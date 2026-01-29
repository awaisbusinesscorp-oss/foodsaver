"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Loader2, Clock, CheckCircle2, XCircle, MapPin, Phone, Package, ArrowRight, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import Link from "next/link";
import VolunteerTracker from "@/components/maps/VolunteerTracker";

const STATUS_TRACKER = [
    { id: "PENDING", label: "Requested", icon: Clock },
    { id: "ACCEPTED", label: "Accepted", icon: CheckCircle2 },
    { id: "PICKED_UP", label: "On the way", icon: Package },
    { id: "DELIVERED", label: "Delivered", icon: CheckCircle2 },
];

export default function DonationHistoryPage() {
    const { data: session } = useSession();
    const [requests, setRequests] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (session?.user) {
            fetch("/api/donations?role=receiver")
                .then((res) => res.json())
                .then((data) => {
                    setRequests(data);
                    setIsLoading(false);
                });
        }
    }, [session]);

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
                    Donation History
                </h1>
                <p className="mt-2 text-muted-foreground">
                    Track your requested donations and their current status.
                </p>
            </div>

            {requests.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed p-20 text-center bg-white">
                    <Package className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-bold">No history found</h3>
                    <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
                        You haven't requested any food yet. Browse the community to find surplus food!
                    </p>
                    <Link href="/explore" className="mt-8 font-bold text-primary hover:underline">
                        Explore nearby food →
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-8">
                    {requests.map((request) => (
                        <div
                            key={request.id}
                            className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-primary/5 hover:shadow-md transition-shadow"
                        >
                            <div className="flex flex-col lg:flex-row gap-8">
                                {/* Left Side: Summary */}
                                <div className="w-full lg:w-1/3">
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="h-20 w-20 rounded-2xl overflow-hidden shrink-0 border">
                                            {request.listing.images?.[0] ? (
                                                <img src={request.listing.images[0].url} alt="Food" className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="h-full w-full bg-primary/5 flex items-center justify-center text-primary">
                                                    <Package className="h-10 w-10" />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-xl font-bold text-gray-900">{request.listing.title}</h3>
                                                {request.listing.uniqueId && (
                                                    <span className="text-[10px] font-black text-white bg-gray-900 px-2 py-0.5 rounded uppercase tracking-tighter">
                                                        ID: {request.listing.uniqueId}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm font-bold text-primary mt-1">
                                                {request.requestedQty} {request.listing.unit}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Requested {format(new Date(request.createdAt), "MMM d, yyyy")}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-4 p-4 rounded-2xl bg-muted/20 border text-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-primary shadow-sm">
                                                <Package className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold uppercase text-muted-foreground">Donor</p>
                                                <p className="font-bold">{request.listing.donor.name}</p>
                                            </div>
                                        </div>
                                        {request.status === "ACCEPTED" && request.listing.donor.phone && (
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-primary shadow-sm">
                                                    <Phone className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold uppercase text-muted-foreground">Phone</p>
                                                    <p className="font-bold">{request.listing.donor.phone}</p>
                                                </div>
                                            </div>
                                        )}
                                        <div className="flex font-bold text-xs pt-4 border-t">
                                            <Link href={`/listings/${request.listingId}`} className="text-primary hover:underline flex items-center gap-1">
                                                View Listing Details <ArrowRight className="h-3 w-3" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: Status Tracker & Live Map */}
                                <div className="flex-1 flex flex-col">
                                    <h4 className="font-bold text-gray-900 mb-8 flex items-center gap-2">
                                        <Clock className="h-5 w-5 text-primary" />
                                        Tracking Status: {request.status}
                                    </h4>

                                    {request.status === "DECLINED" ? (
                                        <div className="p-12 rounded-3xl bg-destructive/5 border border-destructive/20 text-center">
                                            <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                                            <h5 className="text-lg font-bold text-destructive">Request Declined</h5>
                                            <p className="text-muted-foreground text-sm mt-2">
                                                Unfortunately, the donor was unable to fulfill this request.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-8">
                                            {/* Status Stepper */}
                                            <div className="relative pt-4 pb-4">
                                                <div className="absolute top-10 left-6 right-6 h-0.5 bg-muted hidden sm:block" />
                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                                    {STATUS_TRACKER.map((step, idx) => {
                                                        const isActive = request.status === step.id || (
                                                            (request.status === "ACCEPTED" && idx === 0) ||
                                                            (request.status === "PICKED_UP" && idx <= 2) ||
                                                            (request.status === "DELIVERED" && idx <= 3)
                                                        );

                                                        return (
                                                            <div key={step.id} className="relative flex flex-col items-center text-center">
                                                                <div className={cn(
                                                                    "z-10 h-12 w-12 rounded-full flex items-center justify-center transition-all duration-500",
                                                                    isActive ? "bg-primary text-white scale-110 shadow-lg shadow-primary/30" : "bg-white border-2 text-muted-foreground"
                                                                )}>
                                                                    <step.icon className="h-6 w-6" />
                                                                </div>
                                                                <p className={cn(
                                                                    "mt-4 text-[10px] font-bold uppercase tracking-widest",
                                                                    isActive ? "text-primary" : "text-muted-foreground"
                                                                )}>
                                                                    {step.label}
                                                                </p>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* Live Tracking Map for active deliveries */}
                                            {(request.status === "ACCEPTED" || request.status === "PICKED_UP") && (
                                                <div className="mt-4 border-t pt-8">
                                                    <p className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                                                        <Navigation className="h-4 w-4 text-primary" />
                                                        Volunteer Delivery Tracker
                                                    </p>
                                                    <VolunteerTracker
                                                        requestId={request.id}
                                                        donorLocation={[request.listing.latitude || 31.5204, request.listing.longitude || 74.3587]}
                                                        receiverLocation={[
                                                            (session?.user as any).latitude || 31.5312,
                                                            (session?.user as any).longitude || 74.3154
                                                        ]}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
