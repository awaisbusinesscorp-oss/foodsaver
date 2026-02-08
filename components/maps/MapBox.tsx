"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const Map = dynamic(() => import("./DynamicMap"), {
    ssr: false,
    loading: () => (
        <div className="flex h-full w-full items-center justify-center bg-muted/20 animate-pulse">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    ),
});

interface FoodListing {
    id: string;
    title?: string;
    description?: string;
    quantity?: number;
    unit?: string;
    latitude: number;
    longitude: number;
}

interface MapBoxProps {
    listings: FoodListing[];
    center?: [number, number] | null;
}

// Helper to validate coordinates
const isValidCoordinate = (coord: [number, number] | null | undefined): coord is [number, number] => {
    return (
        Array.isArray(coord) &&
        coord.length === 2 &&
        typeof coord[0] === 'number' &&
        Number.isFinite(coord[0]) &&
        typeof coord[1] === 'number' &&
        Number.isFinite(coord[1])
    );
};

export default function MapBox({ listings, center }: MapBoxProps) {
    // Default to Pakistan center if coordinates are invalid
    const DEFAULT_CENTER: [number, number] = [30.3753, 69.3451];
    const safeCenter = isValidCoordinate(center) ? center : DEFAULT_CENTER;

    return <Map listings={listings} center={safeCenter} />;
}
