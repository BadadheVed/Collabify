// hooks/useUserInfo.ts
"use client";

import { useEffect, useState } from "react";
import { axiosInstance } from "@/axiosSetup/axios";

interface UserInfo {
  name: string;
  email: string;
}

export function useUserInfo(): UserInfo | null {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    const cached = sessionStorage.getItem("userInfo");

    if (cached) {
      setUserInfo(JSON.parse(cached));
    } else {
      axiosInstance
        .get("/dashboard/tiledata")
        .then((res) => {
          const data = {
            name: res.data.name,
            email: res.data.email,
          };
          sessionStorage.setItem("userInfo", JSON.stringify(data));
          setUserInfo(data);
        })
        .catch((err) => {
          console.error("Error fetching user info", err);
        });
    }
  }, []);

  return userInfo;
}
