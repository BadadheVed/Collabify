import { Card } from "@/components/ui/card";
import { UserPlus, User, Building, Calendar } from "lucide-react";

export function TeamInviteSkeleton() {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-600/20 rounded-2xl blur opacity-50" />
      <Card className="relative backdrop-blur-xl bg-gray-800/90 border border-white/20 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

        {/* Header Skeleton */}
        <div className="relative z-10 p-6 border-b border-white/10 text-center">
          <div className="w-16 h-16 rounded-full bg-white/10 animate-pulse flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-8 h-8 text-gray-600" />
          </div>
          <div className="h-8 bg-white/10 rounded animate-pulse w-48 mx-auto mb-2" />
          <div className="h-4 bg-white/10 rounded animate-pulse w-32 mx-auto" />
        </div>

        {/* Content Skeleton */}
        <div className="relative z-10 p-6 space-y-6">
          {/* Team Info Skeleton */}
          <div className="text-center space-y-4">
            <div className="h-6 bg-white/10 rounded animate-pulse w-40 mx-auto" />
            <div className="h-4 bg-white/10 rounded animate-pulse w-32 mx-auto" />
            <div className="h-8 bg-white/10 rounded-full animate-pulse w-24 mx-auto" />
          </div>

          {/* Details Skeleton */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
              <User className="w-5 h-5 text-gray-600 animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-white/10 rounded animate-pulse w-16" />
                <div className="h-4 bg-white/10 rounded animate-pulse w-32" />
                <div className="h-3 bg-white/10 rounded animate-pulse w-40" />
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
              <Building className="w-5 h-5 text-gray-600 animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-white/10 rounded animate-pulse w-12" />
                <div className="h-4 bg-white/10 rounded animate-pulse w-36" />
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
              <Calendar className="w-5 h-5 text-gray-600 animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-white/10 rounded animate-pulse w-24" />
                <div className="h-4 bg-white/10 rounded animate-pulse w-44" />
                <div className="h-3 bg-white/10 rounded animate-pulse w-20" />
              </div>
            </div>
          </div>

          {/* Actions Skeleton */}
          <div className="flex gap-3 pt-4">
            <div className="flex-1 h-10 bg-white/10 rounded animate-pulse" />
            <div className="flex-1 h-10 bg-white/10 rounded animate-pulse" />
          </div>
        </div>
      </Card>
    </div>
  );
}
