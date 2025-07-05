"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  Users,
  Bot,
  FolderOpen,
  UserPlus,
  ChevronRight,
  Star,
  Zap,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [isVisible, setIsVisible] = useState({
    feature1: false,
    feature2: false,
    feature3: false,
    feature4: false,
    feature5: false,
  });
  const [showNavbar, setShowNavbar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      // Show navbar when scrolled down more than 50px, hide when at top
      setShowNavbar(scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const featureId = entry.target.getAttribute("data-feature");
            if (featureId) {
              setIsVisible((prev) => ({ ...prev, [featureId]: true }));
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    const featureElements = document.querySelectorAll("[data-feature]");
    featureElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    // Reduced tilt intensity from /10 to /25 for subtle effect
    const rotateX = (y - centerY) / 25;
    const rotateY = (centerX - x) / 25;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.transform =
      "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
  };

  const features = [
    {
      id: "feature1",
      icon: <FileText className="w-12 h-12" />,
      title: "Collaborate & Edit in Real-Time",
      description:
        "Work together seamlessly with your team in real-time. See changes as they happen and never lose track of contributions.",
      direction: "left",
    },
    {
      id: "feature2",
      icon: <Bot className="w-12 h-12" />,
      title: "Get AI Assistance While Writing",
      description:
        "Enhance your writing with intelligent AI suggestions, grammar corrections, and content improvements.",
      direction: "right",
    },
    {
      id: "feature3",
      icon: <FileText className="w-12 h-12" />,
      title: "Work on Shared Documents",
      description:
        "Create, edit, and manage documents together. Keep everything organized and accessible to your entire team.",
      direction: "left",
    },
    {
      id: "feature4",
      icon: <FolderOpen className="w-12 h-12" />,
      title: "Organize Projects by Team",
      description:
        "Structure your work efficiently with team-based project organization. Keep related documents and tasks together.",
      direction: "right",
    },
    {
      id: "feature5",
      icon: <UserPlus className="w-12 h-12" />,
      title: "Join or Create Teams to Get Started",
      description:
        "Build your collaborative workspace by creating teams or joining existing ones. Start collaborating in minutes.",
      direction: "left",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden">
      {/* Fixed Header - Always visible at top */}
      <header className="fixed top-0 w-full z-50 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Collabify
          </div>
          <div className="flex space-x-4">
            <Link href="/login">
              <Button className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto text-center">
          <h1 className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent hover:scale-105 transition-transform duration-500">
            Collabify
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            The ultimate collaboration platform that brings teams together with
            real-time editing, AI assistance, and seamless project management.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-lg px-8 py-4 rounded-full hover:scale-110 hover:shadow-2xl hover:shadow-purple-500/40 transition-all duration-300 transform"
              >
                Get Started
                <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Floating Elements with Hover Effects */}
        <div className="absolute top-40 left-10 animate-pulse hover:scale-125 hover:rotate-12 transition-all duration-2000 cursor-pointer">
          <Star className="w-8 h-8 text-cyan-400" />
        </div>
        <div className="absolute top-60 right-20 animate-bounce hover:scale-125 hover:-rotate-12 transition-all duration-2000 cursor-pointer">
          <Zap className="w-6 h-6 text-purple-500" />
        </div>
        <div className="absolute bottom-40 left-1/4 animate-pulse hover:scale-125 hover:rotate-45 transition-all duration-2000 cursor-pointer">
          <Shield className="w-10 h-10 text-pink-400" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Discover the tools that make collaboration effortless and
              productive
            </p>
          </div>

          <div className="space-y-32">
            {features.map((feature, index) => (
              <div
                key={feature.id}
                data-feature={feature.id}
                className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-20 ${
                  feature.direction === "right" ? "lg:flex-row-reverse" : ""
                } transition-all duration-1000 transform ${
                  isVisible[feature.id as keyof typeof isVisible]
                    ? "translate-x-0 opacity-100"
                    : feature.direction === "left"
                    ? "-translate-x-20 opacity-0"
                    : "translate-x-20 opacity-0"
                }`}
              >
                <div className="flex-1 text-center lg:text-left">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600 mb-8 text-white hover:scale-110 hover:rotate-6 hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 cursor-pointer">
                    {feature.icon}
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold mb-6 text-white hover:text-transparent hover:bg-gradient-to-r hover:from-cyan-400 hover:to-purple-500 hover:bg-clip-text transition-all duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-lg text-gray-300 leading-relaxed max-w-lg hover:text-gray-200 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>
                <div className="flex-1 max-w-lg">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-3xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                    <div
                      className="relative bg-gray-800 rounded-3xl p-8 border border-gray-700 transition-all duration-300 cursor-pointer hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/20"
                      onMouseMove={handleMouseMove}
                      onMouseLeave={handleMouseLeave}
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      <img
                        src={`https://images.pexels.com/photos/${
                          index % 2 === 0 ? "3184465" : "3184292"
                        }/pexels-photo-${
                          index % 2 === 0 ? "3184465" : "3184292"
                        }.jpeg?auto=compress&cs=tinysrgb&w=600`}
                        alt={feature.title}
                        className="w-full h-64 object-cover rounded-2xl transition-transform duration-300"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center">
          <div className="relative max-w-4xl mx-auto group">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
            <div
              className="relative bg-gray-800 rounded-3xl p-12 border border-gray-700 transition-all duration-300 cursor-pointer hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/30"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{ transformStyle: "preserve-3d" }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Ready to Collaborate?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of teams already using Collabify to streamline
                their workflow and boost productivity.
              </p>
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-lg px-12 py-4 rounded-full hover:scale-110 hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300"
                >
                  Get Started Now
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-800">
        <div className="container mx-auto text-center">
          <div className="text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300 cursor-pointer">
            Collabify
          </div>
          <p className="text-gray-400 hover:text-gray-300 transition-colors duration-300">
            © 2025 Collabify. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
