"use client";

import { useTransition, useState } from "react";
import ProfileImage from "@/components/common/ProfileImage";
import { followToggle } from "@/app/(seperate-page)/profile/[userId]/parts/actions";
import type { SearchUser } from "./types";

// 기존 SearchUser 타입에 팔로우 관련 필드를 확장해서 사용
type SearchUserWithFollow = SearchUser & {
  isFollowing?: boolean; // 내가 이미 팔로우 중인지 여부
  isMe?: boolean; // 내 계정이면 버튼 비활성화용(있으면 사용)
};

export default function SearchUserItem({ user }: { user: SearchUserWithFollow }) {
  const [followPending, startFollow] = useTransition();
  const [following, setFollowing] = useState<boolean>(!!user.isFollowing);

  const handleFollowToggle = () => {
    // 내 계정이거나, 이미 처리 중이면 막기
    if (followPending || user.isMe) return;

    startFollow(async () => {
      // 낙관적 업데이트: 먼저 UI를 토글
      setFollowing((prev) => !prev);

      try {
        await followToggle(user.id);
      } catch (e) {
        console.error("followToggle failed in SearchUserItem:", e);
        // 실패하면 원래대로 롤백
        setFollowing((prev) => !prev);
      }
    });
  };

  return (
    <article className="p-5 rounded-2xl bg-white border border-slate-200 shadow-[0_4px_12px_rgba(15,23,42,0.04)] flex gap-3 items-center dark:bg-[#141d2b] dark:border-[#364153]">
      <ProfileImage displayName={user.display_name} imageUrl={user.image_url} />

      <div className="flex-1 min-w-0">
        <div className="font-semibold text-slate-800 truncate dark:text-gray-300">
          {user.display_name}
        </div>
        {user.bio && (
          <p className="text-sm text-slate-500 line-clamp-1 dark:text-gray-400">{user.bio}</p>
        )}
      </div>

      {/* 내 계정이면 버튼 안 보이게 하려면 조건 추가 */}
      {!user.isMe && (
        <button
          type="button"
          onClick={handleFollowToggle}
          disabled={followPending}
          className="px-4 py-1.5 rounded-full bg-gradient-to-r from-[#A8E0FF] to-[#C5C8FF] text-white text-sm font-semibold hover:opacity-90 active:scale-[.99] transition cursor-pointer disabled:opacity-70 disabled:cursor-default"
        >
          {followPending ? "처리 중..." : following ? "언팔로우" : "팔로우"}
        </button>
      )}
    </article>
  );
}
