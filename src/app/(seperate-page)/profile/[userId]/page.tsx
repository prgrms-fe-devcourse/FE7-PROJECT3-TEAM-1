import { notFound, redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import ProfileHeader from "./parts/ProfileHeader";
import ProfileChart from "./parts/ProfileChart";
import ProfilePosts from "./parts/ProfilePosts";
import type { ChartDataPoint } from "@/components/dashboard/type/dashboard";
import type { Tables } from "@/utils/supabase/supabase";

type PostRow = Tables<"posts">;
type HashtagRow = Tables<"hashtags">;

export type PostWithTags = PostRow & {
  hashtags?: Pick<HashtagRow, "content">[] | null;

  likes?: { user_id: string }[] | null;
};

export default async function ProfilePage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId: profileUserId } = await params;
  const supabase = await createClient();

  const {
    data: { user: me },
  } = await supabase.auth.getUser();
  if (!me) redirect("/auth/sign-in");

  const { data: profile, error: profileErr } = await supabase
    .from("users")
    .select("id, display_name, bio, image_url, created_at")
    .eq("id", profileUserId)
    .maybeSingle();

  if (!profile) {
    // console.error("[profile] select error:", profileErr);
    notFound();
  }

  const [
    { count: followerCount }, // 나를 팔로우하는 수
    { count: followingCount }, // 내가 팔로우하는 수
    { count: postCount }, // 작성한 글 수
    { data: followRel }, // 내가 이 프로필을 팔로우 중인지
    { data: feels }, // 감정 기록
    { data: writtenPostsRaw, error: writtenErr }, // 작성한 글
    { data: viewedRowsRaw, error: viewedErr }, // 조회한 글
  ] = await Promise.all([
    supabase
      .from("follows")
      .select("id", { head: true, count: "exact" })
      .eq("following_id", profileUserId),

    supabase
      .from("follows")
      .select("id", { head: true, count: "exact" })
      .eq("follower_id", profileUserId),

    supabase
      .from("posts")
      .select("id", { head: true, count: "exact" })
      .eq("user_id", profileUserId),

    supabase
      .from("follows")
      .select("id")
      .eq("follower_id", me.id)
      .eq("following_id", profileUserId)
      .maybeSingle(),

    supabase
      .from("feels")
      .select("type, amount, created_at")
      .eq("user_id", profileUserId)
      .order("created_at", { ascending: true }),

    supabase
      .from("posts")
      .select(
        `
        id,
        user_id,
        title,
        image_url,
        content,
        created_at,
        likes_count,
        comments_count,
        likes:likes ( user_id ),
        hashtags ( content )
      `,
      )
      .eq("user_id", profileUserId)
      .order("created_at", { ascending: false })
      .limit(50),

    supabase
      .from("recent_views")
      .select(
        `
        created_at,
        posts:posts (
          id,
          user_id,
          title,
          image_url,
          content,
          created_at,
          likes_count,
          comments_count,
          likes:likes ( user_id ),
          hashtags ( content )
        )
      `,
      )
      .eq("user_id", profileUserId)
      .order("created_at", { ascending: false })
      .limit(100),
  ]);

  if (writtenErr) console.error("[profile] writtenPosts error:", writtenErr);
  if (viewedErr) console.error("[profile] viewedPosts(recent_views) error:", viewedErr);

  const isMe = me.id === profileUserId;
  const isFollowing = !!followRel;

  const chartRaw: ChartDataPoint[] = aggregateFeelsToChartData(feels ?? []);

  const hasRealData = chartRaw.length > 0;

  const preview: ChartDataPoint[] = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      date: d.toISOString(),
      day: d.getDate(),
      weekday: ["일", "월", "화", "수", "목", "금", "토"][d.getDay()],
      up: [2, 0, 1, 3, 0, 2, 4][i],
      hold: [0, 1, 0, 0, 1, 0, 0][i],
      down: [0, 2, 0, 0, 3, 0, 0][i],
    };
  });

  const chartData = hasRealData ? chartRaw : preview;

  const writtenPosts: PostWithTags[] = (writtenPostsRaw ?? []) as PostWithTags[];

  const viewedPosts: PostWithTags[] = (() => {
    const rows = (viewedRowsRaw ?? []) as { posts: PostWithTags | null }[];

    const seen = new Set<string>();
    const acc: PostWithTags[] = [];

    for (const row of rows) {
      const p = row.posts;
      if (!p) continue;
      if (seen.has(p.id)) continue;
      seen.add(p.id);
      acc.push(p);
    }

    return acc;
  })();

  console.log("writtenPostsRaw", writtenPostsRaw);
  return (
    <div className="w-full space-y-6">
      <section className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200 dark:bg-[#141d2b] dark:border-[#364153]">
        <ProfileHeader
          isMe={isMe}
          profile={{
            id: profile.id,
            name: profile.display_name ?? "",
            bio: profile.bio ?? "",
            avatar: profile.image_url ?? "",
            followerCount: followerCount ?? 0,
            followingCount: followingCount ?? 0,
            postCount: postCount ?? 0,
            isFollowing,
          }}
        />
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-sm  border border-slate-200 dark:bg-[#141d2b] dark:border-[#364153]">
        <h2 className="mb-4 text-lg font-semibold dark:text-gray-300">감정 트렌드</h2>
        <ProfileChart chartData={chartData} hasRealData={hasRealData} />
      </section>

      <ProfilePosts written={writtenPosts} viewed={viewedPosts} />
    </div>
  );
}

function aggregateFeelsToChartData(
  rows: Array<{ type: string; amount: number | null; created_at: string }>,
): ChartDataPoint[] {
  const byDate = new Map<string, { up: number; down: number; hold: number }>();

  for (const r of rows) {
    const d = new Date(r.created_at);
    d.setHours(0, 0, 0, 0);
    const key = d.toISOString();

    const bucket = byDate.get(key) ?? { up: 0, down: 0, hold: 0 };
    const rawAmt = typeof r.amount === "number" ? r.amount : 1;
    const amt = Math.abs(rawAmt);

    switch (String(r.type).toUpperCase()) {
      case "UP":
        bucket.up += amt;
        break;
      case "DOWN":
        bucket.down += amt;
        break;
      default:
        bucket.hold += amt;
        break;
    }

    byDate.set(key, bucket);
  }

  return Array.from(byDate.entries())
    .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
    .map(([iso, v]) => {
      const d = new Date(iso);
      return {
        date: iso,
        day: d.getDate(),
        weekday: ["일", "월", "화", "수", "목", "금", "토"][d.getDay()],
        up: v.up,
        down: v.down,
        hold: v.hold,
      } satisfies ChartDataPoint;
    });
}
