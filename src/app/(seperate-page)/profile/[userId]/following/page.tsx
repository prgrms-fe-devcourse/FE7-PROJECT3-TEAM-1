import { createClient } from "@/utils/supabase/server";
import { redirect, notFound } from "next/navigation";
import ProfileImage from "@/components/common/ProfileImage";
import Link from "next/link";

type UserRow = {
  id: string;
  display_name: string | null;
  bio: string | null;
  image_url: string | null;
};

export default async function FollowingPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId: profileUserId } = await params;

  const supabase = await createClient();

  // 로그인 확인
  const {
    data: { user: me },
  } = await supabase.auth.getUser();
  if (!me) redirect("/auth/sign-in");

  const { data: profile, error: profileErr } = await supabase
    .from("users")
    .select("id, display_name")
    .eq("id", profileUserId)
    .maybeSingle();

  if (!profile || profileErr) {
    console.error("[following] profile error:", profileErr);
    notFound();
  }

  // 내가 팔로우한 사람들(follows.following_id)
  const { data: followRows, error: followsErr } = await supabase
    .from("follows")
    .select("following_id")
    .eq("follower_id", profileUserId)
    .order("created_at", { ascending: false });

  if (followsErr) {
    console.error("[following] follows error:", followsErr);
  }

  const followingIds = followRows?.map((r) => r.following_id).filter(Boolean) ?? [];

  let followingUsers: UserRow[] = [];

  if (followingIds.length) {
    const { data: users, error: usersErr } = await supabase
      .from("users")
      .select("id, display_name, bio, image_url")
      .in("id", followingIds);

    if (usersErr) {
      console.error("[following] users error:", usersErr);
    } else {
      followingUsers = users as UserRow[];
    }
  }

  return (
    <main className="min-h-screen w-full space-y-6">
      {/* 상단 제목 */}
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-lg font-semibold text-slate-900">
          {profile.display_name ?? "사용자"}님의 팔로잉
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          총 <span className="font-semibold">{followingUsers.length}</span>명을 팔로우하고 있어요.
        </p>
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        {followingUsers.length === 0 ? (
          <div className="py-10 text-center text-sm text-slate-400">
            아직 팔로잉한 사용자가 없어요.
          </div>
        ) : (
          <ul className="space-y-3">
            {followingUsers.map((u) => (
              <li key={u.id}>
                <Link
                  href={`/profile/${u.id}`}
                  className="block rounded-2xl bg-slate-50 px-4 py-3 transition hover:bg-slate-100"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <ProfileImage
                        displayName={u.display_name ?? ""}
                        imageUrl={u.image_url ?? ""}
                        size="md"
                      />
                      <div>
                        <div className="text-[15px] font-semibold text-slate-900">
                          {u.display_name ?? "이름 없음"}
                        </div>
                        <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                          {u.bio || "자기소개가 아직 없어요."}
                        </p>
                      </div>
                    </div>

                    <span className="text-xs font-medium text-violet-500">프로필 보기 →</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
