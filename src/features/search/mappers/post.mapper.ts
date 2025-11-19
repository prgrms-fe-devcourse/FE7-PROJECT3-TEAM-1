// src/features/search/mappers/post.mapper.ts
import type { DBPostRow } from "../types/db";
import type { CommunityPost, FeelType } from "@/components/search/types";
import type { PostLikeRow } from "../api/fetchPosts";

const toFeelType = (v: string | null | undefined): FeelType => {
  const u = (v ?? "HOLD").toUpperCase();
  if (u === "UP" || u === "DOWN" || u === "HOLD") return u as FeelType;
  return "HOLD";
};

export const mapRowToCommunityPost = (
  r: DBPostRow,
  likes: PostLikeRow[],
  currentUserId: string | null,
): CommunityPost => {
  // 이 게시글에 달린 좋아요만 필터
  const postLikes = likes.filter((l) => l.post_id === r.id);
  const likeCount = postLikes.length;
  const isLikedByMe = !!currentUserId && postLikes.some((l) => l.user_id === currentUserId);

  return {
    id: r.id,
    user_id: r.user_id,
    created_at: r.created_at,
    title: r.title ?? "",
    content: r.content ?? "",
    likes_count: likeCount,
    comments_count: r.comments_count ?? 0,
    users: {
      display_name: r.users?.display_name ?? "알 수 없음",
      image_url: r.users?.image_url ?? null,
    },
    feels: (r.feels ?? []).map((f) => ({ type: toFeelType(f.type) })),
    tags: (r.hashtags ?? []).map((h) => h.content),
    likes: postLikes,
    is_liked_by_me: isLikedByMe,
  };
};
