"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Phone, MapPin, Loader2 } from "lucide-react";
import Link from "next/link";

interface RegisterFormProps {
    role: "DONOR" | "RECEIVER" | "VOLUNTEER";
    roleTitle: string;
}

export default function RegisterForm({ role, roleTitle }: RegisterFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        address: "",
    });
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, role }),
            });

            if (res.ok) {
                router.push("/login?registered=true");
            } else {
                const data = await res.json();
                setError(data.message || "Registration failed");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-lg space-y-8 rounded-2xl bg-white p-8 shadow-xl">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                    Register as {roleTitle}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                    Fill in the details to create your account
                </p>
            </div>

            <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                {error && (
                    <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive text-center">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="relative col-span-2">
                        <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                        <input
                            name="name"
                            type="text"
                            required
                            className="block w-full rounded-lg border border-gray-300 px-10 py-3 text-gray-900 placeholder-gray-500 focus:border-primary focus:ring-primary sm:text-sm"
                            placeholder="Full Name / Organization Name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="relative col-span-2">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                        <input
                            name="email"
                            type="email"
                            required
                            className="block w-full rounded-lg border border-gray-300 px-10 py-3 text-gray-900 placeholder-gray-500 focus:border-primary focus:ring-primary sm:text-sm"
                            placeholder="Email address"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                        <input
                            name="password"
                            type="password"
                            required
                            className="block w-full rounded-lg border border-gray-300 px-10 py-3 text-gray-900 placeholder-gray-500 focus:border-primary focus:ring-primary sm:text-sm"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                        <input
                            name="confirmPassword"
                            type="password"
                            required
                            className="block w-full rounded-lg border border-gray-300 px-10 py-3 text-gray-900 placeholder-gray-500 focus:border-primary focus:ring-primary sm:text-sm"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="relative col-span-2">
                        <Phone className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                        <input
                            name="phone"
                            type="tel"
                            className="block w-full rounded-lg border border-gray-300 px-10 py-3 text-gray-900 placeholder-gray-500 focus:border-primary focus:ring-primary sm:text-sm"
                            placeholder="Phone Number"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="relative col-span-2">
                        <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                        <input
                            name="address"
                            type="text"
                            className="block w-full rounded-lg border border-gray-300 px-10 py-3 text-gray-900 placeholder-gray-500 focus:border-primary focus:ring-primary sm:text-sm"
                            placeholder="Address / Location"
                            value={formData.address}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="mt-6 flex w-full justify-center rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating account...
                        </>
                    ) : (
                        "Create Account"
                    )}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="font-medium text-primary hover:underline">
                    Sign in
                </Link>
            </p>
        </div>
    );
}
