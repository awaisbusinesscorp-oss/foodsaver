"use client";

import { useEffect, useState, use } from "react";
import dynamic from "next/dynamic";
import { Loader2, Phone, User, MapPin, Package, CheckCircle2 } from "lucide-react";
import Link from "next/link";

// Dynamic import for Map to avoid SSR issues
const TrackingMap = dynamic(() => import("@/components/maps/TrackingMap"), {
    ssr: false,
    loading: () => <div className="h-full w-full flex items-center justify-center bg-gray-100 animate-pulse text-muted-foreground">Loading Map...</div>
});

interface TrackingData {
    currentLat: number;
    currentLng: number;
    status: string;
    volunteer: {
        name: string;
        phone: string | null;
    };
    request: {
        listing: {
            latitude: number | null;
            longitude: number | null;
            address: string;
            title: string;
        };
        receiver: {
            latitude: number | null;
            longitude: number | null;
            address: string;
            name: string;
        };
    };
}

export default function OrderTrackingPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchTracking = async () => {
        try {
            const res = await fetch(`/api/volunteers/tracking?requestId=${id}`);
            if (!res.ok) throw new Error("Tracking info not available");
            const data = await res.json();
            if (!data) throw new Error("No active tracking found");
            setTrackingData(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTracking();
        const interval = setInterval(fetchTracking, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, [id]);

    if (isLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;

    if (error || !trackingData) {
        return (
            <div className="flex flex-col h-[60vh] items-center justify-center text-center p-8">
                <div className="h-20 w-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-6">
                    <Package className="h-10 w-10" />
                </div>
                <h1 className="text-2xl font-black text-gray-900 mb-2">Tracking Unavailable</h1>
                <p className="text-gray-600 mb-8 max-w-md">{error || "We couldn't find an active delivery for this order. It might already be delivered or cancelled."}</p>
                <Link href="/dashboard" className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all">
                    Return to Dashboard
                </Link>
            </div>
        );
    }

    const { status, volunteer, request } = trackingData;
    const isDelivered = status === "DELIVERED";

    // Default coordinates if missing (e.g. New York)
    const DEFAULT_POS: [number, number] = [40.7128, -74.0060];

    // Parse coordinates safely
    const volunteerPos: [number, number] = trackingData.currentLat && trackingData.currentLng
        ? [trackingData.currentLat, trackingData.currentLng]
        : DEFAULT_POS;

    const donorPos: [number, number] = request.listing.latitude && request.listing.longitude
        ? [request.listing.latitude, request.listing.longitude]
        : [volunteerPos[0] + 0.01, volunteerPos[1] + 0.01]; // Mock offset if missing

    const receiverPos: [number, number] = request.receiver.latitude && request.receiver.longitude
        ? [request.receiver.latitude, request.receiver.longitude]
        : [volunteerPos[0] - 0.01, volunteerPos[1] - 0.01]; // Mock offset if missing

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <div className="bg-white border-b px-6 py-4 flex flex-col sm:flex-row justify-between items-center shadow-sm z-10">
                <div>
                    <h1 className="text-xl font-black text-gray-900 flex items-center gap-2">
                        <Package className="h-5 w-5 text-primary" />
                        Live Delivery Tracking
                    </h1>
                    <p className="text-sm text-gray-500 font-medium">Order ID: #{id.slice(-6)}</p>
                </div>
                <div className={`mt-4 sm:mt-0 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 ${isDelivered ? "bg-green-100 text-green-700" : "bg-blue-50 text-blue-600 animate-pulse"
                    }`}>
                    {isDelivered ? <CheckCircle2 className="h-4 w-4" /> : <div className="h-2 w-2 rounded-full bg-blue-600" />}
                    {status.replace("_", " ")}
                </div>
            </div>

            {/* Map Area */}
            <div className="flex-1 relative">
                {isDelivered ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100/50 backdrop-blur-sm z-20">
                        <div className="bg-white p-10 rounded-3xl shadow-2xl text-center max-w-lg mx-4">
                            <div className="h-24 w-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 className="h-12 w-12" />
                            </div>
                            <h2 className="text-3xl font-black text-gray-900 mb-4">Delivered Successfully!</h2>
                            <p className="text-gray-600 mb-8 text-lg">Thank you for using FoodSaver. This food has been safely delivered.</p>
                            <Link href="/donations/history" className="w-full block py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all">
                                View Donation History
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="absolute inset-0 z-0">
                        <TrackingMap
                            volunteerPos={volunteerPos}
                            donorPos={donorPos}
                            receiverPos={receiverPos}
                        />
                    </div>
                )}

                {/* Info Card Overlay */}
                {!isDelivered && (
                    <div className="absolute bottom-0 left-0 right-0 sm:left-6 sm:bottom-6 sm:right-auto sm:w-96 bg-white sm:rounded-3xl shadow-2xl border border-gray-100 p-6 z-10 m-4 sm:m-0 rounded-2xl">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <User className="h-7 w-7" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Your Volunteer</p>
                                <p className="text-lg font-black text-gray-900">{volunteer.name}</p>
                            </div>
                            {volunteer.phone && (
                                <a href={`tel:${volunteer.phone}`} className="ml-auto p-3 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors">
                                    <Phone className="h-5 w-5" />
                                </a>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div className="relative pl-8 border-l-2 border-gray-100 pb-6">
                                <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full border-2 border-white bg-green-500 shadow-md" />
                                <p className="text-xs font-bold text-gray-400 uppercase mb-1">Pickup Information</p>
                                <p className="font-bold text-sm text-gray-900">{request.listing.title}</p>
                                <p className="text-xs text-gray-500 mt-0.5 truncate">{request.listing.address}</p>
                            </div>
                            <div className="relative pl-8 border-l-2 border-gray-100">
                                <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full border-2 border-white bg-blue-500 shadow-md" />
                                <p className="text-xs font-bold text-gray-400 uppercase mb-1">Delivery Destination</p>
                                <p className="font-bold text-sm text-gray-900">{request.receiver.name}</p>
                                <p className="text-xs text-gray-500 mt-0.5 truncate">{request.receiver.address}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
