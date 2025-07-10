import { Suspense } from "react";
import {
  FolderOpen,
  User,
  Calendar,
  AlertCircle,
  FileText,
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

async function fetchTasks(): Promise<Task[]> {
  try {
    console.log("Fetching the user tasks");
    const response = await axiosInstance.get("/tasks/user/MyTasks");
    console.log("User tasks fetching done successfully");
    const fetchedTasks: Task[] = response.data.tasks;
    return fetchedTasks || [];
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
}
// Server-side data fetching
// async function fetchTasks(): Promise<Task[]> {
//   try {
//     // Replace with your actual API endpoint
//     const response = await fetch(
//       `${process.env.NEXT_PUBLIC_API_URL}/tasks/user/MyTasks`,
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.API_TOKEN}`, // Handle auth appropriately
//         },
//         cache: "no-store", // Always fetch fresh data
//       }
//     );

//     if (!response.ok) {
//       throw new Error("Failed to fetch tasks");
//     }

//     const data = await response.json();
//     return data.tasks || [];
//   } catch (error) {
//     console.error("Error fetching tasks:", error);
//     return [];
//   }
// }

// Loading component
export function TasksLoading() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex items-center justify-between p-4 rounded-xl backdrop-blur-sm bg-white/5 border border-white/5 animate-pulse"
        >
          <div className="flex items-center space-x-4">
            <div className="w-3 h-3 rounded-full bg-gray-600"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-600 rounded mb-2 w-3/4"></div>
              <div className="h-3 bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
          <div className="text-right">
            <div className="h-4 bg-gray-600 rounded mb-1 w-16"></div>
            <div className="h-3 bg-gray-700 rounded w-12"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Tasks content component (async server component)
export async function TasksContent() {
  const tasks = await fetchTasks();

  const formatDueDate = (dateString: string) => {
    const dueDate = new Date(dateString);
    const now = new Date();
    const diffTime = dueDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Overdue";
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays <= 7) return `${diffDays} days`;
    return dueDate.toLocaleDateString();
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

  if (tasks.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <FileText className="w-12 h-12 text-gray-500 mx-auto mb-3" />
          <p className="text-gray-400">No tasks found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.slice(0, 5).map((task) => {
        const urgency = getTaskUrgency(task.dueDate);
        const statusColor = getStatusColor(task.status);

        return (
          <div
            key={task.id}
            className="flex items-center justify-between p-4 rounded-xl backdrop-blur-sm bg-white/5 hover:bg-white/10 transition-all duration-200 ease-out hover:scale-[1.01] cursor-pointer group border border-white/5 hover:border-white/20"
          >
            <div className="flex items-center space-x-4">
              <div
                className={`w-3 h-3 rounded-full ${statusColor} ${
                  urgency === "urgent" || urgency === "overdue"
                    ? "animate-pulse"
                    : ""
                } shadow-lg`}
              ></div>
              <div className="flex-1">
                <h3 className="font-medium text-white group-hover:text-cyan-400 transition-colors duration-200 ease-out">
                  {task.title}
                </h3>
                <div className="flex items-center space-x-4 text-sm text-gray-300 mt-1">
                  <div className="flex items-center">
                    <FolderOpen className="w-3 h-3 mr-1" />
                    {task.projectName}
                  </div>
                  <div className="flex items-center">
                    <User className="w-3 h-3 mr-1" />
                    {task.teamName}
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-white font-medium capitalize">
                {task.status.replace("_", " ")}
              </div>
              <div
                className={`text-xs flex items-center ${
                  urgency === "overdue"
                    ? "text-red-400"
                    : urgency === "urgent"
                    ? "text-orange-400"
                    : "text-gray-400"
                }`}
              >
                <Calendar className="w-3 h-3 mr-1" />
                {formatDueDate(task.dueDate)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
