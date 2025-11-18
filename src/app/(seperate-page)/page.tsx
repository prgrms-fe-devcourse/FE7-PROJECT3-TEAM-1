import { Suspense } from "react";
import { DashboardContent, DashboardSkeleton } from "@/components/dashboard";

export default async function Page() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}
