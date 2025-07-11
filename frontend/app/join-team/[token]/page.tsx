import { Suspense } from "react";
import { TeamInviteClient } from "@/components/invites/team-invite-client";
import { TeamInviteSkeleton } from "@/components/invites/team-invite-skeleton";

interface TeamInvitePageProps {
  params: {
    token: string;
  };
}

export default function TeamInvitePage({ params }: TeamInvitePageProps) {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative w-full max-w-md">
        <Suspense fallback={<TeamInviteSkeleton />}>
          <TeamInviteClient inviteToken={params.token} />
        </Suspense>
      </div>
    </div>
  );
}
