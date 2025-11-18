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

export default async function FollowersPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId: profileUserId } = await params;

  const supabase = await createClient();

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
    console.error("[followers] profile error:", profileErr);
    notFound();
  }

  // 나를 팔로우하는 사람들 (팔로워)
  const { data: followRows, error: followsErr } = await supabase
    .from("follows")
    .select("follower_id")
    .eq("following_id", profileUserId)
    .order("created_at", { ascending: false });

  if (followsErr) {
    console.error("[followers] follows error:", followsErr);
  }

  const followerIds =
    followRows?.map((r) => r.follower_id).filter(Boolean) ?? [];

  let followerUsers: UserRow[] = [];

  if (followerIds.length) {
    const { data: users, error: usersErr } = await supabase
      .from("users")
      .select("id, display_name, bio, image_url")
      .in("id", followerIds);

    if (usersErr) {
      console.error("[followers] users error:", usersErr);
    } else {
      followerUsers = users as UserRow[];
    }
  }

  return (
    <main className="min-h-screen w-full space-y-6">
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-lg font-semibold text-slate-900">
          {profile.display_name ?? "사용자"}님의 팔로워
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          총{" "}
          <span className="font-semibold">{followerUsers.length}</span>명이
          나를 팔로우하고 있어요.
        </p>
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        {followerUsers.length === 0 ? (
          <div className="py-10 text-center text-sm text-slate-400">
            아직 팔로워가 없어요.
          </div>
        ) : (
          <ul className="space-y-3">
            {followerUsers.map((u) => (
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

                    <span className="text-xs font-medium text-violet-500">
                      프로필 보기 →
                    </span>
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
