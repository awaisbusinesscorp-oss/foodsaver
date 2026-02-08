"use client";

import Link from "next/link";
import { MapPin, Clock, Utensils } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface ListingCardProps {
    listing: {
        id: string;
        title: string;
        description: string | null;
        foodType: string;
        quantity: number;
        unit: string;
        expiryTime: Date;
        address: string;
        status: string;
        images?: { url: string }[];
        uniqueId?: string;
    };
    className?: string;
}

export default function ListingCard({ listing, className }: ListingCardProps) {
    const isExpired = new Date(listing.expiryTime) < new Date();

    return (
        <Link
            href={`/listings/${listing.id}`}
            className={cn(
                "group relative block overflow-hidden rounded-2xl border bg-white shadow-sm transition-all hover:shadow-lg hover:border-primary/30",
                isExpired && "opacity-75",
                className
            )}
        >
            {/* Image Section */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                {listing.images && listing.images.length > 0 ? (
                    <img
                        src={listing.images[0].url}
                        alt={listing.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-primary/5 text-primary">
                        <Utensils className="h-12 w-12" />
                    </div>
                )}
                <div className="absolute top-3 left-3 right-3 flex justify-between items-start gap-2">
                    <div className="flex gap-2">
                        <span className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary backdrop-blur-sm">
                            {listing.foodType}
                        </span>
                        {isExpired && (
                            <span className="rounded-full bg-destructive/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                                Expired
                            </span>
                        )}
                    </div>
                    {listing.uniqueId && (
                        <span className="rounded-md bg-gray-900/80 px-2 py-1 text-[10px] font-black uppercase tracking-tighter text-white backdrop-blur-sm">
                            {listing.uniqueId}
                        </span>
                    )}
                </div>
            </div>

            {/* Content Section */}
            <div className="p-4">
                <div className="flex items-start justify-between">
                    <h3 className="line-clamp-1 text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">
                        {listing.title}
                    </h3>
                    <span className="shrink-0 text-sm font-bold text-primary">
                        {listing.quantity} {listing.unit}
                    </span>
                </div>

                <div className="mt-3 space-y-2">
                    <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="mr-1.5 h-4 w-4 shrink-0 text-primary" />
                        <span className="line-clamp-1">{listing.address}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                        <Clock className="mr-1.5 h-4 w-4 shrink-0 text-primary" />
                        <span suppressHydrationWarning>
                            Expires in {formatDistanceToNow(new Date(listing.expiryTime))}
                        </span>
                    </div>
                </div>

                <div className="mt-5">
                    <span
                        className={cn(
                            "block w-full rounded-xl py-2.5 text-sm font-bold text-center shadow-sm transition-all",
                            isExpired
                                ? "bg-gray-300 text-gray-500"
                                : "bg-primary text-white group-hover:bg-primary/90"
                        )}
                    >
                        {isExpired ? "Unavailable" : "View Details"}
                    </span>
                </div>
            </div>
        </Link>
    );
}
