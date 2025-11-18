"use client";

import { useState, useCallback } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import PostTabs from "./PostTabs";
import PostList from "./PostList";
import type { PostWithTags } from "../page";

const POST_PAGE_SIZE = 10;

export default function ProfilePosts({
  written,
  viewed,
}: {
  written: PostWithTags[];
  viewed: PostWithTags[];
}) {
  const [active, setActive] = useState<"posts" | "views">("posts");
  const [postLimit, setPostLimit] = useState(POST_PAGE_SIZE);
  const [viewLimit, setViewLimit] = useState(POST_PAGE_SIZE);

  const handleTabChange = useCallback((newActive: "posts" | "views") => {
    setActive(newActive);
    setPostLimit(POST_PAGE_SIZE);
    setViewLimit(POST_PAGE_SIZE);
  }, []);

  const currentPosts = active === "posts" ? written : viewed;
  const currentLimit = active === "posts" ? postLimit : viewLimit;
  const setCurrentLimit = active === "posts" ? setPostLimit : setViewLimit;

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200 dark:bg-[#141d2b] dark:border-[#364153]">
      <div className="mb-5">
        <PostTabs
          active={active}
          onChange={handleTabChange}
          postsCount={written.length}
          viewsCount={viewed.length}
        />
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
          scrollThreshold={0.95}
          loader={
            <p className="text-center text-slate-400 py-4 dark:text-slate-500">불러오는 중…</p>
          }
          endMessage={
            <p className="text-center text-slate-400 py-4 dark:text-slate-500">
              마지막 게시글입니다.
            </p>
          }
        >
          <PostList posts={currentPosts.slice(0, currentLimit)} hideTitle />
        </InfiniteScroll>
      )}
    </section>
  );
}
