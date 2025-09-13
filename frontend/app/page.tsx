import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Star,
  Users,
  Calendar,
  Shield,
  Music,
  Mic,
  Camera,
  Palette,
} from "lucide-react";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { RedirectGuard } from "@/components/redirect-guard";
import Image from "next/image";

export default function LandingPage() {
  return (
    <RedirectGuard redirectAuthenticated={true}>
      <div className="min-h-screen relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[rgba(var(--primary-red),0.05)]" />
          <Image
            src="/image.jpg"
            alt="Background"
            fill
            className="object-cover opacity-10"
            priority
          />
        </div>

        <Navigation />

        {/* Hero Section */}
        <section className="relative pt-28 pb-20 px-6 bg-gradient-to-br from-white via-[#fff5f5] to-[#ffecec] overflow-hidden">
  {/* Decorative background shapes */}
  <div className="absolute top-0 left-0 w-64 h-64 bg-[var(--primary-red-light)] rounded-full blur-3xl opacity-20 -z-10"></div>
  <div className="absolute bottom-0 right-0 w-72 h-72 bg-yellow-200 rounded-full blur-3xl opacity-20 -z-10"></div>

  <div className="max-w-7xl mx-auto">
    <div className="flex flex-col lg:flex-row items-center gap-14">
      
      {/* Left Text */}
      <div className="lg:w-1/2 space-y-8 animate-fadeInUp">
        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight text-gray-900">
          Book Sri Lanka&apos;s
          <br />
          <span className="bg-gradient-to-r from-[var(--primary-red)] to-[#ff6a6a] bg-clip-text text-transparent">
            Premier Artists
          </span>
        </h1>
        <p className="text-lg md:text-xl text-gray-700 max-w-xl">
          Connect with world-class performers. From <strong>musicians</strong> to 
          <strong> dancers</strong>, find the perfect talent to make your event unforgettable.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/browse">
            <Button className="text-lg px-8 py-4 rounded-full bg-[var(--primary-red)] hover:bg-[var(--primary-red-dark)] text-white shadow-xl hover:shadow-[0_8px_25px_rgba(255,0,0,0.35)] transition-all duration-300">
              🎤 Browse Artists
            </Button>
          </Link>
          <Link href="/signup?role=performer">
            <Button
              variant="outline"
              className="text-lg px-8 py-4 rounded-full border-[var(--primary-red)] text-[var(--primary-red)] hover:bg-[rgba(var(--primary-red),0.1)] hover:text-[var(--primary-red-dark)] transition-all duration-300"
            >
              ⭐ Join as Artist
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-8 pt-4">
          {[
            { number: "500+", label: "Artists" },
            { number: "1000+", label: "Events" },
            { number: "50+", label: "Cities" },
          ].map((stat, index) => (
            <div key={index} className="flex flex-col">
              <span className="text-3xl font-extrabold text-[var(--primary-red)]">
                {stat.number}
              </span>
              <span className="text-gray-500 text-sm">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Image */}
      <div className="lg:w-1/2 relative animate-fadeIn">
        <div className="relative aspect-square max-w-lg mx-auto">
          <Image
            src="/image2.png"
            alt="Talented Artist Performing"
            fill
            className=" object-cover rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.15)]"
            priority
          />
          
          {/* Floating gradient shapes */}
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[var(--primary-red-light)] rounded-full blur-lg opacity-70 -z-10"></div>
          <div className="absolute -top-6 -right-6 w-28 h-28 bg-yellow-400 rounded-full blur-lg opacity-80 -z-10"></div>

          {/* Rating badge */}
          <div className="absolute -bottom-5 -right-5 bg-white px-5 py-3 rounded-full shadow-lg flex items-center gap-2">
            <div className="flex text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <span className="font-bold text-gray-900">4.9</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</section>

        {/* Features Section */}
        <section
          id="features"
          className="py-20 px-6 bg-gradient-to-b from-white to-gray-50"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                Why Choose{" "}
                <span className="text-[var(--primary-red)]">ArtistLK</span>
              </h2>
              <p className="text-xl text-gray-700 max-w-2xl mx-auto">
                The most trusted platform for booking artists in Sri Lanka
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Shield,
                  title: "Verified Artists",
                  description:
                    "All performers are verified and background-checked for your peace of mind",
                },
                {
                  icon: Calendar,
                  title: "Easy Booking",
                  description:
                    "Simple booking process with instant confirmations and secure payments",
                },
                {
                  icon: Users,
                  title: "24/7 Support",
                  description:
                    "Round-the-clock customer support to help with your bookings",
                },
              ].map((feature, index) => (
                <Card
                  key={index}
                  className="p-8 text-center group border border-gray-200 bg-white hover:border-[rgba(var(--primary-red),0.3)] transition-all hover:shadow-lg"
                >
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[var(--primary-red)] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section id="categories" className="py-20 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                Artist{" "}
                <span className="text-[var(--primary-red)]">Categories</span>
              </h2>
              <p className="text-xl text-gray-700 max-w-2xl mx-auto">
                Find the perfect performer for any occasion
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: Music, name: "Musicians", count: "150+" },
                { icon: Mic, name: "Singers", count: "120+" },
                { icon: Users, name: "Dancers", count: "80+" },
                { icon: Camera, name: "Entertainers", count: "90+" },
                { icon: Palette, name: "Artists", count: "60+" },
                { icon: Star, name: "Comedians", count: "40+" },
                { icon: Music, name: "DJs", count: "70+" },
                { icon: Users, name: "Bands", count: "50+" },
              ].map((category, index) => (
                <Card
                  key={index}
                  className="p-6 text-center group cursor-pointer border border-gray-200 hover:border-[rgba(var(--primary-red),0.5)] transition-all hover:shadow-md"
                >
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[var(--primary-red)] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <category.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2 text-gray-900">
                    {category.name}
                  </h3>
                  <p className="text-sm text-[var(--primary-red)]">
                    {category.count}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 px-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                What Our{" "}
                <span className="text-[var(--primary-red)]">Clients Say</span>
              </h2>
              <p className="text-xl text-gray-700 max-w-2xl mx-auto">
                Hear from people who&apos;ve booked through ArtistLK
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  quote:
                    "Found the perfect band for our wedding! The process was so easy and the musicians were incredibly talented.",
                  name: "Sarah J.",
                  role: "Bride",
                },
                {
                  quote:
                    "As an event planner, ArtistLK has become my go-to platform for finding reliable performers.",
                  name: "Rajiv P.",
                  role: "Event Planner",
                },
                {
                  quote:
                    "Joining as a performer tripled my bookings in just three months. Highly recommend!",
                  name: "Lakshan M.",
                  role: "Musician",
                },
              ].map((testimonial, index) => (
                <Card
                  key={index}
                  className="p-8 border border-gray-200 bg-white shadow-sm"
                >
                  <div className="mb-4 text-yellow-500 flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 italic mb-6">
                    &#34;{testimonial.quote}&#34;
                  </p>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-[var(--primary-red)]">
                      {testimonial.role}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 bg-[var(--primary-red-dark)]">
          <div className="max-w-4xl mx-auto text-center">
            <div className="p-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                Ready to Get <span className="text-yellow-200">Started?</span>
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Join thousands of satisfied clients and artists on Sri Lanka&apos;s
                premier booking platform
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup?role=client">
                  <Button className="text-lg px-8 py-4 bg-white text-[var(--primary-red)] hover:bg-white/90 shadow-lg">
                    Book an Artist
                  </Button>
                </Link>
                <Link href="/signup?role=performer">
                  <Button
                    variant="outline"
                    className="text-lg px-8 py-4 border-white text-white hover:bg-white/10 hover:text-white"
                  >
                    Become an Artist
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-[var(--primary-red)] flex items-center justify-center">
                    <Music className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xl font-bold text-white">ArtistLK</span>
                </div>
                <p className="text-gray-400">
                  Sri Lanka&apos;s premier platform for booking talented artists and
                  performers.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-4 text-white">For Clients</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <Link
                      href="/browse"
                      className="hover:text-white transition-colors"
                    >
                      Browse Artists
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/how-it-works"
                      className="hover:text-white transition-colors"
                    >
                      How It Works
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/pricing"
                      className="hover:text-white transition-colors"
                    >
                      Pricing
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4 text-white">For Artists</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <Link
                      href="/signup?role=performer"
                      className="hover:text-white transition-colors"
                    >
                      Join Platform
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/artist-resources"
                      className="hover:text-white transition-colors"
                    >
                      Resources
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/success-stories"
                      className="hover:text-white transition-colors"
                    >
                      Success Stories
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4 text-white">Support</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <Link
                      href="/help"
                      className="hover:text-white transition-colors"
                    >
                      Help Center
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      className="hover:text-white transition-colors"
                    >
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/terms"
                      className="hover:text-white transition-colors"
                    >
                      Terms of Service
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
              <p>
                &copy; 2024 ArtistLK. All rights reserved. Made with ❤️ in Sri
                Lanka.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </RedirectGuard>
  );
}
