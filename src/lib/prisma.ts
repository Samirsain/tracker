import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Runtime MUST use the pooled connection string (Supabase pgbouncer, port 6543).
// DIRECT_URL points at db.<ref>.supabase.co:5432, which is unpooled and not
// reachable over IPv4 from Vercel's serverless network — using it here is what
// makes every query fail after deploy. DIRECT_URL is for the Prisma CLI only
// (see prisma.config.ts: migrations / db push / seed).
const connectionString = process.env.DATABASE_URL;

function createClient() {
  // Each serverless instance gets its own tiny pool; pgbouncer does the real
  // multiplexing, so a large max here just exhausts the upstream limit.
  const pool = new Pool({ connectionString, max: 3 });
  return new PrismaClient({
    adapter: new PrismaPg(pool),
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createClient();

// Cache in every environment: without this, warm-lambda module re-evaluation
// (and dev HMR) leaks a new Pool per reload.
globalForPrisma.prisma = prisma;
