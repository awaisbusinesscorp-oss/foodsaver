import { NextResponse } from "next/server";
import { hash } from "bcryptjs";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Lazy import prisma to avoid build-time initialization
const getPrisma = async () => {
    const { prisma } = await import("@/lib/prisma");
    return prisma;
};

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, password, role, phone, address } = body;

        // Validate required fields
        if (!name || !email || !password || !role) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { message: "Invalid email format" },
                { status: 400 }
            );
        }

        // Validate password length
        if (password.length < 4) {
            return NextResponse.json(
                { message: "Password must be at least 4 characters" },
                { status: 400 }
            );
        }

        // Validate role
        const validRoles = ['DONOR', 'RECEIVER', 'VOLUNTEER', 'ADMIN'];
        if (!validRoles.includes(role)) {
            return NextResponse.json(
                { message: "Invalid role" },
                { status: 400 }
            );
        }

        // Get Prisma client
        const prisma = await getPrisma();

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { message: "User with this email already exists" },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await hash(password, 12);

        // Create user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
                phone: phone || null,
                address: address || null,
            },
        });

        console.log(`✅ User registered successfully: ${user.email}`);

        return NextResponse.json(
            { message: "User registered successfully", user: { id: user.id } },
            { status: 201 }
        );
    } catch (error: unknown) {
        console.error("❌ Registration error:", error);

        // Provide specific error messages based on error type
        let message = "An error occurred during registration";
        let statusCode = 500;

        if (error instanceof Error) {
            const errorMessage = error.message.toLowerCase();

            if (errorMessage.includes("database_url") || errorMessage.includes("not configured")) {
                message = "Database connection not configured. Please contact support.";
            } else if (errorMessage.includes("connection") || errorMessage.includes("connect")) {
                message = "Unable to connect to database. Please try again later.";
            } else if (errorMessage.includes("unique constraint") || errorMessage.includes("duplicate")) {
                message = "User with this email already exists";
                statusCode = 400;
            } else if (errorMessage.includes("timeout")) {
                message = "Database request timed out. Please try again.";
            } else if (errorMessage.includes("prisma")) {
                message = "Database error occurred. Please try again later.";
            }

            // Log the full error for debugging
            console.error("Full error details:", {
                name: error.name,
                message: error.message,
                stack: error.stack,
            });
        }

        return NextResponse.json(
            { message },
            { status: statusCode }
        );
    }
}
