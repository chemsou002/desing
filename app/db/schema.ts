import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  int,
  bigint,
} from "drizzle-orm/mysql-core";

/* ================================================================ */
/*  Users (OAuth via Kimi)                                          */
/* ================================================================ */

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).unique(),
  googleId: varchar("googleId", { length: 255 }).unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  xp: int("xp").default(0).notNull(),
  level: int("level").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/* ================================================================ */
/*  Learning Paths                                                  */
/* ================================================================ */

export const paths = mysqlTable("paths", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  nameAr: varchar("nameAr", { length: 255 }).notNull(),
  nameEn: varchar("nameEn", { length: 255 }).notNull(),
  descriptionAr: text("descriptionAr"),
  descriptionEn: text("descriptionEn"),
  level: mysqlEnum("level", ["beginner", "intermediate", "advanced"])
    .default("beginner")
    .notNull(),
  image: varchar("image", { length: 255 }),
  order: int("order").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Path = typeof paths.$inferSelect;
export type InsertPath = typeof paths.$inferInsert;

/* ================================================================ */
/*  Lessons                                                         */
/* ================================================================ */

export const lessons = mysqlTable("lessons", {
  id: serial("id").primaryKey(),
  pathId: bigint("pathId", { mode: "number", unsigned: true })
    .notNull(),
  titleAr: varchar("titleAr", { length: 255 }).notNull(),
  titleEn: varchar("titleEn", { length: 255 }).notNull(),
  type: mysqlEnum("type", ["video", "quiz", "simulation"])
    .default("video")
    .notNull(),
  durationMinutes: int("durationMinutes").default(15).notNull(),
  xpReward: int("xpReward").default(50).notNull(),
  order: int("order").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Lesson = typeof lessons.$inferSelect;
export type InsertLesson = typeof lessons.$inferInsert;

/* ================================================================ */
/*  User Progress (completed lessons)                               */
/* ================================================================ */

export const userProgress = mysqlTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  lessonId: bigint("lessonId", { mode: "number", unsigned: true }).notNull(),
  completedAt: timestamp("completedAt").defaultNow().notNull(),
  timeSpentMinutes: int("timeSpentMinutes").default(0).notNull(),
});

export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = typeof userProgress.$inferInsert;

/* ================================================================ */
/*  Activities                                                      */
/* ================================================================ */

export const activities = mysqlTable("activities", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  type: mysqlEnum("type", [
    "lesson_complete",
    "xp_earned",
    "level_up",
    "simulation_start",
    "course_enroll",
  ])
    .default("lesson_complete")
    .notNull(),
  textAr: varchar("textAr", { length: 500 }).notNull(),
  textEn: varchar("textEn", { length: 500 }).notNull(),
  color: varchar("color", { length: 50 }).default("#006D77"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = typeof activities.$inferInsert;
