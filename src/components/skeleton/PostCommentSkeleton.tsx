import { Heart } from "lucide-react";

export default function PostCommentSkeleton() {
  return (
    <section className="p-10 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.06)] bg-white border border-slate-300 dark:bg-[#141d2b] dark:border-[#364153]">
      <div className="flex flex-col gap-6 animate-pulse dark:bg-[#141d2b] dark:border-[#364153]">
        <div className="w-20 h-7 bg-slate-100  rounded-sm dark:bg-[#364153]"></div>
        <div className="flex gap-3">
          <div className="rounded-full bg-slate-100  w-12 h-12 dark:bg-[#364153]"></div>
          <div className="flex-1 flex gap-2">
            <div className="flex-1 h-20 bg-slate-100  rounded-sm dark:bg-[#364153]"></div>
            <div className="w-30 h-20 bg-slate-100  rounded-sm dark:bg-[#364153]"></div>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="rounded-full bg-slate-100  w-12 h-12 dark:bg-[#364153]"></div>
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex gap-0.5 items-center">
              <div className="w-30 h-6 bg-slate-100  rounded-sm dark:bg-[#364153]"></div>
              <div className="w-20 h-4 bg-slate-100  rounded-sm dark:bg-[#364153]"></div>
            </div>
            <div className="w-2/3 h-6 bg-slate-100  rounded-sm dark:bg-[#364153]"></div>
            <div className="flex gap-2">
              <div className="flex items-center justify-center gap-1">
                <Heart
                  size={18}
                  fill="currentColor"
                  className="text-slate-100 dark:text-slate-700"
                />
                <div className="w-5 h-4 bg-slate-100  rounded-sm dark:bg-[#364153]"></div>
              </div>
              <div className="w-20 h-5 rounded-sm bg-slate-100 dark:bg-[#364153]"></div>
              <div className="w-20 h-5 rounded-sm bg-slate-100 dark:bg-[#364153]"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
