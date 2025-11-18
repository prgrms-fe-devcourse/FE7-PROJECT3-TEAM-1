import AlertsPageClient from "@/components/alerts/AlertsPageClient";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import AlertsPageSkeleton from "@/components/skeleton/AlertsPageSkeleton";

async function fetchNotifications() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  const { data } = await supabase
    .from("notifications")
    .select(
      `
  id,
  type,
  post_id,
  is_read,
  created_at,
  sender: users!sender_id (
  id,
  display_name,
  image_url
  ),
  post:post_id (
  id
),
comment:comment_id (
  id,
  content
)
`,
    )
    .eq("receiver_id", user.id)
    .order("created_at", { ascending: false });

  const notifications = (data ?? []) as Notification[];

  return notifications;
}

async function AlertsPageWrapper() {
  const notifications = await fetchNotifications();
  return <AlertsPageClient uid={user.id} notifications={notifications} />;
}

export default async function AlertsPage() {
  return (
    <Suspense fallback={<AlertsPageSkeleton />}>
      <AlertsPageWrapper />
    </Suspense>
  );
}
