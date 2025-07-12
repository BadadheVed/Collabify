"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderOpen,
  Users,
  FileText,
  ChevronLeft,
  ChevronRight,
  LogOut,
  DoorOpen,
  CheckSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserInfo } from "@/hooks/userInfo";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    color: "text-purple-400",
  },
  {
    title: "Projects",
    href: "/projects",
    icon: FolderOpen,
    color: "text-cyan-400",
  },
  {
    title: "Teams",
    href: "/teams",
    icon: Users,
    color: "text-cyan-400",
  },
  {
    title: "Tasks",
    href: "/tasks",
    icon: CheckSquare,
    color: "text-cyan-400",
  },
  {
    title: "Documents",
    href: "/documents",
    icon: FileText,
    color: "text-cyan-400",
  },
];

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const data = useUserInfo();
  const [showLogoutDropdown, setShowLogoutDropdown] = useState(false);

  const handleLogout = () => {
    // Add your logout logic here
    console.log("Logging out...");
    // Example: redirect to login page or call logout API
    // window.location.href = '/login';
  };

  return (
    <div
      className={cn(
        "relative h-full backdrop-blur-xl bg-gray-900/80 border-r border-gray-700/50 transition-all duration-300 ease-out shadow-2xl shadow-black/20",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div
          className={cn(
            "text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent transition-all duration-300 ease-out",
            isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
          )}
        >
          Collabify
        </div>
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-200 ease-out hover:scale-105 backdrop-blur-sm"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ease-out group relative backdrop-blur-sm",
                isActive
                  ? "bg-gradient-to-r from-cyan-500/20 to-purple-600/20 border border-cyan-500/30 text-white shadow-lg shadow-cyan-500/20 backdrop-blur-md scale-[1.02]"
                  : "text-gray-400 hover:text-white hover:bg-white/10 hover:scale-[1.02] hover:shadow-lg hover:shadow-white/10",
                isCollapsed ? "justify-center" : ""
              )}
            >
              <Icon
                className={cn(
                  "w-5 h-5 transition-all duration-200 ease-out flex-shrink-0",
                  isActive ? item.color : "group-hover:text-cyan-400"
                )}
              />
              <span
                className={cn(
                  "font-medium transition-all duration-300 ease-out whitespace-nowrap",
                  isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
                )}
              >
                {item.title}
              </span>

              {/* Active indicator */}
              {isActive && (
                <div className="absolute right-2 w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile & Logout Section */}
      <div className="absolute bottom-4 left-4 right-4 space-y-2">
        {/* Logout Button - Always visible */}

        {/* User Profile */}
        {isCollapsed ? (
          <div className="flex justify-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm shadow-lg shadow-purple-500/30 hover:scale-105 transition-all duration-200 ease-out cursor-pointer backdrop-blur-sm">
              {data?.name?.charAt(0) || "X"}
            </div>
          </div>
        ) : (
          <div className="relative">
            {/* Logout Dropdown */}
            {showLogoutDropdown && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-gray-800/95 backdrop-blur-md border border-gray-700/50 rounded-xl shadow-2xl shadow-black/50 overflow-hidden animate-in slide-in-from-bottom-2 duration-200">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-300 hover:text-white hover:bg-red-500/20 transition-all duration-200 ease-out group"
                >
                  <LogOut className="w-4 h-4 text-red-400 group-hover:text-red-300" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            )}

            {/* User Profile Card */}
            <div
              className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-200 ease-out hover:shadow-lg hover:shadow-cyan-500/20 backdrop-blur-md cursor-pointer group hover:scale-[1.02]"
              onClick={() => setShowLogoutDropdown(!showLogoutDropdown)}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm shadow-lg shadow-purple-500/30">
                {data?.name?.charAt(0) || "X"}
              </div>
              <div className="transition-all duration-200 ease-out">
                <div className="text-white text-sm font-medium group-hover:text-cyan-400 transition-colors duration-200 ease-out">
                  {data?.name || "XXXX"}
                </div>
                <div className="text-gray-400 text-xs">
                  {data?.email || "XXXX@XXXX.com"}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close dropdown */}
      {showLogoutDropdown && (
        <div
          className="fixed inset-0 z-[-1]"
          onClick={() => setShowLogoutDropdown(false)}
        />
      )}
    </div>
  );
}
