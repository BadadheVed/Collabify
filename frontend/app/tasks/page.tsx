import { MyTasksServer } from "@/components/tasks/myTasksServer";
import { MyTasksSkeleton } from "@/components/tasks/myTasksSkeleton";
import { Suspense } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
export const dynamic = 'force-dynamic';
export default function TasksPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Tasks
            </h1>
            <p className="text-gray-400">
              Manage your assigned tasks and track progress
            </p>
          </div>
        </div>

        {/* My Tasks Section with SSR */}
        <div className="space-y-6">
          <Suspense fallback={<MyTasksSkeleton />}>
            <MyTasksServer />
          </Suspense>
        </div>
      </div>
    </DashboardLayout>
  );
}
