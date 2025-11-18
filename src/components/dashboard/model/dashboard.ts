"use server";

import { createClient } from "@/utils/supabase/server";
import type { DashboardData, ChartDataPoint, Post, Comment } from "@/components/dashboard/type/dashboard";
import type { Database } from "@/utils/supabase/supabase";

type Hashtag = Database["public"]["Tables"]["hashtags"]["Row"];

// 대시보드 데이터 페칭 함수
export async function fetchDashboardData(currentUsers?: number): Promise<DashboardData> {
  const now = new Date(); // 오늘 날짜 담는 변수
  const supabase = await createClient();

  // 오늘 날짜 시작 
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const todayStartISO = todayStart.toISOString();

  // 오늘 날짜 끝 
  const todayEnd = new Date(now);
  todayEnd.setHours(23, 59, 59, 999);
  const todayEndISO = todayEnd.toISOString();

  // 하루 전 
  const oneDayAgo = new Date(now);
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);
  oneDayAgo.setHours(0, 0, 0, 0);

  // 포스트(오늘), 댓글(오늘), 해시태그(전체), 감정(전체)
  const [
    postsResult,
    commentsResult,
    hashtagsResult,
    feelsResult,
  ] = await Promise.all([
    supabase
      .from("posts")
      .select<"*", Post>("*", { count: "exact", head: true })
      .gte("created_at", todayStartISO)
      .lte("created_at", todayEndISO),
    supabase
      .from("comments")
      .select<"*", Comment>("*", { count: "exact", head: true })
      .gte("created_at", todayStartISO)
      .lte("created_at", todayEndISO),
    supabase
      .from("hashtags")
      .select<"*", Hashtag>("*"),
    supabase
      .from("feels")
      .select("post_id, type, created_at"),
  ]);

  const { count: postsCount, error: postsError } = postsResult;
  const { count: commentsCount, error: commentsError } = commentsResult;
  const { data: hashtagsData, error: hashtagsError } = hashtagsResult;
  const { data: feelsData, error: feelsError } = feelsResult;

  if (postsError) {
    console.error("포스트 데이터 가져오기 실패:", postsError);
  }

  if (commentsError) {
    console.error("댓글 데이터 가져오기 실패:", commentsError);
  }

  if (hashtagsError) {
    console.error("해시태그 데이터 가져오기 실패:", hashtagsError);
  }

  if (feelsError) {
    console.error("감정 데이터 가져오기 실패:", feelsError);
  }


  const postTypeMap = new Map<string, { type: "up" | "down"; createdAt: Date }>();
  feelsData?.forEach((feel) => {
    if (feel.type === "up" || feel.type === "down") {
      const feelDate = new Date(feel.created_at);
      const existing = postTypeMap.get(feel.post_id);

      // 같은 post_id에 여러 feels가 있을 수 있으므로, 가장 최근 것만 사용
      if (!existing || feelDate > existing.createdAt) {
        postTypeMap.set(feel.post_id, { type: feel.type, createdAt: feelDate });
      }
    }
  });

  const resultTypeMap = new Map<string, "up" | "down">();
  postTypeMap.forEach((value, key) => {
    resultTypeMap.set(key, value.type);
  });

  // 디버깅: feels 데이터 확인
  if (process.env.NODE_ENV === 'development') {
    console.log("feels 데이터 개수:", feelsData?.length || 0);
    console.log("up 타입 feels 개수:", feelsData?.filter((f) => f.type === "up").length || 0);
    console.log("hold 타입 feels 개수:", feelsData?.filter((f) => f.type === "hold").length || 0);
    console.log("down 타입 feels 개수:", feelsData?.filter((f) => f.type === "down").length || 0);
  }

  // 상승 태그 관련
  const risingHashtagCounts = new Map<string, number>();
  const previousRisingHashtagCounts = new Map<string, number>();

  // 하락 태그 관련
  const fallingHashtagCounts = new Map<string, number>();
  const previousFallingHashtagCounts = new Map<string, number>();


  if (process.env.NODE_ENV === 'development') {
    console.log("hashtags 데이터 개수:", hashtagsData?.length || 0);
  }

  hashtagsData?.forEach((hashtag) => {
    const hashtagDate = new Date(hashtag.created_at);
    const postType = resultTypeMap.get(hashtag.post_id);

    // type이 "up" 또는 "down"인 경우만 처리
    if (postType !== "up" && postType !== "down") {
      return;
    }

    // 개별 해시태그 추출
    const tags = hashtag.content
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    // 오늘 데이터인지 어제 데이터인지 판단
    const isToday = hashtagDate >= todayStart;
    const isYesterday = hashtagDate >= oneDayAgo && hashtagDate < todayStart;

    tags.forEach((tag) => {
      if (postType === "up") {
        // 상승 해시태그
        if (isToday) {
          risingHashtagCounts.set(tag, (risingHashtagCounts.get(tag) || 0) + 1);
        } else if (isYesterday) {
          previousRisingHashtagCounts.set(tag, (previousRisingHashtagCounts.get(tag) || 0) + 1);
        }
      } else if (postType === "down") {
        // 하락 해시태그
        if (isToday) {
          fallingHashtagCounts.set(tag, (fallingHashtagCounts.get(tag) || 0) + 1);
        } else if (isYesterday) {
          previousFallingHashtagCounts.set(tag, (previousFallingHashtagCounts.get(tag) || 0) + 1);
        }
      }
    });
  });

  if (process.env.NODE_ENV === 'development') {
    // 디버깅 (추후 삭제 예정)
    // console.log("오늘 상승 해시태그 개수:", risingHashtagCounts.size);
    // console.log("어제 상승 해시태그 개수:", previousRisingHashtagCounts.size);
    console.log("오늘 상승 해시태그:", Array.from(risingHashtagCounts.entries()));
    console.log("어제 상승 해시태그:", Array.from(previousRisingHashtagCounts.entries()));

    // 디버깅 (추후 삭제 예정)
    // console.log("하락 해시태그 처리됨:", downHashtagsProcessed);
    // console.log("하락 해시태그 스킵됨 (날짜 범위 밖):", downHashtagsSkipped);
    // console.log("오늘 하락 해시태그 개수:", fallingHashtagCounts.size);
    // console.log("어제 하락 해시태그 개수:", previousFallingHashtagCounts.size);
    console.log("오늘 하락 해시태그:", Array.from(fallingHashtagCounts.entries()));
    console.log("어제 하락 해시태그:", Array.from(previousFallingHashtagCounts.entries()));
  }

  // 오늘과 어제의 모든 태그를 포함 (오늘만 있는 태그도 포함)
  const allRisingTags = new Set([
    ...risingHashtagCounts.keys(),
    ...previousRisingHashtagCounts.keys(),
  ]);

  const risingTrends = Array.from(allRisingTags).map((tag) => {
    const currentCount = risingHashtagCounts.get(tag) || 0;
    const previousCount = previousRisingHashtagCounts.get(tag) || 0;

    let increaseRate: number;

    if (previousCount === 0) {
      // 어제는 없었지만 오늘 생긴 경우: 어제 기준 0으로 계산
      // 오늘 count가 1이면 100%, 2이면 200%로 표시
      increaseRate = currentCount * 100;
    } else if (currentCount === 0) {
      // 어제는 있었지만 오늘 사라진 경우: -100% 감소
      increaseRate = -100;
    } else {
      // 두 기간 모두 있는 경우: 표준 증가율 계산
      // 어제 2회, 오늘 3회 → ((3-2)/2) * 100 = +50%
      increaseRate = ((currentCount - previousCount) / previousCount) * 100;
    }

    return {
      name: `#${tag}`,
      change: `${increaseRate >= 0 ? "+" : ""}${increaseRate.toFixed(1)}%`,
      currentCount,
      previousCount,
      trend: increaseRate,
    };
  });

  // 오늘 하락 해시태그가 있는 태그만 포함 (어제 있었지만 오늘 없는 태그는 제외)
  const allFallingTags = Array.from(fallingHashtagCounts.keys());

  const fallingTrends = allFallingTags.map((tag) => {
    const currentCount = fallingHashtagCounts.get(tag) || 0;
    const previousCount = previousFallingHashtagCounts.get(tag) || 0;

    let increaseRate: number;

    if (previousCount === 0) {
      // 어제는 없었지만 오늘 생긴 경우: 어제 기준 0으로 계산
      // 오늘 count가 1이면 100%, 2이면 200%로 표시
      increaseRate = currentCount * 100;
    } else {
      // 어제도 있었고 오늘도 있는 경우: 표준 증가율 계산
      // 어제 2회, 오늘 3회 → ((3-2)/2) * 100 = +50%
      increaseRate = ((currentCount - previousCount) / previousCount) * 100;
    }

    return {
      name: `#${tag}`,
      change: `${increaseRate >= 0 ? "+" : ""}${increaseRate.toFixed(1)}%`,
      currentCount,
      previousCount,
      trend: increaseRate,
    };
  });

  // 증가율이 높은 순서대로
  const sortedRisingTrends = risingTrends.sort((a, b) => b.trend - a.trend);
  const topRising = sortedRisingTrends
    .filter((item) => item.trend > 0)
    .slice(0, 3)
    .map(({ name, change }) => ({ name, change }));

  // 오늘 하락 해시태그가 없으면 빈 배열 반환
  let topFalling: Array<{ name: string; change: string }> = [];

  if (fallingHashtagCounts.size > 0) {
    // 하락 해시태그: 증가율이 높은 순서로 정렬 (하락 감정이 증가하는 것 = 더 많은 부정적 감정)
    // 어제 0개, 오늘 1개 → +100% (하락 감정이 새로 생김)
    // 어제 1개, 오늘 2개 → +100% (하락 감정이 증가)
    // 어제 2개, 오늘 1개 → -50% (하락 감정이 감소)
    const sortedFallingTrends = fallingTrends.sort((a, b) => {
      if (a.trend > 0 && b.trend <= 0) return -1;
      if (a.trend <= 0 && b.trend > 0) return 1;
      return Math.abs(b.trend) - Math.abs(a.trend); // 절댓값이 큰 순서
    });

    topFalling = sortedFallingTrends
      .slice(0, 3)
      .map(({ name, change }) => ({ name, change }));
  }

  // 데이터가 부족한 경우 기본값 사용 = []
  const finalTopRising = topRising.length > 0 ? topRising : [];
  const finalTopFalling = topFalling.length > 0 ? topFalling : [];

  const lastUpdated = `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일 ${now.getHours() >= 12 ? "오후" : "오전"} ${now.getHours() % 12 || 12}:${String(now.getMinutes()).padStart(2, "0")}`;
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

  // feels 테이블 데이터 집계
  const feelsByDate = new Map<string, { up: number; down: number; hold: number }>();

  feelsData?.forEach((feel) => {
    const feelDate = new Date(feel.created_at);
    feelDate.setHours(0, 0, 0, 0);
    const dateKey = feelDate.toISOString().split("T")[0];

    if (!feelsByDate.has(dateKey)) {
      feelsByDate.set(dateKey, { up: 0, down: 0, hold: 0 });
    }

    const counts = feelsByDate.get(dateKey)!;
    const feelType = feel.type.toLowerCase();

    if (feelType === "up") {
      counts.up++;
    } else if (feelType === "down") {
      counts.down++;
    } else if (feelType === "hold") {
      counts.hold++;
    }
  });

  // 데이터가 있는 날짜들 정렬 (실제 데이터 기준 있는 날짜 추출 역할?)
  const datesWithData = Array.from(feelsByDate.keys())
    .map((dateStr) => new Date(dateStr))
    .sort((a, b) => a.getTime() - b.getTime());

  // 30일전까지
  const thirtyDays = new Date(todayStart);
  thirtyDays.setDate(thirtyDays.getDate() - 29);

  let startDate: Date;
  if (datesWithData.length > 0) {
    const oldestDataDate = datesWithData[0];
    startDate = oldestDataDate > thirtyDays ? thirtyDays : oldestDataDate;
  } else {
    // 시작날짜 30일전 초기화
    startDate = thirtyDays;
  }

  const chartData: ChartDataPoint[] = [];
  const currentDate = new Date(startDate);

  while (currentDate <= todayStart && chartData.length < 30) {
    const dateKey = currentDate.toISOString().split("T")[0];
    const counts = feelsByDate.get(dateKey) || { up: 0, down: 0, hold: 0 };

    chartData.push({
      date: currentDate.toISOString(),
      day: currentDate.getDate(),
      weekday: weekdays[currentDate.getDay()],
      up: counts.up,
      down: counts.down,
      hold: counts.hold,
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return {
    chartData,
    topRising: finalTopRising,
    topFalling: finalTopFalling,
    communityStats: {
      newPosts: `${postsCount || 0}개`,
      comments: `${commentsCount || 0}개`,
      currentUsers: `${currentUsers || 1}명`, // 실시간 접속자 수 (기본값: 1명)
    },
    lastUpdated,
  };
}

