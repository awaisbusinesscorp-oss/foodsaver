"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    MapPin,
    Clock,
    Utensils,
    Calendar,
    ChevronLeft,
    User,
    Star,
    Info,
    ShieldCheck,
    Loader2
} from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow, format } from "date-fns";
import MapBox from "@/components/maps/MapBox";
import DonationRequestModal from "@/components/modals/DonationRequestModal";

export default function ListingDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [listing, setListing] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

    useEffect(() => {
        // For now, we fetch from the general listings API and filter
        // ideally we'd have a specific /api/listings/[id] route
        fetch("/api/listings")
            .then((res) => res.json())
            .then((data) => {
                const found = data.find((l: any) => l.id === params.id);
                setListing(found);
                setIsLoading(false);
            });
    }, [params.id]);

    if (isLoading) {
        return (
            <div className="flex min-h-[80vh] items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    if (!listing) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-bold">Listing not found</h2>
                <Link href="/explore" className="text-primary hover:underline mt-4 inline-block">
                    Return to explore
                </Link>
            </div>
        );
    }

    const isExpired = new Date(listing.expiryTime) < new Date();

    return (
        <div className="bg-muted/10 min-h-screen">
            <div className="container mx-auto px-4 py-8">
                {/* Navigation */}
                <button
                    onClick={() => router.back()}
                    className="mb-6 flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Back to Results
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Main Content Side */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Header Card */}
                        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-primary/5 overflow-hidden relative">
                            {isExpired && (
                                <div className="absolute top-0 right-0 bg-destructive text-white px-6 py-2 rounded-bl-2xl font-bold uppercase tracking-widest text-xs">
                                    Expired
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="bg-primary/10 text-primary text-[10px] font-bold uppercase px-3 py-1 rounded-full">
                                            {listing.foodType}
                                        </span>
                                        <span className="text-muted-foreground text-xs font-medium">
                                            Posted {format(new Date(listing.createdAt), "MMM d, h:mm a")}
                                        </span>
                                    </div>
                                    <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">
                                        {listing.title}
                                    </h1>
                                </div>
                                <div className="bg-primary/5 rounded-2xl p-4 text-center min-w-[120px]">
                                    <span className="block text-2xl font-black text-primary">{listing.quantity}</span>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{listing.unit}</span>
                                </div>
                            </div>

                            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="flex items-center gap-4 group">
                                    <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                        <Clock className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Expires In</span>
                                        <p className="font-bold text-gray-900">
                                            {isExpired ? "Expired" : formatDistanceToNow(new Date(listing.expiryTime))}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                                        <MapPin className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Address</span>
                                        <p className="font-bold text-gray-900 lg:line-clamp-1">{listing.address}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description & Details */}
                        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-primary/5">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Info className="h-5 w-5 text-primary" />
                                About this Donation
                            </h2>
                            <p className="text-muted-foreground leading-relaxed">
                                {listing.description || "No additional description provided for this listing."}
                            </p>

                            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 rounded-2xl border bg-muted/5">
                                    <h4 className="font-bold text-sm mb-2">Safety Guidelines</h4>
                                    <ul className="text-xs text-muted-foreground space-y-2">
                                        <li className="flex items-start gap-2">
                                            <ShieldCheck className="h-3 w-3 text-primary mt-0.5 shrink-0" />
                                            Keep hot food above 60°C until pickup.
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <ShieldCheck className="h-3 w-3 text-primary mt-0.5 shrink-0" />
                                            Keep cold food below 5°C.
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Images Gallery */}
                        {listing.images?.length > 0 && (
                            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-primary/5">
                                <h2 className="text-xl font-bold mb-6">Photos</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {listing.images.map((img: any) => (
                                        <div key={img.id} className="aspect-[4/3] rounded-2xl overflow-hidden border bg-muted">
                                            <img src={img.url} alt="Food" className="h-full w-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action Sidebar */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Request Card */}
                        <div className="bg-white rounded-3xl p-6 shadow-xl border border-primary/20 sticky top-24">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <User className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">{listing.donor.name}</h4>
                                    <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                                        <Star className="h-3 w-3 fill-amber-500" />
                                        {listing.donor.rating.toFixed(1)} Donor Rating
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-sm p-3 rounded-xl bg-muted/30">
                                    <span className="font-medium">Availability</span>
                                    <span className="font-bold text-primary">Available Now</span>
                                </div>

                                <button
                                    onClick={() => setIsRequestModalOpen(true)}
                                    disabled={isExpired}
                                    className="w-full rounded-2xl bg-primary py-4 text-lg font-bold text-white shadow-xl shadow-primary/20 transition-all hover:bg-primary/90 active:scale-[0.98] disabled:bg-gray-300 disabled:shadow-none"
                                >
                                    {isExpired ? "Already Expired" : "Request This Food"}
                                </button>
                                <p className="text-[10px] text-center text-muted-foreground uppercase font-bold tracking-wider">
                                    * By requesting, you agree to our safety guidelines
                                </p>
                            </div>

                            <div className="mt-8 border-t pt-6">
                                <h4 className="font-bold text-sm mb-4">Location View</h4>
                                <div className="aspect-square w-full rounded-2xl overflow-hidden border">
                                    <MapBox listings={[listing]} center={[listing.latitude, listing.longitude]} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {isRequestModalOpen && (
                <DonationRequestModal
                    listingId={listing.id}
                    listingTitle={listing.title}
                    maxQuantity={listing.quantity}
                    unit={listing.unit}
                    onClose={() => setIsRequestModalOpen(false)}
                />
            )}
        </div>
    );
}
