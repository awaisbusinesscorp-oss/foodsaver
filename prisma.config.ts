// Prisma configuration for Prisma 7
// Works with Vercel Postgres (uses POSTGRES_PRISMA_URL) or standard PostgreSQL (uses DATABASE_URL)
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx ts-node prisma/seed.ts",
  },
  datasource: {
    // Vercel Postgres uses POSTGRES_PRISMA_URL, fallback to DATABASE_URL for other providers
    url: process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL,
  },
});
