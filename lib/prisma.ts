import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

function createPrismaClient() {
    // Get the database URL - prioritize DATABASE_URL
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
        throw new Error("No database URL found. Set DATABASE_URL environment variable.");
    }

    // Check if it's a Prisma Accelerate URL
    if (databaseUrl.startsWith('prisma://') || databaseUrl.startsWith('prisma+postgres://')) {
        return new PrismaClient({
            accelerateUrl: databaseUrl,
        } as any);
    }

    // Direct connection (for local development or non-Accelerate)
    return new PrismaClient();
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
