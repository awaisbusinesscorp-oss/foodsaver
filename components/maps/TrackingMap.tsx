"use client";

import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from "react-leaflet";

interface TrackingMapProps {
    volunteerPos: [number, number];
    donorPos: [number, number];
    receiverPos: [number, number];
}

// Helper to validate coordinates
const isValidCoord = (coord: any): coord is [number, number] => {
    return Array.isArray(coord) &&
        coord.length === 2 &&
        typeof coord[0] === 'number' && Number.isFinite(coord[0]) &&
        typeof coord[1] === 'number' && Number.isFinite(coord[1]);
};

function MapUpdater({ volunteerPos }: { volunteerPos: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        if (isValidCoord(volunteerPos) && map) {
            map.panTo(volunteerPos);
        }
    }, [volunteerPos, map]);
    return null;
}

export default function TrackingMap({ volunteerPos, donorPos, receiverPos }: TrackingMapProps) {
    if (typeof window === 'undefined') return null;

    const defaultPos: [number, number] = [30.3753, 69.3451]; // Pakistan center
    const safeVolunteer = isValidCoord(volunteerPos) ? volunteerPos : defaultPos;
    const safeDonor = isValidCoord(donorPos) ? donorPos : defaultPos;
    const safeReceiver = isValidCoord(receiverPos) ? receiverPos : defaultPos;

    // Custom icons
    const VolunteerIcon = L.icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/2972/2972185.png", // Delivery bike icon
        iconSize: [40, 40],
        iconAnchor: [20, 40],
    });

    const DonorIcon = L.icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
    });

    const ReceiverIcon = L.icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/25/25694.png", // Home icon
        iconSize: [30, 30],
        iconAnchor: [15, 30],
    });

    return (
        <MapContainer
            center={safeVolunteer}
            zoom={14}
            scrollWheelZoom={true}
            className="h-full w-full"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapUpdater volunteerPos={safeVolunteer} />

            {/* Donor Marker */}
            <Marker position={safeDonor} icon={DonorIcon}>
                <Popup><b>Pickup Point</b></Popup>
            </Marker>

            {/* Receiver Marker */}
            <Marker position={safeReceiver} icon={ReceiverIcon}>
                <Popup><b>Drop-off Point</b></Popup>
            </Marker>

            {/* Volunteer Marker */}
            <Marker position={safeVolunteer} icon={VolunteerIcon}>
                <Popup><b>Volunteer (You)</b></Popup>
            </Marker>

            {/* Route Lines */}
            <Polyline
                positions={[safeDonor, safeVolunteer]}
                color="green"
                dashArray="5, 10"
                weight={2}
            />
            <Polyline
                positions={[safeVolunteer, safeReceiver]}
                color="blue"
                dashArray="5, 10"
                weight={2}
            />
        </MapContainer>
    );
}
