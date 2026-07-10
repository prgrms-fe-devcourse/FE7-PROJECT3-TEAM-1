"use client";

import { useEffect } from "react";
import { Lightbulb } from "lucide-react";
import type { DashboardData } from "@/components/dashboard/type/dashboard";
import DashboardCards from "@/components/dashboard/ui/DashboardCards";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

interface DashboardStatsProps {
  data: DashboardData;
}

export default function DashboardStats({ data }: DashboardStatsProps) {
  const getFormattedUpdate = (lastUpdated?: string) => {
    if (!lastUpdated) return { date: "데이터 없음", time: "" };

    const seoulTime = dayjs(lastUpdated).tz("Asia/Seoul");

    if (!seoulTime.isValid()) {
      return { date: lastUpdated, time: "" }; // 데이터가 없는 경우
    }

    return {
      date: seoulTime.format("YYYY년 MM월 DD일"),
      time: seoulTime.format("HH:mm:ss"),
    };
  };

  const formattedUpdate = getFormattedUpdate(data.lastUpdated);

  const latestData = data.chartData?.[data.chartData.length - 1] ?? null;

  const getMarketMessage = () => {
    if (!latestData || latestData.day === 0) {
      return "아직 오늘의 감정 데이터가 없습니다. 첫 감정을 공유해보세요!";
    }

    const { up, down, hold, day: total } = latestData;
    const ratios = {
      up: up / total,
      down: down / total,
      hold: hold / total,
    };
    const maxValue = Math.max(up, down, hold);

    if (up === maxValue && ratios.up >= 0.4) {
      if (ratios.up >= 0.7)
        return "개미들은 오늘 강한 상승장을 경험하고 있습니다. 매우 긍정적인 분위기네요!";
      return "개미들은 오늘 상승 흐름을 타고 있습니다. 긍정적인 신호가 많네요!";
    }
    if (down === maxValue && ratios.down >= 0.4) {
      if (ratios.down >= 0.7)
        return "개미들은 오늘 하락장을 경험하고 있습니다. 서로를 응원하며 함께 극복해봐요!";
      return "개미들은 오늘 다소 하락세를 보이고 있습니다. 함께 응원하며 극복해봐요!";
    }
    if (hold === maxValue && ratios.hold >= 0.4) {
      return "개미들은 오늘 안정적인 감정 상태를 유지하고 있습니다. 차분한 하루네요!";
    }

    return "개미들은 오늘 다양한 감정을 경험하고 있으며, 대체로 안정적인 상태입니다!";
  };

  const marketMessage = getMarketMessage();

  // 디버깅용 로그
  useEffect(() => {
    if (latestData && process.env.NODE_ENV === "development") {
      const { up, down, hold, day } = latestData;
      const total = day;
      if (total > 0) {
        const upRatio = up / total;
        const downRatio = down / total;
        const holdRatio = hold / total;
        const maxValue = Math.max(up, down, hold);

        if (process.env.NODE_ENV === "development") {
          console.log("감정 비율 분석:", {
            upRatio: upRatio.toFixed(2),
            downRatio: downRatio.toFixed(2),
            holdRatio: holdRatio.toFixed(2),
            maxValue,
          });
        }
      }
    }
  }, [latestData]);

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 min-h-40 flex items-center border border-slate-300 dark:bg-[#141d2b] dark:border-[#364153]">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full">
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 p-3 rounded-lg dark:bg-[#1e2939]">
              <Lightbulb className="w-8 h-8 text-blue-600 dark:text-indigo-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-1 dark:text-gray-300">
                오늘의 감정 시장지수 요약
              </h2>
              <p className="text-gray-600 text-md dark:text-gray-400">{marketMessage}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-md text-gray-500 mb-1 dark:text-gray-300">최근 업데이트</p>
            <div className="text-md font-medium text-gray-700 dark:text-gray-400">
              <p>{formattedUpdate.date}</p>
              {formattedUpdate.time && <p>{formattedUpdate.time}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* 하단 3개 카드 */}
      <DashboardCards
        topRising={data.topRising}
        topFalling={data.topFalling}
        communityStats={data.communityStats}
      />
    </>
  );
}
