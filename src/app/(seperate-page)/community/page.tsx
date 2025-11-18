import { createClient } from "@/utils/supabase/server";
import { PAGE_SIZE } from "@/utils/helpers";
import PostListClient from "@/components/community/PostListClient";
import { Suspense } from "react";
import PostListSkeleton from "@/components/skeleton/PostListSkeleton";

async function fetchPostsWithDelay() {
  const supabase = await createClient();

  const { data: posts, error: listError } = await supabase
    .from("posts")
    .select(
      "*, users(display_name, image_url), feels(type), likes(post_id, user_id), hashtags(content)",
    )
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .range(0, PAGE_SIZE - 1);

  if (listError || !posts) {
    return null;
  }

  return posts;
}

async function PostListWrapper() {
  const posts = await fetchPostsWithDelay();
  return <PostListClient initialPosts={posts || []} />;
}

export default async function Page() {
  return (
    <Suspense
      fallback={
        <section className="flex-1 flex flex-col gap-4">
          {Array.from({ length: 7 }).map((_, index) => (
            <PostListSkeleton key={index} />
          ))}
        </section>
      }
    >
      <PostListWrapper />
    </Suspense>
  );
}
