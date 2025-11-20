import PostListSkeleton from "./PostListSkeleton";

type ListProps = {
  count?: number;
};

/** 🔹 사용자 카드 스켈레톤 */
function SearchUserItemSkeleton() {
  return (
    <article className="p-5 rounded-2xl bg-white border border-slate-200 shadow-[0_4px_12px_rgba(15,23,42,0.04)] flex gap-3 items-center dark:bg-[#141d2b] dark:border-[#364153] animate-pulse">
      {/* 프로필 이미지 자리 */}
      <div className="w-12 h-12 rounded-full bg-slate-300 dark:bg-[#364153]" />

      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <div className="h-4 w-32 bg-slate-300 rounded-sm dark:bg-[#364153]" />
        <div className="h-3 w-48 bg-slate-300 rounded-sm dark:bg-[#364153]" />
      </div>

      {/* 팔로우 버튼 자리 */}
      <div className="w-20 h-8 rounded-full bg-slate-300 dark:bg-[#364153]" />
    </article>
  );
}

/** 🔹 사용자 리스트 스켈레톤 */
export function SearchUserListSkeleton({ count = 3 }: ListProps) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <SearchUserItemSkeleton key={i} />
      ))}
    </div>
  );
}

/** 🔹 태그 스켈레톤 (간단한 pill 형태) */
function SearchTagItemSkeleton() {
  return <div className="h-9 w-28 rounded-full bg-slate-200 dark:bg-[#364153] animate-pulse" />;
}

export function SearchTagListSkeleton({ count = 6 }: ListProps) {
  return (
    <div className="grid grid-cols-1 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <SearchTagItemSkeleton key={i} />
      ))}
    </div>
  );
}

/** 🔹 게시글 리스트 스켈레톤 (기존 PostListSkeleton 활용) */
export function SearchPostListSkeleton({ count = 3 }: ListProps) {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <PostListSkeleton key={i} />
      ))}
    </div>
  );
}
