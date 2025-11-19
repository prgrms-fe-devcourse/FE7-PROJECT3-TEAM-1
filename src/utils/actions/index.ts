"use server";

import { redirect } from "next/navigation";
import { createClient } from "../supabase/server";
import { revalidatePath } from "next/cache";

// 깃허브 로그인
export const githubLogin = async () => {
  const supabase = await createClient();
  const { data } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_URL}/auth/callback`,
    },
  });

  if (data.url) {
    redirect(data.url);
  }
};

// 구글 로그인
export const googleLogin = async () => {
  const supabase = await createClient();
  const { data } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_URL}/auth/callback`,
    },
  });

  if (data.url) {
    redirect(data.url);
  }
};

// 디스코드 로그인
export const discordLogin = async () => {
  const supabase = await createClient();
  const { data } = await supabase.auth.signInWithOAuth({
    provider: "discord",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_URL}/auth/callback`,
    },
  });

  if (data.url) {
    redirect(data.url);
  }
};

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/");
}


export async function save(userId: string, displayName: string, bio: string) {
  "use server";

  const supabase = await createClient();

  if (!displayName || displayName.trim() === "" || !bio || bio.trim() === "") {
    throw new Error("닉네임과 자기소개를 모두 입력해주세요.");
  }

  const { error } = await supabase
    .from("users")
    .update({ display_name: displayName.trim(), bio: bio.trim() })
    .eq("id", userId);

  if (error) {
    throw new Error("프로필 저장에 실패했습니다.");
  }

  return { success: true };
}

// 서버에서 사용자 프로필 가져오기
export async function getUserProfile() {
  const supabase = await createClient();

  try {
    // 현재 사용자 확인
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return null;
    }

    // 프로필 정보 가져오기
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return null;
    }

    return profile;
  } catch (error) {
    console.error("프로필 데이터 로딩 오류:", error);
    return null;
  }
}

// 오늘의 감정 지수 계산
export async function getTodayScore() {
  const supabase = await createClient();

  try {
    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);

    const oneDayAgo = new Date(todayStart);
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const tomorrowStart = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

    // 오늘, 어제 감정 지수
    const [todayQuery, yesterdayQuery] = await Promise.all([
      supabase
        .from("feels")
        .select("amount, type")
        .in("type", ["up", "down"])
        .gte("created_at", todayStart.toISOString())
        .lt("created_at", tomorrowStart.toISOString()),
      supabase
        .from("feels")
        .select("amount, type")
        .in("type", ["up", "down"])
        .gte("created_at", oneDayAgo.toISOString())
        .lt("created_at", todayStart.toISOString()),
    ]);

    const { data: todayFeels, error: todayError } = todayQuery;
    const { data: yesterdayFeels, error: yesterdayError } = yesterdayQuery;

    if (todayError) {
      console.error("오늘의 감정지수 데이터 가져오기 실패:", todayError);
      return { value: 0, finalResult: 0 };
    }

    if (yesterdayError) {
      console.error("어제의 감정지수 데이터 가져오기 실패:", yesterdayError);
    }

    // 오늘의 감정 지수 계산
    const todayResult =
      todayFeels?.reduce((sum, feel) => {
        return sum + feel.amount; // amount 값 그대로 더하기 (up은 양수, down은 이미 음수)
      }, 0) || 0;

    // 어제의 감정 지수 계산
    const yesterdayResult =
      yesterdayFeels?.reduce((sum, feel) => {
        return sum + feel.amount; // amount 값 그대로 더하기 (up은 양수, down은 이미 음수)
      }, 0) || 0;


    let finalResult = 0;
    if (yesterdayResult !== 0) {
      finalResult = ((todayResult - yesterdayResult) / Math.abs(yesterdayResult)) * 100;
    } else if (todayResult !== 0) {
      finalResult = todayResult > 0 ? 100 : -100;
    }

    if (process.env.NODE_ENV === 'development') {
      console.log("감정지수", todayResult, yesterdayResult, finalResult);
    }

    return {
      value: todayResult,
      finalResult: Math.round(finalResult * 100) / 100, // 소수점 둘째 자리까지
    };
  } catch (error) {
    console.error("감정 지수 계산 오류:", error);
    return { value: 0, finalResult: 0 };
  }
}