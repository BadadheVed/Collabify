import { Card } from "@/components/ui/card";
import { Clock, Users, User } from "lucide-react";

export function DocumentsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 bg-white/10 rounded animate-pulse w-48 mb-2" />
          <div className="h-4 bg-white/10 rounded animate-pulse w-64" />
        </div>
        <div className="h-10 bg-white/10 rounded animate-pulse w-32" />
      </div>

      {/* Filters Skeleton */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <div className="h-10 bg-white/10 rounded animate-pulse" />
        </div>
        <div className="h-10 bg-white/10 rounded animate-pulse w-24" />
        <div className="h-10 bg-white/10 rounded animate-pulse w-20" />
      </div>

      {/* Documents Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card
            key={i}
            className="backdrop-blur-xl bg-white/5 border border-white/10 p-6 rounded-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl pointer-events-none" />
            <div className="relative z-10 space-y-4">
              {/* Header skeleton */}
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-lg bg-white/10 animate-pulse" />
                <div className="w-16 h-6 bg-white/10 rounded-full animate-pulse" />
              </div>

              {/* Content skeleton */}
              <div className="space-y-2">
                <div className="h-5 bg-white/10 rounded animate-pulse w-3/4" />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Users className="w-3 h-3 text-gray-600 animate-pulse" />
                    <div className="h-4 bg-white/10 rounded animate-pulse w-24" />
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-3 h-3 text-gray-600 animate-pulse" />
                    <div className="h-4 bg-white/10 rounded animate-pulse w-20" />
                  </div>
                </div>
              </div>

              {/* Footer skeleton */}
              <div className="flex items-center justify-between text-sm pt-2 border-t border-white/10">
                <div className="h-4 bg-white/10 rounded animate-pulse w-12" />
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-gray-600 animate-pulse" />
                  <div className="h-4 bg-white/10 rounded animate-pulse w-16" />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
