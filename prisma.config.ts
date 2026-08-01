import "dotenv/config";
import { defineConfig } from "prisma/config";

// `prisma generate` runs in `postinstall`, before some hosts (e.g. Vercel's
// install step) have injected project env vars. Falling back to a placeholder
// here lets client generation succeed regardless; commands that actually hit
// the database (`db push`, `db seed`) still require a real DATABASE_URL and
// will fail with a clear connection error if it's missing.
const databaseUrl = process.env.DATABASE_URL ?? "postgresql://placeholder:placeholder@localhost:5432/placeholder";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: databaseUrl,
  },
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
});
