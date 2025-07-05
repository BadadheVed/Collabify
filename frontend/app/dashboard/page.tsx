"use client";

import { useState, useEffect } from "react";
import {
  Users,
  FileText,
  FolderOpen,
  TrendingUp,
  Clock,
  Star,
  Plus,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function DashboardPage() {
  const [isVisible, setIsVisible] = useState({
    stats: false,
    projects: false,
    activity: false,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible({
        stats: true,
        projects: true,
        activity: true,
      });
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const stats = [
    {
      title: "Projects",
      value: "12",
      change: "+2 this week",
      icon: FolderOpen,
      color: "from-cyan-500 to-blue-600",
      bgColor: "bg-cyan-500/10",
    },
    {
      title: "Team Members",
      value: "24",
      change: "+3 this month",
      icon: Users,
      color: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Documents",
      value: "156",
      change: "+12 today",
      icon: FileText,
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Teams",
      value: "1",
      change: "+100% this week",
      icon: TrendingUp,
      color: "from-orange-500 to-red-600",
      bgColor: "bg-orange-500/10",
    },
  ];

  const recentProjects = [
    {
      name: "Website Redesign",
      team: "Design Team",
      progress: 75,
      dueDate: "2 days",
      members: 5,
      status: "active",
    },
    {
      name: "Mobile App Development",
      team: "Dev Team",
      progress: 45,
      dueDate: "1 week",
      members: 8,
      status: "active",
    },
    {
      name: "Marketing Campaign",
      team: "Marketing",
      progress: 90,
      dueDate: "Tomorrow",
      members: 3,
      status: "urgent",
    },
  ];

  const recentActivity = [
    {
      user: "Sarah Johnson",
      action: "updated document",
      target: "Project Requirements.docx",
      time: "2 minutes ago",
      avatar: "SJ",
    },
    {
      user: "Mike Chen",
      action: "created new project",
      target: "E-commerce Platform",
      time: "15 minutes ago",
      avatar: "MC",
    },
    {
      user: "Emily Davis",
      action: "joined team",
      target: "Design Team",
      time: "1 hour ago",
      avatar: "ED",
    },
  ];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.transform =
      "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
  };

  return (
    <div className="space-y-8 relative">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-300 text-lg">
            Welcome back, Ved Badadhe! Here's what's happening with your
            projects.
          </p>
        </div>
        <Button className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/40 transition-all duration-200 ease-out backdrop-blur-sm border border-white/10">
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Stats Grid */}
      <div
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-800 ease-out ${
          isVisible.stats
            ? "translate-y-0 opacity-100"
            : "translate-y-10 opacity-0"
        }`}
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="relative group cursor-pointer"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-600/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out"></div>
              <Card className="relative backdrop-blur-xl bg-white/5 border border-white/10 p-6 hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/30 transition-all duration-300 ease-out rounded-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl pointer-events-none" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`p-3 rounded-xl backdrop-blur-sm ${stat.bgColor} border border-white/10 transition-all duration-200 ease-out hover:scale-105`}
                    >
                      <Icon
                        className={`w-6 h-6 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                      />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white transition-all duration-200 ease-out">
                        {stat.value}
                      </div>
                      <div className="text-sm text-green-400 transition-all duration-200 ease-out">
                        {stat.change}
                      </div>
                    </div>
                  </div>
                  <h3 className="text-gray-200 font-medium transition-all duration-200 ease-out">
                    {stat.title}
                  </h3>
                </div>
              </Card>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Projects */}
        <div
          className={`lg:col-span-2 transition-all duration-800 ease-out delay-200 ${
            isVisible.projects
              ? "translate-x-0 opacity-100"
              : "-translate-x-10 opacity-0"
          }`}
        >
          <Card className="backdrop-blur-xl bg-white/5 border border-white/10 p-6 hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/30 transition-all duration-300 ease-out rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">
                  Recent Projects
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-300 hover:text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-200 ease-out hover:scale-105"
                >
                  View All
                </Button>
              </div>
              <div className="space-y-4">
                {recentProjects.map((project, index) => (
                  <div
                    key={project.name}
                    className="flex items-center justify-between p-4 rounded-xl backdrop-blur-sm bg-white/5 hover:bg-white/10 transition-all duration-200 ease-out hover:scale-[1.01] cursor-pointer group border border-white/5 hover:border-white/20"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          project.status === "urgent"
                            ? "bg-red-500"
                            : "bg-green-500"
                        } animate-pulse shadow-lg ${
                          project.status === "urgent"
                            ? "shadow-red-500/50"
                            : "shadow-green-500/50"
                        }`}
                      ></div>
                      <div>
                        <h3 className="font-medium text-white group-hover:text-cyan-400 transition-colors duration-200 ease-out">
                          {project.name}
                        </h3>
                        <p className="text-sm text-gray-300">
                          {project.team} • {project.members} members
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-white font-medium">
                        {project.progress}%
                      </div>
                      <div className="text-xs text-gray-400">
                        Due in {project.dueDate}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <div
          className={`transition-all duration-800 ease-out delay-400 ${
            isVisible.activity
              ? "translate-x-0 opacity-100"
              : "translate-x-10 opacity-0"
          }`}
        >
          <Card className="backdrop-blur-xl bg-white/5 border border-white/10 p-6 hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/30 transition-all duration-300 ease-out rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">
                  Recent Activity
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-300 hover:text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-200 ease-out hover:scale-105"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 hover:bg-white/5 p-2 rounded-xl transition-all duration-200 ease-out border border-transparent hover:border-white/10 hover:scale-[1.01]"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 flex items-center justify-center text-white text-xs font-semibold shadow-lg shadow-purple-500/30">
                      {activity.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white">
                        <span className="font-medium">{activity.user}</span>{" "}
                        <span className="text-gray-300">{activity.action}</span>{" "}
                        <span className="text-cyan-400">{activity.target}</span>
                      </p>
                      <p className="text-xs text-gray-400 flex items-center mt-1">
                        <Clock className="w-3 h-3 mr-1" />
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
