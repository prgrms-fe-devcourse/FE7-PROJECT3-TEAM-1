import { formatRelativeTime, getHashtagArray } from "@/utils/helpers";
import { FeelType } from "@/types/community";
import ProfileImage from "@/components/common/ProfileImage";
import FeelBadge from "@/components/common/FeelBadge";
import PostDetailActionsClient from "./PostDetailActionsClient";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

export default async function PostDetail({ postId }: { postId: string }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: post, error: postError } = await supabase
    .from("posts")
    .select(
      "*, users(display_name, image_url), feels(type), likes(post_id, user_id), hashtags(content)",
    )
    .eq("id", postId)
    .single();
  if (!post || postError) {
    notFound();
  }

  if (user) {
    await supabase.from("recent_views").upsert({
      user_id: user.id,
      post_id: postId,
    });
  }

  const hashtags = getHashtagArray(post.hashtags);

  return (
    <section
      className={twMerge(
        "rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.06)] bg-white border border-slate-200 dark:bg-[#141d2b] dark:border-[#364153]",
        "xl:p-10",
        "p-5",
      )}
    >
      <div className="flex flex-col gap-6">
        <div className="flex gap-4">
          {/* 사용자 프로필 사진 */}
          <Link href={`/profile/${post.user_id}`}>
            <ProfileImage
              displayName={post.users.display_name}
              imageUrl={post.users.image_url}
              size="lg"
            />
          </Link>

          <div className="flex-1 flex flex-col gap-4">
            {/* 사용자 닉네임, 작성시간, 글 타입 */}
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-0.5">
                <strong className="text-lg font-semibold text-slate-800 dark:text-gray-300">
                  {post.users.display_name}
                </strong>
                <span className="text-slate-400 text-sm dark:text-gray-400">
                  {formatRelativeTime(post.created_at)}
                </span>
              </div>
              <FeelBadge type={post.feels[0].type as FeelType} />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          {/* 작성글 제목, 내용, 이미지 */}
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-bold dark:text-gray-300">{post.title}</h3>
            <p className="font-medium text-slate-700 dark:text-gray-400">{post.content}</p>
            {post.image_url && (
              <Link href={`/community/${post.id}/zoom?image_url=${post.image_url}`}>
                <Image
                  src={post.image_url}
                  alt="Post Image"
                  width={800}
                  height={600}
                  className="w-full aspect-2/1 object-cover rounded-2xl"
                />
              </Link>
            )}
          </div>
          {/* 해시태그 */}
          {hashtags && (
            <div className="flex gap-2">
              {hashtags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 rounded-2xl bg-slate-200 text-sm text-slate-600 dark:bg-gray-700 dark:text-gray-300"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
        {/* 좋아요, 댓글 버튼 */}
        <PostDetailActionsClient
          postId={post.id}
          writerId={post.user_id}
          initialLike={post.likes}
          initialLikeCount={post.likes.length}
          commentsCount={Number(post.comments_count)}
        />
      </div>
    </section>
  );
}
