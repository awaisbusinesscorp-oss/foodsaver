import Link from "next/link";
import { Utensils, Users, Truck, Heart, ArrowRight, ShieldCheck, MapPin, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white py-16 sm:py-24 lg:py-32">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-96 w-96 rounded-full bg-primary/10 blur-[120px]" />

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
            <div className="sm:text-center md:mx-auto md:max-w-2xl lg:col-span-6 lg:text-left">
              <div className="inline-flex items-center space-x-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-bold text-primary">
                <span className="flex h-2.5 w-2.5 rounded-full bg-primary animate-pulse" />
                <span>Join 5,000+ hunger heroes</span>
              </div>
              <h1 className="mt-8 text-5xl font-black tracking-tight text-gray-900 sm:text-6xl md:text-7xl leading-[1.1]">
                Feed Souls,<br />
                <span className="text-primary">Not Landfills.</span>
              </h1>
              <p className="mt-8 text-xl text-gray-600 leading-relaxed max-w-xl">
                FoodSaver is the smartest way to manage food waste. We connect restaurants, events, and households with surplus food to NGOs and shelters.
              </p>
              <div className="mt-12 flex flex-col sm:flex-row sm:justify-center lg:justify-start gap-5">
                <Link
                  href="/explore"
                  className="inline-flex items-center justify-center rounded-2xl bg-primary px-10 py-5 text-lg font-bold text-white shadow-2xl shadow-primary/30 transition-all hover:scale-105 active:scale-95"
                >
                  Find Food <ArrowRight className="ml-2 h-6 w-6" />
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center rounded-2xl bg-white px-10 py-5 text-lg font-bold text-gray-900 border-2 border-gray-100 shadow-sm transition-all hover:border-primary hover:text-primary"
                >
                  Become a Partner
                </Link>
              </div>
            </div>

            <div className="relative mt-16 lg:mt-0 lg:col-span-6">
              <div className="relative aspect-square w-full">
                <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-br from-primary/20 to-primary/5 rotate-3" />
                <div className="absolute inset-0 rounded-[3rem] overflow-hidden shadow-2xl transition-transform hover:-rotate-1 duration-500">
                  <img
                    src="/food_donation_hero_1769702822037.png"
                    alt="Community Food Sharing"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-8 left-8 right-8">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl">
                        <p className="text-2xl font-black text-primary">1.2M+</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Meals Saved</p>
                      </div>
                      <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl">
                        <p className="text-2xl font-black text-blue-600">500+</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Active NGOs</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="bg-gray-50 py-32 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-black tracking-tight text-gray-900 sm:text-5xl">How FoodSaver Works</h2>
            <p className="mt-6 text-xl text-gray-600">
              An end-to-end ecosystem built for efficiency, transparency, and impact.
            </p>
          </div>

          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              {
                icon: <Utensils className="h-12 w-12" />,
                title: "Donors Post Surplus",
                description: "Restaurants and households list surplus food with details and photos in seconds.",
                color: "bg-green-100 text-green-600",
              },
              {
                icon: <Users className="h-12 w-12" />,
                title: "Receivers Request",
                description: "NGOs and individuals browse nearby donations and make requests based on need.",
                color: "bg-blue-100 text-blue-600",
              },
              {
                icon: <Truck className="h-12 w-12" />,
                title: "Volunteers Deliver",
                description: "Friendly volunteers pick up the food and ensure safe, timely delivery.",
                color: "bg-amber-100 text-amber-600",
              },
            ].map((step, idx) => (
              <div key={idx} className="group relative flex flex-col items-center text-center">
                <div className={cn("flex h-24 w-24 items-center justify-center rounded-[2rem] mb-8 shadow-xl transition-all group-hover:scale-110", step.color)}>
                  {step.icon}
                </div>
                <h3 className="text-2xl font-black text-gray-900">{step.title}</h3>
                <p className="mt-5 text-gray-600 leading-relaxed text-lg">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="order-2 lg:order-1">
              <div className="relative rounded-[3rem] overflow-hidden shadow-2xl aspect-[4/3] group">
                <img
                  src="/restaurant_surplus_food_1769702843310.png"
                  alt="Restaurant Surplus Food"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-primary/10 mix-blend-multiply" />
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-4xl font-black tracking-tight text-gray-900 sm:text-5xl">Features Designed for Impact</h2>
              <div className="mt-16 space-y-12">
                {[
                  {
                    icon: <ShieldCheck className="h-8 w-8" />,
                    title: "Safety First",
                    description: "Strict food safety guidelines and quality verification for every listing, ensuring health is never compromised.",
                  },
                  {
                    icon: <MapPin className="h-8 w-8" />,
                    title: "Smart Discovery",
                    description: "Find food exactly where it's needed with real-time map discovery and automated proximity alerts.",
                  },
                  {
                    icon: <BarChart3 className="h-8 w-8" />,
                    title: "Impact Dashboards",
                    description: "Detailed visualization of your contributions, CO2 reduction, and lives touched through our platform.",
                  },
                ].map((feature, idx) => (
                  <div key={idx} className="flex space-x-6">
                    <div className="mt-1 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900">{feature.title}</h4>
                      <p className="mt-3 text-gray-600 text-lg leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 py-24 overflow-hidden relative mx-4 sm:mx-8 mb-12 rounded-[3rem] shadow-2xl">
        <div className="absolute top-0 right-0 h-full w-1/3 bg-primary/20 -skew-x-12 transform translate-x-1/2" />
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-black sm:text-6xl text-white tracking-tight">Ready to make a difference?</h2>
          <p className="mt-8 text-xl text-gray-300 max-w-2xl mx-auto font-medium leading-relaxed">
            Choose your role and start your journey with us today. Every plate shared is a life touched, and every donation is a step toward zero waste.
          </p>
          <div className="mt-14 flex flex-wrap justify-center gap-6">
            <Link href="/register/donor" className="rounded-2xl bg-white px-10 py-5 font-black text-gray-900 shadow-2xl transition-all hover:scale-105 active:scale-95">
              I want to Donate
            </Link>
            <Link href="/register/receiver" className="rounded-2xl border-2 border-white px-10 py-5 font-black text-white hover:bg-white/20 transition-all">
              I need Food
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
