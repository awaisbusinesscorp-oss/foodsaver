import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const { targetId, rating, comment, requestId } = await req.json();

        const newRating = await prisma.rating.create({
            data: {
                fromId: (session.user as any).id,
                toId: targetId,
                rating: parseInt(rating),
                comment,
                requestId
            }
        });

        // Update target user's average rating
        const userRatings = await prisma.rating.findMany({
            where: { toId: targetId }
        });

        const avg = userRatings.reduce((acc: number, curr: any) => acc + curr.rating, 0) / userRatings.length;

        await prisma.user.update({
            where: { id: targetId },
            data: { rating: avg }
        });

        return NextResponse.json(newRating);
    } catch (error) {
        return NextResponse.json({ message: "Error" }, { status: 500 });
    }
}
