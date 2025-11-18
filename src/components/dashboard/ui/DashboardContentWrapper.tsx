"use client";

import { useEffect, useState, useCallback } from "react";
import { RefreshCcw } from "lucide-react";
import { fetchDashboardData } from "@/components/dashboard/model/dashboard";
import type { DashboardData } from "@/components/dashboard/type/dashboard";
import DashboardChart from "@/components/dashboard/ui/DashboardChart";
import DashboardStats from "@/components/dashboard/ui/DashboardStats";
import { usePresenceContext } from "@/contexts/PresenceContext";
import { useUserName, useIsLoggedIn } from "@/store/useStore";

const POLLING_INTERVAL = 5 * 60 * 1000; // (1000ms = 1 second) | 초기값 5분

interface DashboardContentWrapperProps {
  initialData: DashboardData;
}

export default function DashboardContentWrapper({ initialData }: DashboardContentWrapperProps) {
  // 실시간 접속자 수 (전역 Context에서 가져옴)
  const { currentUsers } = usePresenceContext();

  // 초기 데이터는 이미 currentUsers가 포함된 상태로 받음
  const [data, setData] = useState<DashboardData>(initialData);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 사용자 정보 (Store에서 가져옴)
  const userName = useUserName();
  const isLoggedIn = useIsLoggedIn();

  const loadData = useCallback(
    async (showLoading = false) => {
      try {
        if (showLoading) {
          setIsRefreshing(true);
        }
        // 실시간 접속자 수를 파라미터로 전달
        const newData = await fetchDashboardData(currentUsers || 1);
        setData(newData);
      } catch (error) {
        console.error("데이터 로드 실패:", error);
      } finally {
        if (showLoading) {
          setIsRefreshing(false);
        }
      }
    },
    [currentUsers],
  );

  // 현재 접속자 수가 변경될 때마다 데이터 업데이트
  useEffect(() => {
    setData((prevData) => ({
      ...prevData,
      communityStats: {
        ...prevData.communityStats,
        currentUsers: `${currentUsers || 1}명`,
      },
    }));
  }, [currentUsers]);

  // 수동 새로고침
  const handleRefresh = useCallback(() => {
    loadData(true);
  }, [loadData]);

  // 자동 새로고침
  useEffect(() => {
    const intervalId = setInterval(() => {
      loadData(true);
    }, POLLING_INTERVAL);

    return () => clearInterval(intervalId);
  }, [loadData]);

  return (
    <div className="w-full h-full relative">
      <div className="w-full space-y-6">
        {/* 상단 섹션 */}
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 dark:bg-[#141c2c]">
          <span className="text-2xl md:text-3xl font-bold text-gray-800 mb-16 p-4 block dark:text-gray-300">
            {!isLoggedIn
              ? "안녕하세요, 로그인을 해주세요."
              : userName
                ? `안녕하세요, ${userName}님`
                : "안녕하세요!"}
          </span>
          <DashboardChart chartData={data.chartData} />
        </div>
        {/* 하단 부분*/}
        <DashboardStats data={data} />
      </div>

      {/* 새로고침 버튼 */}
      <button
        onClick={handleRefresh}
        disabled={isRefreshing}
        className="fixed bottom-8 right-8 z-50 bg-white hover:bg-white disabled:bg-gray-200 text-white dark:bg-[#313b4b] dark:hover:bg-[#141d2b] dark:disabled:bg-[#364153] rounded-full p-4 shadow-lg transition-all duration-200 hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center group"
        aria-label="새로고침"
      >
        <RefreshCcw
          className={`w-6 h-6 transition-transform duration-500 text-black dark:text-slate-300 ${isRefreshing ? "animate-spin" : "group-hover:rotate-180"}`}
        />
      </button>
    </div>
  );
}
