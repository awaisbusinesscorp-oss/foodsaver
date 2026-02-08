"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
    Utensils,
    MapPin,
    Clock,
    Plus,
    Loader2,
    Image as ImageIcon,
    Upload,
    X,
    Check
} from "lucide-react";

const FOOD_TYPES = ["COOKED", "RAW", "PACKAGED", "BEVERAGES"];

export default function CreateListingForm() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
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

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Preview the image
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Upload the image
        setIsUploading(true);
        try {
            const uploadFormData = new FormData();
            uploadFormData.append("file", file);

            const res = await fetch("/api/upload", {
                method: "POST",
                body: uploadFormData,
            });

            if (res.ok) {
                const data = await res.json();
                setFormData(prev => ({ ...prev, imageUrl: data.url }));
            } else {
                setError("Failed to upload image. Please try again.");
            }
        } catch (_err) {
            setError("Failed to upload image. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemoveImage = () => {
        setImagePreview(null);
        setFormData(prev => ({ ...prev, imageUrl: "" }));
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
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
                () => {
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
        } catch (_err) {
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
                    Detailed information helps receivers know what they&apos;re getting.
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
                            <MapPin className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Image Upload Section */}
                <div className="col-span-2 space-y-3">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <ImageIcon className="h-4 w-4 text-primary" />
                        Food Photo
                    </label>

                    {/* Hidden file input */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                    />

                    {imagePreview ? (
                        /* Image Preview */
                        <div className="relative w-full h-48 rounded-2xl overflow-hidden border-2 border-primary/20 bg-gray-50">
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-full h-full object-cover"
                            />
                            {isUploading && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <Loader2 className="h-8 w-8 animate-spin text-white" />
                                </div>
                            )}
                            {!isUploading && formData.imageUrl && (
                                <div className="absolute top-2 left-2 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                    <Check className="h-3 w-3" />
                                    Uploaded
                                </div>
                            )}
                            <button
                                type="button"
                                onClick={handleRemoveImage}
                                className="absolute top-2 right-2 p-2 bg-white/90 hover:bg-white text-gray-700 rounded-full shadow-lg transition-all"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    ) : (
                        /* Upload Button */
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full h-48 rounded-2xl border-2 border-dashed border-gray-300 hover:border-primary/50 bg-gray-50 hover:bg-primary/5 flex flex-col items-center justify-center gap-3 transition-all cursor-pointer group"
                        >
                            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Upload className="h-7 w-7 text-primary" />
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-semibold text-gray-700">Click to upload photo</p>
                                <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WEBP up to 5MB</p>
                            </div>
                        </button>
                    )}

                    {/* Optional URL input */}
                    <div className="flex items-center gap-3">
                        <div className="flex-1 h-px bg-gray-200"></div>
                        <span className="text-xs text-muted-foreground font-medium">OR paste URL</span>
                        <div className="flex-1 h-px bg-gray-200"></div>
                    </div>
                    <input
                        name="imageUrl"
                        placeholder="https://example.com/image.jpg"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                        value={formData.imageUrl}
                        onChange={(e) => {
                            handleChange(e);
                            if (e.target.value) setImagePreview(e.target.value);
                        }}
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={isLoading || isUploading}
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
