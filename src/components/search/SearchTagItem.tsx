"use client";

import type { SearchTag } from "./types";

export default function SearchTagItem({ tag }: { tag: SearchTag }) {
  return (
    <article className="p-4 rounded-2xl bg-white border border-slate-200 dark:bg-[#141d2b] dark:border-[#364153]">
      <span className="inline-flex items-center px-4 py-1.5 bg-slate-50 text-slate-700 text-sm border border-slate-200 dark:bg-[#141d2b] dark:border-[#364153] rounded-4xl hover:bg-slate-200 dark:text-gray-300">
        #{tag.content}
      </span>
    </article>
  );
}
