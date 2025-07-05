import { MyTeamsClient } from "./myTeamClient";

interface UserTeam {
  teamId: string;
  teamName: string;
  joinedAt: string;
  role: string;
}
import { axiosInstance } from "@/axiosSetup/axios";
interface MyTeamsResponse {
  success: boolean;
  teams: UserTeam[];
}
import { cookies } from "next/headers";
async function getUserTeams(): Promise<UserTeam[]> {
  try {
    const furl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

    console.log(
      "Server: Attempting to fetch user teams from",
      `${furl}/teams/getUserTeams`
    );
    const cookieStore = cookies();
    const token = cookieStore.get("token");
    if (!token) {
      console.log("Server: No token found in cookies");
      return [];
    }
    

    const response = await axiosInstance.get("/teams/MyTeams", {
      headers: {
        Cookie: `token=${token.value}`,
      },
    });

    console.log("Server: API Response received", {
      success: response.data.success,
      teams: response.data.teams?.length || 0,
    });

    const data: MyTeamsResponse = await response.data;

    console.log("Server: API Response received");
    if (data.success) {
      console.log("Server: Teams loaded successfully");
      return data.teams;
    }
    return [];
  } catch (error) {
    console.error("Server: Error fetching user teams:", error);
    return [];
  }
}

export async function MyTeamsServer() {
  const teams = await getUserTeams();

  return <MyTeamsClient initialTeams={teams} />;
}
