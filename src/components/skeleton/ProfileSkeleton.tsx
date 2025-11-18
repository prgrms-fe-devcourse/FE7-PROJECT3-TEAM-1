import { Heart, MessageCircle } from "lucide-react";

export default function ProfileSkeleton() {
  return (
    <div className="w-full space-y-6">
      <section className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200 dark:bg-[#141d2b] dark:border-[#364153]">
        <div className="flex items-start justify-between gap-6 animate-pulse">
          <div className="flex items-start gap-5">
            <div className="w-20 h-20 rounded-full bg-slate-300 dark:bg-slate-700" />

            <div className="pt-1 space-y-3">
              <div className="w-40 h-7 bg-slate-300 rounded-sm dark:bg-slate-700" />

              <div className="w-64 h-4 bg-slate-300 rounded-sm dark:bg-slate-700" />

              <div className="flex items-center gap-6 mt-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 bg-slate-300 rounded-sm dark:bg-slate-700" />
                  <div className="w-12 h-4 bg-slate-300 rounded-sm dark:bg-slate-700" />
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 bg-slate-300 rounded-sm dark:bg-slate-700" />
                  <div className="w-12 h-4 bg-slate-300 rounded-sm dark:bg-slate-700" />
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 bg-slate-300 rounded-sm dark:bg-slate-700" />
                  <div className="w-12 h-4 bg-slate-300 rounded-sm dark:bg-slate-700" />
                </div>
              </div>
            </div>
          </div>

          <div className="w-24 h-9 rounded-2xl bg-slate-300 dark:bg-slate-700" />
        </div>
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200 dark:bg-[#141d2b] dark:border-[#364153]">
        <div className="mb-4 h-6 w-24 bg-slate-300 rounded-sm animate-pulse dark:bg-slate-700" />

        <div className="h-[360px] w-full rounded-xl bg-slate-200 animate-pulse dark:bg-slate-700" />
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200 dark:bg-[#141d2b] dark:border-[#364153]">
        <div className="mb-5">
          <div className="flex gap-2 animate-pulse">
            <div className="w-16 h-9 bg-slate-300 rounded-lg dark:bg-slate-700" />
            <div className="w-16 h-9 bg-slate-300 rounded-lg dark:bg-slate-700" />
          </div>
        </div>

        <div className="grid gap-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <article
              key={index}
              className="rounded-2xl bg-white p-4 shadow-sm border border-slate-200 dark:bg-[#141d2b] dark:border-[#364153] animate-pulse"
            >
              <header className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded bg-slate-300 dark:bg-slate-700" />
                  <div className="h-3 w-24 bg-slate-300 rounded-sm dark:bg-slate-700" />
                </div>
                <div className="h-5 w-12 rounded-full bg-slate-300 dark:bg-slate-700" />
              </header>

              <div className="space-y-2 mb-4">
                <div className="h-4 w-24 bg-slate-300 rounded-sm dark:bg-slate-700" />
              </div>

              <div className="mt-3 flex items-center justify-between gap-4">
                <div className="inline-flex  flex-wrap gap-2">
                  <div className="h-6 w-8 rounded-md bg-slate-300 dark:bg-slate-700" />
                  <div className="h-6 w-8 rounded-md bg-slate-300 dark:bg-slate-700" />
                </div>

                <footer className="flex items-center gap-4">
                  <div className="inline-flex items-center gap-1">
                    <Heart className="h-4 w-4 stroke-slate-300 fill-slate-300 dark:stroke-slate-700 dark:fill-slate-700" />
                    <div className="h-4 w-4 bg-slate-300 rounded-sm dark:bg-slate-700" />
                  </div>
                  <div className="inline-flex items-center gap-1">
                    <MessageCircle className="h-4 w-4 stroke-slate-300 dark:stroke-slate-700" />
                    <div className="h-4 w-4 bg-slate-300 rounded-sm dark:bg-slate-700" />
                  </div>
                </footer>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
