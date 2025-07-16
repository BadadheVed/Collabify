"use client";

import { useState, useEffect } from "react";
import {
  Users,
  FileText,
  FolderOpen,
  TrendingUp,
  Clock,
  Plus,
  MoreHorizontal,
  AlertCircle,
  Calendar,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { axiosInstance } from "@/axiosSetup/axios";

interface Task {
  id: number;
  title: string;
  status: string;
  dueDate: string;
  description: string;
  projectName: string;
  teamName: string;
}

interface TileData {
  name: string;
  projects: number;
  teams: number;
  teamMembers: number;
  documents: number;
}

interface Notification {
  id: string;
  message: string;
  read: boolean;
  createdAt: string;
  expiresAt: string;
}

export default function DashboardPage() {
  const [isVisible, setIsVisible] = useState({
    stats: false,
    projects: false,
    activity: false,
  });

  // Replace the custom hook with direct state management
  const [tileData, setTileData] = useState<TileData | null>(null);
  const [tileDataLoading, setTileDataLoading] = useState(true);
  const [tileDataError, setTileDataError] = useState<string | null>(null);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [tasksError, setTasksError] = useState<string | null>(null);

  // Notifications state
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(true);
  const [notificationsError, setNotificationsError] = useState<string | null>(
    null
  );

  const [isClient, setIsClient] = useState(false);

  // Handle client-side mounting
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch tile data function
  const fetchTileData = async (useCache: boolean = true) => {
    try {
      setTileDataLoading(true);
      setTileDataError(null);

      // Only use sessionStorage on client side
      if (useCache && isClient) {
        const cached = sessionStorage.getItem("tileData");
        if (cached) {
          setTileData(JSON.parse(cached));
          setTileDataLoading(false);
          return;
        }
      }

      console.log("Fetching tile data from API");
      const response = await axiosInstance.get("/dashboard/tiledata");

      const data: TileData = {
        name: response.data.name,
        projects: response.data.projects,
        teams: response.data.teams,
        teamMembers: response.data.teamMembers,
        documents: response.data.documents,
      };

      // Store in sessionStorage only on client side
      if (isClient) {
        sessionStorage.setItem("tileData", JSON.stringify(data));
      }

      setTileData(data);
      console.log("Tile data fetched successfully");
    } catch (error) {
      console.error("Error fetching tile data:", error);
      setTileDataError("Failed to load dashboard data");
    } finally {
      setTileDataLoading(false);
    }
  };

  // Function to update tile data when activities change
  const updateTileDataOnActivity = async () => {
    console.log("Activity detected, refreshing tile data...");
    await fetchTileData(false); // Force fetch without cache
  };

  // Function to clear tile data cache
  const clearTileDataCache = () => {
    if (isClient) {
      sessionStorage.removeItem("tileData");
    }
  };

  // Initial data fetch
  useEffect(() => {
    if (isClient) {
      fetchTileData();
    }
  }, [isClient]);

  const name = tileData?.name || "USER";

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
    getNotifications();
  }, []);

  const stats = [
    {
      title: "Projects",
      value: tileData?.projects.toString() || "0",
      icon: FolderOpen,
      color: "from-cyan-500 to-blue-600",
      bgColor: "bg-cyan-500/10",
    },
    {
      title: "Team Members",
      value: tileData?.teamMembers.toString() || "0",
      icon: Users,
      color: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Documents",
      value: tileData?.documents.toString() || "0",
      icon: FileText,
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Teams",
      value: tileData?.teams.toString() || "0",
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
      setTasks(fetchedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setTasksError("Error fetching tasks");
    } finally {
      setTasksLoading(false);
    }
  };

  // Fetch notifications function
  const getNotifications = async () => {
    try {
      setNotificationsLoading(true);
      setNotificationsError(null);
      console.log("Fetching notifications");
      const response = await axiosInstance.get("/notifications/");
      console.log("Notifications fetching done successfully");
      const fetchedNotifications: Notification[] = response.data.notifications;
      setNotifications(fetchedNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotificationsError("Error fetching notifications");
    } finally {
      setNotificationsLoading(false);
    }
  };

  // Example function to handle activities that might change tile data
  const handleActivityThatChangesData = async (activityType: string) => {
    try {
      await updateTileDataOnActivity();
      await getRecentTasks();
      await getNotifications();
    } catch (error) {
      console.error("Error handling activity:", error);
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

  // Format notification timestamp
  const formatNotificationTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) {
      return "Just now";
    } else if (diffMinutes < 60) {
      return `${diffMinutes} minute${diffMinutes === 1 ? "" : "s"} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
    } else {
      return date.toLocaleDateString();
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

  // Stats Loading Component
  const StatsLoading = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, index) => (
        <Card
          key={index}
          className="backdrop-blur-xl bg-white/5 border border-white/10 p-6 rounded-2xl animate-pulse"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gray-700/30 border border-white/10">
              <div className="w-6 h-6 bg-gray-600 rounded"></div>
            </div>
            <div className="text-right">
              <div className="w-8 h-8 bg-gray-600 rounded"></div>
            </div>
          </div>
          <div className="w-20 h-4 bg-gray-600 rounded"></div>
        </Card>
      ))}
    </div>
  );

  // Tasks Loading Component
  const TasksLoading = () => (
    <div className="space-y-4">
      <div className="w-full bg-gray-700 rounded-full h-1 mb-4 overflow-hidden">
        <div className="bg-gradient-to-r from-cyan-500 to-purple-600 h-1 rounded-full animate-pulse"></div>
      </div>
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

  // Notifications Loading Component
  const NotificationsLoading = () => (
    <div className="space-y-4">
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="animate-pulse p-3 rounded-xl border border-gray-700 bg-gray-800/30"
        >
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
            <div className="flex-1">
              <div className="h-3 bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-700 rounded w-2/3 mb-2"></div>
              <div className="h-2 bg-gray-700 rounded w-16"></div>
            </div>
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

  // Notifications Content Component
  const NotificationsContent = () => {
    if (notificationsLoading) {
      return <NotificationsLoading />;
    }

    if (notificationsError) {
      return (
        <div className="flex items-center justify-center p-8 text-red-400">
          <AlertCircle className="w-5 h-5 mr-2" />
          {notificationsError}
        </div>
      );
    }

    if (notifications.length === 0) {
      return (
        <div className="flex items-center justify-center p-8 text-gray-400">
          <Bell className="w-5 h-5 mr-2" />
          No notifications found
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {notifications.slice(0, 5).map((notification) => (
          <div
            key={notification.id}
            className={`flex items-start space-x-3 hover:bg-white/5 p-3 rounded-xl transition-all duration-200 ease-out border ${
              notification.read
                ? "border-transparent hover:border-white/10"
                : "border-cyan-500/30 bg-cyan-500/5"
            } hover:scale-[1.01]`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold shadow-lg ${
                notification.read
                  ? "bg-gradient-to-r from-gray-400 to-gray-500 shadow-gray-500/30"
                  : "bg-gradient-to-r from-cyan-400 to-purple-500 shadow-purple-500/30"
              }`}
            >
              <Bell className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p
                className={`text-sm ${notification.read ? "text-gray-300" : "text-white"} leading-relaxed`}
              >
                {notification.message}
              </p>
              <p className="text-xs text-gray-400 flex items-center mt-1">
                <Clock className="w-3 h-3 mr-1" />
                {formatNotificationTime(notification.createdAt)}
              </p>
            </div>
            {!notification.read && (
              <div className="w-2 h-2 rounded-full bg-cyan-400 mt-1 flex-shrink-0"></div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Show loading state during initial render
  if (!isClient) {
    return (
      <div className="space-y-8 relative">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-gray-300 text-lg">Loading...</p>
          </div>
        </div>
        <StatsLoading />
      </div>
    );
  }

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
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchTileData(false)}
            disabled={tileDataLoading}
            className="text-gray-300 hover:text-white bg-white/10 hover:bg-white/10 backdrop-blur-sm transition-all duration-200 ease-out hover:scale-105 disabled:opacity-50"
          >
            {tileDataLoading ? "Refreshing..." : "Refresh Data"}
          </Button>
          <Button
            className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/40 transition-all duration-200 ease-out backdrop-blur-sm border border-white/10"
            onClick={() => handleActivityThatChangesData("create_project")}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      {tileDataLoading ? (
        <StatsLoading />
      ) : tileDataError ? (
        <div className="flex items-center justify-center p-8 text-red-400 bg-red-500/10 rounded-xl border border-red-500/20">
          <AlertCircle className="w-5 h-5 mr-2" />
          {tileDataError}
        </div>
      ) : (
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
      )}

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

        {/* Recent Notifications */}
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
                <h2 className="text-xl font-semibold text-white flex items-center">
                  Recent Notifications
                  {notificationsLoading && (
                    <div className="ml-3 w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                  )}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-300 hover:text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-200 ease-out hover:scale-105 disabled:opacity-50"
                  onClick={getNotifications}
                  disabled={notificationsLoading}
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
              <NotificationsContent />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
