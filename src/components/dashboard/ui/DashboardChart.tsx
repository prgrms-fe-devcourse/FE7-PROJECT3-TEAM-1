"use client";

import { useMemo, useState, useEffect } from "react";
import {
  LineChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import type { ChartDataPoint } from "@/components/dashboard/type/dashboard";

type Period = "3일" | "1주" | "2주" | "All";

interface DashboardChartProps {
  chartData: ChartDataPoint[];
}

// 커스텀 툴팁 컴포넌트
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
  }>;
  label?: string | number;
}

const formatKoreanDate = (isoString: string) => {
  const date = new Date(isoString);
  const weekdays = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
  return `${date.getMonth() + 1}월 ${date.getDate()}일 ${weekdays[date.getDay()]}`;
};

const CustomTooltip = ({
  active,
  payload,
  label,
  chartData,
}: CustomTooltipProps & { chartData: ProcessedPoint[] }) => {
  if (active && payload && payload.length) {
    const index = typeof label === "number" ? Math.round(label) : NaN;
    const data =
      Number.isFinite(index) && index >= 0 && index < chartData.length
        ? chartData[index]
        : chartData.find((d) => d.date === label);
    if (data) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-xl z-50 dark:bg-[#1e2939] dark:border-[#374151]">
          <p className="font-semibold text-sm mb-3 text-gray-800 dark:text-gray-300">
            {formatKoreanDate(data.date)}
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
              <span className="text-sm text-gray-700 font-medium dark:text-gray-400">
                UP {data.up}
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
              <span className="text-sm text-gray-700 font-medium dark:text-gray-400">
                DOWN {data.down}
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-black"></div>
              <span className="text-sm text-gray-700 font-medium dark:text-gray-400">
                HOLD {data.hold}
              </span>
            </div>
          </div>
        </div>
      );
    }
  }
  return null;
};

// 커스텀 X축 틱 컴포넌트 (2줄 표시)
interface CustomTickProps {
  x?: number;
  y?: number;
  payload?: {
    value: number;
  };
}

type ProcessedPoint = ChartDataPoint & { index: number };

const CustomTick = ({
  x = 0,
  y = 0,
  payload,
  chartData,
  isDarkMode,
}: CustomTickProps & { chartData: ProcessedPoint[]; isDarkMode: boolean }) => {
  if (!payload || chartData.length === 0) return null;

  const index = Math.round(payload.value);
  const data = chartData[index];
  if (!data) return null;

  const date = new Date(data.date);
  const line1 = `${date.getMonth() + 1}월 ${date.getDate()}일`;
  const line2 = `${data.weekday}요일`;

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={12}
        textAnchor="middle"
        fill={isDarkMode ? "#9ca3af" : "#6b7280"}
        fontSize={11}
      >
        <tspan x={0} dy="0">
          {line1}
        </tspan>
        <tspan x={0} dy="13">
          {line2}
        </tspan>
      </text>
    </g>
  );
};

export default function DashboardChart({ chartData }: DashboardChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("1주");
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 다크 모드 감지
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };

    checkDarkMode();

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // 데이터 정렬 및 메모이제이션
  const sortedData = useMemo(
    () => [...chartData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [chartData],
  );

  // 데이터 필터링
  const filteredData = useMemo(() => {
    if (selectedPeriod === "All") {
      return sortedData;
    }

    const last = sortedData.at(-1);
    if (!last) return [];

    const lastDate = new Date(last.date);
    lastDate.setHours(0, 0, 0, 0);

    const days =
      selectedPeriod === "3일"
        ? 3
        : selectedPeriod === "1주"
          ? 7
          : selectedPeriod === "2주"
            ? 14
            : 30;
    const threshold = new Date(lastDate);
    threshold.setDate(threshold.getDate() - (days - 1));

    return sortedData.filter((point) => {
      const current = new Date(point.date);
      current.setHours(0, 0, 0, 0);
      return current.getTime() >= threshold.getTime();
    });
  }, [selectedPeriod, sortedData]);

  // 데이터 필터링
  const processedData = useMemo(
    () => filteredData.map((point, index) => ({ ...point, index })),
    [filteredData],
  );

  const [hoveredOverride, setHoveredOverride] = useState<number | null>(null);
  const defaultHover = processedData.at(-1)?.index ?? null;
  const hoveredDate = useMemo(() => {
    if (
      hoveredOverride !== null &&
      processedData.some((point) => point.index === hoveredOverride)
    ) {
      return hoveredOverride;
    }
    return defaultHover;
  }, [hoveredOverride, processedData, defaultHover]);

  const tickValues = useMemo(() => {
    if (processedData.length === 0) return [];
    return processedData.map((point) => point.index);
  }, [processedData]);

  // Y축 동적 할당
  const yAxisConfig = useMemo(() => {
    if (processedData.length === 0) {
      return {
        domain: [0, 10] as [number, number],
        ticks: [0, 5, 10],
      };
    }

    // 최대값 검색
    const maxValue = Math.max(
      ...processedData.map((point) => Math.max(point.up, point.down, point.hold)),
    );

    // 최대값 없을 경우 기본 값 할당
    if (maxValue === 0) {
      return {
        domain: [0, 10] as [number, number],
        ticks: [0, 5, 10],
      };
    }

    // 최대값 설정
    const maxDomain = Math.ceil(maxValue * 1.2);

    // 적절한 간격 계산 (최대값에 따라)
    let tickInterval: number;
    if (maxDomain <= 10) {
      tickInterval = 2;
    } else if (maxDomain <= 20) {
      tickInterval = 5;
    } else if (maxDomain <= 50) {
      tickInterval = 10;
    } else if (maxDomain <= 100) {
      tickInterval = 20;
    } else if (maxDomain <= 200) {
      tickInterval = 50;
    } else {
      tickInterval = Math.ceil(maxDomain / 5);
    }

    const roundedMax = Math.ceil(maxDomain / tickInterval) * tickInterval;

    // 눈금 생성
    const ticks: number[] = [];
    for (let i = 0; i <= roundedMax; i += tickInterval) {
      ticks.push(i);
    }

    return {
      domain: [0, roundedMax] as [number, number],
      ticks,
    };
  }, [processedData]);

  return (
    <div className="w-full select-none">
      <div className="flex items-center justify-between mb-4">
        {/* 기간 선택 버튼 */}
        <div className="flex flex-wrap gap-2 select-none">
          {(["3일", "1주", "2주", "All"] as Period[]).map((period) => (
            <button
              key={period}
              onClick={() => {
                setSelectedPeriod(period);
                setHoveredOverride(null);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedPeriod === period
                  ? "bg-blue-600 text-white dark:bg-indigo-500 dark:text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-[#1e2939] dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              {period}
            </button>
          ))}
        </div>
        {/* 차트 색상 표시 영역 */}
        <div className="flex pr-2 select-none gap-2 sm:gap-4">
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-xs sm:text-sm text-gray-600 font-medium dark:text-gray-400">
              UP
            </span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-xs sm:text-sm text-gray-600 font-medium dark:text-gray-400">
              DOWN
            </span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="w-3 h-3 rounded-full bg-black"></div>
            <span className="text-xs sm:text-sm text-gray-600 font-medium dark:text-gray-400">
              HOLD
            </span>
          </div>
        </div>
      </div>
      {/* 차트 */}
      <div className="w-full bg-white rounded-lg select-none dark:bg-[#141d2b] outline-none focus:outline-none [&_svg]:outline-none [&_svg]:focus:outline-none [&_svg]:focus-visible:outline-none">
        <ResponsiveContainer
          width="100%"
          height={384}
          className="outline-none focus:outline-none select-none pt-4"
        >
          <LineChart
            data={processedData}
            margin={{ top: 10, right: 20, left: 0, bottom: 30 }}
            onMouseMove={(e) => {
              const label = e?.activeLabel;
              if (label === undefined || label === null) return;
              const numericLabel = Math.round(Number(label));
              if (!Number.isNaN(numericLabel)) {
                setHoveredOverride(numericLabel);
              }
            }}
            onMouseLeave={() => setHoveredOverride(null)}
            style={{ outline: "none" }}
          >
            <defs>
              <linearGradient id="colorUp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray={isDarkMode ? "0" : "3 3"}
              stroke={isDarkMode ? "#374151" : "#e5e7eb"}
              horizontal={true} // 수평선 표시
              vertical={false} // 수직선 표시
            />
            <XAxis
              dataKey="index" // 순번을 기준으로
              type="number"
              domain={processedData.length > 0 ? [-0.5, processedData.length - 0.5] : [0, 0]}
              stroke="#6b7280" // 선 색상
              axisLine={{ stroke: isDarkMode ? "#374151" : "#e5e7eb" }} // 기본 스타일
              tickLine={{ stroke: isDarkMode ? "#374151" : "#e5e7eb" }} // 눈금 선 스타일
              ticks={tickValues}
              interval={0}
              height={48}
              tickMargin={14}
              tick={<CustomTick chartData={processedData} isDarkMode={isDarkMode} />}
            />
            {/* 일자별 경계선 */}
            {processedData.map((item, index) => {
              // 첫 번째는 시작점이므로 경계선 표시X
              if (index === 0) return null;
              return (
                <ReferenceLine
                  key={`border-${index}`}
                  x={item.index} // 인덱스를 기준으로
                  stroke={isDarkMode ? "#374151" : "#e5e7eb"} // 선 색상
                  strokeWidth={1} // 선 두께 : 1px
                />
              );
            })}
            <YAxis
              domain={yAxisConfig.domain} // Y축 범위를 데이터에 맞게 동적으로 설정
              ticks={yAxisConfig.ticks} // 눈금 위치를 데이터에 맞게 동적으로 설정
              stroke={isDarkMode ? "#374151" : "#6b7280"} // 선 색상
              tick={{ fontSize: 12, fill: isDarkMode ? "#9ca3af" : "#6b7280" }} // 눈금 텍스트 스타일
              axisLine={{ stroke: isDarkMode ? "#374151" : "#e5e7eb" }} // 기본 스타일
              tickLine={{ stroke: isDarkMode ? "#374151" : "#e5e7eb" }} // 눈금 선 스타일
              width={40} // Y축 너비
            />
            <Tooltip content={<CustomTooltip chartData={processedData} />} />
            {hoveredDate !== null && (
              <ReferenceLine
                x={hoveredDate}
                stroke={isDarkMode ? "#374151" : "#9ca3af"} // 선 색상
                strokeWidth={1} // 선 두께
                strokeDasharray="5 5" // 5px 선, 5px 공백
              />
            )}
            <Area
              type="monotone" // 타입 : monotone
              dataKey="up" // 데이터 키 타입
              stroke="none" // 테두리 X
            />
            {/* hover 시 차트에 표시 되는 부분 */}
            <Line
              type="monotone"
              dataKey="up"
              stroke={isDarkMode ? "#3b82f6" : "#3b82f6"}
              strokeWidth={2.5}
              dot={{ fill: "#3b82f6", r: 0, strokeWidth: 0 }} // 점 스타일
              activeDot={{
                r: 5,
                fill: isDarkMode ? "#3b82f6" : "#3b82f6",
                stroke: "#fff",
                strokeWidth: 2,
              }} // 활성화 점 스타일
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
