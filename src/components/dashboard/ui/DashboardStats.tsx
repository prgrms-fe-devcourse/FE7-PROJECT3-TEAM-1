"use client";

import { useMemo, useEffect } from "react";
import { Lightbulb } from "lucide-react";
import type { DashboardData } from "@/components/dashboard/type/dashboard";
import DashboardCards from "@/components/dashboard/ui/DashboardCards";

interface DashboardStatsProps {
  data: DashboardData;
}

export default function DashboardStats({ data }: DashboardStatsProps) {
  const formatLastUpdated = (lastUpdated: string) => {
    const match = lastUpdated.match(/^(.+일)\s+(.+)$/);
    if (match) {
      return {
        date: match[1], // 날짜
        time: match[2], // 시간
      };
    }
    // 에러 발생 시 기존 데이터 반환 ("YYYY년 MM월 DD일 HH:MM")
    return {
      date: lastUpdated,
      time: "",
    };
  };

  // 가장 최근 데이터 추출 및 메모이제이션 (참조 변경 방지)
  const latestData = useMemo(() => {
    if (!data.chartData || data.chartData.length === 0) {
      return null;
    }
    return data.chartData[data.chartData.length - 1];
  }, [data.chartData]);

  // 최근 데이터의 값들을 문자열로 직렬화하여 의존성으로 사용 (실제 값 변경 감지)
  const latestDataKey = useMemo(() => {
    if (!latestData) return "";
    return `${latestData.up}-${latestData.down}-${latestData.hold}-${latestData.day}`;
  }, [latestData]);

  // chartData를 기반으로 오늘의 감정 상태 메시지 생성 (메모이제이션)
  const marketMessage = useMemo(() => {
    if (!latestData) {
      return "데이터를 분석 중입니다. 잠시만 기다려주세요!";
    }

    const { up, down, hold, day } = latestData;
    const total = day;

    if (total === 0) {
      return "아직 오늘의 감정 데이터가 없습니다. 첫 감정을 공유해보세요!";
    }

    const upRatio = up / total;
    const downRatio = down / total;
    const holdRatio = hold / total;

    const maxValue = Math.max(up, down, hold);

    // UP이 가장 많은 경우
    if (up === maxValue && upRatio >= 0.4) {
      if (upRatio >= 0.7) {
        return "개미들은 오늘 강한 상승장을 경험하고 있습니다. 매우 긍정적인 분위기네요!";
      } else if (upRatio >= 0.5) {
        return "개미들은 오늘 상승장을 경험하고 있습니다. 긍정적인 신호가 많네요!";
      } else {
        return "개미들은 오늘 소폭 상승장을 경험하고 있습니다. 긍정적인 신호가 보입니다!";
      }
    }
    // DOWN이 가장 많은 경우
    else if (down === maxValue && downRatio >= 0.4) {
      if (downRatio >= 0.7) {
        return "개미들은 오늘 하락장을 경험하고 있습니다. 서로를 응원하며 함께 극복해봐요!";
      } else if (downRatio >= 0.5) {
        return "개미들은 오늘 소폭 하락장을 경험하고 있습니다. 서로의 이야기를 들어주는 것이 중요해요!";
      } else {
        return "개미들은 오늘 약간의 하락세를 보이고 있습니다. 함께 응원하며 극복해봐요!";
      }
    }
    // HOLD가 가장 많은 경우
    else if (hold === maxValue && holdRatio >= 0.4) {
      if (holdRatio >= 0.7) {
        return "개미들은 오늘 안정적인 감정 상태를 유지하고 있습니다. 차분한 하루네요!";
      } else if (holdRatio >= 0.5) {
        return "개미들은 오늘 대체로 안정적인 감정을 보이고 있습니다. 평온한 하루입니다!";
      } else {
        return "개미들은 오늘 대체로 안정적인 감정 상태입니다. 차분한 분위기네요!";
      }
    }
    // 나머지 비율이 낮은 경우
    else {
      if (up > down && up > hold) {
        return "개미들은 오늘 다양한 감정을 경험하고 있으며, 상승 감정이 약간 우세합니다!";
      } else if (down > up && down > hold) {
        return "개미들은 오늘 다양한 감정을 경험하고 있으며, 하락 감정이 약간 우세합니다. 서로를 응원해요!";
      } else {
        return "개미들은 오늘 다양한 감정을 경험하고 있으며, 대체로 안정적인 상태입니다!";
      }
    }
  }, [latestData]);

  // 디버깅용 로그 (추후 삭제 예정)
  useEffect(() => {
    if (latestDataKey) {
      if (latestData && process.env.NODE_ENV === "development") {
        const { up, down, hold, day } = latestData;
        const total = day;
        if (total > 0) {
          const upRatio = up / total;
          const downRatio = down / total;
          const holdRatio = hold / total;
          const maxValue = Math.max(up, down, hold);

          console.log("감정 비율 분석:", {
            upRatio: upRatio.toFixed(2),
            downRatio: downRatio.toFixed(2),
            holdRatio: holdRatio.toFixed(2),
            maxValue,
          });
        }
      }
    }
  }, [latestDataKey, latestData]);

  // 날짜 포맷팅도 메모이제이션
  const { date, time } = useMemo(() => formatLastUpdated(data.lastUpdated), [data.lastUpdated]);

  return (
    <>
      {/* 시장 요약 카드 */}
      <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 min-h-40 flex items-center dark:bg-[#141d2d]">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full">
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 p-3 rounded-lg dark:bg-[#1e2939]">
              <Lightbulb className="w-10 h-10 text-blue-600 dark:text-indigo-500" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-1 dark:text-gray-300">
                오늘의 감정 시장지수 요약
              </h2>
              <p className="text-gray-600 text-md md:text-lg dark:text-gray-400">{marketMessage}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm sm:text-md md:text-lg text-gray-500 mb-1 dark:text-gray-300">
              최근 업데이트
            </p>
            <div className="text-sm sm:text-md md:text-lg font-medium text-gray-700 dark:text-gray-400">
              <p>{date}</p>
              {time && <p>{time}</p>}
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
