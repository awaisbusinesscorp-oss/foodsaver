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

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const user = session.user as SessionUser;
        const prisma = await getPrisma();

        const { searchParams } = new URL(req.url);
        const mode = searchParams.get("mode"); // 'available', 'active', or 'history'

        if (mode === "available") {
            // Show both PENDING and ACCEPTED requests that don't have a volunteer yet
            const available = await prisma.donationRequest.findMany({
                where: {
                    status: { in: ["PENDING", "ACCEPTED"] },
                    volunteerAssignment: null
                },
                include: {
                    listing: {
                        include: { images: true, donor: true }
                    },
                    receiver: true
                },
                orderBy: { createdAt: "desc" }
            });
            return NextResponse.json(available);
        } else if (mode === "history") {
            const history = await prisma.volunteerAssignment.findMany({
                where: {
                    volunteerId: user.id,
                    status: "DELIVERED"
                },
                include: {
                    request: {
                        include: {
                            listing: { include: { images: true, donor: true } },
                            receiver: true
                        }
                    }
                },
                orderBy: { updatedAt: "desc" }
            });
            return NextResponse.json(history);
        } else {
            const active = await prisma.volunteerAssignment.findMany({
                where: {
                    volunteerId: user.id,
                    status: { not: "DELIVERED" }
                },
                include: {
                    request: {
                        include: {
                            listing: { include: { images: true, donor: true } },
                            receiver: true
                        }
                    }
                },
                orderBy: { updatedAt: "desc" }
            });
            return NextResponse.json(active);
        }
    } catch (_error) {
        return NextResponse.json({ message: "Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const user = session.user as SessionUser;
        const prisma = await getPrisma();

        const { requestId } = await req.json();

        const assignment = await prisma.volunteerAssignment.create({
            data: {
                requestId,
                volunteerId: user.id,
                status: "ASSIGNED"
            }
        });

        return NextResponse.json(assignment);
    } catch (_error) {
        return NextResponse.json({ message: "Error" }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const prisma = await getPrisma();

        const { assignmentId, status } = await req.json();

        const assignment = await prisma.volunteerAssignment.update({
            where: { id: assignmentId },
            data: {
                status,
                ...(status === "PICKED_UP" ? { pickupTime: new Date() } : {}),
                ...(status === "DELIVERED" ? { deliveryTime: new Date() } : {})
            },
            include: { request: true }
        });

        // Update request status sync
        await prisma.donationRequest.update({
            where: { id: assignment.requestId },
            data: { status: status as 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'PICKED_UP' | 'DELIVERED' | 'CANCELLED' }
        });

        return NextResponse.json(assignment);
    } catch (_error) {
        return NextResponse.json({ message: "Error" }, { status: 500 });
    }
}
