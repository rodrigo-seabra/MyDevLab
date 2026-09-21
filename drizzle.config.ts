import { defineConfig } from "drizzle-kit";

const databaseUrl =
  process.env.MYDEVLAB_DATABASE_URL ??
  "postgresql://mydevlab:mydevlab_local_password@postgres:5432/mydevlab";

export default defineConfig({
  schema: "./src/db/schema/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
});
