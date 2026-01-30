import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

function createPrismaClient() {
    // Get the database URL - prioritize DATABASE_URL
    const databaseUrl = process.env.DATABASE_URL;

    // During build time, DATABASE_URL might not be available
    // Return a mock client to prevent build failures
    if (!databaseUrl) {
        if (process.env.NODE_ENV === "production") {
            console.warn("DATABASE_URL not found during build. Using mock Prisma client.");
        }
        // Return a basic PrismaClient that will fail at runtime if actually used
        // but won't break the build process
        return new PrismaClient();
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
