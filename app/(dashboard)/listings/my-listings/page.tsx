"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ListingCard from "@/components/cards/ListingCard";
import { Plus, Loader2, Utensils } from "lucide-react";
import Link from "next/link";

export default function MyListingsPage() {
    const { data: session } = useSession();
    const [listings, setListings] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (session?.user) {
            fetch(`/api/listings?donorId=${(session.user as any).id}`)
                .then((res) => res.json())
                .then((data) => {
                    setListings(data);
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
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                        My Food Donations
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        Manage your active and past food listings.
                    </p>
                </div>
                <Link
                    href="/listings/create"
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
                >
                    <Plus className="h-5 w-5" />
                    New Donation
                </Link>
            </div>

            {listings.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed p-20 text-center">
                    <div className="rounded-full bg-primary/10 p-4 text-primary mb-6">
                        <Utensils className="h-10 w-10" />
                    </div>
                    <h3 className="text-xl font-bold">No donations yet</h3>
                    <p className="mt-2 text-muted-foreground max-w-sm mx-auto">
                        You haven't listed any surplus food yet. Share what you have and help someone in need!
                    </p>
                    <Link
                        href="/listings/create"
                        className="mt-8 font-bold text-primary hover:underline"
                    >
                        Create your first listing →
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {listings.map((listing) => (
                        <ListingCard key={listing.id} listing={listing} />
                    ))}
                </div>
            )}
        </div>
    );
}
