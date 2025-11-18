"use client";

import { useRouter } from "next/navigation";
import { useTransition, useState, useEffect } from "react";
import type { ReactNode } from "react";
import Button from "@/components/common/Button";
import ProfileImage from "@/components/common/ProfileImage";
import { signOut, followToggle } from "./actions";
import { Users, UserCheck, PenSquare } from "lucide-react";

type Props = {
  isMe: boolean;
  profile: {
    id: string;
    name: string;
    bio: string;
    avatar: string | null;
    followerCount: number;
    followingCount: number;
    postCount: number;
    isFollowing: boolean;
  };
};

export default function ProfileHeader({ isMe, profile }: Props) {
  const router = useRouter();

  const [signOutPending, startSignOut] = useTransition();

  const [followPending, startFollow] = useTransition();
  const [following, setFollowing] = useState(profile.isFollowing);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 다크 모드 감지
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };

    checkDarkMode();

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const handleSignOut = () => {
    startSignOut(async () => {
      await signOut();
    });
  };

  const handleFollowToggle = () => {
    if (followPending) return;

    startFollow(async () => {
      setFollowing((prev) => !prev);
      try {
        await followToggle(profile.id);
      } catch (e) {
        console.error("followToggle failed:", e);

        setFollowing((prev) => !prev);
      } finally {
        router.refresh();
      }
    });
  };

  return (
    <section className="w-full">
      <div className="flex-1 flex items-start gap-5">
        <ProfileImage displayName={profile.name} imageUrl={profile.avatar ?? ""} size="xl" />
        <div className="flex-1 flex flex-col">
          <div className="flex-1 flex justify-between">
            <div className="pt-1">
              <h1 className="text-[22px] font-bold text-slate-900 dark:text-gray-300">
                {profile.name}
              </h1>
              <p className="mt-1 text-[13px] leading-5 text-slate-500 dark:text-gray-400">
                {profile.bio || " "}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              {isMe ? (
                <>
                  <Button
                    variant="edit"
                    className="px-3 py-1 min-w-20"
                    style={
                      isDarkMode ? { backgroundColor: "#e2e6ec", color: "#1e2939" } : undefined
                    }
                    onClick={() =>
                      router.push(`/profile/edit?mode=edit&return=/profile/${profile.id}`)
                    }
                  >
                    수정
                  </Button>
                  <Button
                    variant="common"
                    className="px-3 py-1 min-w-20"
                    style={isDarkMode ? { color: "#e2e6ec" } : undefined}
                    onClick={handleSignOut}
                    disabled={signOutPending}
                  >
                    {signOutPending ? "로그아웃 중…" : "로그아웃"}
                  </Button>
                </>
              ) : (
                <Button
                  variant={following ? "common" : "edit"}
                  className="px-4 py-1.5 text-sm"
                  onClick={handleFollowToggle}
                  disabled={followPending}
                >
                  {followPending ? "처리 중..." : following ? "언팔로우" : "팔로우"}
                </Button>
              )}
            </div>
          </div>

          <div className="mt-3 flex items-center gap-6 text-[13px]">
            <Stat
              icon={<Users className="h-4 w-4 text-slate-500 dark:text-gray-400" aria-hidden />}
              label="팔로워"
              value={profile.followerCount}
              onClick={() => router.push(`/profile/${profile.id}/followers`)}
            />
            <Stat
              icon={<UserCheck className="h-4 w-4 text-slate-500 dark:text-gray-400" aria-hidden />}
              label="팔로잉"
              value={profile.followingCount}
              onClick={() => router.push(`/profile/${profile.id}/following`)}
            />
            <Stat
              icon={<PenSquare className="h-4 w-4 text-slate-500 dark:text-gray-400" aria-hidden />}
              label="작성글"
              value={profile.postCount}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({
  icon,
  label,
  value,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  value: number | null | undefined;
  onClick?: () => void;
}) {
  const clickable = !!onClick;

  const inner = (
    <>
      <div className="flex items-center gap-1.5 text-slate-600 dark:text-gray-300">
        {icon}
        <span>{label}</span>
      </div>
      <b className="ml-0.5 tabular-nums text-slate-900 dark:text-gray-400">
        {typeof value === "number" ? value : 0}
      </b>
    </>
  );

  if (clickable) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="flex items-center gap-2 rounded-full px-2 py-1 text-left text-[13px] text-slate-700 hover:bg-slate-100"
      >
        {inner}
      </button>
    );
  }

  return <div className="flex items-center gap-2">{inner}</div>;
}
