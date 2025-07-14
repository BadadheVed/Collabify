// utils/dashboardUtils.ts
import { DashboardTileService } from "@/utils/dashboardTileservice";

// Utility functions to update dashboard tiles when activities happen
export class DashboardUtils {
  private static tileService = DashboardTileService.getInstance();

  // Call this when a new project is created
  static onProjectCreated() {
    this.tileService.updateCounter("projects", 1);
  }

  // Call this when a project is deleted
  static onProjectDeleted() {
    this.tileService.updateCounter("projects", -1);
  }

  // Call this when a new team is created
  static onTeamCreated() {
    this.tileService.updateCounter("teams", 1);
  }

  // Call this when a team is deleted
  static onTeamDeleted() {
    this.tileService.updateCounter("teams", -1);
  }

  // Call this when a new document is created
  static onDocumentCreated() {
    this.tileService.updateCounter("documents", 1);
  }

  // Call this when a document is deleted
  static onDocumentDeleted() {
    this.tileService.updateCounter("documents", -1);
  }

  // Call this when a team member is added
  static onTeamMemberAdded() {
    this.tileService.updateCounter("teamMembers", 1);
  }

  // Call this when a team member is removed
  static onTeamMemberRemoved() {
    this.tileService.updateCounter("teamMembers", -1);
  }

  // Call this when multiple items are updated at once
  static onBulkUpdate(updates: {
    projects?: number;
    teams?: number;
    documents?: number;
    teamMembers?: number;
  }) {
    Object.entries(updates).forEach(([field, increment]) => {
      if (increment !== undefined) {
        this.tileService.updateCounter(
          field as keyof typeof updates,
          increment
        );
      }
    });
  }

  // Call this to force refresh tile data from API
  static async refreshTileData() {
    return await this.tileService.getTileData(true);
  }

  // Call this to get current cached data
  static getCurrentTileData() {
    return this.tileService.getCachedDataSync();
  }

  // Call this to clear cached data (useful for logout)
  static clearCache() {
    this.tileService.clearCache();
  }

  // Subscribe to tile data changes (for components that need real-time updates)
  static subscribe(callback: (data: any) => void) {
    return this.tileService.subscribe(callback);
  }

  // Utility method to handle API responses that might affect tile data
  static handleAPIResponse(
    response: any,
    action: "created" | "deleted",
    type: "project" | "team" | "document" | "teamMember"
  ) {
    if (
      response.success ||
      response.status === 200 ||
      response.status === 201
    ) {
      const methodMap = {
        project: {
          created: this.onProjectCreated,
          deleted: this.onProjectDeleted,
        },
        team: {
          created: this.onTeamCreated,
          deleted: this.onTeamDeleted,
        },
        document: {
          created: this.onDocumentCreated,
          deleted: this.onDocumentDeleted,
        },
        teamMember: {
          created: this.onTeamMemberAdded,
          deleted: this.onTeamMemberRemoved,
        },
      };

      const method = methodMap[type]?.[action];
      if (method) {
        method.call(this);
      }
    }
  }
}
