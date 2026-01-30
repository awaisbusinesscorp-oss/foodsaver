import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || (session.user as any).role !== "VOLUNTEER") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { assignmentId, latitude, longitude } = await req.json();

        if (!assignmentId || latitude === undefined || longitude === undefined) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        const assignment = await prisma.volunteerAssignment.update({
            where: { id: assignmentId, volunteerId: (session.user as any).id },
            data: {
                currentLat: parseFloat(latitude.toString()),
                currentLng: parseFloat(longitude.toString()),
            },
        });

        return NextResponse.json(assignment);
    } catch (error) {
        console.error("Tracking update error:", error);
        return NextResponse.json({ message: "Failed to update tracking" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const requestId = searchParams.get("requestId");

        if (!requestId) {
            return NextResponse.json({ message: "Missing requestId" }, { status: 400 });
        }

        const assignment = await prisma.volunteerAssignment.findUnique({
            where: { requestId },
            select: {
                currentLat: true,
                currentLng: true,
                status: true,
                volunteer: {
                    select: {
                        name: true,
                        phone: true
                    }
                },
                request: {
                    select: {
                        listing: {
                            select: {
                                latitude: true,
                                longitude: true,
                                address: true,
                                title: true
                            }
                        },
                        receiver: {
                            select: {
                                latitude: true,
                                longitude: true,
                                address: true,
                                name: true
                            }
                        }
                    }
                }
            }
        });

        return NextResponse.json(assignment);
    } catch (error) {
        console.error("Tracking fetch error:", error);
        return NextResponse.json({ message: "Failed to fetch tracking" }, { status: 500 });
    }
}
