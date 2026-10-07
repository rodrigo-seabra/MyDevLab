import {
  boolean,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", [
  "founder",
  "recovery",
  "admin",
  "author",
]);

export const adminCapabilityEnum = pgEnum("admin_capability", [
  "review_queue.view",
  "content.approve",
  "content.edit_others",
  "tags.manage",
  "relations.manage",
  "media.manage",
  "content.archive",
]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 254 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: userRoleEnum("role").notNull(),
  name: varchar("name", { length: 120 }).notNull(),
  isActive: boolean("is_active").notNull().default(true),
  mfaSecret: text("mfa_secret"),
  recoverySecretHash: text("recovery_secret_hash"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const adminCapabilities = pgTable(
  "admin_capabilities",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    capability: adminCapabilityEnum("capability").notNull(),
    grantedAt: timestamp("granted_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("admin_capabilities_user_capability_unique").on(
      table.userId,
      table.capability
    ),
  ]
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type AdminCapability = typeof adminCapabilities.$inferSelect;
export type NewAdminCapability = typeof adminCapabilities.$inferInsert;
