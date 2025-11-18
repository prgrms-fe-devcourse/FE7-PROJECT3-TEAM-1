export default function DashboardSkeleton() {
  return (
    <div className="w-full h-full bg-gray-50 animate-pulse dark:bg-[#141c2c]">
      <div className="w-full space-y-6">
        {/* 상단  */}
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 dark:bg-[#141c2c]">
          <div className="h-14 bg-gray-100 rounded w-64 mb-16 dark:bg-[#1b263c]"></div>
          <div className="h-96 bg-gray-100 rounded-lg dark:bg-[#1b263c]"></div>
        </div>

        {/* 시장 요약 */}
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 min-h-40 flex items-center dark:bg-[#141c2c]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded-lg dark:bg-[#1b263c]"></div>
              <div className="flex-1">
                <div className="h-7 bg-gray-100 rounded w-64 mb-1 dark:bg-[#1b263c]"></div>
                <div className="h-5 bg-gray-100 rounded w-96 dark:bg-[#1b263c]"></div>
              </div>
            </div>
            <div className="text-right">
              <div className="h-5 bg-gray-100 rounded w-32 mb-1 dark:bg-[#1b263c]"></div>
              <div className="h-6 bg-gray-100 rounded w-40 dark:bg-[#1b263c]"></div>
            </div>
          </div>
        </div>

        {/* 3개 카드 영역 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 dark:bg-[#141c2c]">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-4 md:p-6 dark:bg-[#1b263c]">
              <div className="h-6 bg-gray-100 rounded w-32 mb-4 dark:bg-[#1b263c]"></div>
              <div className="space-y-3">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="flex items-center justify-between">
                    <div className="h-4 bg-gray-100 rounded w-24 dark:bg-[#1b263c]"></div>
                    <div className="h-4 bg-gray-100 rounded w-16 dark:bg-[#1b263c]"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
