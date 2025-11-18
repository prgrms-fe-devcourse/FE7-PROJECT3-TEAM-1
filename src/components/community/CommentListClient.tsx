"use client";

import { CommunityComment } from "@/types/community";
import { User } from "@/types/database";
import CommentListItemClient from "@/components/community/CommentListItemClient";
import { useState } from "react";

export default function CommentListClient({
  comments,
  allComments,
  commentChildsMap,
  profile, // 현재 로그인한 사용자 프로필
  editingCommentId,
  onEdit,
}: {
  comments: CommunityComment[] | null;
  allComments: CommunityComment[] | null;
  commentChildsMap: Map<string, CommunityComment[]>;
  profile: User | null;
  editingCommentId: string | null;
  onEdit: (commentId: string) => void;
}) {
  const [replyingCommentId, setReplyingCommentId] = useState<string | null>(null);
  const [editingReplyCommentId, setEditingReplyCommentId] = useState<string | null>(null);

  if (!comments) {
    return (
      <p className="mt-14 mb-7 text-center text-slate-500 dark:text-slate-500">
        등록된 댓글이 없습니다.
      </p>
    );
  }

  const visibleComments = comments?.filter((comment) => comment.id !== editingCommentId);

  if (visibleComments.length === 0) {
    return (
      <div className="flex justify-center items-center flex-col border-t border-slate-200 mt-7 pt-7 gap-4 text-slate-400 dark:border-slate-700 dark:text-slate-500">
        <p className="font-medium dark:text-slate-500">등록된 댓글이 없습니다.</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-6 mt-6 dark:bg-[#141d2b] dark:border-[#364153]">
        {visibleComments?.map((comment) => (
          <CommentListItemClient
            key={comment.id}
            comment={comment}
            childComments={commentChildsMap.get(comment.id) || []}
            profile={profile}
            onEdit={onEdit}
            isReplying={replyingCommentId === comment.id}
            setIsReplying={() =>
              setReplyingCommentId(replyingCommentId === comment.id ? null : comment.id)
            }
            editingReplyCommentId={editingReplyCommentId}
            editingReplyComment={allComments?.find((c) => c.id === editingReplyCommentId)?.content}
            cancelEditing={() => setEditingReplyCommentId(null)}
            onEditReply={(replyId) => setEditingReplyCommentId(replyId)}
            initialLike={comment.likes}
          />
        ))}
      </div>
    </>
  );
}
