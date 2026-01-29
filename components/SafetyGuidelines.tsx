"use client";

import { ShieldCheck, Thermometer, Clock, AlertTriangle } from "lucide-react";

const guidelines = [
    {
        title: "Temperature Control",
        desc: "Ensure cooked food is kept above 60°C or cooled rapidly and kept below 5°C.",
        icon: Thermometer,
        color: "text-rose-500 bg-rose-50"
    },
    {
        title: "Packaging",
        desc: "Use clean, food-grade containers. Label with date, time, and potential allergens.",
        icon: ShieldCheck,
        color: "text-green-500 bg-green-50"
    },
    {
        title: "Quick Transport",
        desc: "Deliver within 90 minutes of pickup to prevent bacterial growth.",
        icon: Clock,
        color: "text-blue-500 bg-blue-50"
    },
    {
        title: "Allergen Alert",
        desc: "Always specify if food contains nuts, dairy, gluten, or other common allergens.",
        icon: AlertTriangle,
        color: "text-amber-500 bg-amber-50"
    }
];

export default function SafetyGuidelines() {
    return (
        <div className="bg-white rounded-[2.5rem] p-8 lg:p-12 border border-primary/5 shadow-sm">
            <div className="max-w-3xl">
                <h2 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                    <ShieldCheck className="h-8 w-8 text-primary" />
                    Safety & Quality Standards
                </h2>
                <p className="mt-4 text-muted-foreground text-lg">
                    At FoodSaver, safety is our #1 priority. We follow strict guidelines to ensure every meal shared is healthy and safe.
                </p>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                {guidelines.map((g) => (
                    <div key={g.title} className="flex gap-6 p-6 rounded-3xl hover:bg-muted/30 transition-colors">
                        <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 ${g.color}`}>
                            <g.icon className="h-7 w-7" />
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-gray-900">{g.title}</h4>
                            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{g.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
