"use client";

import { useEffect, useState } from "react";
import { Plane, Users, Globe, Shield, Star, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

const features = [
  {
    icon: Users,
    title: "Smart Matching",
    description:
      "Our AI-powered algorithm finds compatible travel buddies based on your preferences, interests, and travel style.",
  },
  {
    icon: Shield,
    title: "Verified Profiles",
    description:
      "Travel safely with our comprehensive verification system and user reviews.",
  },
  {
    icon: Zap,
    title: "Real-time Updates",
    description:
      "Get instant notifications when someone matches your travel plans or interests.",
  },
  {
    icon: Globe,
    title: "Global Community",
    description:
      "Connect with travelers from around the world and discover new perspectives.",
  },
];

const testimonials = [
  {
    name: "Sarah M.",
    location: "San Francisco",
    text: "Found an amazing travel buddy for my Japan trip through this platform. Best travel experience ever!",
    rating: 5,
    image:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1",
  },
  {
    name: "Marcus J.",
    location: "New York",
    text: "The matching system is incredible. Connected with like-minded travelers who became lifelong friends.",
    rating: 5,
    image:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1",
  },
  {
    name: "Emma R.",
    location: "Austin",
    text: "Premium features are totally worth it. Priority matching helped me find the perfect beach companion.",
    rating: 5,
    image:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1",
  },
];

function AnimatedText({ text }) {
  const [key, setKey] = useState(0);

  useEffect(() => {
    const totalDuration = text.length * 80 + 2000;
    const interval = setInterval(() => {
      setKey((k) => k + 1);
    }, totalDuration);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <span key={key} style={{ display: "inline-block" }}>
      <style>
        {`
          @keyframes fadeInLetter {
            from { opacity: 0; transform: translateY(10px);}
            to { opacity: 1; transform: translateY(0);}
          }
          .letter {
            display: inline-block;
            opacity: 0;
            animation: fadeInLetter 0.4s forwards;
          }
        `}
      </style>
      {text.split("").map((char, i) => (
        <span
          className="letter bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent"
          key={i}
          style={{ animationDelay: `${i * 0.08}s` }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}

export default function LandingPage() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/register");
  };

  const handleLogin = () => {
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Header */}
      <header className="bg-emerald-600 text-white shadow-md sticky top-0 z-50">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 w-full">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <img
                src="/image/logo.png"
                alt="Logo"
                className="h-8 w-8 rounded-full object-cover"
              />
              <h1 className="text-xl font-bold">Buddy Traveller</h1>
            </div>

            {/* Buttons */}
            <div className="flex items-center space-x-3">
              <button
                onClick={handleLogin}
                className="px-4 py-2 bg-white text-emerald-600 font-semibold rounded-lg shadow hover:bg-gray-100"
              >
                Login
              </button>
              <button
                onClick={handleGetStarted}
                className="px-4 py-2 bg-yellow-400 text-gray-900 font-semibold rounded-lg shadow hover:bg-yellow-500"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Find Your Perfect{" "}
            <span className="ml-2">
              <AnimatedText text="Travel Buddy" />
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Connect with like-minded travelers, create unforgettable memories,
            and explore the world safely with verified companions who share your
            passion for adventure.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleGetStarted}
              className="px-8 py-3 bg-emerald-600 text-white rounded-lg text-lg hover:bg-emerald-700"
            >
              Start Your Journey
            </button>
            <button className="px-8 py-3 border border-emerald-200 rounded-lg text-lg text-gray-700 hover:bg-emerald-50">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Buddy Traveller?
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to find the perfect travel companion
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 border rounded-lg text-center hover:shadow-lg transition"
              >
                <div className="bg-emerald-100 p-3 rounded-full w-fit mx-auto mb-4">
                  <feature.icon className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 mb-16">
            Start your adventure in three simple steps
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {["Create Your Profile", "Find Matches", "Start Exploring"].map(
              (step, i) => (
                <div key={i}>
                  <div
                    className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center text-white font-bold mb-4 ${
                      i === 0
                        ? "bg-emerald-600"
                        : i === 1
                        ? "bg-yellow-500"
                        : "bg-teal-600"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step}</h3>
                  <p className="text-gray-600">
                    {i === 0 &&
                      "Tell us about your travel preferences, interests, and dream destinations."}
                    {i === 1 &&
                      "Our smart algorithm connects you with compatible travel buddies and trips."}
                    {i === 2 &&
                      "Connect, plan, and embark on amazing adventures together!"}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            What Travelers Say
          </h2>
          <p className="text-lg text-gray-600 mb-16">
            Join thousands of happy travelers
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="p-6 border rounded-lg hover:shadow-lg transition"
              >
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="text-left">
                    <h4 className="text-lg font-semibold">{t.name}</h4>
                    <p className="text-sm text-gray-500">{t.location}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-3 justify-center">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star
                      key={j}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-600 italic">"{t.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-teal-600 text-center text-white">
        <h2 className="text-4xl font-bold mb-6">
          Ready for Your Next Adventure?
        </h2>
        <p className="text-xl mb-8">
          Join thousands of travelers who have found their perfect travel
          companions
        </p>
        <button
          onClick={handleGetStarted}
          className="px-8 py-3 bg-yellow-400 text-gray-900 rounded-lg text-lg hover:bg-yellow-500"
        >
          Find Your Travel Buddy Today
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-emerald-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-yellow-400 p-2 rounded-lg">
                <Plane className="h-6 w-6 text-emerald-900" />
              </div>
              <h3 className="text-lg font-bold">Buddy Traveller</h3>
            </div>
            <p className="text-gray-300">
              Connecting travelers worldwide for unforgettable adventures.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Platform</h4>
            <ul className="space-y-2 text-gray-300">
              <li>How it Works</li>
              <li>Safety</li>
              <li>Success Stories</li>
              <li>Community Guidelines</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Support</h4>
            <ul className="space-y-2 text-gray-300">
              <li>Help Center</li>
              <li>Contact Us</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-gray-300">
              <li>About Us</li>
              <li>Careers</li>
              <li>Press</li>
              <li>Blog</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-emerald-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Buddy Traveller. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
