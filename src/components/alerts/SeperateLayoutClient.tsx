"use client";

import Header from "@/components/common/Header";
import AlarmProvider from "@/components/alerts/AlarmProvider";
import { User } from "@/types/database";

export default function SeperateLayoutClient({
  children,
  userProfile,
  todayScore,
}: {
  children: React.ReactNode;
  userProfile: User | null;
  todayScore: { value: number; finalResult: number };
}) {
  return (
    <div className="flex min-w-full min-h-screen">
      {/*  전역 실시간 알림 Provider */}
      <AlarmProvider />

      <div className="py-6 pl-4 w-[18%] min-w-[180px] shrink-0 sticky top-0 h-screen overflow-y-auto">
        <Header initialProfile={userProfile} todayScore={todayScore} />
      </div>

      <main className="flex-1">{children}</main>
    </div>
  );
}
