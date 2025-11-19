import type { Metadata } from "next";

export function generateMetadata(): Metadata {
  return {
    title: "검색",
    description: "게시글, 사용자, 태그를 검색해보세요. 원하는 콘텐츠를 빠르게 찾을 수 있습니다.",
    openGraph: {
      title: "검색 - UPDOWN",
      description: "게시글, 사용자, 태그를 검색해보세요.",
    },
  };
}

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
