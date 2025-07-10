"use client";

import { InviteLinkClient } from "@/components/teams/InviteByLink";
import { CreateTeamClient } from "@/components/teams/CreateTeamClient";

export function TeamsClientWrapper() {
  const handleTeamCreated = () => {
    // Refresh the page to show the new team
    window.location.reload();
  };

  return (
    <div className="flex items-center gap-3">
      <InviteLinkClient />
      <CreateTeamClient onTeamCreated={handleTeamCreated} />
    </div>
  );
}
