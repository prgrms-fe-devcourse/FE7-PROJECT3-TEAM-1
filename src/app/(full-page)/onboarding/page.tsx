import SignUpClient from "@/components/auth/SignUpClient";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <main className="min-h-screen flex items-center justify-center py-10 ">
      <section className="w-full max-w-150 mx-10 flex flex-col gap-8">
        <SignUpClient
          userId={user.id}
          userName={user.user_metadata?.name}
          userImage={user.user_metadata?.avatar_url}
        />
        <div className="p-8 space-y-3 border border-slate-200 bg-linear-to-r from-blue-50 to-violet-100 rounded-2xl dark:border-slate-700 dark:from-blue-50/20 dark:to-violet-100/10">
          <h3 className="text-md font-semibold text-slate-900 dark:text-slate-100">
            💡 시작하기 전에 알아두세요
          </h3>
          <ul className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
            <li>• 매일 감정을 기록하고 다른 개미들과 공유하세요</li>
            <li>• UP, DOWN, HOLD로 오늘의 기분을 표현하세요</li>
            <li>• 프로필은 언제든지 수정할 수 있습니다</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
