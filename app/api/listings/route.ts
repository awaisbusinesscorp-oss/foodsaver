import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

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
                description,
                foodType,
                quantity: parseInt(quantity.toString()),
                unit,
                expiryTime: new Date(expiryTime),
                pickupStart: pickupStart ? new Date(pickupStart) : null,
                pickupEnd: pickupEnd ? new Date(pickupEnd) : null,
                address,
                latitude: parseFloat(latitude.toString()),
                longitude: parseFloat(longitude.toString()),
                donorId: (session.user as any).id,
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
    } catch (error) {
        console.error("Listing creation error:", error);
        return NextResponse.json({ message: "Failed to create listing" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
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
