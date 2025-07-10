import { Suspense } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { NotificationsPageClient } from './components/notifications-page-client';
import { Card } from '@/components/ui/card';
import { Bell, Settings, Filter, CheckCheck, Trash2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Loading skeleton for notifications page
function NotificationsPageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 bg-white/10 rounded animate-pulse w-48 mb-2" />
          <div className="h-4 bg-white/10 rounded animate-pulse w-64" />
        </div>
        <div className="flex gap-3">
          <div className="h-10 bg-white/10 rounded animate-pulse w-32" />
          <div className="h-10 bg-white/10 rounded animate-pulse w-24" />
        </div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="backdrop-blur-xl bg-white/5 border border-white/10 p-6 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-xl animate-pulse" />
              <div className="flex-1">
                <div className="h-8 bg-white/10 rounded animate-pulse w-16 mb-2" />
                <div className="h-4 bg-white/10 rounded animate-pulse w-24" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Notifications List Skeleton */}
      <Card className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl">
        <div className="p-6 border-b border-white/10">
          <div className="h-6 bg-white/10 rounded animate-pulse w-32" />
        </div>
        <div className="divide-y divide-white/10">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-6 flex items-start gap-4">
              <div className="w-10 h-10 bg-white/10 rounded-lg animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-white/10 rounded animate-pulse w-3/4" />
                <div className="h-3 bg-white/10 rounded animate-pulse w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default function NotificationsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Notifications
            </h1>
            <p className="text-gray-400">Stay updated with your team activities and important updates</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="border-white/10 text-gray-400 hover:text-white hover:border-cyan-500 backdrop-blur-sm hover:bg-white/10 transition-all duration-200 ease-out hover:scale-105"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button
              variant="outline"
              className="border-white/10 text-gray-400 hover:text-white hover:border-cyan-500 backdrop-blur-sm hover:bg-white/10 transition-all duration-200 ease-out hover:scale-105"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Notifications Content */}
        <Suspense fallback={<NotificationsPageSkeleton />}>
          <NotificationsPageClient />
        </Suspense>
      </div>
    </DashboardLayout>
  );
}