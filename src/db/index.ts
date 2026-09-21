import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "@/db/schema";

const databaseUrl = process.env.MYDEVLAB_DATABASE_URL;

if (!databaseUrl) {
  throw new Error("MYDEVLAB_DATABASE_URL must be configured before using the database.");
}

const globalForDb = globalThis as unknown as {
  mydevlabPool?: Pool;
};

export const pool = globalForDb.mydevlabPool ?? new Pool({ connectionString: databaseUrl });

if (process.env.NODE_ENV !== "production") {
  globalForDb.mydevlabPool = pool;
}

export const db = drizzle(pool, { schema });
