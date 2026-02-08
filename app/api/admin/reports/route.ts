import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Lazy import prisma to avoid build-time initialization
const getPrisma = async () => {
    const { prisma } = await import('@/lib/prisma');
    return prisma;
};

interface SessionUser {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    id?: string;
    role?: string;
}

export async function GET(_req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user as SessionUser)?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const prisma = await getPrisma();
        const reports = await prisma.report.findMany({
            orderBy: { createdAt: 'desc' },
            take: 50,
            include: {
                reporter: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            }
        });

        return NextResponse.json(reports);
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Admin reports error:', error);
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
