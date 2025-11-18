"use client";

import { memo } from "react";
import { TrendingUp, TrendingDown, Antenna } from "lucide-react";
import { EmptyState } from "@/components/dashboard/components/EmptyState";

interface DashboardCardsProps {
  topRising: Array<{ name: string; change: string }>;
  topFalling: Array<{ name: string; change: string }>;
  communityStats: {
    newPosts: string;
    comments: string;
    currentUsers: string;
  };
}

const DashboardCards = memo(function DashboardCards({
  topRising,
  topFalling,
  communityStats,
}: DashboardCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      {/* 상승 감정 */}
      <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 dark:bg-[#141c2c]">
        <div className="flex items-center justify-between gap-2 mb-4 select-none">
          <span className="text-lg font-bold text-gray-800 dark:text-gray-300">
            상승 감정 TOP 3
          </span>
          <TrendingUp className="w-5 h-5 text-green-600" />
        </div>
        {topRising.length > 0 ? (
          <ul className="space-y-3">
            {topRising.map((item, index) => (
              <li
                key={index}
                className="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
              >
                <span className="text-gray-700 dark:text-gray-400">{item.name}</span>
                <span className="text-green-600 font-semibold select-none">{item.change}</span>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState message="상승 감정 데이터가 없습니다" />
        )}
      </div>

      {/* 하락 감정 */}
      <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 dark:bg-[#141c2c]">
        <div className="flex items-center justify-between gap-2 mb-4 select-none">
          <span className="text-lg font-bold text-gray-800 dark:text-gray-300">
            하락 감정 TOP 3
          </span>
          <TrendingDown className="w-5 h-5 text-red-600" />
        </div>
        {topFalling.length > 0 ? (
          <ul className="space-y-3">
            {topFalling.map((item, index) => (
              <li
                key={index}
                className="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
              >
                <span className="text-gray-700 dark:text-gray-400">{item.name}</span>
                <span className="text-red-600 font-semibold select-none">{item.change}</span>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState message="하락 감정 데이터가 없습니다" />
        )}
      </div>

      {/* 커뮤니티 활동 */}
      <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 dark:bg-[#141c2c]">
        <div className="flex items-center justify-between gap-2 mb-4 select-none">
          <span className="text-lg font-bold text-gray-800 dark:text-gray-300">커뮤니티 활동</span>
          <Antenna className="w-5 h-5 text-blue-600" />
        </div>
        <ul className="space-y-3">
          <li className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
            <span className="text-gray-700 dark:text-gray-400">새로운 글</span>
            <span className="text-indigo-400 font-semibold select-none">
              {communityStats.newPosts}
            </span>
          </li>
          <li className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
            <span className="text-gray-700 dark:text-gray-400">새로운 댓글</span>
            <span className="text-indigo-400 font-semibold select-none">
              {communityStats.comments}
            </span>
          </li>
          <li className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
            <span className="text-gray-700 dark:text-gray-400">현재 접속자</span>
            <span className="text-indigo-400 font-semibold select-none">
              {communityStats.currentUsers}
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
});

export default DashboardCards;
