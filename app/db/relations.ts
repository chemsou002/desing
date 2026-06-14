import { relations } from "drizzle-orm";
import { users, paths, lessons, userProgress, activities } from "./schema";

/* ================================================================ */
/*  Relations                                                        */
/* ================================================================ */

export const pathsRelations = relations(paths, ({ many }) => ({
  lessons: many(lessons),
}));

export const lessonsRelations = relations(lessons, ({ one }) => ({
  path: one(paths, {
    fields: [lessons.pathId],
    references: [paths.id],
  }),
}));

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  user: one(users, {
    fields: [userProgress.userId],
    references: [users.id],
  }),
  lesson: one(lessons, {
    fields: [userProgress.lessonId],
    references: [lessons.id],
  }),
}));

export const activitiesRelations = relations(activities, ({ one }) => ({
  user: one(users, {
    fields: [activities.userId],
    references: [users.id],
  }),
}));
