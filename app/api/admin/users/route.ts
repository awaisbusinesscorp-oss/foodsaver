import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user as any).role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const users = await prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
            take: 50,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                rating: true,
                createdAt: true,
            }
        });

        return NextResponse.json(users);
    } catch (error: any) {
        console.error('Admin users error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
