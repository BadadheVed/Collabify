"use client";

import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="h-16 backdrop-blur-xl bg-gray-900/80 border-b border-gray-700/50 flex items-center justify-end px-6 shadow-lg shadow-black/10 transition-all duration-200 ease-out">
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent pointer-events-none" />

      <div className="flex items-center gap-4 relative z-10">
        {/* Notifications */}
        <Button
          variant="ghost"
          size="sm"
          className="relative p-2 text-gray-400 hover:text-white hover:bg-white/10 hover:scale-105 transition-all duration-200 ease-out backdrop-blur-sm rounded-xl"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse shadow-lg shadow-red-500/50"></span>
        </Button>

        {/* User Menu */}
      </div>
    </header>
  );
}
