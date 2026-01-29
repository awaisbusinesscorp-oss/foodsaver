import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const { listingId, type, description, targetUserId } = await req.json();

        if (!type || !description) {
            return NextResponse.json({ message: "Type and description are required" }, { status: 400 });
        }

        const report = await prisma.report.create({
            data: {
                reporterId: (session.user as any).id,
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

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        // Only admins can view all reports
        const user = await prisma.user.findUnique({
            where: { id: (session.user as any).id }
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
    } catch (error) {
        return NextResponse.json({ message: "Failed to fetch reports" }, { status: 500 });
    }
}
