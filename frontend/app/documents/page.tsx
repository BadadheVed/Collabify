import { Suspense } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { DocumentsServer } from "@/components/documents/DocumentServer";
import { DocumentsSkeleton } from "@/components/documents/Document-Skeleton";

export default function DocumentsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}

        {/* Documents Content with SSR */}
        <Suspense fallback={<DocumentsSkeleton />}>
          <DocumentsServer />
        </Suspense>
      </div>
    </DashboardLayout>
  );
}
