import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "글쓰기",
  description: "감정을 기록하고 공유하는 글을 작성해보세요.",
  openGraph: {
    title: "글쓰기 - UPDOWN",
    description: "감정을 기록하고 공유하는 글을 작성해보세요.",
  },
};

export default function WriteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
