"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "next-auth/react";
import { Utensils, Menu, X, Bell, User, LogOut, LayoutDashboard } from "lucide-react";

export default function Header() {
    const { data: session } = useSession();
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const userRole = (session?.user as any)?.role;

    const navigation = [
        { name: "Explore", href: "/explore", show: true },
        { name: "Donate", href: "/listings/create", show: userRole === "DONOR" || !session },
        { name: "My Donations", href: "/listings/my-listings", show: userRole === "DONOR" },
        { name: "Requests", href: "/donations/requests", show: userRole === "DONOR" },
        { name: "Deliveries", href: "/pickups", show: userRole === "VOLUNTEER" || !session },
        { name: "My Pickups", href: "/pickups/active", show: userRole === "VOLUNTEER" },
        { name: "Impact", href: "/impact", show: true },
        { name: "Admin", href: "/admin/dashboard", show: userRole === "ADMIN" },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center px-4 sm:px-6 lg:px-8">
                <div className="flex flex-1 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <Utensils className="h-8 w-8 text-primary" />
                        <span className="text-xl font-bold tracking-tight text-primary">FoodSaver</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex md:items-center md:space-x-6">
                        {navigation.filter(i => i.show).map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "text-sm font-medium transition-colors hover:text-primary",
                                    pathname === item.href
                                        ? "text-primary"
                                        : "text-muted-foreground"
                                )}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* User Actions */}
                    <div className="flex items-center space-x-4">
                        <Link
                            href="/notifications"
                            className="relative rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        >
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-destructive" />
                        </Link>

                        {session ? (
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/impact"
                                    className="hidden lg:flex items-center space-x-2 rounded-full border p-1 pr-3 hover:bg-accent transition-colors"
                                >
                                    <div className="rounded-full bg-primary p-1 text-primary-foreground">
                                        <User className="h-4 w-4" />
                                    </div>
                                    <span className="text-sm font-medium">{session.user?.name?.split(' ')[0]}</span>
                                </Link>
                                <button
                                    onClick={() => signOut()}
                                    className="p-2 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                    title="Sign Out"
                                >
                                    <LogOut className="h-5 w-5" />
                                </button>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="hidden md:flex items-center space-x-2 rounded-full border p-1 pr-3 hover:bg-accent transition-colors"
                            >
                                <div className="rounded-full bg-primary p-1 text-primary-foreground">
                                    <User className="h-4 w-4" />
                                </div>
                                <span className="text-sm font-medium">Sign In</span>
                            </Link>
                        )}

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="rounded-md p-2 text-muted-foreground hover:bg-accent md:hidden"
                        >
                            {isMobileMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="border-b bg-background md:hidden">
                    <div className="space-y-1 px-4 pb-3 pt-2">
                        {navigation.filter(i => i.show).map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={cn(
                                    "block rounded-md px-3 py-2 text-base font-medium",
                                    pathname === item.href
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                )}
                            >
                                {item.name}
                            </Link>
                        ))}
                        {session ? (
                            <button
                                onClick={() => { signOut(); setIsMobileMenuOpen(false); }}
                                className="w-full text-left block rounded-md px-3 py-2 text-base font-medium text-destructive hover:bg-destructive/10"
                            >
                                Sign Out
                            </button>
                        ) : (
                            <Link
                                href="/login"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block rounded-md px-3 py-2 text-base font-medium text-primary hover:bg-primary/10"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
