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

interface DonationRequestWithListing {
    requestedQty: number;
    receiverId: string;
    listing: {
        unit: string;
    };
}

interface AssignmentWithRequest {
    request: {
        requestedQty: number;
        receiverId: string;
        listing: {
            unit: string;
        };
    };
}

interface RequestWithDate {
    updatedAt: Date;
}

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const user = session.user as SessionUser;
        const userId = user.id;
        const role = user.role;
        const prisma = await getPrisma();

        let meals = 0;
        let kg = 0;
        let people = 0;

        if (role === "DONOR") {
            // Stats for Donor: All delivered requests from their listings
            const deliveredRequests = await prisma.donationRequest.findMany({
                where: {
                    listing: { donorId: userId },
                    status: "DELIVERED"
                },
                include: { listing: true }
            });

            meals = deliveredRequests.reduce((acc: number, req: DonationRequestWithListing) => acc + req.requestedQty, 0);

            // Calc KG (rough estimate: 1 portion ~ 0.5kg if not already in kg)
            kg = deliveredRequests.reduce((acc: number, req: DonationRequestWithListing) => {
                const qty = req.requestedQty;
                return acc + (req.listing.unit.toLowerCase() === "kg" ? qty : qty * 0.5);
            }, 0);

            // Unique people reached
            const uniqueReceivers = new Set(deliveredRequests.map((r: DonationRequestWithListing) => r.receiverId));
            people = uniqueReceivers.size;

        } else if (role === "VOLUNTEER") {
            // Stats for Volunteer: All delivered assignments
            const assignments = await prisma.volunteerAssignment.findMany({
                where: {
                    volunteerId: userId,
                    status: "DELIVERED"
                },
                include: {
                    request: { include: { listing: true } }
                }
            });

            meals = assignments.reduce((acc: number, a: AssignmentWithRequest) => acc + a.request.requestedQty, 0);
            kg = assignments.reduce((acc: number, a: AssignmentWithRequest) => {
                const qty = a.request.requestedQty;
                return acc + (a.request.listing.unit.toLowerCase() === "kg" ? qty : qty * 0.5);
            }, 0);

            const uniqueReceivers = new Set(assignments.map((a: AssignmentWithRequest) => a.request.receiverId));
            people = uniqueReceivers.size;

        } else if (role === "RECEIVER") {
            // Stats for Receiver: All items they received
            const received = await prisma.donationRequest.findMany({
                where: {
                    receiverId: userId,
                    status: "DELIVERED"
                },
                include: { listing: true }
            });

            meals = received.reduce((acc: number, r: DonationRequestWithListing) => acc + r.requestedQty, 0);
            kg = received.reduce((acc: number, r: DonationRequestWithListing) => {
                const qty = r.requestedQty;
                return acc + (r.listing.unit.toLowerCase() === "kg" ? qty : qty * 0.5);
            }, 0);
            people = 1; // They are the person reached
        }

        // CO2 Approximation: 1kg food waste = ~2.5kg CO2
        const carbon = parseFloat((kg * 2.5).toFixed(1));

        // Get activity for last 7 days for the chart
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const weeklyActivity = [0, 0, 0, 0, 0, 0, 0];

        const recentRequests = await prisma.donationRequest.findMany({
            where: {
                ...(role === "DONOR" ? { listing: { donorId: userId } } : { receiverId: userId }),
                status: "DELIVERED",
                updatedAt: { gte: sevenDaysAgo }
            },
            select: { updatedAt: true }
        });

        recentRequests.forEach((req: RequestWithDate) => {
            const dayIndex = (new Date(req.updatedAt).getDay() + 6) % 7; // Map Sun-Sat to Mon-Sun
            weeklyActivity[dayIndex]++;
        });

        return NextResponse.json({
            meals,
            kg: parseFloat(kg.toFixed(1)),
            people,
            carbon,
            weeklyActivity
        });

    } catch (error) {
        console.error("Impact stats error:", error);
        return NextResponse.json({ message: "Error fetching impact data" }, { status: 500 });
    }
}
