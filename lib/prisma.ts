import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const globalForPrisma = global as unknown as { prisma: any };

// Get the database URL with fallbacks
function getDatabaseUrl(): string | undefined {
    return process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_URL;
}

// Check if URL is Prisma Accelerate
function isAccelerateUrl(url: string): boolean {
    return url.startsWith('prisma://') || url.startsWith('prisma+postgres://');
}

// Create a proxy that throws helpful errors only when actually called (for build time)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createMockPrismaClient(): any {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handler: ProxyHandler<any> = {
        get(_target, prop) {
            if (typeof prop === 'string' && prop !== 'then' && prop !== 'catch' && prop !== '$connect' && prop !== '$disconnect') {
                return new Proxy({}, {
                    get() {
                        return () => {
                            throw new Error(
                                `DATABASE_URL is not configured. Please set DATABASE_URL environment variable.`
                            );
                        };
                    },
                });
            }
            if (prop === '$connect' || prop === '$disconnect') {
                return () => Promise.resolve();
            }
            return undefined;
        },
    };
    return new Proxy({}, handler);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createPrismaClient(): any {
    const databaseUrl = getDatabaseUrl();

    // During build time, DATABASE_URL might not be available
    if (!databaseUrl) {
        console.warn("⚠️ DATABASE_URL not found. Using mock Prisma client.");
        return createMockPrismaClient();
    }

    try {
        // Check if it's a Prisma Accelerate URL
        if (isAccelerateUrl(databaseUrl)) {
            console.log("🚀 Using Prisma Accelerate");
            return new PrismaClient().$extends(withAccelerate());
        }

        // Direct connection
        console.log("📡 Using direct database connection");
        return new PrismaClient();
    } catch (error) {
        console.error("Failed to create Prisma client:", error);
        return createMockPrismaClient();
    }
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}
