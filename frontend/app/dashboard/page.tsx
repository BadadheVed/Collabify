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
  AlertCircle,
  Calendar,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { axiosInstance } from "@/axiosSetup/axios";
import { useDashboardTileData } from "@/hooks/userTileData";
interface Task {
  id: number;
  title: string;
  status: string;
  dueDate: string;
  description: string;
  projectName: string;
  teamName: string;
}

export default function DashboardPage() {
  const [isVisible, setIsVisible] = useState({
    stats: false,
    projects: false,
    activity: false,
  });
  const data = useDashboardTileData();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [tasksError, setTasksError] = useState<string | null>(null);
  const name = data?.name || "USER";
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

  useEffect(() => {
    getRecentTasks();
  }, []);

  const stats = [
    {
      title: "Projects",
      value: data?.projects.toString() || "0",
      icon: FolderOpen,
      color: "from-cyan-500 to-blue-600",
      bgColor: "bg-cyan-500/10",
    },
    {
      title: "Team Members",
      value: data?.teamMembers.toString() || "0",
      icon: Users,
      color: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Documents",
      value: data?.documents.toString() || "0",
      icon: FileText,
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Teams",
      value: data?.teams.toString() || "0",
      icon: TrendingUp,
      color: "from-orange-500 to-red-600",
      bgColor: "bg-orange-500/10",
    },
  ];

  const getRecentTasks = async () => {
    try {
      setTasksLoading(true);
      setTasksError(null);
      console.log("Fetching the user tasks");
      const response = await axiosInstance.get("/tasks/user/MyTasks");
      console.log("User tasks fetching done successfully");
      const fetchedTasks: Task[] = response.data.tasks;
      // setTasks(mockTasks);
      setTasks(fetchedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setTasksError("Error fetching tasks");
    } finally {
      setTasksLoading(false);
    }
  };

  const formatDueDate = (dateString: string) => {
    const dueDate = new Date(dateString);
    const now = new Date();
    const diffTime = dueDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return "Overdue";
    } else if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Tomorrow";
    } else if (diffDays <= 7) {
      return `${diffDays} days`;
    } else {
      return dueDate.toLocaleDateString();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-500";
      case "in_progress":
      case "in-progress":
        return "bg-blue-500";
      case "pending":
        return "bg-yellow-500";
      case "overdue":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getTaskUrgency = (dateString: string) => {
    const dueDate = new Date(dateString);
    const now = new Date();
    const diffTime = dueDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "overdue";
    if (diffDays <= 1) return "urgent";
    if (diffDays <= 3) return "medium";
    return "normal";
  };

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

  // Tasks Loading Component
  const TasksLoading = () => (
    <div className="space-y-4">
      {/* Loading Progress Bar */}
      <div className="w-full bg-gray-700 rounded-full h-1 mb-4 overflow-hidden">
        <div className="bg-gradient-to-r from-cyan-500 to-purple-600 h-1 rounded-full animate-pulse"></div>
      </div>

      {/* Skeleton Cards */}
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="animate-pulse p-4 rounded-xl border border-gray-700 bg-gray-800/30"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gray-700 rounded-full"></div>
              <div className="h-3 bg-gray-700 rounded w-16"></div>
            </div>
          </div>
          <div className="h-3 bg-gray-700 rounded w-full mb-2"></div>
          <div className="h-3 bg-gray-700 rounded w-2/3 mb-3"></div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-3 bg-gray-700 rounded w-20"></div>
              <div className="h-3 bg-gray-700 rounded w-16"></div>
            </div>
            <div className="h-3 bg-gray-700 rounded w-24"></div>
          </div>
        </div>
      ))}
    </div>
  );

  // Tasks Content Component
  const TasksContent = () => {
    if (tasksLoading) {
      return <TasksLoading />;
    }

    if (tasksError) {
      return (
        <div className="flex items-center justify-center p-8 text-red-400">
          <AlertCircle className="w-5 h-5 mr-2" />
          {tasksError}
        </div>
      );
    }

    if (tasks.length === 0) {
      return (
        <div className="flex items-center justify-center p-8 text-gray-400">
          <Calendar className="w-5 h-5 mr-2" />
          No tasks found
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {tasks.slice(0, 5).map((task) => {
          const urgency = getTaskUrgency(task.dueDate);
          const urgencyColors = {
            overdue: "border-red-500/50 bg-red-500/10",
            urgent: "border-orange-500/50 bg-orange-500/10",
            medium: "border-yellow-500/50 bg-yellow-500/10",
            normal: "border-gray-500/50 bg-gray-500/10",
          };

          return (
            <div
              key={task.id}
              className={`p-4 rounded-xl border transition-all duration-200 ease-out hover:scale-[1.01] hover:shadow-lg ${urgencyColors[urgency]}`}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-white truncate flex-1 mr-2">
                  {task.title}
                </h3>
                <div className="flex items-center space-x-2">
                  <span
                    className={`w-2 h-2 rounded-full ${getStatusColor(
                      task.status
                    )}`}
                  ></span>
                  <span className="text-xs text-gray-400 capitalize">
                    {task.status.replace("_", " ")}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                {task.description}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center">
                    <FolderOpen className="w-3 h-3 mr-1" />
                    {task.projectName}
                  </span>
                  <span className="flex items-center">
                    <Users className="w-3 h-3 mr-1" />
                    {task.teamName}
                  </span>
                </div>
                <span className="flex items-center text-cyan-400">
                  <Calendar className="w-3 h-3 mr-1" />
                  {formatDueDate(task.dueDate)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
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
            Welcome back, {name}! Here's what's happening with your projects.
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
        {/* Recent Tasks */}
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
                <h2 className="text-xl font-semibold text-white flex items-center">
                  My Recent Tasks
                  {tasksLoading && (
                    <div className="ml-3 w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                  )}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-300 hover:text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-200 ease-out hover:scale-105 disabled:opacity-50"
                  onClick={getRecentTasks}
                  disabled={tasksLoading}
                >
                  Refresh
                </Button>
              </div>
              <TasksContent />
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
