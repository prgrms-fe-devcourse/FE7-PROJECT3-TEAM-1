import { Heart, MessageCircle } from "lucide-react";

export default function PostDetailSkeleton() {
  return (
    <section className="p-10 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.06)] bg-white border border-slate-200 dark:bg-[#141d2b] dark:border-[#364153]">
      <div className="flex flex-col gap-6 animate-pulse dark:bg-[#141d2b] dark:border-[#364153]">
        <div className="flex gap-4">
          <div className="rounded-full bg-slate-100  w-15 h-15 dark:bg-[#364153]"></div>
          <div className="flex-1 flex justify-between items-start">
            <div className="flex flex-col gap-0.5">
              <div className="w-30 h-7 bg-slate-100  rounded-sm dark:bg-[#364153]"></div>
              <div className="w-20 h-5 bg-slate-100  rounded-sm dark:bg-[#364153]"></div>
            </div>
            <div className="w-20 h-7 rounded-2xl bg-slate-100 dark:bg-[#364153]"></div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="w-2/3 h-7 bg-slate-100  rounded-sm dark:bg-[#364153]"></div>
          <div className="w-full h-6 bg-slate-100  rounded-sm dark:bg-[#364153]"></div>
        </div>
        <div className="flex gap-5 border-t border-slate-300 pt-5 dark:border-slate-700">
          <div className="flex items-center justify-center gap-1">
            <Heart size={18} fill="currentColor" className="text-slate-300 dark:text-slate-700" />
            <div className="w-5 h-4 bg-slate-100  rounded-sm dark:bg-[#364153]"></div>
          </div>
          <div className="flex items-center justify-center gap-1 dark:stroke-slate-300 dark:fill-slate-300">
            <MessageCircle
              size={16}
              fill="currentColor"
              className="text-slate-300 dark:text-slate-700"
            />
            <div className="w-5 h-4 bg-slate-100  rounded-sm dark:bg-[#364153]"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
