import TodayFeels from "@/components/common/TodayFeels";
import TrendTags from "@/components/common/TrendTags";
import TrendTagsSkeleton from "@/components/skeleton/TrendTagsSkeleton";
import { Suspense } from "react";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "커뮤니티",
  description:
    "감정을 공유하고 소통하는 커뮤니티 공간입니다. 다양한 게시글을 확인하고 참여해보세요.",
  openGraph: {
    title: "커뮤니티 - UPDOWN",
    description: "감정을 공유하고 소통하는 커뮤니티 공간입니다.",
  },
};

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-10 xl:flex-row xl:gap-6 w-full">
      <div className="flex-1 flex flex-col gap-6">{children}</div>
      <div className="w-full xl:min-w-64 xl:max-w-64">
        <div className="flex flex-col gap-4 w-full xl:sticky xl:top-0">
          <Suspense fallback={<TrendTagsSkeleton />}>
            <TrendTags />
            <TodayFeels />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
