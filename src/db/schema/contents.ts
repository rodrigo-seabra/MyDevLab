import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { users } from "./auth";

export const contentTypeEnum = pgEnum("content_type", [
  "project",
  "article",
  "note",
]);

export const editorialStatusEnum = pgEnum("editorial_status", [
  "draft",
  "pending_review",
  "rejected",
  "published",
  "archived",
]);

export const visibilityEnum = pgEnum("visibility", ["public", "private"]);

export const reviewDecisionEnum = pgEnum("review_decision", [
  "approved",
  "rejected",
]);

export const contents = pgTable("contents", {
  id: uuid("id").defaultRandom().primaryKey(),
  type: contentTypeEnum("type").notNull(),
  slug: varchar("slug", { length: 160 }).notNull().unique(),
  title: varchar("title", { length: 240 }).notNull(),
  summary: text("summary").notNull(),
  editorialStatus: editorialStatusEnum("editorial_status")
    .notNull()
    .default("draft"),
  visibility: visibilityEnum("visibility").notNull().default("public"),
  authorId: uuid("author_id")
    .notNull()
    .references(() => users.id, { onDelete: "restrict" }),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const reviewLogs = pgTable("review_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  contentId: uuid("content_id")
    .notNull()
    .references(() => contents.id, { onDelete: "cascade" }),
  reviewerId: uuid("reviewer_id")
    .notNull()
    .references(() => users.id, { onDelete: "restrict" }),
  decision: reviewDecisionEnum("decision").notNull(),
  reason: text("reason"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Content = typeof contents.$inferSelect;
export type NewContent = typeof contents.$inferInsert;
export type ReviewLog = typeof reviewLogs.$inferSelect;
export type NewReviewLog = typeof reviewLogs.$inferInsert;
