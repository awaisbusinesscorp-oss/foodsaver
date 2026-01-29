"use client";

import { useState } from "react";
import { Star, X, Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingModalProps {
    targetId: string;
    targetName: string;
    requestId: string;
    onClose: () => void;
}

export default function RatingModal({ targetId, targetName, requestId, onClose }: RatingModalProps) {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async () => {
        if (rating === 0) return;
        setIsLoading(true);

        try {
            const res = await fetch("/api/ratings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ targetId, rating, comment, requestId }),
            });

            if (res.ok) {
                setIsSuccess(true);
                setTimeout(onClose, 2000);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="p-8 text-center">
                    {isSuccess ? (
                        <div className="py-8">
                            <CheckCircle2 className="h-20 w-20 text-primary mx-auto mb-6 animate-bounce" />
                            <h3 className="text-2xl font-black text-gray-900">Thank You!</h3>
                            <p className="text-muted-foreground mt-2">Your feedback helps keep the community safe.</p>
                        </div>
                    ) : (
                        <>
                            <h3 className="text-2xl font-black text-gray-900">Rate your experience</h3>
                            <p className="text-muted-foreground mt-2 italic">with {targetName}</p>

                            <div className="my-10 flex justify-center gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHover(star)}
                                        onMouseLeave={() => setHover(0)}
                                        className="p-1 transition-transform hover:scale-125 active:scale-95"
                                    >
                                        <Star
                                            className={cn(
                                                "h-10 w-10 transition-colors",
                                                (hover || rating) >= star ? "fill-amber-400 text-amber-400" : "text-gray-200"
                                            )}
                                        />
                                    </button>
                                ))}
                            </div>

                            <textarea
                                placeholder="Share more details about the pickup/delivery (Optional)"
                                className="w-full rounded-2xl border border-gray-100 bg-muted/20 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none h-32"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />

                            <div className="mt-8 flex gap-4">
                                <button
                                    onClick={onClose}
                                    className="flex-1 py-4 font-bold text-muted-foreground hover:text-gray-900 transition-colors"
                                >
                                    Skip
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={rating === 0 || isLoading}
                                    className="flex-[2] py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                                >
                                    {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Submit Feedback"}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
