import {
  check,
  pgTable,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { contents } from "./contents";

export const contentRelations = pgTable(
  "content_relations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    sourceId: uuid("source_id")
      .notNull()
      .references(() => contents.id, { onDelete: "cascade" }),
    targetId: uuid("target_id")
      .notNull()
      .references(() => contents.id, { onDelete: "cascade" }),
    relationType: varchar("relation_type", { length: 50 })
      .notNull()
      .default("related"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("content_relations_source_target_unique").on(
      table.sourceId,
      table.targetId
    ),
    check(
      "content_relations_no_self_reference",
      sql`${table.sourceId} <> ${table.targetId}`
    ),
  ]
);

export type ContentRelation = typeof contentRelations.$inferSelect;
export type NewContentRelation = typeof contentRelations.$inferInsert;
