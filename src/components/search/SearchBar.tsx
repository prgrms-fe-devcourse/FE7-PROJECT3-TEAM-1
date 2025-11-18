"use client";

import { Search } from "lucide-react";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
};

export default function SearchBar({ value, onChange, onSubmit }: Props) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex items-center gap-3 w-full rounded-xl border  border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-[#141d2b]">
        <Search className="w-5 h-5 text-slate-400" />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="커피"
          className="w-full bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400 dark:text-slate-300 dark:placeholder:text-slate-400"
        />
      </div>
    </form>
  );
}
