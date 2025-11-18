type Tab = "all" | "posts" | "users" | "tags";

export type { Tab };

const TabButton = ({
  t,
  label,
  count,
  active,
  onChange,
}: {
  t: Tab;
  label: string;
  count: number;
  active: Tab;
  onChange: (t: Tab) => void;
}) => {
  const isActive = active === t;

  return (
    <button
      type="button"
      onClick={() => onChange(t)}
      aria-pressed={isActive}
      className={[
        "inline-flex items-center justify-center gap-1 rounded-md px-4 py-2 text-sm font-medium transition cursor-pointer select-none",
        isActive
          ? "bg-slate-900 text-white shadow-sm dark:bg-[#454e5d] dark:text-slate-300 dark:hover:bg-[#1e2939]"
          : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-[#141d2b] dark:text-slate-400 dark:hover:bg-[#1e2939]",
      ].join(" ")}
    >
      <span className="dark:text-slate-300">{label}</span>
      <span className="text-xs opacity-80 dark:text-slate-400">({count})</span>
    </button>
  );
};

export default function SearchTabs({
  active,
  counts,
  onChange,
}: {
  active: Tab;
  counts: { posts: number; users: number; tags: number };
  onChange: (t: Tab) => void;
}) {
  const total = counts.posts + counts.users + counts.tags;

  return (
    <div className="flex items-center gap-2 text-sm flex-wrap dark:text-slate-300">
      <TabButton t="all" label="전체" count={total} active={active} onChange={onChange} />
      <TabButton
        t="posts"
        label="게시글"
        count={counts.posts}
        active={active}
        onChange={onChange}
      />
      <TabButton t="tags" label="태그" count={counts.tags} active={active} onChange={onChange} />
      <TabButton
        t="users"
        label="사용자"
        count={counts.users}
        active={active}
        onChange={onChange}
      />
    </div>
  );
}
