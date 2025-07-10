"use client";

import { useEffect, useState } from "react";
import { axiosInstance } from "@/axiosSetup/axios";

interface TileData {
  name: string;
  projects: number;
  teams: number;
  teamMembers: number;
  documents: number;
}

export function useDashboardTileData(): TileData | null {
  const [tileData, setTileData] = useState<TileData | null>(null);

  useEffect(() => {
    const cached = sessionStorage.getItem("tileData");

    if (cached) {
      setTileData(JSON.parse(cached));
    } else {
      axiosInstance
        .get("/dashboard/tiledata")
        .then((res) => {
          const data: TileData = {
            name: res.data.name,
            projects: res.data.projects,
            teams: res.data.teams,
            teamMembers: res.data.teamMembers,
            documents: res.data.documents,
          };
          sessionStorage.setItem("tileData", JSON.stringify(data));
          setTileData(data);
        })
        .catch((err) => {
          console.error("Error fetching dashboard tile data", err);
        });
    }
  }, []);

  return tileData;
}
