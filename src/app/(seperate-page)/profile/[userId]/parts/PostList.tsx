"use client";

import PostCard from "./PostCard";

type RawTag = { content?: string } | string;

type RawPost = {
  id: string | number;
  created_at: string;
  title: string;
  likes_count?: number | null;
  comments_count?: number | null;
  hashtags?: { content: string }[] | null;
  likes?: { user_id: string }[] | null;
  post_type?: string | null;
};

export default function PostList({
  posts,
  hideTitle = true,
}: {
  posts: RawPost[] | null | undefined;
  hideTitle?: boolean;
}) {
  const list = (posts ?? []).map((p) => {
    const likeCount =
      Array.isArray(p.likes) && p.likes.length > 0 ? p.likes.length : (p.likes_count ?? 0);

    return {
      id: p.id,
      createdAt: p.created_at,
      visibility: "public" as const,
      content: p.title,
      likeCount,
      commentCount: p.comments_count ?? 0,
      tags: (p.hashtags ?? []).map((t: RawTag) => (typeof t === "string" ? t : (t.content ?? ""))),
      post_type: p.post_type || null,
    };
  });

  if (list.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 p-12 text-center text-sm text-slate-400">
        아직 표시할 글이 없어요.
      </div>
    );
  }

  return (
    <div className="grid gap-3 ">
      {!hideTitle && <div className="mb-1 mt-2 text-sm font-semibold text-slate-600">목록</div>}
      {list.map((p) => (
        <PostCard key={p.id} {...p} />
      ))}
    </div>
  );
}
