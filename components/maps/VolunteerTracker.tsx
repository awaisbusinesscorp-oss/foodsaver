"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Loader2, Phone, User, Package } from "lucide-react";

// Dynamically import the map to avoid SSR issues
interface TrackingMapProps {
    volunteerPos: [number, number];
    donorPos: [number, number];
    receiverPos: [number, number];
}

const Map = dynamic<TrackingMapProps>(() => import("./TrackingMap"), {
    ssr: false,
    loading: () => (
        <div className="flex h-full w-full items-center justify-center bg-muted/20 animate-pulse rounded-2xl">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    ),
});

interface VolunteerTrackerProps {
    requestId: string;
    donorLocation: [number, number];
    receiverLocation: [number, number];
}

export default function VolunteerTracker({ requestId, donorLocation, receiverLocation }: VolunteerTrackerProps) {
    const [trackingData, setTrackingData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTracking = async () => {
            try {
                const res = await fetch(`/api/volunteers/tracking?requestId=${requestId}`);
                if (res.ok) {
                    const data = await res.json();
                    setTrackingData(data);
                }
            } catch (error) {
                console.error("Tracking fetch error:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTracking();
        const interval = setInterval(fetchTracking, 15000); // Polling every 15 seconds

        return () => clearInterval(interval);
    }, [requestId]);

    if (isLoading && !trackingData) {
        return (
            <div className="flex h-full w-full items-center justify-center bg-muted/20 animate-pulse rounded-2xl">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!trackingData || !trackingData.currentLat) {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-muted/10 rounded-2xl border border-dashed text-center">
                <Package className="h-10 w-10 text-muted-foreground mb-4" />
                <p className="text-sm font-bold text-gray-900">Waiting for volunteer to start delivery...</p>
                <p className="text-xs text-muted-foreground mt-1">Live tracking will appear here once the volunteer is on the way.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="h-[300px] w-full rounded-2xl overflow-hidden shadow-xl border relative">
                <Map
                    volunteerPos={[trackingData.currentLat, trackingData.currentLng]}
                    donorPos={donorLocation}
                    receiverPos={receiverLocation}
                />
                <div className="absolute top-4 left-4 z-[1000]">
                    <span className="bg-red-500 text-white px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 animate-pulse shadow-lg">
                        <div className="h-2 w-2 rounded-full bg-white" />
                        Live tracking
                    </span>
                </div>
            </div>

            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-primary shadow-sm">
                        <User className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase text-muted-foreground">Volunteer</p>
                        <p className="text-sm font-bold text-gray-900">{trackingData.volunteer.name}</p>
                    </div>
                </div>

                {trackingData.volunteer.phone && (
                    <a
                        href={`tel:${trackingData.volunteer.phone}`}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all shadow-md active:scale-95"
                    >
                        <Phone className="h-3.5 w-3.5" />
                        Call Volunteer
                    </a>
                )}
            </div>
        </div>
    );
}
