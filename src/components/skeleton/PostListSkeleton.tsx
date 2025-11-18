import { Heart, MessageCircle } from "lucide-react";
import { twMerge } from "tailwind-merge";

export default function PostListSkeleton() {
  return (
    <>
      <div className="p-5 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.06)] bg-white border border-slate-300 dark:bg-[#141d2b] dark:border-[#364153]">
        <div className="flex gap-4 pb-5 animate-pulse">
          <div className="rounded-full bg-slate-100  w-15 h-15 dark:bg-[#364153]"></div>
          <div className="flex-1 flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-0.5">
                <div className="w-30 h-6 bg-slate-100  rounded-sm dark:bg-[#364153]"></div>
                <div className="w-20 h-4 bg-slate-100  rounded-sm dark:bg-[#364153]"></div>
              </div>
              <div
                className={twMerge(
                  "rounded-2xl bg-slate-100 ",
                  "w-10 h-4.5",
                  "md:w-15 md:h-6",
                  "xl:w-20 xl:h-7",
                  "dark:bg-[#364153]",
                )}
              ></div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="w-2/3 h-7 bg-slate-100  rounded-sm dark:bg-[#364153]"></div>
              <div className="w-3/4 h-6 bg-slate-100  rounded-sm dark:bg-[#364153]"></div>
            </div>
          </div>
        </div>
        <div className="flex gap-5 border-t border-slate-300 pt-5 animate-pulse dark:border-slate-700">
          <div className="flex items-center justify-center gap-1">
            <Heart
              size={18}
              className="stroke-slate-300 fill-slate-300 dark:stroke-[#364153] dark:fill-[#364153]"
            />
            <div className="w-5 h-4 bg-slate-100  rounded-sm dark:bg-[#364153]"></div>
          </div>
          <div className="flex items-center justify-center gap-1">
            <MessageCircle
              size={16}
              className="stroke-slate-300 fill-slate-300 dark:stroke-[#364153] dark:fill-[#364153]"
            />
            <div className="w-5 h-4 bg-slate-100  rounded-sm dark:bg-[#364153]"></div>
          </div>
        </div>
      </div>
    </>
  );
}
