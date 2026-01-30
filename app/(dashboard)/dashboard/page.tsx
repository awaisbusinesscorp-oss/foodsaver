"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "loading") return;

        if (!session) {
            router.push("/login");
            return;
        }

        const role = (session.user as any)?.role;

        // Redirect based on user role
        switch (role) {
            case "ADMIN":
                router.push("/admin/dashboard");
                break;
            case "DONOR":
                router.push("/listings/my-listings");
                break;
            case "RECEIVER":
                router.push("/explore");
                break;
            case "VOLUNTEER":
                router.push("/pickups");
                break;
            default:
                router.push("/impact");
        }
    }, [session, status, router]);

    return (
        <div className="flex min-h-screen items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
    );
}
