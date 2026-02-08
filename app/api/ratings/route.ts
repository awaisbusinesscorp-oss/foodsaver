import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic';

// Lazy import prisma to avoid build-time initialization
const getPrisma = async () => {
    const { prisma } = await import("@/lib/prisma");
    return prisma;
};

interface SessionUser {
    id: string;
    role: string;
    name?: string | null;
    email?: string | null;
}

interface RatingRecord {
    score: number;
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const user = session.user as SessionUser;
        const prisma = await getPrisma();

        const { targetId, rating, comment, requestId } = await req.json();

        const newRating = await prisma.rating.create({
            data: {
                fromUserId: user.id,
                toUserId: targetId,
                score: parseInt(rating),
                comment,
                requestId
            }
        });

        // Update target user's average rating
        const userRatings = await prisma.rating.findMany({
            where: { toUserId: targetId }
        });

        const avg = userRatings.reduce((acc: number, curr: RatingRecord) => acc + curr.score, 0) / userRatings.length;

        await prisma.user.update({
            where: { id: targetId },
            data: { rating: avg }
        });

        return NextResponse.json(newRating);
    } catch (_error) {
        return NextResponse.json({ message: "Error" }, { status: 500 });
    }
}
