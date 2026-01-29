"use client";

import Link from "next/link";
import { Utensils, Heart, Truck, UtensilsCrossed, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const roles = [
    {
        id: "donor",
        title: "Food Donor",
        description: "I have surplus food from my restaurant, household, or event to share.",
        icon: <UtensilsCrossed className="h-8 w-8" />,
        color: "bg-green-100 text-green-600",
        href: "/register/donor",
    },
    {
        id: "receiver",
        title: "Food Receiver",
        description: "I am an NGO, shelter, or individual looking for food donations.",
        icon: <Heart className="h-8 w-8" />,
        color: "bg-blue-100 text-blue-600",
        href: "/register/receiver",
    },
    {
        id: "volunteer",
        title: "Volunteer",
        description: "I want to help by picking up and delivering food to those in need.",
        icon: <Truck className="h-8 w-8" />,
        color: "bg-amber-100 text-amber-600",
        href: "/register/volunteer",
    },
];

export default function RegisterPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-2xl space-y-8 rounded-2xl bg-white p-8 shadow-xl">
                <div className="text-center">
                    <Link href="/" className="inline-flex items-center space-x-2">
                        <Utensils className="h-10 w-10 text-primary" />
                        <span className="text-2xl font-bold text-primary tracking-tight">FoodSaver</span>
                    </Link>
                    <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
                        Join the movement
                    </h2>
                    <p className="mt-2 text-lg text-muted-foreground">
                        Select your role to get started with FoodSaver
                    </p>
                </div>

                <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
                    {roles.map((role) => (
                        <Link
                            key={role.id}
                            href={role.href}
                            className="group relative flex flex-col items-center justify-between rounded-2xl border-2 border-transparent bg-muted/20 p-6 text-center shadow-sm transition-all hover:border-primary hover:bg-white hover:shadow-md"
                        >
                            <div className={cn("flex h-16 w-16 items-center justify-center rounded-2xl mb-4 group-hover:scale-110 transition-transform", role.color)}>
                                {role.icon}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">{role.title}</h3>
                                <p className="mt-2 text-xs text-muted-foreground">
                                    {role.description}
                                </p>
                            </div>
                            <div className="mt-6 flex items-center text-sm font-semibold text-primary">
                                Choose <ArrowRight className="ml-1 h-4 w-4" />
                            </div>
                        </Link>
                    ))}
                </div>

                <p className="mt-10 text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link href="/login" className="font-medium text-primary hover:underline">
                        Log in here
                    </Link>
                </p>
            </div>
        </div>
    );
}
