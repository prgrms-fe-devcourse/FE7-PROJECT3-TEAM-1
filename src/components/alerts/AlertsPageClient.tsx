"use client";

import Image from "next/image";

import heart from "@/assets/alerts/heart.svg";
import commentIcon from "@/assets/alerts/comment.svg";
import followIcon from "@/assets/alerts/follow.svg";
import blueDot from "@/assets/alerts/bluepoint.svg";
import ProfileImage from "../common/ProfileImage";
import { useEffect } from "react";

import {} from "@/utils/supabase/client";
import { timeAgo } from "./TimeAgo";
import { useRouter } from "next/navigation";
import { useNotificationStore } from "@/store/alarmStore";

export default function AlertsPageClient({
  notifications: initialNotifications,
  uid,
}: {
  notifications: Notification[];
  uid: string;
}) {
  const router = useRouter();

  const notifications = useNotificationStore((s) => s.notifications);
  const setNotifications = useNotificationStore((s) => s.setNotifications);
  const setUnReadCount = useNotificationStore((s) => s.setUnReadCount);
  const markAllRead = useNotificationStore((s) => s.markAllRead);

  useEffect(() => {
    if (initialNotifications) {
      setNotifications(initialNotifications);
      setUnReadCount(initialNotifications.filter((n) => !n.is_read).length);
    }
  }, [initialNotifications, setNotifications, setUnReadCount]);

  const handleClick = async (n: Notification) => {
    setNotifications(
      notifications.map((i) =>
        i.id === n.id
          ? {
              ...i,
              is_read: true,
            }
          : i,
      ),
    );

    await fetch("api/notifications/read", {
      method: "POST",
      body: JSON.stringify({ id: n.id }),
    });

    if (n.type === "follow") {
      router.push(`/profile/${n.sender.id}`);
    } else {
      router.push(`/community/${n.post_id}`);
    }
  };

  const allRead = async () => {
    await markAllRead(uid);
  };

  const getMessage = (n: Notification) => {
    const name = n.sender.display_name;
    switch (n.type) {
      case "like":
        return `${name}님이 회원님의 게시글을 좋아합니다`;
      case "comment":
        return `${name}님이 회원님의 게시글에 댓글을 남겼습니다:"${n.comment?.content}"`;
      case "follow":
        return `${name}님이 회원님을 팔로우하기 시작했습니다`;
    }
  };

  return (
    <div className="mx-auto p-6 flex flex-col">
      <p className="font-bold text-[28px]">알림</p>

      {/* 상단 버튼 */}
      <div className="flex justify-between items-center mt-3">
        <p className="text-[16px] text-[#4A5565] pt-3 dark:text-slate-300">
          {notifications.filter((n) => !n.is_read).length}개의 읽지 않은 알림이 있습니다.
        </p>

        <button
          onClick={allRead}
          className="w-36 h-[38px] border border-[#d7d7da]  dark:border-slate-700 dark:bg-[#141d2b] dark:text-slate-300 rounded-xl text-[14px] font-bold text-[#364153] cursor-pointer active:scale-97 transition hover:opacity-80"
        >
          모두 읽음으로 표시
        </button>
      </div>

      {/* 알림 리스트 */}
      <div className="overflow-hidden mt-6 border border-[#e3e3e6] rounded-2xl bg-white divide-y divide-[#f2f2f4] dark:border-slate-700 dark:bg-[#141d2b] dark:divide-slate-700 shadow-[0px_4px_12px_rgba(0,0,0,0.06)]">
        {notifications.length === 0 ? (
          <div className="flex justify-center items-center font-bold text-[40px] py-20 dark:text-slate-300">
            받은 알림이 없습니다
          </div>
        ) : (
          notifications.map((n) => (
            <button
              key={n.id}
              onClick={() => handleClick(n)}
              className={`
                flex justify-between items-center w-full px-6 py-4 text-left transition cursor-pointer hover:opacity-80 active:scale-[.99]
                ${n.is_read ? "bg-white dark:bg-[#141d2b]" : "bg-[#EFF6FF] dark:bg-[#141d2b]"}
              `}
            >
              {/* 왼쪽 */}
              <div className="flex items-center">
                <Image
                  src={n.type === "like" ? heart : n.type === "comment" ? commentIcon : followIcon}
                  alt="알림 아이콘"
                  width={40}
                  height={40}
                  className="shrink-0 mr-4"
                />

                <ProfileImage
                  displayName={n.sender.display_name}
                  imageUrl={n.sender.image_url}
                  size="sm"
                  className="shrink-0 mr-2"
                />

                <div className="flex flex-col">
                  <p className="text-[15px] text-[#1A1A1A] dark:text-slate-100">{getMessage(n)}</p>
                  <p className="text-[13px] text-[#6A7282] dark:text-slate-300">
                    {timeAgo(n.created_at)}
                  </p>
                </div>
              </div>

              {/* 오른쪽 파란 점 (읽지 않았을 때만 표시) */}
              {!n.is_read && (
                <Image src={blueDot} alt="새로운 알림" width={8} height={8} className="shrink-0" />
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );
}
