"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Loader2, MapPin, Package, CheckCircle2, Phone, Navigation, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function ActivePickupsPage() {
    const { data: session } = useSession();
    const [assignments, setAssignments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchActive = async () => {
        try {
            const res = await fetch("/api/volunteers?mode=active");
            const data = await res.json();
            setAssignments(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch active assignments:", error);
            setAssignments([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (session?.user) fetchActive();
    }, [session]);

    const updateStatus = async (assignmentId: string, status: string) => {
        const res = await fetch("/api/volunteers", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ assignmentId, status }),
        });
        if (res.ok) fetchActive();
    };

    // Live Tracking logic
    useEffect(() => {
        const activePickups = Array.isArray(assignments) ? assignments.filter(a => a.status === 'PICKED_UP') : [];
        if (activePickups.length === 0) return;

        const interval = setInterval(() => {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition((position) => {
                    activePickups.forEach(a => {
                        fetch("/api/volunteers/tracking", {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                assignmentId: a.id,
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude
                            }),
                        });
                    });
                }, (err) => console.error("Geo error:", err), { enableHighAccuracy: true });
            }
        }, 15000); // 15 seconds

        return () => clearInterval(interval);
    }, [assignments]);

    if (isLoading) return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;

    return (
        <div className="container mx-auto px-4 py-12">
            <Link href="/pickups" className="flex items-center gap-2 text-sm text-muted-foreground mb-8 hover:text-primary">
                <ArrowLeft className="h-4 w-4" /> Back to Available Tasks
            </Link>

            <h1 className="text-3xl font-extrabold text-gray-900 mb-12">My Active Tasks</h1>

            {assignments.length === 0 ? (
                <div className="text-center py-20 bg-muted/20 rounded-3xl border border-dashed">
                    <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="font-bold">You have no active deliveries.</p>
                    <Link href="/pickups" className="text-primary font-bold hover:underline">Find a task →</Link>
                </div>
            ) : (
                <div className="space-y-8">
                    {Array.isArray(assignments) && assignments.map((assignment) => (
                        <div key={assignment.id} className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-l-8 border-primary relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 flex gap-2">
                                {assignment.status === "PICKED_UP" && (
                                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 animate-pulse">
                                        <div className="h-1.5 w-1.5 rounded-full bg-white" />
                                        Live Tracking Active
                                    </span>
                                )}
                                <span className="bg-primary/10 text-primary px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                                    {assignment.status}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-2xl font-black text-gray-900">{assignment.request.listing.title}</h3>
                                        <p className="text-primary font-bold">{assignment.request.requestedQty} {assignment.request.listing.unit}</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="p-4 rounded-2xl bg-muted/30 border space-y-3">
                                            <div className="flex items-start gap-3">
                                                <MapPin className="h-5 w-5 text-primary mt-1" />
                                                <div>
                                                    <p className="text-xs font-bold uppercase text-muted-foreground">Pickup from {assignment.request.listing.donor.name}</p>
                                                    <p className="font-bold">{assignment.request.listing.address}</p>
                                                    {assignment.request.listing.donor.phone && <p className="text-xs text-primary font-bold mt-1">Tel: {assignment.request.listing.donor.phone}</p>}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 space-y-3">
                                            <div className="flex items-start gap-3">
                                                <Navigation className="h-5 w-5 text-blue-500 mt-1" />
                                                <div>
                                                    <p className="text-xs font-bold uppercase text-muted-foreground">Deliver to {assignment.request.receiver.name}</p>
                                                    <p className="font-bold">{assignment.request.receiver.address || "Receiver Location"}</p>
                                                    {assignment.request.receiver.phone && <p className="text-xs text-primary font-bold mt-1">Tel: {assignment.request.receiver.phone}</p>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col justify-center gap-4">
                                    {assignment.status === "ASSIGNED" && (
                                        <button
                                            onClick={() => updateStatus(assignment.id, "PICKED_UP")}
                                            className="w-full py-6 rounded-2xl bg-primary text-white text-xl font-black shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
                                        >
                                            Confirm Food Pickup
                                        </button>
                                    )}
                                    {assignment.status === "PICKED_UP" && (
                                        <button
                                            onClick={() => updateStatus(assignment.id, "DELIVERED")}
                                            className="w-full py-6 rounded-2xl bg-blue-600 text-white text-xl font-black shadow-lg shadow-blue/20 hover:scale-[1.02] transition-all"
                                        >
                                            Confirm Successful Delivery
                                        </button>
                                    )}
                                    <p className="text-center text-xs text-muted-foreground font-bold uppercase tracking-widest">
                                        Please ensure food safety during transport
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
