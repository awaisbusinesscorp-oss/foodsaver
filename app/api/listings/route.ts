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
        const prisma = await getPrisma();

        const body = await req.json();
        const {
            title,
            description,
            foodType,
            quantity,
            unit,
            expiryTime,
            pickupStart,
            pickupEnd,
            address,
            latitude,
            longitude,
            imageUrl
        } = body;

        // Basic validation
        if (!title || !foodType || !quantity || !expiryTime || !address) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        const listing = await prisma.foodListing.create({
            data: {
                title,
                description: description || null,
                foodType,
                quantity: parseInt(quantity.toString()),
                unit,
                expiryTime: new Date(expiryTime),
                pickupStart: pickupStart ? new Date(pickupStart) : null,
                pickupEnd: pickupEnd ? new Date(pickupEnd) : null,
                address,
                latitude: latitude && latitude !== 0 ? parseFloat(latitude.toString()) : null,
                longitude: longitude && longitude !== 0 ? parseFloat(longitude.toString()) : null,
                donorId: user.id,
                status: "AVAILABLE",
                images: imageUrl ? {
                    create: [{ url: imageUrl }]
                } : undefined
            },
            include: {
                images: true
            }
        });

        return NextResponse.json(listing, { status: 201 });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : undefined;
        console.error("Listing creation error:", error);
        return NextResponse.json({
            message: "Failed to create listing",
            error: process.env.NODE_ENV === 'development' ? errorMessage : undefined
        }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const prisma = await getPrisma();
        const { searchParams } = new URL(req.url);
        const donorId = searchParams.get("donorId");

        const listings = await prisma.foodListing.findMany({
            where: {
                ...(donorId ? { donorId } : { status: "AVAILABLE" }),
                expiryTime: {
                    gt: new Date()
                }
            },
            include: {
                images: true,
                donor: {
                    select: {
                        name: true,
                        rating: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return NextResponse.json(listings);
    } catch (error) {
        console.error("Fetch listings error:", error);
        return NextResponse.json({ message: "Failed to fetch listings" }, { status: 500 });
    }
}
