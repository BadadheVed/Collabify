import { axiosInstance } from "@/axiosSetup/axios";

interface TileData {
  name: string;
  projects: number;
  teams: number;
  teamMembers: number;
  documents: number;
}

export class DashboardTileService {
  private static instance: DashboardTileService;
  private readonly STORAGE_KEY = "tileData";
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private listeners: Set<(data: TileData) => void> = new Set();

  static getInstance(): DashboardTileService {
    if (!DashboardTileService.instance) {
      DashboardTileService.instance = new DashboardTileService();
    }
    return DashboardTileService.instance;
  }

  // Check if we're in browser environment
  private isBrowser(): boolean {
    return (
      typeof window !== "undefined" && typeof sessionStorage !== "undefined"
    );
  }

  // Get cached data from sessionStorage
  private getCachedData(): { data: TileData; timestamp: number } | null {
    if (!this.isBrowser()) return null;

    try {
      const cached = sessionStorage.getItem(this.STORAGE_KEY);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (error) {
      console.error("Error reading from sessionStorage:", error);
    }
    return null;
  }

  // Set data in sessionStorage with timestamp
  private setCachedData(data: TileData): void {
    if (!this.isBrowser()) return;

    try {
      const cacheData = {
        data,
        timestamp: Date.now(),
      };
      sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.error("Error writing to sessionStorage:", error);
    }
  }

  // Check if cached data is still valid
  private isCacheValid(cachedItem: {
    data: TileData;
    timestamp: number;
  }): boolean {
    return Date.now() - cachedItem.timestamp < this.CACHE_DURATION;
  }

  // Fetch data from API
  private async fetchFromAPI(): Promise<TileData> {
    try {
      const response = await axiosInstance.get("/dashboard/tiledata");
      const data: TileData = {
        name: response.data.name,
        projects: response.data.projects,
        teams: response.data.teams,
        teamMembers: response.data.teamMembers,
        documents: response.data.documents,
      };
      return data;
    } catch (error) {
      console.error("Error fetching dashboard tile data:", error);
      throw error;
    }
  }

  // Main method to get tile data
  async getTileData(forceRefresh = false): Promise<TileData | null> {
    if (!forceRefresh) {
      const cached = this.getCachedData();
      if (cached && this.isCacheValid(cached)) {
        return cached.data;
      }
    }

    try {
      const data = await this.fetchFromAPI();
      this.setCachedData(data);
      this.notifyListeners(data);
      return data;
    } catch (error) {
      // Return cached data if available, even if expired
      const cached = this.getCachedData();
      if (cached) {
        return cached.data;
      }
      return null;
    }
  }

  // Method to update specific tile data without full refresh
  updateTileData(updates: Partial<TileData>): void {
    const cached = this.getCachedData();
    if (cached) {
      const updatedData = { ...cached.data, ...updates };
      this.setCachedData(updatedData);
      this.notifyListeners(updatedData);
    }
  }

  // Method to increment/decrement specific counters
  updateCounter(
    field: keyof Pick<
      TileData,
      "projects" | "teams" | "teamMembers" | "documents"
    >,
    increment: number
  ): void {
    const cached = this.getCachedData();
    if (cached) {
      const updatedData = {
        ...cached.data,
        [field]: Math.max(0, cached.data[field] + increment),
      };
      this.setCachedData(updatedData);
      this.notifyListeners(updatedData);
    }
  }

  // Clear cached data
  clearCache(): void {
    if (this.isBrowser()) {
      sessionStorage.removeItem(this.STORAGE_KEY);
    }
  }

  // Subscribe to data changes
  subscribe(callback: (data: TileData) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  // Notify all listeners about data changes
  private notifyListeners(data: TileData): void {
    this.listeners.forEach((callback) => callback(data));
  }

  // Get current cached data synchronously (for initial render)
  getCachedDataSync(): TileData | null {
    const cached = this.getCachedData();
    return cached ? cached.data : null;
  }
}
