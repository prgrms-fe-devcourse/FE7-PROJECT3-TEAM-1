"use client";

import { CommunityComment } from "@/types/community";
import CommentFormClient from "./CommentFormClient";
import CommentListClient from "./CommentListClient";
import { User } from "@/types/database";
import { useMemo, useState } from "react";

export default function PostCommentClient({
  postId,
  initialComments,
  profile, // 현재 로그인한 사용자 프로필
}: {
  postId: string;
  initialComments: CommunityComment[] | null;
  profile: User | null;
}) {
  const comments = useMemo(
    () => initialComments?.filter((c) => c.parent_id === null) || null,
    [initialComments],
  );

  const commentChildsMap = new Map<string, CommunityComment[]>();
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);

  const editingComment = comments?.find((comment) => comment.id === editingCommentId)?.content;

  initialComments?.forEach((comment) => {
    if (comment.parent_id) {
      if (!commentChildsMap.has(comment.parent_id)) {
        commentChildsMap.set(comment.parent_id, []);
      }
      commentChildsMap.get(comment.parent_id)!.push(comment);
    }
  });

  return (
    <div>
      <p className="font-semibold text-xl mb-6 text-slate-900 dark:text-slate-300 dark:bg-[#141d2b] dark:border-[#364153]">
        댓글 {comments?.length}
      </p>
      <CommentFormClient
        profile={profile}
        postId={postId}
        editingCommentId={editingCommentId}
        editingComment={editingComment || ""}
        cancelEditing={() => setEditingCommentId(null)}
      />
      <CommentListClient
        comments={comments}
        allComments={initialComments}
        commentChildsMap={commentChildsMap}
        profile={profile}
        editingCommentId={editingCommentId}
        onEdit={(commentId) => setEditingCommentId(commentId)}
      />
    </div>
  );
}
