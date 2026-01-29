import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const { listingId, reason, description } = await req.json();

        const report = await prisma.report.create({
            data: {
                reporterId: (session.user as any).id,
                listingId,
                reason,
                description,
                status: "PENDING"
            }
        });

        return NextResponse.json(report);
    } catch (error) {
        return NextResponse.json({ message: "Error" }, { status: 500 });
    }
}
