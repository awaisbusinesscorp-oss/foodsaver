"use client";

import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";

interface FoodListing {
    id: string;
    title?: string;
    description?: string;
    quantity?: number;
    unit?: string;
    latitude: number;
    longitude: number;
}

interface DynamicMapProps {
    listings: FoodListing[];
    center?: [number, number];
}

// Separate component to handle icon initialization safely on the client
function IconInitializer() {
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const DefaultIcon = L.icon({
                iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
                iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
                shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
                iconSize: [25, 41],
                iconAnchor: [12, 41],
            });
            L.Marker.prototype.options.icon = DefaultIcon;
        }
    }, []);
    return null;
}

// Helper to validate coordinates
const isValidCoord = (coord: [number, number] | undefined | null): coord is [number, number] => {
    return Array.isArray(coord) &&
        coord.length === 2 &&
        typeof coord[0] === 'number' && Number.isFinite(coord[0]) &&
        typeof coord[1] === 'number' && Number.isFinite(coord[1]);
};

function ZoomHandler({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        if (isValidCoord(center) && map) {
            map.setView(center, map.getZoom());
        }
    }, [center, map]);
    return null;
}

export default function DynamicMap({ listings, center }: DynamicMapProps) {
    if (typeof window === 'undefined') return null;

    // Fallback to India center if center is invalid
    const defaultCenter: [number, number] = [30.3753, 69.3451]; // Pakistan center
    const safeCenter = isValidCoord(center) ? center : defaultCenter;

    return (
        <div className="h-full w-full rounded-2xl overflow-hidden border shadow-inner bg-muted/20">
            <IconInitializer />
            <MapContainer
                center={safeCenter}
                zoom={13}
                scrollWheelZoom={true}
                className="h-full w-full"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <ZoomHandler center={safeCenter} />
                {listings && Array.isArray(listings) && listings
                    .filter((listing) =>
                        listing &&
                        typeof listing.latitude === 'number' &&
                        Number.isFinite(listing.latitude) &&
                        typeof listing.longitude === 'number' &&
                        Number.isFinite(listing.longitude)
                    )
                    .map((listing) => (
                        <Marker
                            key={listing.id}
                            position={[listing.latitude, listing.longitude]}
                        >
                            <Popup className="listing-popup">
                                <div className="p-1 max-w-[200px]">
                                    <h4 className="font-bold text-primary">{listing.title || "Food Listing"}</h4>
                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{listing.description || ""}</p>
                                    <div className="mt-2 flex items-center justify-between">
                                        <span className="text-[10px] font-bold uppercase">{listing.quantity} {listing.unit}</span>
                                        <button className="text-[10px] bg-primary text-white px-2 py-1 rounded font-bold">Details</button>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
            </MapContainer>
        </div>
    );
}
