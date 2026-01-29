"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
    Users,
    AlertCircle,
    BarChart3,
    ShieldCheck,
    Search,
    Filter,
    CheckCircle2,
    XCircle,
    MoreVertical,
    Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminDashboard() {
    const { data: session } = useSession();
    const [activeTab, setActiveTab] = useState("users");
    const [isLoading, setIsLoading] = useState(true);

    // Simulation
    useEffect(() => {
        setTimeout(() => setIsLoading(false), 800);
    }, []);

    if ((session?.user as any)?.role !== "ADMIN") {
        return <div className="p-20 text-center">Unauthorized. Admins only.</div>;
    }

    if (isLoading) return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;

    const stats = [
        { label: "Total Users", value: "1,284", icon: Users, color: "text-blue-600" },
        { label: "Pending Verifications", value: "12", icon: ShieldCheck, color: "text-amber-600" },
        { label: "Active Reports", value: "3", icon: AlertCircle, color: "text-rose-600" },
        { label: "Monthly Growth", value: "+14%", icon: BarChart3, color: "text-green-600" },
    ];

    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden">
            {/* Admin Sidebar */}
            <aside className="w-64 bg-white border-r flex flex-col p-6 hidden lg:flex">
                <div className="space-y-2 flex-1">
                    {["Overview", "Users", "Listings", "Reports", "Settings"].map((item) => (
                        <button
                            key={item}
                            onClick={() => setActiveTab(item.toLowerCase())}
                            className={cn(
                                "w-full text-left px-4 py-3 rounded-xl font-bold transition-all text-sm",
                                activeTab === item.toLowerCase() ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-muted-foreground hover:bg-muted"
                            )}
                        >
                            {item}
                        </button>
                    ))}
                </div>
                <div className="p-4 bg-muted/30 rounded-2xl">
                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Admin Session</p>
                    <p className="text-sm font-bold truncate">{session?.user?.name}</p>
                </div>
            </aside>

            {/* Main Admin Content */}
            <main className="flex-1 overflow-y-auto bg-muted/10 p-8 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {stats.map((stat) => (
                        <div key={stat.label} className="bg-white p-6 rounded-3xl shadow-sm border border-primary/5">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
                                <stat.icon className={cn("h-5 w-5", stat.color)} />
                            </div>
                            <p className="text-3xl font-black text-gray-900">{stat.value}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-sm border border-primary/5 overflow-hidden">
                    <div className="p-8 border-b flex flex-col sm:flex-row justify-between items-center gap-4">
                        <h2 className="text-xl font-black text-gray-900 capitalize">{activeTab} Management</h2>
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input placeholder={`Search ${activeTab}...`} className="w-full pl-10 pr-4 py-2 bg-muted/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all" />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-muted/30 text-[10px] uppercase font-black tracking-[0.2em] text-gray-500">
                                <tr>
                                    <th className="px-8 py-4">Name</th>
                                    <th className="px-8 py-4">Status</th>
                                    <th className="px-8 py-4">Created Date</th>
                                    <th className="px-8 py-4">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <tr key={i} className="hover:bg-muted/10 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">U</div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900">Sample User {i}</p>
                                                    <p className="text-xs text-muted-foreground">user{i}@example.com</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-black uppercase">Active</span>
                                        </td>
                                        <td className="px-8 py-6 text-sm text-muted-foreground font-medium">May 1{i}, 2024</td>
                                        <td className="px-8 py-6">
                                            <button className="p-2 hover:bg-muted rounded-lg"><MoreVertical className="h-4 w-4" /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
