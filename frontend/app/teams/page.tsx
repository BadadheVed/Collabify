import { MyTeamsServer } from "@/components/teams/myTeamServer";
import { MyTeamsSkeleton } from "@/components/teams/myTeamSkeleton";
import { Suspense } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { InviteLinkClient } from "@/components/teams/InviteByLink";
import { CreateTeamClient } from "@/components/teams/CreateTeamClient";
import { TeamsClientWrapper } from "@/components/teams/TeamClientWrapper";
//import { useRouter } from "next/navigation";
export default function TeamsPage() {
  // const router = useRouter();
  // const handleTeamCreated = () => {
  //   router.refresh();
  // };
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Teams
            </h1>
            <p className="text-gray-400">
              Collaborate with your teams and manage members
            </p>
          </div>
          {/* <div className="flex items-center gap-3">
            <InviteLinkClient />
            <CreateTeamClient />
          </div> */}
          <TeamsClientWrapper />
        </div>

        {/* My Teams Section with SSR */}
        <div className="space-y-6">
          <Suspense fallback={<MyTeamsSkeleton />}>
            <MyTeamsServer />
          </Suspense>
        </div>
      </div>
    </DashboardLayout>
  );
}
