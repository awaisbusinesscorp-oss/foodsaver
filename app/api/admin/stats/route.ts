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

        const [
            totalUsers,
            totalListings,
            totalDonations,
            totalVolunteers
        ] = await Promise.all([
            prisma.user.count(),
            prisma.foodListing.count(),
            prisma.donationRequest.count({ where: { status: 'DELIVERED' } }),
            prisma.user.count({ where: { role: 'VOLUNTEER' } })
        ]);

        return NextResponse.json({
            totalUsers,
            totalListings,
            totalDonations,
            totalVolunteers
        });
    } catch (error: any) {
        console.error('Admin stats error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
