import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const mode = searchParams.get("mode"); // 'available' or 'active'

        if (mode === "available") {
            const available = await prisma.donationRequest.findMany({
                where: {
                    status: "ACCEPTED",
                    volunteerAssignment: null
                },
                include: {
                    listing: {
                        include: { images: true, donor: true }
                    },
                    receiver: true
                }
            });
            return NextResponse.json(available);
        } else {
            const active = await prisma.volunteerAssignment.findMany({
                where: {
                    volunteerId: (session.user as any).id,
                    status: { not: "DELIVERED" }
                },
                include: {
                    request: {
                        include: {
                            listing: { include: { images: true, donor: true } },
                            receiver: true
                        }
                    }
                }
            });
            return NextResponse.json(active);
        }
    } catch (error) {
        return NextResponse.json({ message: "Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const { requestId } = await req.json();

        const assignment = await prisma.volunteerAssignment.create({
            data: {
                requestId,
                volunteerId: (session.user as any).id,
                status: "ASSIGNED"
            }
        });

        return NextResponse.json(assignment);
    } catch (error) {
        return NextResponse.json({ message: "Error" }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

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
            data: { status: status as any }
        });

        return NextResponse.json(assignment);
    } catch (error) {
        return NextResponse.json({ message: "Error" }, { status: 500 });
    }
}
