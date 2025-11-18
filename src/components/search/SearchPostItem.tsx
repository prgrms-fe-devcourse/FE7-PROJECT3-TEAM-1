// src/components/search/SearchPostItem.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart, MessageCircle } from "lucide-react";
import { twMerge } from "tailwind-merge";
import Button from "@/components/common/Button";
import ProfileImage from "@/components/common/ProfileImage";
import FeelBadge from "@/components/common/FeelBadge";
import { CommunityPost } from "./types";
import type { FeelType as CoreFeelType } from "@/types/community";
import { togglePostLike } from "@/features/likes/api/togglePostLike";
import { getHashtagArray } from "@/utils/helpers";

// 간단한 상대시간 헬퍼(추후 utils로 교체 가능)
function formatRelativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / (1000 * 60 * 60));
  if (h <= 0) return "방금 전";
  return `${h}시간 전`;
}

export default function SearchPostItem({ post }: { post: CommunityPost }) {
  // ✅ 서버에서 계산해 온 is_liked_by_me로 초기 상태 설정
  const [liked, setLiked] = useState<boolean>(post.is_liked_by_me);
  const [likeCount, setLikeCount] = useState<number>(post.likes_count ?? 0);
  const [pending, setPending] = useState(false);

  const hashtags = getHashtagArray(post.tags);

  const likeHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();

    if (pending) return; // 중복 클릭 방지
    setPending(true);

    const prevLiked = liked;
    const nextLiked = !prevLiked;

    // 1) 낙관적 업데이트 - UI 먼저 바꾸기
    setLiked(nextLiked);
    setLikeCount((prev) => prev + (nextLiked ? 1 : -1));

    try {
      // 2) Supabase에 실제로 반영
      await togglePostLike(post.id, prevLiked);
    } catch (error) {
      console.error(error);
      // 3) 실패하면 UI 롤백
      setLiked(prevLiked);
      setLikeCount((prev) => prev + (nextLiked ? -1 : 1));
      alert("좋아요 처리 중 오류가 발생했습니다.");
    } finally {
      setPending(false);
    }
  };

  const feel: CoreFeelType = (post.feels?.[0]?.type?.toLowerCase?.() ?? "hold") as CoreFeelType;

  return (
    <article className="p-5 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.06)] bg-white border border-slate-200 dark:bg-[#141d2b] dark:border-[#364153]">
      <Link href={`/community/${post.id}`}>
        <div className="flex gap-4 pb-5">
          <ProfileImage displayName={post.users.display_name} imageUrl={post.users.image_url} />
          <div className="flex-1 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-0.5">
                <strong className="font-semibold text-slate-800 dark:text-gray-300">
                  {post.users.display_name}
                </strong>
                <span className="text-slate-400 text-xs">
                  {formatRelativeTime(post.created_at)}
                </span>
              </div>
              <FeelBadge type={feel} />
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-bold dark:text-gray-300">{post.title}</h3>
              <p className="line-clamp-1 font-medium text-slate-700 dark:text-gray-400">
                {post.content}
              </p>
            </div>

            {hashtags && (
              <div className="flex gap-2 flex-wrap">
                {hashtags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 rounded-2xl dark:bg-gray-700 dark:text-gray-300 bg-slate-200 text-xs text-slate-600"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-5 border-t border-slate-200 pt-5 dark:border-[#364153]">
          <Button onClick={likeHandler}>
            <Heart
              size={18}
              className={twMerge(
                "transition-transform active:scale-125",
                liked
                  ? "stroke-red-500 fill-red-500"
                  : "stroke-slate-300 fill-slate-300 dark:stroke-[#b2b7c2] dark:fill-[#b2b7c2]",
              )}
            />
            {likeCount ?? "0"}
          </Button>
          <Button>
            <MessageCircle
              size={16}
              className="stroke-slate-300 fill-slate-300 dark:stroke-[#b2b7c2] dark:fill-[#b2b7c2]"
            />
            {post.comments_count ?? "0"}
          </Button>
        </div>
      </Link>
    </article>
  );
}
