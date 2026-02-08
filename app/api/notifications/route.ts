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

export async function GET(_req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const user = session.user as SessionUser;
        const prisma = await getPrisma();

        const notifications = await prisma.notification.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: "desc" },
            take: 50
        });

        return NextResponse.json(notifications);
    } catch (_error) {
        return NextResponse.json({ message: "Error" }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const prisma = await getPrisma();
        const { id } = await req.json();

        await prisma.notification.update({
            where: { id },
            data: { read: true }
        });

        return NextResponse.json({ success: true });
    } catch (_error) {
        return NextResponse.json({ message: "Error" }, { status: 500 });
    }
}
