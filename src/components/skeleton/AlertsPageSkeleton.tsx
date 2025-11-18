export default function AlertsPageSkeleton() {
  return (
    <div className="mx-auto p-6 flex flex-col ">
      <div className="w-20 h-8 bg-slate-300 rounded-sm animate-pulse dark:bg-[#364153] mb-3"></div>
      <div className="flex justify-between items-center mt-3 mb-6">
        <div className="w-48 h-6 bg-slate-300 rounded-sm animate-pulse dark:bg-[#364153] pt-3"></div>
        <div className="w-36 h-[38px] bg-slate-300 rounded-xl animate-pulse dark:bg-[#364153]"></div>
      </div>

      {/* 알림 리스트 */}
      <div className="flex flex-col gap-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden border border-[#e3e3e6] rounded-2xl bg-white dark:border-slate-700 dark:bg-[#141d2b] dark:shadow-[0px_4px_12px_rgba(0,0,0,0.06)]"
          >
            <div className="flex justify-between items-center w-full px-6 py-4 animate-pulse">
              <div className="flex items-center flex-1">
                <div className="w-10 h-10 bg-slate-300 rounded-sm shrink-0 mr-4 dark:bg-[#364153]"></div>
                <div className="rounded-full bg-slate-300 w-10 h-10 shrink-0 mr-2 dark:bg-[#364153]"></div>

                <div className="flex flex-col gap-2 flex-1">
                  <div className="w-64 h-5 bg-slate-300 rounded-sm dark:bg-[#364153]"></div>
                  <div className="w-24 h-4 bg-slate-300 rounded-sm dark:bg-[#364153]"></div>
                </div>
              </div>
              <div className="flex items-center shrink-0 ml-4">
                <div className="w-2 h-2 bg-slate-300 rounded-full dark:bg-[#364153]"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
