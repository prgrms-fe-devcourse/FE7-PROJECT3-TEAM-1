"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import InfiniteScroll from "react-infinite-scroll-component";

import SearchBar from "@/components/search/SearchBar";
import SearchTabs from "@/components/search/SearchTabs";
import SearchPostItem from "@/components/search/SearchPostItem";
import SearchUserItem from "@/components/search/SearchUserItem";
import SearchTagItem from "@/components/search/SearchTagItem";

import {
  SearchUserListSkeleton,
  SearchTagListSkeleton,
  SearchPostListSkeleton,
} from "@/components/skeleton/SearchSkeleton";

import { fetchPostsWithLikes } from "@/features/search/api/fetchPosts";
import { fetchUsers } from "@/features/search/api/fetchUsers";
import { fetchTags } from "@/features/search/api/fetchTags";
import { mapRowToCommunityPost } from "@/features/search/mappers/post.mapper";
import { mapRowToSearchUser } from "@/features/search/mappers/user.mapper";
import { mapRowToSearchTag } from "@/features/search/mappers/tag.mapper";

import type { Tab } from "@/components/search/SearchTabs";
import { createClient } from "@/utils/supabase/client";

export default function Page() {
  const searchParams = useSearchParams();
  const q = (searchParams.get("query") || "").trim();
  const initialTab = (searchParams.get("type") as Tab) || "posts";

  const [input, setInput] = useState(q);
  const [active, setActive] = useState<Tab>(initialTab);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [posts, setPosts] = useState<ReturnType<typeof mapRowToCommunityPost>[]>([]);
  const [users, setUsers] = useState<ReturnType<typeof mapRowToSearchUser>[]>([]);
  const [tags, setTags] = useState<ReturnType<typeof mapRowToSearchTag>[]>([]);

  const [showAllUsers, setShowAllUsers] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);
  const [showAllPosts, setShowAllPosts] = useState(false);

  const POST_PAGE_SIZE = 10;
  const USER_PAGE_SIZE = 10;
  const TAG_PAGE_SIZE = 15;

  const [postLimit, setPostLimit] = useState(POST_PAGE_SIZE);
  const [userLimit, setUserLimit] = useState(USER_PAGE_SIZE);
  const [tagLimit, setTagLimit] = useState(TAG_PAGE_SIZE);

  // 최초 로딩
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr(null);

        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        const userId = user?.id ?? null;

        const [{ posts: rawPosts, likes }, u, t] = await Promise.all([
          fetchPostsWithLikes(),
          fetchUsers(),
          fetchTags(),
        ]);

        setPosts(rawPosts.map((row) => mapRowToCommunityPost(row, likes, userId)));
        setUsers(u.map(mapRowToSearchUser));
        setTags(t.map(mapRowToSearchTag));
      } catch (e) {
        setErr(e instanceof Error ? e.message : "알 수 없는 오류");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const updateUrl = (nextQ: string, nextTab: Tab) => {
    const url =
      `/search${nextQ || nextTab !== "posts" ? "?" : ""}` +
      [nextQ && `query=${encodeURIComponent(nextQ)}`, nextTab !== "posts" && `type=${nextTab}`]
        .filter(Boolean)
        .join("&");
    window.history.replaceState(null, "", url);
  };

  const onSubmit = () => updateUrl(input, active);
  const onChangeTab = (t: Tab) => {
    setActive(t);
    updateUrl(input, t);
  };

  const needle = q.toLowerCase();

  // 검색어가 바뀌면 무한스크롤 리셋
  useEffect(() => {
    setPostLimit(POST_PAGE_SIZE);
    setUserLimit(USER_PAGE_SIZE);
    setTagLimit(TAG_PAGE_SIZE);
  }, [needle]);

  const filteredPosts = useMemo(() => {
    if (!needle) return posts;
    return posts.filter((p) => {
      const hay = [
        p.title,
        p.content,
        p.users?.display_name ?? "",
        ...(p.tags ?? []).map((t) => `#${t}`),
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(needle);
    });
  }, [needle, posts]);

  const filteredUsers = useMemo(() => {
    if (!needle) return users;
    return users.filter((u) =>
      [u.display_name, u.bio ?? ""].join(" ").toLowerCase().includes(needle),
    );
  }, [needle, users]);

  const filteredTags = useMemo(() => {
    if (!needle) return tags;
    return tags.filter((t) => t.content.toLowerCase().includes(needle));
  }, [needle, tags]);

  const counts = {
    posts: filteredPosts.length,
    users: filteredUsers.length,
    tags: filteredTags.length,
  };

  return (
    <section className="flex flex-col gap-6">
      <div className="rounded-2xl bg-card border border-border shadow-[0_4px_16px_rgba(15,23,42,0.06)] px-6 py-5 flex flex-col gap-4">
        <SearchBar value={input} onChange={setInput} onSubmit={onSubmit} />
        <SearchTabs active={active} counts={counts} onChange={onChangeTab} />
      </div>

      {/* 로딩 중 (스켈레톤 보여주기) */}
      {loading && !err && (
        <div className="flex flex-col gap-6">
          {/* 전체 탭 */}
          {active === "all" && (
            <>
              <section className="rounded-2xl bg-card border border-border p-5">
                <h3 className="font-semibold text-slate-700 dark:text-gray-300 mb-4">사용자</h3>
                <SearchUserListSkeleton count={3} />
              </section>

              <section className="rounded-2xl bg-card border border-border p-5">
                <h3 className="font-semibold text-slate-700 dark:text-gray-300 mb-4">태그</h3>
                <SearchTagListSkeleton count={6} />
              </section>

              <section className="rounded-2xl bg-card border border-border p-5">
                <h3 className="font-semibold text-slate-700 dark:text-gray-300 mb-4">게시글</h3>
                <SearchPostListSkeleton count={3} />
              </section>
            </>
          )}

          {/* 단독 탭 */}
          {active === "posts" && <SearchPostListSkeleton count={POST_PAGE_SIZE} />}
          {active === "users" && <SearchUserListSkeleton count={USER_PAGE_SIZE} />}
          {active === "tags" && <SearchTagListSkeleton count={TAG_PAGE_SIZE} />}
        </div>
      )}
      {/* 에러 */}
      {err && <p className="text-red-500">{err}</p>}

      {/* 로딩 후 실제 데이터 보여주기 */}
      {!loading && !err && (
        <div className="flex flex-col gap-6">
          {/* 전체 탭 */}
          {active === "all" && (
            <>
              {/* 사용자 섹션 */}
              {filteredUsers.length > 0 && (
                <section className="rounded-2xl bg-card border border-border p-5 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-slate-700 font-semibold dark:text-slate-300">사용자</h3>
                    {filteredUsers.length > 3 && (
                      <button
                        type="button"
                        onClick={() => setShowAllUsers((prev) => !prev)}
                        className="text-xs text-slate-500 hover:text-slate-700 cursor-pointer dark:text-slate-400"
                      >
                        {showAllUsers ? "접기" : "더보기"}
                      </button>
                    )}
                  </div>
                  <div className="flex flex-col gap-3">
                    {(showAllUsers ? filteredUsers : filteredUsers.slice(0, 3)).map((user) => (
                      <SearchUserItem key={user.id} user={user} />
                    ))}
                  </div>
                </section>
              )}

              {/* 태그 섹션 */}
              {filteredTags.length > 0 && (
                <section className="rounded-2xl bg-card border border-border p-5 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-slate-700 font-semibold dark:text-slate-300">태그</h3>
                    {filteredTags.length > 3 && (
                      <button
                        type="button"
                        onClick={() => setShowAllTags((prev) => !prev)}
                        className="text-xs text-slate-500 hover:text-slate-700 cursor-pointer dark:text-slate-400"
                      >
                        {showAllTags ? "접기" : "더보기"}
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {(showAllTags ? filteredTags : filteredTags.slice(0, 3)).map((tag) => (
                      <SearchTagItem key={tag.content} tag={tag} />
                    ))}
                  </div>
                </section>
              )}

              {/* 게시글 섹션 */}
              {filteredPosts.length > 0 && (
                <section className="rounded-2xl bg-card border border-border p-5 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-slate-700 font-semibold dark:text-slate-300">게시글</h3>
                    {filteredPosts.length > 3 && (
                      <button
                        type="button"
                        onClick={() => setShowAllPosts((prev) => !prev)}
                        className="text-xs text-slate-500 hover:text-slate-700 cursor-pointer dark:text-slate-300"
                      >
                        {showAllPosts ? "접기" : "더보기"}
                      </button>
                    )}
                  </div>
                  <div className="flex flex-col gap-4">
                    {(showAllPosts ? filteredPosts : filteredPosts.slice(0, 3)).map((post) => (
                      <SearchPostItem key={post.id} post={post} />
                    ))}
                  </div>
                </section>
              )}
            </>
          )}

          {/* 개별 탭 (무한 스크롤 유지) */}
          {active === "posts" && (
            <InfiniteScroll
              dataLength={Math.min(postLimit, filteredPosts.length)}
              next={() => setPostLimit((prev) => prev + POST_PAGE_SIZE)}
              hasMore={postLimit < filteredPosts.length}
              loader={<p className="text-center text-slate-400 py-4">불러오는 중…</p>}
            >
              <div className="flex flex-col gap-4">
                {filteredPosts.slice(0, postLimit).map((post) => (
                  <SearchPostItem key={post.id} post={post} />
                ))}
              </div>
            </InfiniteScroll>
          )}

          {active === "users" && (
            <InfiniteScroll
              dataLength={Math.min(userLimit, filteredUsers.length)}
              next={() => setUserLimit((prev) => prev + USER_PAGE_SIZE)}
              hasMore={userLimit < filteredUsers.length}
              loader={<p className="text-center text-slate-400 py-4">불러오는 중…</p>}
            >
              <div className="flex flex-col gap-3">
                {filteredUsers.slice(0, userLimit).map((user) => (
                  <SearchUserItem key={user.id} user={user} />
                ))}
              </div>
            </InfiniteScroll>
          )}

          {active === "tags" && (
            <InfiniteScroll
              dataLength={Math.min(tagLimit, filteredTags.length)}
              next={() => setTagLimit((prev) => prev + TAG_PAGE_SIZE)}
              hasMore={tagLimit < filteredTags.length}
              loader={<p className="text-center text-slate-400 py-4">불러오는 중…</p>}
            >
              <div className="grid grid-cols-1 gap-3">
                {filteredTags.slice(0, tagLimit).map((tag) => (
                  <SearchTagItem key={tag.content} tag={tag} />
                ))}
              </div>
            </InfiniteScroll>
          )}
        </div>
      )}
    </section>
  );
}
