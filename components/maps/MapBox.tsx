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

interface MapBoxProps {
    listings: any[];
    center?: [number, number];
}

export default function MapBox({ listings, center }: MapBoxProps) {
    return <Map listings={listings} center={center} />;
}
