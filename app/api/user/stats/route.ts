import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const userId = (session.user as any).id;
        const role = (session.user as any).role;

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

            meals = deliveredRequests.reduce((acc, req) => acc + req.requestedQty, 0);

            // Calc KG (rough estimate: 1 portion ~ 0.5kg if not already in kg)
            kg = deliveredRequests.reduce((acc, req) => {
                const qty = req.requestedQty;
                return acc + (req.listing.unit.toLowerCase() === "kg" ? qty : qty * 0.5);
            }, 0);

            // Unique people reached
            const uniqueReceivers = new Set(deliveredRequests.map(r => r.receiverId));
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

            meals = assignments.reduce((acc, a) => acc + a.request.requestedQty, 0);
            kg = assignments.reduce((acc, a) => {
                const qty = a.request.requestedQty;
                return acc + (a.request.listing.unit.toLowerCase() === "kg" ? qty : qty * 0.5);
            }, 0);

            const uniqueReceivers = new Set(assignments.map(a => a.request.receiverId));
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

            meals = received.reduce((acc, r) => acc + r.requestedQty, 0);
            kg = received.reduce((acc, r) => {
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

        let weeklyActivity = [0, 0, 0, 0, 0, 0, 0];

        const recentRequests = await prisma.donationRequest.findMany({
            where: {
                ...(role === "DONOR" ? { listing: { donorId: userId } } : { receiverId: userId }),
                status: "DELIVERED",
                updatedAt: { gte: sevenDaysAgo }
            },
            select: { updatedAt: true }
        });

        recentRequests.forEach(req => {
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
