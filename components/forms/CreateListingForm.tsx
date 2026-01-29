"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Utensils,
    MapPin,
    Calendar,
    Clock,
    Plus,
    X,
    Loader2,
    Image as ImageIcon,
    Camera
} from "lucide-react";

const FOOD_TYPES = ["COOKED", "RAW", "PACKAGED", "BEVERAGES"];

export default function CreateListingForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        foodType: "COOKED",
        quantity: "",
        unit: "portions",
        expiryTime: "",
        pickupStart: "",
        pickupEnd: "",
        address: "",
        latitude: 0,
        longitude: 0,
        imageUrl: "",
    });

    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleDetectLocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setFormData(prev => ({
                        ...prev,
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    }));
                    alert("Location detected!");
                },
                (error) => {
                    alert("Could not detect location. Please enter address manually.");
                }
            );
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await fetch("/api/listings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push("/listings/my-listings");
            } else {
                const data = await res.json();
                setError(data.message || "Failed to create listing");
            }
        } catch (err) {
            setError("An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 sm:p-10 rounded-3xl shadow-xl border border-primary/10">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900 leading-tight flex items-center gap-2">
                    <Utensils className="h-6 w-6 text-primary" />
                    Share Surplus Food
                </h2>
                <p className="text-muted-foreground text-sm">
                    Detailed information helps receivers know what they're getting.
                </p>
            </div>

            {error && (
                <div className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive font-medium border border-destructive/20 animate-in fade-in zoom-in duration-200">
                    {error}
                </div>
            )}

            {/* Basic Info */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="col-span-2 space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Listing Title</label>
                    <input
                        name="title"
                        required
                        placeholder="e.g. 10 Trays of Chicken Biryani"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        value={formData.title}
                        onChange={handleChange}
                    />
                </div>

                <div className="col-span-2 space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Description (Optional)</label>
                    <textarea
                        name="description"
                        rows={3}
                        placeholder="Tell us about the food, allergens, or special notes..."
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Food Type</label>
                    <select
                        name="foodType"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all bg-white"
                        value={formData.foodType}
                        onChange={handleChange}
                    >
                        {FOOD_TYPES.map(type => (
                            <option key={type} value={type}>{type.charAt(0) + type.slice(1).toLowerCase()}</option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Quantity</label>
                        <input
                            name="quantity"
                            type="number"
                            required
                            min="1"
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                            value={formData.quantity}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Unit</label>
                        <input
                            name="unit"
                            required
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                            value={formData.unit}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </div>

            {/* Expiry & Location */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        Expiry Time
                    </label>
                    <input
                        name="expiryTime"
                        type="datetime-local"
                        required
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        value={formData.expiryTime}
                        onChange={handleChange}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        Address
                    </label>
                    <div className="relative">
                        <input
                            name="address"
                            required
                            placeholder="Store/Home address"
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                            value={formData.address}
                            onChange={handleChange}
                        />
                        <button
                            type="button"
                            onClick={handleDetectLocation}
                            className="absolute right-2 top-2 p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                            title="Detect Location"
                        >
                            <Camera className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                <div className="col-span-2 space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <ImageIcon className="h-4 w-4 text-primary" />
                        Image URL
                    </label>
                    <input
                        name="imageUrl"
                        placeholder="Paste an image URL (e.g. from Unsplash)"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        value={formData.imageUrl}
                        onChange={handleChange}
                    />
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider pt-1">
                        * Cloudinary integration coming soon for direct uploads
                    </p>
                </div>
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-lg font-bold text-white shadow-xl shadow-primary/20 transition-all hover:bg-primary/90 active:scale-[0.99] disabled:opacity-50"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Creating Listing...
                    </>
                ) : (
                    <>
                        Publish Donation
                        <Plus className="h-5 w-5" />
                    </>
                )}
            </button>
        </form>
    );
}
