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
    <div className="flex min-w-full h-screen overflow-hidden">
      {/*  전역 실시간 알림 Provider */}
      <AlarmProvider />

      <Header initialProfile={userProfile} todayScore={todayScore} />
      <main
        id="main-scroll-container"
        className="flex-1 p-6 pt-25 xl:pt-6 overflow-y-auto overscroll-y-none"
      >
        {children}
      </main>
    </div>
  );
}
