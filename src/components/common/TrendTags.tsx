import { useBreakpoint } from "@/hooks/useBreakPoint";
import { setTrendTagsRank } from "@/utils/helpers";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export const revalidate = 3600; // 1시간마다 재검증

export default async function TrendTags() {
  const supabase = await createClient();

  // 지난 7일간 날짜 범위
  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const start = new Date(end);
  start.setDate(start.getDate() - 7);
  start.setHours(0, 0, 0, 0);

  const { data: tags, error: tagsError } = await supabase
    .from("hashtags")
    .select("content")
    .gte("created_at", start.toISOString())
    .lte("created_at", end.toISOString());

  if (tagsError) {
    return (
      <section className="flex flex-col gap-3 p-6 bg-white border dark:bg-[#141d2b] dark:border-[#364153] border-slate-200 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
        <h2 className="text-lg font-bold text-slate-900">실시간 트렌드 태그</h2>
        <p>트렌드 태그가 존재하지 않습니다.</p>
      </section>
    );
  }

  const tagRanks = setTrendTagsRank(tags, 6);

  return (
    <section className="flex flex-col gap-3 p-6 bg-white border dark:bg-[#141d2b] dark:border-[#364153] border-slate-200 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
      <h2 className="text-lg font-bold text-slate-900 dark:text-gray-300">실시간 트렌드 태그</h2>
      <div className="flex flex-wrap gap-2">
        {tagRanks.map(({ tag }) => (
          <Link
            key={tag}
            className="px-3 py-2 border dark:bg-[#141d2b] dark:border-[#364153] border-slate-200 rounded-4xl text-sm hover:bg-slate-200"
            href={`/search?query=${tag}`}
          >
            # {tag}
          </Link>
        ))}
      </div>
    </section>
  );
}
