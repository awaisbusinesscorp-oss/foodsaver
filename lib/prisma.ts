import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Create a proxy that throws helpful errors only when actually called
function createMockPrismaClient(): PrismaClient {
    const handler: ProxyHandler<object> = {
        get(_target, prop) {
            // Return another proxy for method chaining (e.g., prisma.user.findMany)
            if (typeof prop === 'string' && prop !== 'then' && prop !== 'catch') {
                return new Proxy({}, {
                    get() {
                        return () => {
                            throw new Error(
                                `DATABASE_URL is not configured. This operation cannot be performed during build time.`
                            );
                        };
                    },
                });
            }
            return undefined;
        },
    };
    return new Proxy({}, handler) as PrismaClient;
}

function createPrismaClient(): PrismaClient {
    // Get the database URL
    const databaseUrl = process.env.DATABASE_URL;

    // During build time, DATABASE_URL might not be available
    // Return a mock client to prevent build failures
    if (!databaseUrl) {
        console.warn("DATABASE_URL not found. Using mock Prisma client for build.");
        return createMockPrismaClient();
    }

    // Check if it's a Prisma Accelerate URL
    if (databaseUrl.startsWith('prisma://') || databaseUrl.startsWith('prisma+postgres://')) {
        // Prisma Accelerate requires accelerateUrl which isn't in standard PrismaClient types
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return new PrismaClient({ accelerateUrl: databaseUrl } as any);
    }

    // Direct connection (for local development or non-Accelerate)
    return new PrismaClient();
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
