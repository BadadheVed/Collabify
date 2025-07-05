import { MyProjectsClient } from "./myProjectClient";
import { axiosInstance } from "@/axiosSetup/axios";
import { cookies } from "next/headers";

interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  createdBy: string;
  role: string;
  team: {
    id: string;
    name: string;
  };
}

interface MyProjectsResponse {
  success: boolean;
  projects: Project[];
}

async function getProjects(): Promise<Project[]> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token");

    if (!token) {
      console.log("Server: No token found in cookies");
      return [];
    }

    console.log("Server: Attempting to fetch projects with token");

    const response = await axiosInstance.get("/projects/UserProjects", {
      headers: {
        Cookie: `token=${token.value}`,
      },
    });

    console.log("Server: API Response received", {
      success: response.data.success,
      projectCount: response.data.projects?.length || 0,
    });

    if (response.data.success && response.data.projects) {
      console.log(
        "Server: Projects loaded successfully",
        response.data.projects
      );
      return response.data.projects;
    }

    console.log("Server: No projects in response");
    return [];
  } catch (error) {
    console.error("Server: Error fetching projects:", error);
    return [];
  }
}

export async function MyProjectsServer() {
  const projects = await getProjects();

  console.log("Server: Rendering MyProjectsClient with projects:", projects);

  return <MyProjectsClient initialProjects={projects} />;
}
