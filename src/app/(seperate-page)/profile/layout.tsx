import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "프로필",
  description: "내 프로필을 확인하고 관리하세요.",
  openGraph: {
    title: "프로필 - UPDOWN",
    description: "내 프로필을 확인하고 관리하세요.",
  },
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
