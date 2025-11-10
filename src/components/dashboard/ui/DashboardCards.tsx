"use client";

import { TrendingUp, TrendingDown, Users } from "lucide-react";

interface DashboardCardsProps {
  topRising: Array<{ name: string; change: string }>;
  topFalling: Array<{ name: string; change: string }>;
  communityStats: {
    newPosts: string;
    comments: string;
    currentUsers: string;
  };
}

type TestProps = {
  name: string;
  change: string;
};

export default function DashboardCards({
  topRising,
  topFalling,
  communityStats,
}: DashboardCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      {/* 상승 주식 */}
      <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-bold text-gray-800">상승 주식 TOP 3</h3>
        </div>
        <ul className="space-y-3">
          {topRising.map((item, index) => (
            <li
              key={index}
              className="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
            >
              <span className="text-gray-700">{item.name}</span>
              <span className="text-green-600 font-semibold">{item.change}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 하락 주식 */}
      <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingDown className="w-5 h-5 text-red-600" />
          <h3 className="text-lg font-bold text-gray-800">하락 주식 TOP 3</h3>
        </div>
        <ul className="space-y-3">
          {topFalling.map((item, index) => (
            <li
              key={index}
              className="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
            >
              <span className="text-gray-700">{item.name}</span>
              <span className="text-red-600 font-semibold">{item.change}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 커뮤니티 활동 */}
      <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-bold text-gray-800">커뮤니티 활동</h3>
        </div>
        <ul className="space-y-3">
          <li className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
            <span className="text-gray-700">새로운 글</span>
            <span className="text-gray-800 font-semibold">{communityStats.newPosts}</span>
          </li>
          <li className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
            <span className="text-gray-700">댓글</span>
            <span className="text-gray-800 font-semibold">{communityStats.comments}</span>
          </li>
          <li className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
            <span className="text-gray-700">현재 접속자</span>
            <span className="text-gray-800 font-semibold">{communityStats.currentUsers}</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
