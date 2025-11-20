"use client";

import clsx from "clsx";

type Props = {
  active: "posts" | "views";
  onChange: (t: "posts" | "views") => void;
  postsCount?: number;
  viewsCount?: number;
  onClearViews?: () => void;
};

export default function PostTabs({
  active,
  onChange,
  postsCount = 0,
  viewsCount = 0,
  onClearViews,
}: Props) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="inline-flex rounded-full bg-slate-100 p-1 gap-1 border border-slate-200 dark:bg-[#141d2b] dark:border-[#364153]">
        <button
          type="button"
          onClick={() => onChange("posts")}
          className={clsx(
            "rounded-full px-5 py-2 text-[14px] font-semibold transition",
            active === "posts"
              ? "bg-white shadow-sm text-slate-900 dark:text-gray-400 dark:bg-gray-700"
              : "text-slate-600 hover:text-slate-800 dark:text-gray-400",
          )}
        >
          작성한 글{" "}
          <span className="tabular-nums text-slate-400 dark:text-gray-400">
            ({postsCount})
          </span>
        </button>
        <button
          type="button"
          onClick={() => onChange("views")}
          className={clsx(
            "rounded-full px-5 py-2 text-[14px] font-semibold transition",
            active === "views"
              ? "bg-white shadow-sm text-slate-900 dark:text-gray-400 dark:bg-gray-700"
              : "text-slate-600 hover:text-slate-800 dark:text-gray-400",
          )}
        >
          조회한 글{" "}
          <span className="tabular-nums text-slate-400 dark:text-gray-400">
            ({viewsCount})
          </span>
        </button>
      </div>

      {active === "views" && onClearViews && (
        <button
          type="button"
          onClick={onClearViews}
          className="text-xs px-3 py-1 rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-[#364153] dark:text-gray-400 dark:hover:bg-[#1b2636]"
        >
          조회한 글 모두 삭제
        </button>
      )}
    </div>
  );
}
