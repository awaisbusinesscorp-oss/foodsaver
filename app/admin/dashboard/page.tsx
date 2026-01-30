"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
    Users,
    AlertCircle,
    BarChart3,
    Package,
    Search,
    Loader2,
    MoreVertical,
    Utensils,
    UserCheck,
    Settings as SettingsIcon,
    FileText
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function AdminDashboard() {
    const { data: session } = useSession();
    const [activeTab, setActiveTab] = useState("overview");
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalListings: 0,
        totalDonations: 0,
        totalVolunteers: 0
    });
    const [users, setUsers] = useState<any[]>([]);
    const [listings, setListings] = useState<any[]>([]);
    const [reports, setReports] = useState<any[]>([]);

    useEffect(() => {
        fetchAdminData();
    }, []);

    const fetchAdminData = async () => {
        setIsLoading(true);
        try {
            // Fetch stats
            const statsRes = await fetch("/api/admin/stats");
            if (statsRes.ok) {
                const data = await statsRes.json();
                setStats(data);
            }

            // Fetch users
            const usersRes = await fetch("/api/admin/users");
            if (usersRes.ok) {
                const data = await usersRes.json();
                setUsers(Array.isArray(data) ? data : []);
            }

            // Fetch listings
            const listingsRes = await fetch("/api/admin/listings");
            if (listingsRes.ok) {
                const data = await listingsRes.json();
                setListings(Array.isArray(data) ? data : []);
            }

            // Fetch reports
            const reportsRes = await fetch("/api/admin/reports");
            if (reportsRes.ok) {
                const data = await reportsRes.json();
                setReports(Array.isArray(data) ? data : []);
            }
        } catch (error) {
            console.error("Failed to fetch admin data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if ((session?.user as any)?.role !== "ADMIN") {
        return <div className="p-20 text-center">Unauthorized. Admins only.</div>;
    }

    if (isLoading) return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;

    const statCards = [
        { label: "Total Users", value: stats.totalUsers, icon: Users, color: "text-blue-600" },
        { label: "Total Listings", value: stats.totalListings, icon: Utensils, color: "text-green-600" },
        { label: "Donations Made", value: stats.totalDonations, icon: Package, color: "text-purple-600" },
        { label: "Active Volunteers", value: stats.totalVolunteers, icon: UserCheck, color: "text-amber-600" },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case "overview":
                return (
                    <div className="p-8">
                        <h3 className="text-2xl font-black mb-6">Platform Overview</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-muted/20 rounded-2xl p-6">
                                <h4 className="text-lg font-bold mb-4">Recent Activity</h4>
                                <p className="text-muted-foreground text-sm">
                                    {users.length === 0 && listings.length === 0
                                        ? "No activity yet. The platform is ready for users!"
                                        : `${users.length} users registered, ${listings.length} food listings created`}
                                </p>
                            </div>
                            <div className="bg-muted/20 rounded-2xl p-6">
                                <h4 className="text-lg font-bold mb-4">System Status</h4>
                                <div className="flex items-center gap-2 text-green-600">
                                    <div className="h-2 w-2 rounded-full bg-green-600 animate-pulse" />
                                    <span className="text-sm font-semibold">All Systems Operational</span>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case "users":
                return (
                    <div className="overflow-x-auto">
                        {users.length === 0 ? (
                            <div className="p-20 text-center">
                                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <p className="font-bold text-lg">No users registered yet</p>
                                <p className="text-muted-foreground text-sm">Users will appear here as they sign up</p>
                            </div>
                        ) : (
                            <table className="w-full text-left">
                                <thead className="bg-muted/30 text-[10px] uppercase font-black tracking-[0.2em] text-gray-500">
                                    <tr>
                                        <th className="px-8 py-4">User</th>
                                        <th className="px-8 py-4">Role</th>
                                        <th className="px-8 py-4">Rating</th>
                                        <th className="px-8 py-4">Joined</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {users.map((user) => (
                                        <tr key={user.id} className="hover:bg-muted/10 transition-colors">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                        {user.name?.charAt(0).toUpperCase() || 'U'}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-900">{user.name}</p>
                                                        <p className="text-xs text-muted-foreground">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={cn(
                                                    "px-3 py-1 rounded-full text-[10px] font-black uppercase",
                                                    user.role === "ADMIN" ? "bg-purple-100 text-purple-700" :
                                                        user.role === "DONOR" ? "bg-blue-100 text-blue-700" :
                                                            user.role === "VOLUNTEER" ? "bg-green-100 text-green-700" :
                                                                "bg-amber-100 text-amber-700"
                                                )}>{user.role}</span>
                                            </td>
                                            <td className="px-8 py-6 text-sm font-bold">{user.rating?.toFixed(1) || 'N/A'}</td>
                                            <td className="px-8 py-6 text-sm text-muted-foreground font-medium">
                                                {format(new Date(user.createdAt), "MMM d, yyyy")}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                );

            case "listings":
                return (
                    <div className="overflow-x-auto">
                        {listings.length === 0 ? (
                            <div className="p-20 text-center">
                                <Utensils className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <p className="font-bold text-lg">No food listings yet</p>
                                <p className="text-muted-foreground text-sm">Listings will appear here as donors create them</p>
                            </div>
                        ) : (
                            <table className="w-full text-left">
                                <thead className="bg-muted/30 text-[10px] uppercase font-black tracking-[0.2em] text-gray-500">
                                    <tr>
                                        <th className="px-8 py-4">Food Item</th>
                                        <th className="px-8 py-4">Donor</th>
                                        <th className="px-8 py-4">Status</th>
                                        <th className="px-8 py-4">Created</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {listings.map((listing) => (
                                        <tr key={listing.id} className="hover:bg-muted/10 transition-colors">
                                            <td className="px-8 py-6">
                                                <p className="text-sm font-bold text-gray-900">{listing.title}</p>
                                                <p className="text-xs text-muted-foreground">{listing.quantity} {listing.unit}</p>
                                            </td>
                                            <td className="px-8 py-6 text-sm">{listing.donor?.name || 'Unknown'}</td>
                                            <td className="px-8 py-6">
                                                <span className={cn(
                                                    "px-3 py-1 rounded-full text-[10px] font-black uppercase",
                                                    listing.status === "AVAILABLE" ? "bg-green-100 text-green-700" :
                                                        listing.status === "RESERVED" ? "bg-amber-100 text-amber-700" :
                                                            "bg-gray-100 text-gray-700"
                                                )}>{listing.status}</span>
                                            </td>
                                            <td className="px-8 py-6 text-sm text-muted-foreground font-medium">
                                                {format(new Date(listing.createdAt), "MMM d, yyyy")}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                );

            case "reports":
                return (
                    <div className="overflow-x-auto">
                        {reports.length === 0 ? (
                            <div className="p-20 text-center">
                                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <p className="font-bold text-lg">No reports submitted</p>
                                <p className="text-muted-foreground text-sm">User reports will appear here</p>
                            </div>
                        ) : (
                            <table className="w-full text-left">
                                <thead className="bg-muted/30 text-[10px] uppercase font-black tracking-[0.2em] text-gray-500">
                                    <tr>
                                        <th className="px-8 py-4">Report</th>
                                        <th className="px-8 py-4">Reported By</th>
                                        <th className="px-8 py-4">Status</th>
                                        <th className="px-8 py-4">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {reports.map((report) => (
                                        <tr key={report.id} className="hover:bg-muted/10 transition-colors">
                                            <td className="px-8 py-6">
                                                <p className="text-sm font-bold">{report.reason}</p>
                                                <p className="text-xs text-muted-foreground">{report.description}</p>
                                            </td>
                                            <td className="px-8 py-6 text-sm">{report.reporter?.name || 'Anonymous'}</td>
                                            <td className="px-8 py-6">
                                                <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-[10px] font-black uppercase">
                                                    {report.status || 'PENDING'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-sm text-muted-foreground">
                                                {format(new Date(report.createdAt), "MMM d, yyyy")}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                );

            case "settings":
                return (
                    <div className="p-8">
                        <h3 className="text-2xl font-black mb-6">Settings</h3>
                        <div className="space-y-6">
                            <div className="bg-muted/20 rounded-2xl p-6">
                                <h4 className="text-lg font-bold mb-2">Platform Configuration</h4>
                                <p className="text-muted-foreground text-sm mb-4">Manage system-wide settings and configurations</p>
                                <button className="px-4 py-2 bg-primary text-white rounded-xl font-bold hover:bg-primary/90">
                                    Configure Settings
                                </button>
                            </div>
                            <div className="bg-muted/20 rounded-2xl p-6">
                                <h4 className="text-lg font-bold mb-2">Database Management</h4>
                                <p className="text-muted-foreground text-sm mb-4">View and manage database status</p>
                                <button className="px-4 py-2 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700">
                                    View Database Status
                                </button>
                            </div>
                        </div>
                    </div>
                );

            default:
                return <div className="p-8">Select a tab to view details</div>;
        }
    };

    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden">
            {/* Admin Sidebar */}
            <aside className="w-64 bg-white border-r flex flex-col p-6 hidden lg:flex">
                <div className="space-y-2 flex-1">
                    {[
                        { id: "overview", label: "Overview", icon: BarChart3 },
                        { id: "users", label: "Users", icon: Users },
                        { id: "listings", label: "Listings", icon: Utensils },
                        { id: "reports", label: "Reports", icon: FileText },
                        { id: "settings", label: "Settings", icon: SettingsIcon }
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={cn(
                                "w-full text-left px-4 py-3 rounded-xl font-bold transition-all text-sm flex items-center gap-3",
                                activeTab === item.id ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-muted-foreground hover:bg-muted"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                        </button>
                    ))}
                </div>
                <div className="p-4 bg-muted/30 rounded-2xl">
                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Admin Session</p>
                    <p className="text-sm font-bold truncate">{session?.user?.name}</p>
                </div>
            </aside>

            {/* Main Admin Content */}
            <main className="flex-1 overflow-y-auto bg-muted/10 custom-scrollbar">
                <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {statCards.map((stat) => (
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
                            {activeTab !== "overview" && activeTab !== "settings" && (
                                <div className="relative w-full sm:w-64">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <input placeholder={`Search ${activeTab}...`} className="w-full pl-10 pr-4 py-2 bg-muted/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all" />
                                </div>
                            )}
                        </div>

                        {renderTabContent()}
                    </div>
                </div>
            </main>
        </div>
    );
}
