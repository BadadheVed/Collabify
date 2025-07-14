// contexts/DashboardContext.tsx
"use client";

import { createContext, useContext, useCallback } from "react";

type RefreshHandler = () => Promise<void>;

interface DashboardContextType {
  registerRefreshHandler: (handler: RefreshHandler) => void;
  refreshTileData: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  let refreshHandler: RefreshHandler | null = null;

  const registerRefreshHandler = useCallback((handler: RefreshHandler) => {
    refreshHandler = handler;
  }, []);

  const refreshTileData = useCallback(async () => {
    if (refreshHandler) {
      await refreshHandler();
    }
  }, []);

  return (
    <DashboardContext.Provider value={{ registerRefreshHandler, refreshTileData }}>
      {children}
    </DashboardContext.Provider>
  );
}

export const useDashboardContext = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboardContext must be used within a DashboardProvider");
  }
  return context;
};