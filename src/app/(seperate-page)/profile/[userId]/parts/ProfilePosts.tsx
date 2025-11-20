"use client";

import { useState, useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import InfiniteScroll from "react-infinite-scroll-component";
import PostTabs from "./PostTabs";
import PostList from "./PostList";
import { clearRecentViews } from "./actions";
import type { PostWithTags } from "../page";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import Button from "@/components/common/Button";

const POST_PAGE_SIZE = 10;

type Props = {
  written: PostWithTags[];
  viewed: PostWithTags[];
  isMe: boolean;
};

export default function ProfilePosts({ written, viewed, isMe }: Props) {
  const [active, setActive] = useState<"posts" | "views">("posts");
  const [postLimit, setPostLimit] = useState(POST_PAGE_SIZE);
  const [viewLimit, setViewLimit] = useState(POST_PAGE_SIZE);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleTabChange = useCallback((newActive: "posts" | "views") => {
    setActive(newActive);
    setPostLimit(POST_PAGE_SIZE);
    setViewLimit(POST_PAGE_SIZE);
  }, []);

  const currentPosts = active === "posts" ? written : viewed;
  const currentLimit = active === "posts" ? postLimit : viewLimit;
  const setCurrentLimit = active === "posts" ? setPostLimit : setViewLimit;

  // ⚠️ ConfirmDialog 가 요구하는 타입: () => Promise<void>
  const handleClearViews = async () => {
    if (!isMe) return;

    // useTransition 안에서 실제 삭제 로직 실행
    await new Promise<void>((resolve) => {
      startTransition(async () => {
        const result = await clearRecentViews();

        if (!result?.ok) {
          console.error("[handleClearViews] failed:", result);
        } else {
          router.refresh();
        }

        resolve();
      });
    });
  };

  console.log("[ProfilePosts] rendered, isMe =", isMe);

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200 dark:bg-[#141d2b] dark:border-[#364153]">
      <div className="mb-5 flex items-center justify-between gap-4">
        <PostTabs
          active={active}
          onChange={handleTabChange}
          postsCount={written.length}
          viewsCount={viewed.length}
        />

        {active === "views" && isMe && (
          <ConfirmDialog
            title="조회 기록 삭제"
            description="정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
            onConfirm={handleClearViews}
            trigger={
              <Button
                type="button"
                variant="delete"
                className="px-4 py-2 text-xs"
                disabled={isPending}
              >
                {isPending ? "삭제 중..." : "조회 기록 삭제"}
              </Button>
            }
          />
        )}
      </div>

      {currentPosts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 p-12 text-center text-sm text-slate-400 dark:border-slate-700">
          아직 표시할 글이 없어요.
        </div>
      ) : (
        <InfiniteScroll
          dataLength={Math.min(currentLimit, currentPosts.length)}
          next={() => setCurrentLimit((prev) => prev + POST_PAGE_SIZE)}
          hasMore={currentLimit < currentPosts.length}
          scrollableTarget="main-scroll-container"
          scrollThreshold={0.95}
          loader={
            <p className="text-center text-slate-400 py-4 dark:text-slate-500">불러오는 중…</p>
          }
          // endMessage={
          //   <p className="text-center text-slate-400 py-4 dark:text-slate-500">
          //     마지막 게시글입니다.
          //   </p>
          // }
        >
          <PostList posts={currentPosts.slice(0, currentLimit)} hideTitle />
        </InfiniteScroll>
      )}
    </section>
  );
}
