"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Bell, Check, Loader2, Info, AlertTriangle, CheckCircle, Package } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

export default function NotificationsPage() {
    const { data: session } = useSession();
    const [notifications, setNotifications] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const res = await fetch("/api/notifications");
            const data = await res.json();
            setNotifications(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
            setNotifications([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (session?.user) fetchNotifications();
    }, [session]);

    const markAsRead = async (id: string) => {
        await fetch("/api/notifications", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        });
        fetchNotifications();
    };

    if (isLoading) return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;

    return (
        <div className="container mx-auto px-4 py-12 max-w-3xl">
            <div className="flex items-center justify-between mb-12">
                <h1 className="text-3xl font-extrabold text-gray-900">Notifications</h1>
                <Bell className="h-8 w-8 text-primary/20" />
            </div>

            {notifications.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border">
                    <Info className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="font-bold">You're all caught up!</p>
                    <p className="text-muted-foreground text-sm">No new notifications at this time.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {Array.isArray(notifications) && notifications.map((notif) => (
                        <div
                            key={notif.id}
                            className={cn(
                                "p-6 rounded-3xl flex gap-4 transition-all relative border",
                                notif.read ? "bg-white border-primary/5 opacity-70" : "bg-primary/5 border-primary/20 shadow-sm"
                            )}
                        >
                            <div className={cn(
                                "h-12 w-12 rounded-2xl flex items-center justify-center shrink-0",
                                notif.type === "URGENT" ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
                            )}>
                                {notif.type === "URGENT" ? <AlertTriangle className="h-6 w-6" /> : <Package className="h-6 w-6" />}
                            </div>

                            <div className="flex-1 pr-12">
                                <p className="text-sm font-bold text-gray-900">{notif.title}</p>
                                <p className="text-sm text-muted-foreground mt-1">{notif.message}</p>
                                <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mt-3">
                                    {formatDistanceToNow(new Date(notif.createdAt))} ago
                                </p>
                            </div>

                            {!notif.read && (
                                <button
                                    onClick={() => markAsRead(notif.id)}
                                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-primary/10 text-primary transition-colors"
                                    title="Mark as read"
                                >
                                    <Check className="h-5 w-5" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
