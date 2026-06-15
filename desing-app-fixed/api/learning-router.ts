import { z } from "zod";
import { eq, and, desc } from "drizzle-orm";
import { createRouter, authedQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { paths, lessons, userProgress, activities, users } from "@db/schema";

/* ================================================================ */
/*  XP & Level System                                               */
/* ================================================================ */

/** Level thresholds - XP needed to reach each level */
const LEVEL_THRESHOLDS = [
  0,      // Level 1
  500,    // Level 2
  2000,   // Level 3
  4500,   // Level 4
  8000,   // Level 5
  12500,  // Level 6
  18000,  // Level 7
  25000,  // Level 8
  35000,  // Level 9
  50000,  // Level 10
];

const LEVEL_LABELS = [
  "مبتدئ",      // Level 1
  "متعلم",      // Level 2
  "متوسط",      // Level 3
  "متقدم",      // Level 4
  "خبير",       // Level 5
  "محترف",      // Level 6
  "خبير أول",   // Level 7
  "استاذ",      // Level 8
  "استاذ اول",  // Level 9
  "أسطورة",     // Level 10
];

function getLevelInfo(xp: number) {
  let level = 1;
  for (let i = 1; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) level = i + 1;
    else break;
  }
  const currentXp = LEVEL_THRESHOLDS[level - 1];
  const nextXp = LEVEL_THRESHOLDS[level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  const progress = Math.min(100, Math.round(((xp - currentXp) / (nextXp - currentXp)) * 100));
  return {
    level,
    label: LEVEL_LABELS[level - 1] || "خبير",
    currentXp,
    nextXp,
    progress,
  };
}

/* ================================================================ */
/*  Learning Router                                                  */
/* ================================================================ */

export const learningRouter = createRouter({
  /* ============================================================== */
  /*  GET /api/dashboard  →  Full dashboard data                     */
  /* ============================================================== */
  dashboard: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const userId = ctx.user.id;
    const userXp = ctx.user.xp || 0;

    // 1. Get all paths with their lessons
    const allPaths = await db.query.paths.findMany({
      orderBy: (p, { asc }) => [asc(p.order)],
      with: { lessons: true },
    });

    // 2. Get user's completed lessons
    const completedLessons = await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, userId));

    const completedLessonIds = new Set(completedLessons.map((cl) => cl.lessonId));

    // 3. Calculate path progress
    const pathProgressList = allPaths.map((path) => {
      const totalLessons = path.lessons.length;
      const completedCount = path.lessons.filter((l) =>
        completedLessonIds.has(l.id)
      ).length;
      const progressPercent = totalLessons > 0
        ? Math.round((completedCount / totalLessons) * 100)
        : 0;
      return {
        pathId: path.id,
        name: path.nameAr,
        slug: path.slug,
        totalLessons,
        completedCount,
        progressPercent,
      };
    });

    // 4. Overall progress (average of all paths)
    const overallProgress = pathProgressList.length > 0
      ? Math.round(
          pathProgressList.reduce((sum, p) => sum + p.progressPercent, 0) /
            pathProgressList.length
        )
      : 0;

    // 5. Stats
    const totalCourses = allPaths.length;
    const totalCompletedCourses = pathProgressList.filter(
      (p) => p.progressPercent === 100
    ).length;
    const totalStudyMinutes = completedLessons.reduce(
      (sum, cl) => sum + (cl.timeSpentMinutes || 0),
      0
    );
    const totalStudyHours = Math.round(totalStudyMinutes / 60);

    // 6. Level info
    const levelInfo = getLevelInfo(userXp);

    // 7. Skill breakdown for radar chart (from path progress)
    const skillData = pathProgressList.map((p) => ({
      name: p.name,
      value: p.progressPercent,
    }));

    // 8. Roadmap stages
    const roadmapStages = allPaths.map((path) => {
      const pProgress = pathProgressList.find((pp) => pp.pathId === path.id)!;
      let status: "completed" | "current" | "locked" = "locked";
      if (pProgress.progressPercent === 100) status = "completed";
      else if (pProgress.progressPercent > 0) status = "current";
      else if (path.order === 1) status = "current"; // First path is always current
      else {
        // Check if previous path is completed
        const prevPath = allPaths.find((p) => p.order === path.order - 1);
        if (prevPath) {
          const prevProgress = pathProgressList.find(
            (pp) => pp.pathId === prevPath.id
          );
          if (prevProgress && prevProgress.progressPercent === 100) {
            status = "current";
          }
        }
      }

      return {
        id: path.id,
        name: path.nameAr,
        description: path.descriptionAr || "",
        status,
        topics: path.lessons.map((lesson) => ({
          name: lesson.titleAr,
          locked: !completedLessonIds.has(lesson.id) && status === "locked",
        })),
      };
    });

    // 9. Recent activities
    const recentActivities = await db
      .select()
      .from(activities)
      .where(eq(activities.userId, userId))
      .orderBy(desc(activities.createdAt))
      .limit(10);

    const formattedActivities = recentActivities.map((act) => ({
      id: act.id,
      text: act.textAr,
      time: act.createdAt,
      color: act.color || "#006D77",
    }));

    return {
      // User stats
      xp: userXp,
      level: levelInfo.level,
      levelLabel: levelInfo.label,
      currentXp: levelInfo.currentXp,
      nextXp: levelInfo.nextXp,
      xpProgress: levelInfo.progress,

      // Summary stats
      totalCourses,
      totalCompletedCourses,
      totalStudyHours,
      overallProgress,

      // Breakdown
      pathProgress: pathProgressList,
      skills: skillData,
      roadmap: roadmapStages,
      activities: formattedActivities,
    };
  }),

  /* ============================================================== */
  /*  GET /api/paths  →  List all paths with progress                */
  /* ============================================================== */
  paths: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const userId = ctx.user.id;

    const allPaths = await db.query.paths.findMany({
      orderBy: (p, { asc }) => [asc(p.order)],
      with: { lessons: true },
    });

    const completedLessons = await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, userId));

    const completedLessonIds = new Set(completedLessons.map((cl) => cl.lessonId));

    return allPaths.map((path) => {
      const totalLessons = path.lessons.length;
      const completedCount = path.lessons.filter((l) =>
        completedLessonIds.has(l.id)
      ).length;
      const progressPercent = totalLessons > 0
        ? Math.round((completedCount / totalLessons) * 100)
        : 0;

      return {
        id: path.id,
        slug: path.slug,
        name: path.nameAr,
        nameEn: path.nameEn,
        description: path.descriptionAr,
        level: path.level,
        image: path.image,
        order: path.order,
        totalLessons,
        completedCount,
        progressPercent,
        lessons: path.lessons.map((l) => ({
          id: l.id,
          title: l.titleAr,
          titleEn: l.titleEn,
          type: l.type,
          durationMinutes: l.durationMinutes,
          xpReward: l.xpReward,
          order: l.order,
          isCompleted: completedLessonIds.has(l.id),
        })),
      };
    });
  }),

  /* ============================================================== */
  /*  GET /api/lessons/:pathId  →  Lessons in a path                 */
  /* ============================================================== */
  lessonsByPath: authedQuery
    .input(z.object({ pathId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const userId = ctx.user.id;

      const pathData = await db.query.paths.findFirst({
        where: eq(paths.id, input.pathId),
        with: {
          lessons: true,
        },
      });

      if (!pathData) {
        throw new Error("Path not found");
      }

      const completedLessons = await db
        .select()
        .from(userProgress)
        .where(eq(userProgress.userId, userId));

      const completedLessonIds = new Set(
        completedLessons.map((cl) => cl.lessonId)
      );

      return {
        path: {
          id: pathData.id,
          name: pathData.nameAr,
          nameEn: pathData.nameEn,
          description: pathData.descriptionAr,
          level: pathData.level,
        },
        lessons: pathData.lessons.map((lesson) => ({
          id: lesson.id,
          title: lesson.titleAr,
          titleEn: lesson.titleEn,
          type: lesson.type,
          durationMinutes: lesson.durationMinutes,
          xpReward: lesson.xpReward,
          order: lesson.order,
          isCompleted: completedLessonIds.has(lesson.id),
        })),
      };
    }),

  /* ============================================================== */
  /*  POST /api/lessons/:id/complete  →  Complete a lesson           */
  /* ============================================================== */
  completeLesson: authedQuery
    .input(z.object({ lessonId: z.number(), timeSpentMinutes: z.number().optional() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const userId = ctx.user.id;
      const { lessonId, timeSpentMinutes = 0 } = input;

      // Check if lesson exists
      const lesson = await db.query.lessons.findFirst({
        where: eq(lessons.id, lessonId),
        with: { path: true },
      });

      if (!lesson) {
        throw new Error("Lesson not found");
      }

      // Check if already completed
      const existing = await db
        .select()
        .from(userProgress)
        .where(
          and(
            eq(userProgress.userId, userId),
            eq(userProgress.lessonId, lessonId)
          )
        );

      if (existing.length > 0) {
        // Already completed - return current state
        return {
          success: false,
          message: "Lesson already completed",
          xpEarned: 0,
          totalXp: ctx.user.xp,
          leveledUp: false,
        };
      }

      // Insert progress record
      await db.insert(userProgress).values({
        userId,
        lessonId,
        completedAt: new Date(),
        timeSpentMinutes,
      });

      // Add XP to user
      const xpReward = lesson.xpReward || 50;
      const newXp = (ctx.user.xp || 0) + xpReward;
      const oldLevel = ctx.user.level || 1;
      const newLevelInfo = getLevelInfo(newXp);
      const newLevel = newLevelInfo.level;
      const leveledUp = newLevel > oldLevel;

      await db
        .update(users)
        .set({ xp: newXp, level: newLevel })
        .where(eq(users.id, userId));

      // Log activity
      await db.insert(activities).values({
        userId,
        type: "lesson_complete",
        textAr: `أكملت درس "${lesson.titleAr}"`,
        textEn: `Completed lesson "${lesson.titleEn}"`,
        color: "#006D77",
      });

      // Log XP activity
      await db.insert(activities).values({
        userId,
        type: "xp_earned",
        textAr: `حصلت على ${xpReward} نقطة خبرة`,
        textEn: `Earned ${xpReward} XP points`,
        color: "#E9C46A",
      });

      if (leveledUp) {
        await db.insert(activities).values({
          userId,
          type: "level_up",
          textAr: `ارتقيت إلى المستوى ${newLevel} - ${newLevelInfo.label}!`,
          textEn: `Leveled up to Level ${newLevel} - ${newLevelInfo.label}!`,
          color: "#2A9D8F",
        });
      }

      return {
        success: true,
        message: "Lesson completed successfully",
        xpEarned: xpReward,
        totalXp: newXp,
        leveledUp,
        newLevel: leveledUp ? newLevel : undefined,
        newLevelLabel: leveledUp ? newLevelInfo.label : undefined,
      };
    }),
});
