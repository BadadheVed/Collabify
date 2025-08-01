import { Card } from "@/components/ui/card";
import { Clock, Users } from "lucide-react";

export function MyProjectsSkeleton() {
  return (
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
              <div className="w-5 h-5 bg-white/10 rounded animate-pulse" />
            </div>

            {/* Content skeleton */}
            <div className="space-y-2">
              <div className="h-6 bg-white/10 rounded animate-pulse w-3/4" />
              <div className="h-4 bg-white/10 rounded animate-pulse w-full" />
              <div className="h-4 bg-white/10 rounded animate-pulse w-5/6" />
            </div>

            {/* Footer skeleton */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4 text-gray-600 animate-pulse" />
                <div className="h-4 bg-white/10 rounded animate-pulse w-16" />
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-gray-600 animate-pulse" />
                <div className="h-4 bg-white/10 rounded animate-pulse w-20" />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
