"use client";

import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";

// Fix for default Leaflet icons in Next.js
const DefaultIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface DynamicMapProps {
    listings: any[];
    center?: [number, number];
}

function ZoomHandler({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, map.getZoom());
    }, [center, map]);
    return null;
}

export default function DynamicMap({ listings, center = [20.5937, 78.9629] }: DynamicMapProps) {
    return (
        <div className="h-full w-full rounded-2xl overflow-hidden border shadow-inner bg-muted/20">
            <MapContainer
                center={center}
                zoom={13}
                scrollWheelZoom={true}
                className="h-full w-full"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <ZoomHandler center={center} />
                {listings.map((listing) => (
                    listing.latitude && listing.longitude && (
                        <Marker
                            key={listing.id}
                            position={[listing.latitude, listing.longitude]}
                        >
                            <Popup className="listing-popup">
                                <div className="p-1 max-w-[200px]">
                                    <h4 className="font-bold text-primary">{listing.title}</h4>
                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{listing.description}</p>
                                    <div className="mt-2 flex items-center justify-between">
                                        <span className="text-[10px] font-bold uppercase">{listing.quantity} {listing.unit}</span>
                                        <button className="text-[10px] bg-primary text-white px-2 py-1 rounded font-bold">Details</button>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    )
                ))}
            </MapContainer>
        </div>
    );
}
