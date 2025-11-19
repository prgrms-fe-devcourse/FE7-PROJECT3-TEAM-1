import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "알람",
  description: "나에게 온 알람을 확인하세요.",
  openGraph: {
    title: "알람 - UPDOWN",
    description: "나에게 온 알람을 확인하세요.",
  },
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
