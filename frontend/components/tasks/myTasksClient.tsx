"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Calendar,
  Clock,
  X,
  CheckCircle,
  Circle,
  Play,
  Plus,
  Building,
  Users,
  User,
  ChevronDown,
  Filter,
  SortAsc,
  SortDesc,
  CalendarDays,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CreateTaskPopup from "./createTaskPopUp";
import { axiosInstance } from "@/axiosSetup/axios";

interface Task {
  id: string;
  title: string;
  status: "TODO" | "IN_PROGRESS" | "COMPLETED";
  dueDate: string;
  description: string;
  projectName: string;
  teamName: string;
}

interface Team {
  id: string;
  name: string;
  projectId: string;
  projectName: string;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
}

interface CreateTaskData {
  title: string;
  description: string;
  dueDate: string;
  teamId: string;
  assignedToId: string;
}

interface MyTasksClientProps {
  initialTasks: Task[];
  currentUserId?: string;
}

type FilterStatus = "ALL" | "TODO" | "IN_PROGRESS" | "COMPLETED";
type SortOption =
  | "DUE_DATE_ASC"
  | "DUE_DATE_DESC"
  | "CREATED_ASC"
  | "CREATED_DESC"
  | "TITLE_ASC"
  | "TITLE_DESC"
  | "STATUS";

// Helper function to get cookies in the browser
const getCookie = (name: string): string | undefined => {
  if (typeof document === "undefined") return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
};

// Helper function to get JWT token from cookie
const getJWTToken = (cookieName: string = "token"): string | null => {
  const token = getCookie(cookieName);
  return token || null;
};

// Helper function to parse JWT payload
const parseJWTPayload = (token: string): any => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error parsing JWT payload:", error);
    return null;
  }
};

const isJWTExpired = (token: string): boolean => {
  const payload = parseJWTPayload(token);
  if (!payload || !payload.exp) return true;

  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
};

// Complete helper function to get valid JWT token
const getValidJWTToken = (cookieName: string = "token"): string | null => {
  const token = getJWTToken(cookieName);

  if (!token) {
    console.warn("No JWT token found in cookie");
    return null;
  }

  if (isJWTExpired(token)) {
    console.warn("JWT token is expired");
    return null;
  }

  return token;
};

export function MyTasksClient({
  initialTasks,
  currentUserId,
}: MyTasksClientProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showTaskPopup, setShowTaskPopup] = useState(false);
  const [showCreateTaskPopup, setShowCreateTaskPopup] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<
    "TODO" | "IN_PROGRESS" | "COMPLETED" | null
  >(null);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Filter and Sort States
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("ALL");
  const [sortOption, setSortOption] = useState<SortOption>("DUE_DATE_ASC");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<number | null>(null);
  // Admin teams for create task
  const [adminTeams, setAdminTeams] = useState<Team[]>([]);

  useEffect(() => {
    setIsClient(true);
    loadAdminTeams();
  }, []);

  const furl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  // Filter and sort tasks
  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks;

    // Apply status filter
    if (filterStatus !== "ALL") {
      filtered = filtered.filter((task) => task.status === filterStatus);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query) ||
          task.projectName.toLowerCase().includes(query) ||
          task.teamName.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortOption) {
        case "DUE_DATE_ASC":
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case "DUE_DATE_DESC":
          return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
        case "TITLE_ASC":
          return a.title.localeCompare(b.title);
        case "TITLE_DESC":
          return b.title.localeCompare(a.title);
        case "STATUS":
          const statusOrder = { TODO: 0, IN_PROGRESS: 1, COMPLETED: 2 };
          return statusOrder[a.status] - statusOrder[b.status];
        default:
          return 0;
      }
    });

    return sorted;
  }, [tasks, filterStatus, sortOption, searchQuery]);

  const refreshTasks = async () => {
    setIsRefreshing(true);
    try {
      const response = await axiosInstance.get("/tasks/user/MyTasks");
      if (response.data.success) {
        setTasks(response.data.tasks);
        setLastRefreshed(Date.now()); // ← set the timestamp
      }
      console.log("Refreshing Tasks");
    } catch (error) {
      console.error("Error refreshing tasks:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    const now = Date.now();
    const cooldown = 30 * 1000; // 30 seconds

    if (!lastRefreshed || now - lastRefreshed >= cooldown) {
      refreshTasks();
    } else {
      const remaining = Math.ceil((cooldown - (now - lastRefreshed)) / 1000);
      console.warn(`Please wait ${remaining}s before refreshing again.`);
    }
  };

  const getStatusCounts = () => {
    return {
      all: tasks.length,
      todo: tasks.filter((t) => t.status === "TODO").length,
      inProgress: tasks.filter((t) => t.status === "IN_PROGRESS").length,
      completed: tasks.filter((t) => t.status === "COMPLETED").length,
    };
  };

  const statusCounts = getStatusCounts();

  const loadAdminTeams = async () => {
    console.log("FETCHING ADMIN TEAMS DATA");
    try {
      const res = await axiosInstance.get("/teams/AdminTeams");
      console.log("DONE FETCHING ADMIN TEAMS DATA", res.data);

      // Check if the response has the expected structure
      if (res.data.success && Array.isArray(res.data.teams)) {
        setAdminTeams(res.data.teams);
      } else {
        console.error("Expected teams array but got:", res.data);
        setAdminTeams([]);
      }
    } catch (error) {
      console.error("Error fetching admin teams:", error);
      setAdminTeams([]);
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "TODO":
        return {
          icon: Circle,
          color: "text-gray-400",
          bgColor: "bg-gray-500/20",
          borderColor: "border-gray-500/30",
          label: "To Do",
        };
      case "IN_PROGRESS":
        return {
          icon: Play,
          color: "text-blue-400",
          bgColor: "bg-blue-500/20",
          borderColor: "border-blue-500/30",
          label: "In Progress",
        };
      case "COMPLETED":
        return {
          icon: CheckCircle,
          color: "text-green-400",
          bgColor: "bg-green-500/20",
          borderColor: "border-green-500/30",
          label: "Completed",
        };
      default:
        return {
          icon: Circle,
          color: "text-gray-400",
          bgColor: "bg-gray-500/20",
          borderColor: "border-gray-500/30",
          label: "Unknown",
        };
    }
  };

  const getSortLabel = (option: SortOption) => {
    switch (option) {
      case "DUE_DATE_ASC":
        return "Due Date (Earliest)";
      case "DUE_DATE_DESC":
        return "Due Date (Latest)";
      case "TITLE_ASC":
        return "Title (A-Z)";
      case "TITLE_DESC":
        return "Title (Z-A)";
      case "STATUS":
        return "Status";
      default:
        return "Sort";
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setSelectedStatus(task.status);
    setShowTaskPopup(true);
  };

  const handleStatusChange = async (
    newStatus: "TODO" | "IN_PROGRESS" | "COMPLETED"
  ) => {
    if (!selectedTask || newStatus === selectedTask.status) return;

    setIsUpdating(true);
    try {
      // Make actual API call to update task status
      // const response = await axiosInstance.patch(
      //   `/tasks/${selectedTask.id}/status`,
      //   {
      //     status: newStatus,
      //   }
      // );
      const response = await axiosInstance.patch(
        `/tasks/status/${selectedTask.id}`,
        {
          status: newStatus,
        }
      );

      if (response.data.success) {
        // Update local state
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === selectedTask.id ? { ...task, status: newStatus } : task
          )
        );

        setSelectedTask((prev) =>
          prev ? { ...prev, status: newStatus } : null
        );
        setSelectedStatus(newStatus);

        setSuccessMessage(
          `Task status updated to ${getStatusDisplay(newStatus).label}`
        );
        setShowSuccess(true);
        setShowTaskPopup(false);

        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
      } else {
        throw new Error(
          response.data.message || "Failed to update task status"
        );
      }
    } catch (error: any) {
      console.error("Error updating task status:", error);
      setErrorMessage(
        error.response?.data?.message ||
          "Failed to update task status. Please try again."
      );
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    } finally {
      setIsUpdating(false);
    }
  };

  // Fixed handleCreateTask function to work with CreateTaskPopup
  const handleCreateTask = async (taskData: CreateTaskData) => {
    console.log("📝 Creating task with data:", taskData);

    // Use the improved JWT cookie helper

    try {
      // Send only the fields that backend expects
      const response = await axiosInstance.post("/tasks/create", {
        title: taskData.title,
        description: taskData.description,
        dueDate: taskData.dueDate,
        teamId: taskData.teamId,
        assignedToId: taskData.assignedToId,
      });

      console.log("✅ Task creation response:", response.data);

      if (response.data.success) {
        setSuccessMessage(
          `Task "${taskData.title}" created and assigned successfully!`
        );
        setShowSuccess(true);
        setShowCreateTaskPopup(false);

        // Refresh tasks list
        await refreshTasks();

        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
      } else {
        throw new Error(response.data.message || "Failed to create task");
      }
    } catch (error: any) {
      console.error("💥 Error creating task:", error);

      // Enhanced error handling based on error type
      let errorMsg = "Failed to create task. Please try again.";

      if (error.response?.status === 401) {
        errorMsg = "Authentication expired. Please login again.";
      } else if (error.response?.status === 403) {
        errorMsg = "You don't have permission to create tasks in this team.";
      } else if (error.response?.status === 400) {
        errorMsg =
          error.response.data.message ||
          "Invalid task data. Please check all fields.";
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      }

      setErrorMessage(errorMsg);
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);

      // Re-throw the error so CreateTaskPopup knows the creation failed
      throw error;
    }
  };

  const formatDateReliable = (dateString: string) => {
    if (!isClient) {
      return "Loading...";
    }

    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = date.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) return "Today";
      if (diffDays === 1) return "Tomorrow";
      if (diffDays === -1) return "Yesterday";
      if (diffDays > 0) return `In ${diffDays} days`;
      if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;

      return date.toLocaleDateString();
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  const getDueDateColor = (dueDate: string) => {
    const date = new Date(dueDate);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "text-red-400"; // Overdue
    if (diffDays === 0) return "text-orange-400"; // Due today
    if (diffDays === 1) return "text-yellow-400"; // Due tomorrow
    return "text-gray-400"; // Future
  };

  if (tasks.length === 0) {
    return (
      <>
        {showCreateTaskPopup && (
          <CreateTaskPopup
            isOpen={showCreateTaskPopup}
            onClose={() => setShowCreateTaskPopup(false)}
            onCreateTask={handleCreateTask}
            adminTeams={adminTeams}
          />
        )}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              My Tasks
            </h2>
            <p className="text-gray-400 mt-1">Tasks assigned to you</p>
          </div>

          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("Create Task button clicked"); // Debug log
              setShowCreateTaskPopup(true);
            }}
            className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-200 ease-out backdrop-blur-sm border border-white/10"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Task
          </Button>
        </div>

        <Card className="backdrop-blur-xl bg-white/5 border border-white/10 p-8 text-center rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl pointer-events-none" />
          <div className="relative z-10">
            <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              No Tasks Yet
            </h3>
            <p className="text-gray-400">
              You don't have any tasks assigned yet. Create a task or wait for
              assignments.
            </p>
          </div>
        </Card>
      </>
    );
  }

  return (
    <>
      {/* Header with Create Task Button */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            My Tasks
          </h2>
          <p className="text-gray-400 mt-1">Tasks assigned to you</p>
        </div>
        <Button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log("Create Task button clicked"); // Debug log
            setShowCreateTaskPopup(true);
          }}
          className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-200 ease-out backdrop-blur-sm border border-white/10"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Task
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="space-y-4 mb-6">
        {/* Search Bar */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="backdrop-blur-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:border-cyan-500 hover:border-white/20 transition-all duration-200 ease-out"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="bg-white/10 text-white border-white/10 text-gray-400 hover:text-white hover:border-cyan-500 backdrop-blur-sm hover:bg-white/10 transition-all duration-200 ease-out hover:scale-105"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button
            onClick={() => handleRefresh()}
            disabled={isRefreshing}
            variant="outline"
            className="bg-white/10 text-white border-white/10 text-gray-400 hover:text-white hover:border-cyan-500 backdrop-blur-sm hover:bg-white/10 transition-all duration-200 ease-out hover:scale-105"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <Card className="backdrop-blur-xl bg-white/5 border border-white/10 p-4 rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl pointer-events-none" />
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Status Filter */}
              <div>
                <Label className="text-white mb-3 block">
                  Filter by Status
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    {
                      key: "ALL",
                      label: `All (${statusCounts.all})`,
                      color: "text-gray-400",
                    },
                    {
                      key: "TODO",
                      label: `To Do (${statusCounts.todo})`,
                      color: "text-gray-400",
                    },
                    {
                      key: "IN_PROGRESS",
                      label: `In Progress (${statusCounts.inProgress})`,
                      color: "text-blue-400",
                    },
                    {
                      key: "COMPLETED",
                      label: `Completed (${statusCounts.completed})`,
                      color: "text-green-400",
                    },
                  ].map((status) => (
                    <button
                      key={status.key}
                      onClick={() =>
                        setFilterStatus(status.key as FilterStatus)
                      }
                      className={`p-2 rounded-lg text-sm font-medium transition-all duration-200 ease-out hover:scale-105 ${
                        filterStatus === status.key
                          ? "bg-cyan-500/20 border border-cyan-500/50 text-cyan-400"
                          : "bg-white/5 border border-white/10 text-gray-400 hover:border-white/20"
                      }`}
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort Options */}
              <div>
                <Label className="text-white mb-3 block">Sort by</Label>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as SortOption)}
                  className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-cyan-500 focus:outline-none transition-all duration-200 ease-out"
                >
                  <option value="DUE_DATE_ASC" className="bg-gray-800">
                    Due Date (Earliest First)
                  </option>
                  <option value="DUE_DATE_DESC" className="bg-gray-800">
                    Due Date (Latest First)
                  </option>
                  <option value="TITLE_ASC" className="bg-gray-800">
                    Title (A-Z)
                  </option>
                  <option value="TITLE_DESC" className="bg-gray-800">
                    Title (Z-A)
                  </option>
                  <option value="STATUS" className="bg-gray-800">
                    Status
                  </option>
                </select>
              </div>
            </div>
          </Card>
        )}

        {/* Results Summary */}
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>
            Showing {filteredAndSortedTasks.length} of {tasks.length} tasks
            {filterStatus !== "ALL" &&
              ` • Filtered by ${getStatusDisplay(filterStatus).label}`}
            {searchQuery && ` • Search: "${searchQuery}"`}
          </span>
          <span>Sorted by {getSortLabel(sortOption)}</span>
        </div>
      </div>

      {/* Tasks Grid */}
      {filteredAndSortedTasks.length === 0 ? (
        <Card className="backdrop-blur-xl bg-white/5 border border-white/10 p-8 text-center rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl pointer-events-none" />
          <div className="relative z-10">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              No Tasks Found
            </h3>
            <p className="text-gray-400">
              No tasks match your current filters. Try adjusting your search or
              filters.
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedTasks.map((task, index) => {
            const statusDisplay = getStatusDisplay(task.status);
            const StatusIcon = statusDisplay.icon;
            const dueDateColor = getDueDateColor(task.dueDate);

            return (
              <Card
                key={task.id}
                onClick={() => handleTaskClick(task)}
                className="backdrop-blur-xl bg-white/5 border border-white/10 p-6 hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 ease-out cursor-pointer group hover:scale-[1.02] rounded-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl pointer-events-none" />
                <div className="relative z-10 space-y-4">
                  <div className="flex items-start justify-between">
                    <div
                      className={`w-12 h-12 rounded-lg bg-gradient-to-r ${
                        index % 4 === 0
                          ? "from-cyan-500 to-blue-600"
                          : index % 4 === 1
                            ? "from-purple-500 to-pink-600"
                            : index % 4 === 2
                              ? "from-green-500 to-emerald-600"
                              : "from-orange-500 to-red-600"
                      } flex items-center justify-center text-white font-bold text-lg shadow-lg transition-all duration-200 ease-out group-hover:scale-105`}
                    >
                      {task.title.charAt(0).toUpperCase()}
                    </div>
                    <div
                      className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm border transition-all duration-200 ease-out ${statusDisplay.bgColor} ${statusDisplay.borderColor}`}
                    >
                      <StatusIcon
                        className={`w-3 h-3 ${statusDisplay.color}`}
                      />
                      <span className={statusDisplay.color}>
                        {statusDisplay.label}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors duration-200 ease-out mb-2">
                      {task.title}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                      {task.description}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Building className="w-4 h-4" />
                      <span>{task.projectName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Users className="w-4 h-4" />
                      <span>{task.teamName}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm pt-2 border-t border-white/10">
                    <div className={`flex items-center gap-1 ${dueDateColor}`}>
                      <Clock className="w-4 h-4" />
                      <span>Due {formatDateReliable(task.dueDate)}</span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Task Details Popup */}
      {showTaskPopup && selectedTask && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="relative w-full max-w-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-600/20 rounded-3xl blur opacity-50" />
            <Card className="relative backdrop-blur-xl bg-gray-900/90 border border-white/20 rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

              {/* Header */}
              <div className="relative z-10 flex items-center justify-between p-6 border-b border-white/10">
                <h2 className="text-2xl font-bold text-white bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                  Task Details
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowTaskPopup(false)}
                  className="text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200 ease-out hover:scale-105 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Content */}
              <div className="relative z-10 p-6 space-y-6">
                {/* Task Info */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {selectedTask.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    {selectedTask.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10">
                      <Building className="w-4 h-4 text-cyan-400" />
                      <div>
                        <p className="text-gray-400">Project</p>
                        <p className="text-white font-medium">
                          {selectedTask.projectName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10">
                      <Users className="w-4 h-4 text-purple-400" />
                      <div>
                        <p className="text-gray-400">Team</p>
                        <p className="text-white font-medium">
                          {selectedTask.teamName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 col-span-2">
                      <Calendar className="w-4 h-4 text-orange-400" />
                      <div>
                        <p className="text-gray-400">Due Date</p>
                        <p className="text-white font-medium">
                          {formatDateReliable(selectedTask.dueDate)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Selection */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">
                    Update Status
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    {(["TODO", "IN_PROGRESS", "COMPLETED"] as const).map(
                      (status) => {
                        const statusDisplay = getStatusDisplay(status);
                        const StatusIcon = statusDisplay.icon;
                        const isSelected = selectedStatus === status;
                        const isCurrentStatus = selectedTask.status === status;

                        return (
                          <button
                            key={status}
                            onClick={() => setSelectedStatus(status)}
                            className={`p-4 rounded-xl border transition-all duration-200 ease-out hover:scale-105 ${
                              isSelected
                                ? `${statusDisplay.bgColor} ${statusDisplay.borderColor} shadow-lg`
                                : "bg-white/5 border-white/10 hover:border-white/20"
                            }`}
                          >
                            <div className="flex flex-col items-center gap-2">
                              <StatusIcon
                                className={`w-6 h-6 ${
                                  isSelected
                                    ? statusDisplay.color
                                    : "text-gray-400"
                                }`}
                              />
                              <span
                                className={`text-sm font-medium ${
                                  isSelected
                                    ? statusDisplay.color
                                    : "text-gray-400"
                                }`}
                              >
                                {statusDisplay.label}
                              </span>
                              {isCurrentStatus && (
                                <span className="text-xs text-gray-500">
                                  (Current)
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowTaskPopup(false)}
                    className="flex-1 border-white/10 text-gray-400 hover:text-white hover:border-cyan-500 backdrop-blur-sm hover:bg-white/10 transition-all duration-200 ease-out"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleStatusChange(selectedStatus!)}
                    disabled={
                      !selectedStatus ||
                      selectedStatus === selectedTask.status ||
                      isUpdating
                    }
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-200 ease-out disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUpdating ? "Updating..." : "Update Status"}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Create Task Popup */}
      {showCreateTaskPopup && (
        <CreateTaskPopup
          isOpen={showCreateTaskPopup}
          onClose={() => setShowCreateTaskPopup(false)}
          onCreateTask={handleCreateTask}
          adminTeams={adminTeams}
        />
      )}

      {/* Success Popup */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 max-w-sm w-full relative overflow-hidden shadow-2xl">
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <CheckCircle className="w-16 h-16 text-green-500 animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Success!</h3>
              <p className="text-gray-300">{successMessage}</p>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700 rounded-b-2xl overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-400 to-green-600"
                style={{
                  animation: "progressBar 2s linear forwards",
                }}
              ></div>
            </div>
          </div>
        </div>
      )}
      {showError && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl border border-red-700/50 p-6 max-w-sm w-full relative overflow-hidden shadow-2xl">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <AlertCircle className="w-16 h-16 text-red-500 animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Error</h3>
              <p className="text-gray-300">{errorMessage}</p>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700 rounded-b-2xl overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-400 to-red-600"
                style={{
                  animation: "progressBar 2s linear forwards",
                }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style jsx global>{`
        @keyframes progressBar {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }

        .scrollbar-thin {
          scrollbar-width: thin;
        }
        .scrollbar-track-gray-800::-webkit-scrollbar-track {
          background-color: rgb(31 41 55);
          border-radius: 0.5rem;
        }
        .scrollbar-thumb-gray-600::-webkit-scrollbar-thumb {
          background-color: rgb(75 85 99);
          border-radius: 0.5rem;
        }
        .hover\\:scrollbar-thumb-gray-500:hover::-webkit-scrollbar-thumb {
          background-color: rgb(107 114 128);
        }
        ::-webkit-scrollbar {
          width: 8px;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </>
  );
}
