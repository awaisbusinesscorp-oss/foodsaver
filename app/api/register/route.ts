import { NextResponse } from "next/server";
import { hash } from "bcryptjs";

export const dynamic = 'force-dynamic';

// Lazy import prisma to avoid build-time initialization
const getPrisma = async () => {
    const { prisma } = await import("@/lib/prisma");
    return prisma;
};

export async function POST(req: Request) {
    try {
        const prisma = await getPrisma();
        const body = await req.json();
        const { name, email, password, role, phone, address } = body;

        if (!name || !email || !password || !role) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

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
                phone,
                address,
            },
        });

        return NextResponse.json(
            { message: "User registered successfully", user: { id: user.id } },
            { status: 201 }
        );
    } catch (error: unknown) {
        console.error("Registration error:", error);

        // Provide more specific error messages
        let message = "An error occurred during registration";

        if (error instanceof Error) {
            // Check for common Prisma/database errors
            if (error.message.includes("DATABASE_URL")) {
                message = "Database connection not configured";
            } else if (error.message.includes("Connection")) {
                message = "Unable to connect to database";
            } else if (error.message.includes("Unique constraint")) {
                message = "User with this email already exists";
            } else if (process.env.NODE_ENV === 'development') {
                message = error.message;
            }
        }

        return NextResponse.json(
            { message },
            { status: 500 }
        );
    }
}
