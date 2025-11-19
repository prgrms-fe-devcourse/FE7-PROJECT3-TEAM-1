"use client";

import { useMemo } from "react";
import Link from "next/link";
import { MessageCircle, Eye, Lock, Heart, ArrowUp, ArrowDown, ArrowRight } from "lucide-react";
import FeelBadge from "@/components/common/FeelBadge";

type Tag = { id?: string | number; label: string } | string;

export default function PostCard({
  id,
  createdAt,
  visibility,
  content,
  likeCount,
  commentCount,
  tags = [],
  post_type,
}: {
  id: string | number;
  createdAt: string;
  visibility: "public" | "followers";
  content: string;
  likeCount: number;
  commentCount: number;
  tags?: Tag[];
  post_type?: string | null;
}) {
  const vis =
    visibility === "public" ? (
      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-gray-700 px-2 py-0.5 text-xs text-slate-700 dark:text-gray-400">
        <Eye className="h-3.5 w-3.5" /> <p className="text-slate-700 dark:text-gray-400">공개</p>
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-gray-700 px-2 py-0.5 text-xs text-slate-700 dark:text-gray-400">
        <Lock className="h-3.5 w-3.5" /> <p className="text-slate-700 dark:text-gray-400">팔로워</p>
      </span>
    );

  const d = new Date(createdAt);
  const dateLabel = `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;

  // 태그 공백 제거 (없을 경우 비노출)
  const validTags = useMemo(() => {
    return tags.filter((t) => {
      const label = typeof t === "string" ? t : t.label;
      return label && label.trim().length > 0;
    });
  }, [tags]);

  return (
    <Link href={`/community/${String(id)}`} className="block">
      <article className="rounded-2xl bg-white p-4 shadow-sm transition hover:shadow-md cursor-pointer border border-slate-200 dark:bg-[#141d2b] dark:border-[#364153]">
        <header className="mb-3 flex items-center justify-between text-xs text-slate-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            {post_type && (
              <>
                <FeelBadge type={post_type as "up" | "down" | "hold"} size="sm" />
              </>
            )}
            <span>{dateLabel}</span>
          </div>
          {vis}
        </header>

        <p className="whitespace-pre-wrap text-[15px] leading-6 text-slate-800 dark:text-gray-300 mb-4">
          {content.trimEnd()}
        </p>

        <div className="mt-3 flex items-center justify-between gap-4">
          {validTags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {validTags.flatMap((t, i) => {
                const label = typeof t === "string" ? t : t.label;
                const splitTags = label
                  .split(",")
                  .map((tag) => tag.trim())
                  .filter((tag) => tag.length > 0);
                return splitTags.map((tag, j) => (
                  <span
                    key={typeof t === "string" ? `${t}-${i}-${j}` : `${t.id ?? i}-${j}`}
                    className="rounded-md  px-2 py-1 text-xs bg-slate-50 text-slate-600 dark:bg-gray-700 dark:text-gray-400"
                  >
                    #{tag}
                  </span>
                ));
              })}
            </div>
          ) : (
            <div></div>
          )}

          <footer className="flex items-center gap-4 text-sm text-slate-500 dark:text-gray-400">
            <div className="inline-flex items-center gap-1">
              <Heart className="h-4 w-4 stroke-slate-300 fill-slate-300 dark:stroke-[#b2b7c2] dark:fill-[#b2b7c2]" />
              <span className="font-semibold dark:text-gray-400">{likeCount}</span>
            </div>
            <div className="inline-flex items-center gap-1">
              <MessageCircle className="h-4 w-4  stroke-slate-300 fill-slate-300 dark:stroke-[#b2b7c2] dark:fill-[#b2b7c2]" />
              <span className="font-semibold dark:text-gray-400">{commentCount}</span>
            </div>
          </footer>
        </div>
      </article>
    </Link>
  );
}
