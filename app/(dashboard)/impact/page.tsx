"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Utensils, Heart, Globe, Award, Loader2, Leaf, ThumbsUp, TrendingUp, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function ImpactDashboard() {
    const { data: session } = useSession();
    const [stats, setStats] = useState({ meals: 0, kg: 0, people: 0, carbon: 0, weeklyActivity: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("impact");
    const [history, setHistory] = useState<any[]>([]);

    const userRole = (session?.user as any)?.role;

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Real Stats from DB
                const statsRes = await fetch("/api/user/stats");
                const statsData = await statsRes.json();
                if (statsRes.ok) {
                    setStats(statsData);
                }

                if (userRole === "VOLUNTEER") {
                    const res = await fetch("/api/volunteers?mode=history");
                    const data = await res.json();
                    setHistory(Array.isArray(data) ? data : []);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [userRole]);

    if (isLoading) return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;

    const cards = [
        { title: "Meals Provided", value: stats.meals, icon: Utensils, color: "bg-green-100 text-green-600", unit: "Meals" },
        { title: "Food Saved", value: stats.kg, icon: Leaf, color: "bg-blue-100 text-blue-600", unit: "kg" },
        { title: "People Reached", value: stats.people, icon: Heart, color: "bg-rose-100 text-rose-600", unit: "People" },
        { title: "CO2 Offset", value: stats.carbon, icon: Globe, color: "bg-amber-100 text-amber-600", unit: "kg CO2" },
    ];

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                        {userRole === "VOLUNTEER" ? "Volunteer Profile" : "Your Impact Dashboard"}
                    </h1>
                    <p className="text-muted-foreground mt-2 text-lg">See the real-world difference you're making every day.</p>
                </div>
                <div className="flex gap-4">
                    {userRole === "DONOR" && (
                        <Link
                            href="/listings/my-listings"
                            className="inline-flex items-center gap-2 rounded-2xl bg-white border-2 border-primary/20 px-6 py-4 font-bold text-primary shadow-sm transition-all hover:bg-primary/5 hover:border-primary active:scale-95"
                        >
                            <Utensils className="h-5 w-5" />
                            My Food Donations
                        </Link>
                    )}
                    {userRole === "RECEIVER" && (
                        <Link
                            href="/donations/history"
                            className="inline-flex items-center gap-2 rounded-2xl bg-white border-2 border-primary/20 px-6 py-4 font-bold text-primary shadow-sm transition-all hover:bg-primary/5 hover:border-primary active:scale-95"
                        >
                            <Clock className="h-5 w-5" />
                            My Food Receives
                        </Link>
                    )}
                </div>
            </div>

            {/* Tabs for Volunteer */}
            {userRole === "VOLUNTEER" && (
                <div className="flex gap-4 mb-8">
                    <button
                        onClick={() => setActiveTab("impact")}
                        className={cn(
                            "px-6 py-3 rounded-2xl font-bold transition-all",
                            activeTab === "impact" ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-white text-muted-foreground hover:bg-muted"
                        )}
                    >
                        Impact Stats
                    </button>
                    <button
                        onClick={() => setActiveTab("history")}
                        className={cn(
                            "px-6 py-3 rounded-2xl font-bold transition-all",
                            activeTab === "history" ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-white text-muted-foreground hover:bg-muted"
                        )}
                    >
                        Delivery History
                    </button>
                </div>
            )}

            {activeTab === "impact" ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {cards.map((card) => (
                            <div key={card.title} className="bg-white p-8 rounded-[2rem] shadow-sm border border-primary/5 hover:scale-[1.02] transition-all">
                                <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center mb-6", card.color)}>
                                    <card.icon className="h-8 w-8" />
                                </div>
                                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">{card.title}</h3>
                                <div className="mt-2 flex items-baseline gap-2">
                                    <span className="text-4xl font-black text-gray-900">{card.value}</span>
                                    <span className="text-sm font-bold text-gray-400">{card.unit}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 border border-primary/5 shadow-sm">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-primary" />
                                Impact Over Time
                            </h3>
                            <div className="h-64 flex items-end justify-between gap-2 px-4 border-b border-l">
                                {stats.weeklyActivity && stats.weeklyActivity.length > 0 ? stats.weeklyActivity.map((h: number, i: number) => {
                                    const max = Math.max(...stats.weeklyActivity, 1);
                                    const height = (h / max) * 100;
                                    return (
                                        <div key={i} className="flex-1 bg-primary/20 rounded-t-lg hover:bg-primary transition-colors cursor-help group relative" style={{ height: `${height || 5}%` }}>
                                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                Deliveries: {h}
                                            </div>
                                        </div>
                                    );
                                }) : (
                                    [0, 0, 0, 0, 0, 0, 0].map((_, i) => (
                                        <div key={i} className="flex-1 bg-gray-50 h-[10%] rounded-t-lg" />
                                    ))
                                )}
                            </div>
                            <div className="flex justify-between mt-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4">
                                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                            </div>
                        </div>

                        <div className="bg-primary/5 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center space-y-6">
                            <div className="h-24 w-24 bg-white rounded-full flex items-center justify-center shadow-xl shadow-primary/10">
                                <Award className="h-12 w-12 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black">Food Guardian Silver</h3>
                                <p className="text-sm text-muted-foreground mt-2">You're in the top 5% of local contributors this month!</p>
                            </div>
                            <div className="w-full bg-white/50 h-3 rounded-full overflow-hidden">
                                <div className="bg-primary h-full w-[70%]" />
                            </div>
                            <p className="text-xs font-bold text-primary">700 / 1000 pts to next rank</p>
                        </div>
                    </div>
                </>
            ) : (
                <div className="space-y-6">
                    {history.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed">
                            <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                            <p className="font-bold text-lg">No completed deliveries yet.</p>
                            <p className="text-muted-foreground">Your completed delivery history will appear here.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {history.map((item) => (
                                <div key={item.id} className="bg-white p-6 rounded-3xl shadow-sm border border-primary/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-2xl bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                                            <ThumbsUp className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">{item.request.listing.title}</h4>
                                            <p className="text-sm text-muted-foreground">
                                                Delivered to {item.request.receiver.name} on {format(new Date(item.deliveryTime || item.updatedAt), "PPP")}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-gray-900">{item.request.requestedQty} {item.request.listing.unit}</p>
                                            <p className="text-xs text-muted-foreground">Quantity</p>
                                        </div>
                                        <div className="h-10 w-[1px] bg-gray-100" />
                                        <Link
                                            href={`/donations/track/${item.requestId}`}
                                            className="text-sm font-bold text-primary hover:underline"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
