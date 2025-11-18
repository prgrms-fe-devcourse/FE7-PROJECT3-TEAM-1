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
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          console.error("[search] getUser error", userError);
        }

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
        if (e instanceof Error) {
          setErr(e.message ?? "알 수 없는 오류");
        } else {
          setErr("알 수 없는 오류");
        }
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

  // 검색어가 바뀌면 무한 스크롤 개수 리셋
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
      {/* 검색창 + 탭 */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-[0_4px_16px_rgba(15,23,42,0.06)] px-6 py-5 flex flex-col gap-4 dark:bg-[#141827] dark:border-[#181d2a]">
        <SearchBar value={input} onChange={setInput} onSubmit={onSubmit} />
        <SearchTabs active={active} counts={counts} onChange={onChangeTab} />
      </div>

      {/* 🔹 로딩 중: 탭에 맞는 스켈레톤 표시 (여기서 '전체' 탭도 처리) */}
      {loading && !err && (
        <div className="flex flex-col gap-6">
          {/* ✨ 전체(all) 탭: 사용자/태그/게시글 섹션 스켈레톤 모두 노출 */}
          {active === "all" && (
            <>
              {/* 사용자 섹션 스켈레톤 */}
              <section className="rounded-2xl bg-white border border-slate-200 p-5 flex flex-col gap-4 dark:bg-[#141827] dark:border-[#181d2a]">
                <div className="flex items-center justify-between">
                  <h3 className="text-slate-700 font-semibold">사용자</h3>
                </div>
                <SearchUserListSkeleton count={3} />
              </section>

              {/* 태그 섹션 스켈레톤 */}
              <section className="rounded-2xl bg-white border border-slate-200 p-5 flex flex-col gap-4 dark:bg-[#141827] dark:border-[#181d2a]">
                <div className="flex items-center justify-between">
                  <h3 className="text-slate-700 font-semibold">태그</h3>
                </div>
                <SearchTagListSkeleton count={6} />
              </section>

              {/* 게시글 섹션 스켈레톤 */}
              <section className="rounded-2xl bg-white border border-slate-200 p-5 flex flex-col gap-4 dark:bg-[#141827] dark:border-[#181d2a]">
                <div className="flex items-center justify-between">
                  <h3 className="text-slate-700 font-semibold">게시글</h3>
                </div>
                <SearchPostListSkeleton count={3} />
              </section>
            </>
          )}

          {/* 단일 탭 스켈레톤들 */}
          {active === "posts" && <SearchPostListSkeleton count={POST_PAGE_SIZE} />}
          {active === "users" && <SearchUserListSkeleton count={USER_PAGE_SIZE} />}
          {active === "tags" && <SearchTagListSkeleton count={TAG_PAGE_SIZE} />}
        </div>
      )}

      {/* 에러 */}
      {err && <p className="text-red-500">오류: {err}</p>}

      {/* 🔹 실제 데이터 렌더링 (로딩 끝 + 에러 없음일 때) */}
      {!loading && !err && (
        <div className="flex flex-col gap-6">
          {/* ✨ 전체(all) 탭: 3개 섹션 함께 노출 */}
          {active === "all" && (
            <>
              {/* 사용자 섹션 */}
              {filteredUsers.length > 0 && (
                <section className="rounded-2xl bg-white border border-slate-200 p-5 flex flex-col gap-4 dark:bg-[#141827] dark:border-[#181d2a]">
                  <div className="flex items-center justify-between">
                    <h3 className="text-slate-700 font-semibold">사용자</h3>
                    {filteredUsers.length > 3 && (
                      <button
                        type="button"
                        onClick={() => setShowAllUsers((prev) => !prev)}
                        className="text-xs text-slate-500 hover:text-slate-700 cursor-pointer"
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
                <section className="rounded-2xl bg-white border border-slate-200 p-5 flex flex-col gap-4 dark:bg-[#141827] dark:border-[#181d2a]">
                  <div className="flex items-center justify-between">
                    <h3 className="text-slate-700 font-semibold">태그</h3>
                    {filteredTags.length > 3 && (
                      <button
                        type="button"
                        onClick={() => setShowAllTags((prev) => !prev)}
                        className="text-xs text-slate-500 hover:text-slate-700 cursor-pointer"
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
                <section className="rounded-2xl bg-white border border-slate-200 p-5 flex flex-col gap-4 dark:bg-[#141827] dark:border-[#181d2a]">
                  <div className="flex items-center justify-between">
                    <h3 className="text-slate-700 font-semibold">게시글</h3>
                    {filteredPosts.length > 3 && (
                      <button
                        type="button"
                        onClick={() => setShowAllPosts((prev) => !prev)}
                        className="text-xs text-slate-500 hover:text-slate-700 cursor-pointer"
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

          {/* 게시글 탭 단독 */}
          {active === "posts" && (
            <>
              {filteredPosts.length === 0 ? (
                <p className="text-center text-slate-400 py-6">
                  해당 키워드와 일치하는 게시글이 없습니다.
                </p>
              ) : (
                <InfiniteScroll
                  dataLength={Math.min(postLimit, filteredPosts.length)}
                  next={() => setPostLimit((prev) => prev + POST_PAGE_SIZE)}
                  hasMore={postLimit < filteredPosts.length}
                  scrollThreshold={1}
                  loader={<p className="text-center text-slate-400 py-4">불러오는 중…</p>}
                  endMessage={
                    <p className="text-center text-slate-400 py-4">마지막 게시글입니다.</p>
                  }
                >
                  <div className="flex flex-col gap-4">
                    {filteredPosts.slice(0, postLimit).map((post) => (
                      <SearchPostItem key={post.id} post={post} />
                    ))}
                  </div>
                </InfiniteScroll>
              )}
            </>
          )}

          {/* 사용자 탭 단독 */}
          {active === "users" && (
            <>
              {filteredUsers.length === 0 ? (
                <p className="text-center text-slate-400 py-6">
                  해당 키워드와 일치하는 사용자가 없습니다.
                </p>
              ) : (
                <InfiniteScroll
                  dataLength={Math.min(userLimit, filteredUsers.length)}
                  next={() => setUserLimit((prev) => prev + USER_PAGE_SIZE)}
                  hasMore={userLimit < filteredUsers.length}
                  scrollThreshold={1}
                  loader={<p className="text-center text-slate-400 py-4">불러오는 중…</p>}
                  endMessage={
                    <p className="text-center text-slate-400 py-4">마지막 사용자입니다.</p>
                  }
                >
                  <div className="flex flex-col gap-3">
                    {filteredUsers.slice(0, userLimit).map((user) => (
                      <SearchUserItem key={user.id} user={user} />
                    ))}
                  </div>
                </InfiniteScroll>
              )}
            </>
          )}

          {/* 태그 탭 단독 */}
          {active === "tags" && (
            <>
              {filteredTags.length === 0 ? (
                <p className="text-center text-slate-400 py-6">
                  해당 키워드와 일치하는 태그가 없습니다.
                </p>
              ) : (
                <InfiniteScroll
                  dataLength={Math.min(tagLimit, filteredTags.length)}
                  next={() => setTagLimit((prev) => prev + TAG_PAGE_SIZE)}
                  hasMore={tagLimit < filteredTags.length}
                  scrollThreshold={1}
                  loader={<p className="text-center text-slate-400 py-4">불러오는 중…</p>}
                  endMessage={<p className="text-center text-slate-400 py-4">마지막 태그입니다.</p>}
                >
                  <div className="grid grid-cols-1 gap-3">
                    {filteredTags.slice(0, tagLimit).map((tag) => (
                      <SearchTagItem key={tag.content} tag={tag} />
                    ))}
                  </div>
                </InfiniteScroll>
              )}
            </>
          )}
        </div>
      )}
    </section>
  );
}
