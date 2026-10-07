import { integer, pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { contents } from "./contents";

export const projectMetadata = pgTable("project_metadata", {
  contentId: uuid("content_id")
    .primaryKey()
    .references(() => contents.id, { onDelete: "cascade" }),
  repositoryUrl: varchar("repository_url", { length: 255 }),
  liveUrl: varchar("live_url", { length: 255 }),
  techStack: text("tech_stack")
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
  architectureNotes: text("architecture_notes"),
  challenges: text("challenges"),
});

export const articleMetadata = pgTable("article_metadata", {
  contentId: uuid("content_id")
    .primaryKey()
    .references(() => contents.id, { onDelete: "cascade" }),
  body: text("body").notNull(),
  readingMinutes: integer("reading_minutes"),
  canonicalUrl: varchar("canonical_url", { length: 255 }),
});

export const noteMetadata = pgTable("note_metadata", {
  contentId: uuid("content_id")
    .primaryKey()
    .references(() => contents.id, { onDelete: "cascade" }),
  body: text("body").notNull(),
});

export type ProjectMetadata = typeof projectMetadata.$inferSelect;
export type NewProjectMetadata = typeof projectMetadata.$inferInsert;
export type ArticleMetadata = typeof articleMetadata.$inferSelect;
export type NewArticleMetadata = typeof articleMetadata.$inferInsert;
export type NoteMetadata = typeof noteMetadata.$inferSelect;
export type NewNoteMetadata = typeof noteMetadata.$inferInsert;
