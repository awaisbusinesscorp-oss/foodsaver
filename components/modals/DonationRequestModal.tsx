"use client";

import { useState } from "react";
import { X, Loader2, CheckCircle2 } from "lucide-react";

interface DonationRequestModalProps {
    listingId: string;
    listingTitle: string;
    maxQuantity: number;
    unit: string;
    onClose: () => void;
}

export default function DonationRequestModal({
    listingId,
    listingTitle,
    maxQuantity,
    unit,
    onClose
}: DonationRequestModalProps) {
    const [quantity, setQuantity] = useState(maxQuantity);
    const [notes, setNotes] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await fetch("/api/donations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    listingId,
                    requestedQty: quantity,
                    notes
                }),
            });

            if (res.ok) {
                setIsSuccess(true);
                setTimeout(() => {
                    onClose();
                }, 2000);
            } else {
                const data = await res.json();
                setError(data.message || "Failed to submit request");
            }
        } catch (err) {
            setError("An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900">Request Donation</h3>
                    <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-6">
                    {isSuccess ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center animate-in zoom-in duration-300">
                            <div className="h-16 w-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                                <CheckCircle2 className="h-10 w-10" />
                            </div>
                            <h4 className="text-xl font-bold text-gray-900">Request Submitted!</h4>
                            <p className="text-muted-foreground mt-2">
                                The donor has been notified. You can track the status in your history.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="bg-primary/5 p-4 rounded-2xl">
                                <p className="text-sm font-medium text-primary">Item</p>
                                <p className="text-lg font-bold text-gray-900">{listingTitle}</p>
                            </div>

                            {error && (
                                <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20 text-center">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">How much do you need?</label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="range"
                                        min="1"
                                        max={maxQuantity}
                                        value={quantity}
                                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                                        className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                                    />
                                    <span className="text-lg font-black text-primary min-w-[60px] text-right">
                                        {quantity} <span className="text-xs font-bold uppercase text-muted-foreground">{unit}</span>
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Add a note (Optional)</label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Tell the donor why you're requesting this or coordinate pickup details..."
                                    className="w-full rounded-2xl border border-gray-200 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                                    rows={3}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    "Confirm Request"
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
