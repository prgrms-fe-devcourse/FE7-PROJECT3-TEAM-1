import SeperateLayoutClient from "@/components/alerts/SeperateLayoutClient";
import { getUserProfile, getTodayScore } from "@/utils/actions";

export default async function SeperateLayout({ children }: { children: React.ReactNode }) {
  const [userProfile, todayScore] = await Promise.all([getUserProfile(), getTodayScore()]);

  return (
    <SeperateLayoutClient userProfile={userProfile} todayScore={todayScore}>
      {children}
    </SeperateLayoutClient>
  );
}
