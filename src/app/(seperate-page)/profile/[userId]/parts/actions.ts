"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

/** 로그아웃 */
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/auth/sign-in");
}

/** 팔로우/언팔로우 토글 */
export async function followToggle(targetUserId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.id === targetUserId) return;

  const { data: rel } = await supabase
    .from("follows")
    .select("id")
    .eq("follower_id", user.id)
    .eq("following_id", targetUserId)
    .maybeSingle();

  if (rel) {
    const { error: deleteErr } = await supabase
      .from("follows")
      .delete()
      .eq("id", rel.id);

    if (deleteErr) {
      console.error("[followToggle] unfollow error:", deleteErr);
    }

    return;
  }

  const { error: insertFollowErr } = await supabase.from("follows").insert({
    follower_id: user.id,
    following_id: targetUserId,
  });

  if (insertFollowErr) {
    console.error("[followToggle] follow insert error:", insertFollowErr);
    return;
  }

  const { error: notiErr } = await supabase.from("notifications").insert({
    type: "follow",
    receiver_id: targetUserId,
    sender_id: user.id,
    post_id: null,
    comment_id: null,
    is_read: false,
  });

  if (notiErr) {
    console.error("[followToggle] notification insert error:", notiErr);
  }
}


export async function clearRecentViews() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "UNAUTHORIZED" };
  }

  const { error } = await supabase
    .from("recent_views")
    .delete()
    .eq("user_id", user.id);

  if (error) {
    console.error("[clearRecentViews] delete error:", error);
    return { ok: false, error: "DB_ERROR" };
  }

  return { ok: true };
}
