import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user as any).role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

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
    } catch (error: any) {
        console.error('Admin reports error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
