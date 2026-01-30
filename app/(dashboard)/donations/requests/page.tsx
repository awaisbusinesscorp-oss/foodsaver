"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Loader2, CheckCircle2, XCircle, Clock, ArrowRight, User, Phone, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function DonorRequestsPage() {
    const { data: session } = useSession();
    const [requests, setRequests] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchRequests = async () => {
        try {
            const res = await fetch("/api/donations?role=donor");
            const data = await res.json();
            setRequests(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch requests:", error);
            setRequests([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (session?.user) {
            fetchRequests();
        }
    }, [session]);

    const handleUpdateStatus = async (requestId: string, status: string) => {
        try {
            const res = await fetch("/api/donations", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ requestId, status }),
            });

            if (res.ok) {
                fetchRequests();
            }
        } catch (err) {
            console.error("Update error:", err);
        }
    };

    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="mb-12">
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                    Incoming Requests
                </h1>
                <p className="mt-2 text-muted-foreground">
                    Manage requests from people and organizations looking for your food.
                </p>
            </div>

            {requests.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed p-20 text-center bg-white">
                    <Package className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-bold">No requests yet</h3>
                    <p className="text-muted-foreground mt-2">When someone requests your food, it will appear here.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {Array.isArray(requests) && requests.map((request) => (
                        <div
                            key={request.id}
                            className="bg-white rounded-3xl p-6 shadow-sm border border-primary/5 hover:shadow-md transition-shadow"
                        >
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                {/* Request Info */}
                                <div className="flex items-start gap-4">
                                    <div className="h-16 w-16 rounded-2xl overflow-hidden shrink-0 border">
                                        {request.listing.images?.[0] ? (
                                            <img src={request.listing.images[0].url} alt="Food" className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="h-full w-full bg-primary/5 flex items-center justify-center text-primary">
                                                <Package className="h-8 w-8" />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">{request.listing.title}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs font-bold text-primary px-2 py-0.5 bg-primary/10 rounded-full uppercase">
                                                {request.requestedQty} {request.listing.unit}
                                            </span>
                                            <span className="text-xs text-muted-foreground font-medium">
                                                Requested {format(new Date(request.createdAt), "MMM d, h:mm a")}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Receiver Info */}
                                <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-muted/30">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                            <User className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{request.receiver.name}</p>
                                            <p className="text-xs text-muted-foreground">Receiver Rating: {request.receiver.rating.toFixed(1)}</p>
                                        </div>
                                    </div>
                                    {request.receiver.phone && (
                                        <div className="flex items-center gap-2 text-sm text-primary font-bold">
                                            <Phone className="h-4 w-4" />
                                            {request.receiver.phone}
                                        </div>
                                    )}
                                </div>

                                {/* Status & Actions */}
                                <div className="flex items-center gap-3">
                                    {request.status === "PENDING" ? (
                                        <>
                                            <button
                                                onClick={() => handleUpdateStatus(request.id, "DECLINED")}
                                                className="flex items-center gap-2 px-6 py-3 rounded-2xl border-2 border-destructive text-destructive font-bold hover:bg-destructive/5 transition-all text-sm"
                                            >
                                                <XCircle className="h-4 w-4" />
                                                Decline
                                            </button>
                                            <button
                                                onClick={() => handleUpdateStatus(request.id, "ACCEPTED")}
                                                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-white font-bold hover:bg-primary/90 transition-all text-sm shadow-lg shadow-primary/20"
                                            >
                                                <CheckCircle2 className="h-4 w-4" />
                                                Accept
                                            </button>
                                        </>
                                    ) : (
                                        <div className={cn(
                                            "px-6 py-3 rounded-2xl font-bold text-sm uppercase tracking-widest border-2",
                                            request.status === "ACCEPTED" ? "border-primary text-primary bg-primary/5" : "border-muted text-muted-foreground bg-muted/10 text-destructive"
                                        )}>
                                            {request.status}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {request.notes && (
                                <div className="mt-6 p-4 rounded-2xl bg-muted/20 border text-sm text-muted-foreground italic">
                                    "{request.notes}"
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
