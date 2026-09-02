import "dotenv/config";

import { defineConfig } from "drizzle-kit";

const databaseUrl =
  process.env.DATABASE_URL ?? process.env.CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE;

if (!databaseUrl) {
  throw new Error("Database URL not present in the env variables.");
}

export default defineConfig({
  dialect: "postgresql",

  dbCredentials: {
    url: databaseUrl,
  },

  casing: "snake_case",

  schema: "./src/database/schema/*.ts",
  out: "./src/database/migrations",
});
