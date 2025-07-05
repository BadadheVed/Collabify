import { MyTasksClient } from "./myTasksClient";
import { cookies } from "next/headers";
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

interface MyTasksResponse {
  success: boolean;
  tasks: Task[];
}

async function getUserTasks(): Promise<Task[]> {
  try {
    const burl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
    const cookieStore = cookies();
    const token = cookieStore.get("token");
    if (!token) {
      console.log("Server: No token found in cookies");
      return [];
    }
    console.log(
      "Server: Attempting to fetch user tasks from",
      `${burl}/tasks/user/MyTasks`
    );

    // Mock data matching your exact backend response structure
    // const mockTasks: Task[] = [
    //   {
    //     id: "task-1",
    //     title: "Implement User Authentication",
    //     status: "IN_PROGRESS",
    //     dueDate: "2024-02-15T10:00:00Z",
    //     description:
    //       "Implement secure user authentication system with JWT tokens and password hashing",
    //     projectName: "E-commerce Platform",
    //     teamName: "Backend Development",
    //   },
    //   {
    //     id: "task-2",
    //     title: "Design Product Catalog UI",
    //     status: "TODO",
    //     dueDate: "2024-02-20T14:30:00Z",
    //     description:
    //       "Create responsive product catalog interface with filtering and search functionality",
    //     projectName: "E-commerce Platform",
    //     teamName: "Frontend Development",
    //   },
    //   {
    //     id: "task-3",
    //     title: "Setup CI/CD Pipeline",
    //     status: "COMPLETED",
    //     dueDate: "2024-02-10T09:00:00Z",
    //     description:
    //       "Configure automated deployment pipeline with testing and staging environments",
    //     projectName: "Mobile Banking App",
    //     teamName: "DevOps Team",
    //   },
    //   {
    //     id: "task-4",
    //     title: "Write API Documentation",
    //     status: "TODO",
    //     dueDate: "2024-02-25T16:00:00Z",
    //     description:
    //       "Document all REST API endpoints with examples and response schemas",
    //     projectName: "Data Analytics Dashboard",
    //     teamName: "Backend Development",
    //   },
    //   {
    //     id: "task-5",
    //     title: "Implement Real-time Notifications",
    //     status: "IN_PROGRESS",
    //     dueDate: "2024-02-18T11:30:00Z",
    //     description:
    //       "Add real-time notification system using WebSockets for instant updates",
    //     projectName: "Mobile Banking App",
    //     teamName: "Frontend Development",
    //   },
    //   {
    //     id: "task-6",
    //     title: "Database Performance Optimization",
    //     status: "TODO",
    //     dueDate: "2024-03-01T13:00:00Z",
    //     description:
    //       "Optimize database queries and implement proper indexing for better performance",
    //     projectName: "Data Analytics Dashboard",
    //     teamName: "Backend Development",
    //   },
    // ];

    // console.log("Server: Mock tasks loaded successfully");
    // return mockTasks;

    console.log("Server: Attempting to fetch projects with token");

    const response = await axiosInstance.get("/tasks/user/MyTasks", {
      headers: {
        Cookie: `token=${token.value}`,
      },
    });

    console.log("Server: API Response received", {
      success: response.data.success,
      tasks: response.data.tasks?.length || 0,
    });

    if (response.data.success && response.data.tasks) {
      console.log("Server: Tasks loaded successfully", response.data.tasks);
      return response.data.tasks;
    }

    console.log("Server: No Tasks in response");
    return [];
  } catch (error) {
    console.error("Server: Error fetching user tasks:", error);
    return [];
  }
}

export async function MyTasksServer() {
  const tasks = await getUserTasks();

  return <MyTasksClient initialTasks={tasks} />;
}
