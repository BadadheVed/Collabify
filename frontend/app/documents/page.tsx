import { Suspense } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

import { DocumentsSkeleton } from "@/components/documents/Document-Skeleton";
import { DocumentsClient } from "@/components/documents/DocumentClient";
export const dynamic = "force-dynamic";
export default function DocumentsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}

        {/* Documents Content with SSR */}
        <Suspense fallback={<DocumentsSkeleton />}>
          <DocumentsClient />
        </Suspense>
      </div>
    </DashboardLayout>
  );
}
