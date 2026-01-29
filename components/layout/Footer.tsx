import Link from "next/link";
import { Utensils, Heart, Mail, Phone, MapPin, Instagram, Twitter, Facebook } from "lucide-react";

export default function Footer() {
    return (
        <footer className="border-t bg-muted/30">
            <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand Info */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <Utensils className="h-6 w-6 text-primary" />
                            <span className="text-lg font-bold text-primary">FoodSaver</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Connecting those with surplus food to those in need. Together, we can reduce waste and end hunger.
                        </p>
                        <div className="flex space-x-4">
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Twitter className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Facebook className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Instagram className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider">Platform</h3>
                        <ul className="mt-4 space-y-2">
                            <li>
                                <Link href="/explore" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    Find Food
                                </Link>
                            </li>
                            <li>
                                <Link href="/listings/create" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    Donate Food
                                </Link>
                            </li>
                            <li>
                                <Link href="/pickups" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    Volunteer
                                </Link>
                            </li>
                            <li>
                                <Link href="/impact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    Our Impact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider">Resources</h3>
                        <ul className="mt-4 space-y-2">
                            <li>
                                <Link href="/safety-guidelines" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    Safety Guidelines
                                </Link>
                            </li>
                            <li>
                                <Link href="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link href="/partner" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    Partner with Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    Contact Support
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider">Contact Us</h3>
                        <ul className="mt-4 space-y-3">
                            <li className="flex items-start space-x-3">
                                <MapPin className="h-5 w-5 text-primary shrink-0" />
                                <span className="text-sm text-muted-foreground">123 Green Way, Eco City, EC 54321</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Phone className="h-5 w-5 text-primary shrink-0" />
                                <span className="text-sm text-muted-foreground">+1 (555) 000-0000</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Mail className="h-5 w-5 text-primary shrink-0" />
                                <span className="text-sm text-muted-foreground">support@foodsaver.org</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 border-t pt-8">
                    <p className="flex items-center justify-center text-sm text-muted-foreground">
                        © {new Date().getFullYear()} FoodSaver. Made with <Heart className="mx-1 h-4 w-4 text-destructive" /> for the planet.
                    </p>
                </div>
            </div>
        </footer>
    );
}
