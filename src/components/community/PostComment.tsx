import { createClient } from "@/utils/supabase/server";
import PostCommentClient from "./PostCommentClient";
import { twMerge } from "tailwind-merge";

export default async function PostComment({ postId }: { postId: string }) {
  const supabase = await createClient();

  const [
    { data: comments, error: commentsError },
    {
      data: { user },
      error: userError,
    },
  ] = await Promise.all([
    supabase
      .from("comments")
      .select("*, users(display_name, image_url), likes(post_id, user_id, comment_id)")
      .eq("post_id", postId)
      .order("created_at", { ascending: false }),
    supabase.auth.getUser(),
  ]);

  if (commentsError) {
    console.error(commentsError);
  }
  if (userError) {
    console.error(userError);
  }

  // 프로필 (조건부)
  let profile = null;
  if (user) {
    const { data } = await supabase.from("users").select("*").eq("id", user.id).single();
    profile = data;
  }

  return (
    <section
      className={twMerge(
        "rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.06)] bg-white border border-slate-200 dark:bg-[#141d2b] dark:border-[#364153]",
        "xl:p-10",
        "p-5"
      )}
    >
      <PostCommentClient postId={postId} initialComments={comments} profile={profile} />
    </section>
  );
}
