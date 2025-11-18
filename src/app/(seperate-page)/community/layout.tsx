import TodayFeels from "@/components/common/TodayFeels";
import TrendTags from "@/components/common/TrendTags";
import TrendTagsSkeleton from "@/components/skeleton/TrendTagsSkeleton";
import { Suspense } from "react";
import { twMerge } from "tailwind-merge";

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={twMerge("flex h-full", "flex-col gap-10", "xl:flex-row xl:gap-6")}>
      <div className="flex-1 flex flex-col gap-6">{children}</div>
      <div className={twMerge("w-full", "xl:min-w-64 xl:max-w-64")}>
        <div className={twMerge("flex flex-col gap-4", "w-full top-25", "xl:sticky xl:top-6")}>
          <Suspense fallback={<TrendTagsSkeleton />}>
            <TrendTags />
            <TodayFeels />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
