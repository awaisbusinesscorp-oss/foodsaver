"use client";

import { useEffect, useState } from "react";
import ListingCard from "@/components/cards/ListingCard";
import MapBox from "@/components/maps/MapBox";
import { Search, Map as MapIcon, List, Filter, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ExplorePage() {
    const [listings, setListings] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState<"list" | "map">("list");
    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState("ALL");

    useEffect(() => {
        fetch("/api/listings")
            .then((res) => res.json())
            .then((data) => {
                setListings(data);
                setIsLoading(false);
            });
    }, []);

    const filteredListings = listings.filter((l) => {
        const matchesSearch = l.title.toLowerCase().includes(search.toLowerCase()) ||
            l.address.toLowerCase().includes(search.toLowerCase());
        const matchesType = filterType === "ALL" || l.foodType === filterType;
        return matchesSearch && matchesType;
    });

    return (
        <div className="flex flex-col h-[calc(100vh-64px)]">
            {/* Search & Filter Header */}
            <div className="border-b bg-white p-4">
                <div className="container mx-auto flex flex-col md:flex-row items-center gap-4">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <input
                            placeholder="Search by food name or location..."
                            className="w-full rounded-2xl border bg-muted/30 pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <select
                            className="flex-1 md:flex-none rounded-2xl border bg-white px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/50"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            <option value="ALL">All Types</option>
                            <option value="COOKED">Cooked</option>
                            <option value="RAW">Raw</option>
                            <option value="PACKAGED">Packaged</option>
                            <option value="BEVERAGES">Beverages</option>
                        </select>

                        <div className="flex rounded-2xl border bg-muted/30 p-1">
                            <button
                                onClick={() => setViewMode("list")}
                                className={cn(
                                    "p-2 rounded-xl transition-all",
                                    viewMode === "list" ? "bg-white shadow-sm text-primary" : "text-muted-foreground"
                                )}
                            >
                                <List className="h-5 w-5" />
                            </button>
                            <button
                                onClick={() => setViewMode("map")}
                                className={cn(
                                    "p-2 rounded-xl transition-all",
                                    viewMode === "map" ? "bg-white shadow-sm text-primary" : "text-muted-foreground"
                                )}
                            >
                                <MapIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-hidden relative">
                {isLoading ? (
                    <div className="flex h-full w-full items-center justify-center">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="h-full flex flex-col lg:flex-row">
                        {/* List Side */}
                        <div className={cn(
                            "w-full h-full overflow-y-auto p-4 md:p-6 custom-scrollbar transition-all bg-muted/10",
                            viewMode === "map" ? "hidden lg:block lg:w-1/3 xl:w-1/4" : "block"
                        )}>
                            <div className="container mx-auto">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-gray-900">
                                        {filteredListings.length} results found
                                    </h2>
                                </div>

                                {filteredListings.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center p-12 text-center opacity-60">
                                        <Search className="h-12 w-12 mb-4" />
                                        <p className="font-bold">No food found matching your criteria.</p>
                                        <p className="text-sm">Try changing your search or filters.</p>
                                    </div>
                                ) : (
                                    <div className={cn(
                                        "grid gap-6",
                                        viewMode === "list" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
                                    )}>
                                        {filteredListings.map((listing) => (
                                            <ListingCard key={listing.id} listing={listing} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Map Side */}
                        <div className={cn(
                            "w-full h-full lg:flex-1",
                            viewMode === "map" ? "block" : "hidden lg:block lg:w-2/3 xl:w-3/4"
                        )}>
                            <MapBox listings={filteredListings} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
