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

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const user = session.user as SessionUser;
        const prisma = await getPrisma();

        const { listingId, type, description, targetUserId } = await req.json();

        if (!type || !description) {
            return NextResponse.json({ message: "Type and description are required" }, { status: 400 });
        }

        const report = await prisma.report.create({
            data: {
                reporterId: user.id,
                listingId: listingId || null,
                targetUserId: targetUserId || null,
                type,
                description,
            }
        });

        return NextResponse.json(report);
    } catch (error) {
        console.error("Report creation error:", error);
        return NextResponse.json({ message: "Failed to create report" }, { status: 500 });
    }
}

export async function GET(_req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const sessionUser = session.user as SessionUser;
        const prisma = await getPrisma();

        // Only admins can view all reports
        const user = await prisma.user.findUnique({
            where: { id: sessionUser.id }
        });

        if (user?.role !== "ADMIN") {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const reports = await prisma.report.findMany({
            include: {
                reporter: {
                    select: { name: true, email: true }
                },
                listing: {
                    select: { title: true, id: true }
                },
                targetUser: {
                    select: { name: true, email: true }
                }
            },
            orderBy: { createdAt: "desc" }
        });

        return NextResponse.json(reports);
    } catch (_error) {
        return NextResponse.json({ message: "Failed to fetch reports" }, { status: 500 });
    }
}
