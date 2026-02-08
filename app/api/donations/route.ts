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
        if (!session?.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const user = session.user as SessionUser;
        const userId = user.id;
        const userRole = user.role;

        // Only RECEIVER role can request donations
        if (userRole !== "RECEIVER" && userRole !== "ADMIN") {
            return NextResponse.json({
                message: "Only receivers can request donations. Please register as a receiver."
            }, { status: 403 });
        }

        const { listingId, requestedQty, notes } = await req.json();

        if (!listingId || !requestedQty) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        const prisma = await getPrisma();

        // Check listing availability
        const listing = await prisma.foodListing.findUnique({
            where: { id: listingId },
        });

        if (!listing || listing.status !== "AVAILABLE") {
            return NextResponse.json({ message: "Listing is no longer available" }, { status: 400 });
        }

        if (requestedQty > listing.quantity) {
            return NextResponse.json({ message: "Requested quantity exceeds availability" }, { status: 400 });
        }

        // Can't request your own listing
        if (listing.donorId === userId) {
            return NextResponse.json({ message: "You cannot request your own donation" }, { status: 400 });
        }

        const request = await prisma.donationRequest.create({
            data: {
                listingId,
                receiverId: userId,
                requestedQty: Number(requestedQty),
                notes: notes || null,
                status: "PENDING",
            },
            include: {
                listing: true
            }
        });

        return NextResponse.json(request, { status: 201 });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        const errorStack = error instanceof Error ? error.stack : undefined;
        console.error("Donation request error:", error);
        return NextResponse.json({
            message: errorMessage || "Failed to submit request",
            stack: errorStack,
            error: error
        }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const user = session.user as SessionUser;
        const prisma = await getPrisma();

        const { searchParams } = new URL(req.url);
        const role = searchParams.get("role"); // 'donor' or 'receiver'

        if (role === "donor") {
            const requests = await prisma.donationRequest.findMany({
                where: {
                    listing: {
                        donorId: user.id
                    }
                },
                include: {
                    listing: {
                        include: {
                            images: true
                        }
                    },
                    receiver: {
                        select: {
                            name: true,
                            email: true,
                            phone: true,
                            rating: true
                        }
                    }
                },
                orderBy: {
                    createdAt: "desc"
                }
            });
            return NextResponse.json(requests);
        } else {
            const requests = await prisma.donationRequest.findMany({
                where: {
                    receiverId: user.id
                },
                include: {
                    listing: {
                        include: {
                            images: true,
                            donor: {
                                select: {
                                    name: true,
                                    phone: true
                                }
                            }
                        }
                    }
                },
                orderBy: {
                    createdAt: "desc"
                }
            });
            return NextResponse.json(requests);
        }
    } catch (error) {
        console.error("Fetch requests error:", error);
        return NextResponse.json({ message: "Failed to fetch requests" }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const user = session.user as SessionUser;
        const prisma = await getPrisma();

        const { requestId, status } = await req.json();

        if (!requestId || !status) {
            return NextResponse.json({ message: "Missing fields" }, { status: 400 });
        }

        const request = await prisma.donationRequest.findUnique({
            where: { id: requestId },
            include: { listing: true }
        });

        if (!request) {
            return NextResponse.json({ message: "Request not found" }, { status: 404 });
        }

        // Only donor can accept/decline
        if (request.listing.donorId !== user.id) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const updatedRequest = await prisma.donationRequest.update({
            where: { id: requestId },
            data: { status },
        });

        // If accepted, mark listing as RESERVED
        if (status === "ACCEPTED") {
            await prisma.foodListing.update({
                where: { id: request.listingId },
                data: { status: "RESERVED" }
            });
        }

        return NextResponse.json(updatedRequest);
    } catch (error) {
        console.error("Update request error:", error);
        return NextResponse.json({ message: "Failed to update request" }, { status: 500 });
    }
}
