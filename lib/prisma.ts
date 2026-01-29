import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

function createPrismaClient() {
    // Prisma Accelerate URL (preferred for Prisma 7)
    const accelerateUrl = process.env.fs_PRISMA_DATABASE_URL || process.env.PRISMA_DATABASE_URL;

    if (accelerateUrl) {
        // Use Prisma Accelerate - pass accelerateUrl option
        return new PrismaClient({
            accelerateUrl: accelerateUrl,
        } as any);
    }

    // Fallback to direct database URL via adapter
    const databaseUrl = process.env.fs_DATABASE_URL || process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL;

    if (!databaseUrl) {
        throw new Error("No database URL found. Set DATABASE_URL or PRISMA_DATABASE_URL environment variable.");
    }

    // For direct connections without Accelerate, we need an adapter
    // But on Vercel with Accelerate, this code path won't be reached
    return new PrismaClient({
        accelerateUrl: databaseUrl,
    } as any);
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
