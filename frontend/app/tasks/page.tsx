
import { MyTasksSkeleton } from "@/components/tasks/myTasksSkeleton";
import { Suspense } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { MyTasksClient } from "@/components/tasks/myTasksClient";
export const dynamic = "force-dynamic";
export default function TasksPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}

        {/* My Tasks Section with SSR */}
        <div className="space-y-6">
          <Suspense fallback={<MyTasksSkeleton />}>
            <MyTasksClient />
          </Suspense>
        </div>
      </div>
    </DashboardLayout>
  );
}
