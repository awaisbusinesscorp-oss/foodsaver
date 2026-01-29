"use client";

import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from "react-leaflet";

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

interface TrackingMapProps {
    volunteerPos: [number, number];
    donorPos: [number, number];
    receiverPos: [number, number];
}

function MapUpdater({ volunteerPos }: { volunteerPos: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        // Only center on volunteer if they move significantly
        // or just keep them in view
        // map.panTo(volunteerPos);
    }, [volunteerPos, map]);
    return null;
}

export default function TrackingMap({ volunteerPos, donorPos, receiverPos }: TrackingMapProps) {
    return (
        <MapContainer
            center={volunteerPos}
            zoom={14}
            scrollWheelZoom={true}
            className="h-full w-full"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapUpdater volunteerPos={volunteerPos} />

            {/* Donor Marker */}
            <Marker position={donorPos} icon={DonorIcon}>
                <Popup><b>Pickup Point</b></Popup>
            </Marker>

            {/* Receiver Marker */}
            <Marker position={receiverPos} icon={ReceiverIcon}>
                <Popup><b>Drop-off Point</b></Popup>
            </Marker>

            {/* Volunteer Marker */}
            <Marker position={volunteerPos} icon={VolunteerIcon}>
                <Popup><b>Volunteer (You)</b></Popup>
            </Marker>

            {/* Route Lines */}
            <Polyline
                positions={[donorPos, volunteerPos]}
                color="green"
                dashArray="5, 10"
                weight={2}
            />
            <Polyline
                positions={[volunteerPos, receiverPos]}
                color="blue"
                dashArray="5, 10"
                weight={2}
            />
        </MapContainer>
    );
}
