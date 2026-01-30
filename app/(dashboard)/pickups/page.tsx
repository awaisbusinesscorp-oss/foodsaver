"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2, MapPin, Package, Navigation, ArrowRight, User } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import MapBox from "@/components/maps/MapBox";

export default function AvailablePickupsPage() {
    const router = useRouter();
    const { data: session } = useSession();
    const [pickups, setPickups] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPickups = async () => {
        try {
            const res = await fetch("/api/volunteers?mode=available");
            const data = await res.json();
            setPickups(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch pickups:", error);
            setPickups([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (session?.user) fetchPickups();
    }, [session]);

    const [isAssigning, setIsAssigning] = useState<string | null>(null);

    const handleAssign = async (requestId: string) => {
        setIsAssigning(requestId);
        try {
            const res = await fetch("/api/volunteers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ requestId }),
            });
            if (res.ok) {
                router.push("/pickups/active");
            }
        } catch (error) {
            console.error("Assignment error:", error);
        } finally {
            setIsAssigning(null);
        }
    };

    if (isLoading) return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="mb-12 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">Available Deliveries</h1>
                    <p className="text-muted-foreground mt-2">Help bridge the gap between donors and receivers.</p>
                </div>
                <Link href="/pickups/active" className="text-sm font-bold text-primary hover:underline">
                    View Active Tasks →
                </Link>
            </div>

            {pickups.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed">
                    <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="font-bold text-lg">No available pickups at the moment.</p>
                    <p className="text-muted-foreground">Check back later for new opportunities.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {Array.isArray(pickups) && pickups.map((pickup) => (
                        <div key={pickup.id} className="bg-white rounded-3xl p-6 shadow-sm border border-primary/5 flex flex-col sm:flex-row gap-6">
                            <div className="flex-1 space-y-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-xl font-bold">{pickup.listing.title}</h3>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${pickup.status === "ACCEPTED"
                                            ? "bg-primary/10 text-primary"
                                            : "bg-amber-100 text-amber-600"
                                            }`}>
                                            {pickup.status === "ACCEPTED" ? "Approved" : "Awaiting Approval"}
                                        </span>
                                    </div>
                                    <p className="text-sm text-primary font-bold">{pickup.requestedQty} {pickup.listing.unit}</p>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm">
                                        <MapPin className="h-4 w-4 text-primary" />
                                        <span className="font-bold">Pickup:</span> {pickup.listing.address}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Navigation className="h-4 w-4 text-blue-500" />
                                        <span className="font-bold">Dropoff:</span> {pickup.receiver.address || "Recipient Address"}
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleAssign(pickup.id)}
                                    disabled={isAssigning !== null}
                                    className="w-full bg-primary text-white font-bold py-3 rounded-2xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isAssigning === pickup.id ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Accepting...
                                        </>
                                    ) : (
                                        <>
                                            Accept Delivery Task <ArrowRight className="h-4 w-4" />
                                        </>
                                    )}
                                </button>
                            </div>
                            <div className="w-full sm:w-48 aspect-square rounded-2xl overflow-hidden border">
                                <MapBox
                                    listings={[pickup.listing]}
                                    center={
                                        pickup.listing.latitude && pickup.listing.longitude
                                            ? [pickup.listing.latitude, pickup.listing.longitude]
                                            : null
                                    }
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
