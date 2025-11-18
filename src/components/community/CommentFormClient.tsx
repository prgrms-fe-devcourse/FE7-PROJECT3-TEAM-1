"use client";

import Button from "@/components/common/Button";
import TextArea from "@/components/common/TextArea";
import { insertComment, updateComment } from "@/utils/actions/comment";
import { useActionState, useCallback, useEffect, useRef } from "react";
import Input from "@/components/common/Input";
import { User } from "@/types/database";
import ProfileImage from "@/components/common/ProfileImage";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CommentFormClient({
  profile,
  postId,
  editingCommentId,
  editingComment,
  cancelEditing,
}: {
  profile: User | null;
  postId: string;
  editingCommentId: string | null;
  editingComment: string | undefined;
  cancelEditing: () => void;
}) {
  const router = useRouter();

  const prevPendingRef = useRef(false); // 이전 pending 상태 추적
  const formRef = useRef<HTMLFormElement>(null);
  const isEditing = !!editingCommentId;

  const [state, action, pending] = useActionState(isEditing ? updateComment : insertComment, {
    success: false,
    error: null,
  });

  const handleCancel = useCallback(() => {
    formRef.current?.reset();
    if (isEditing) {
      cancelEditing(); // 수정 모드 취소
    }
    setTimeout(() => router.refresh(), 0);
  }, [router, isEditing, cancelEditing]);

  // 수정 모드 진입 시 기존 내용 폼에 채우기
  useEffect(() => {
    if (!isEditing) return;

    formRef.current!.comment!.focus();
    formRef.current!.comment!.value = editingComment || "";
  }, [isEditing, editingComment]);

  useEffect(() => {
    const wasPending = prevPendingRef.current;
    const nowPending = !!pending;

    if (wasPending && !nowPending) {
      if (state?.error) {
        toast.error(state.error || "댓글 처리 중 문제가 발생했습니다.");
      } else if (state?.success) {
        // 성공 분기
        if (isEditing) {
          toast.success("댓글이 수정되었습니다.");
          cancelEditing();
          setTimeout(() => router.refresh(), 0);
        } else {
          toast.success("댓글이 등록되었습니다.");
          formRef.current?.reset();
          setTimeout(() => router.refresh(), 0);
        }
      }
    }

    prevPendingRef.current = nowPending;
  }, [pending, state, isEditing, cancelEditing, router]);

  return (
    <>
      {!profile && (
        <p className="py-7 text-center bg-slate-100 border border-slate-200 rounded-2xl font-medium text-slate-500 dark:bg-[#141d2b] dark:border-[#364153] dark:text-slate-500">
          회원만 댓글 작성 권한이 있습니다.
        </p>
      )}
      {profile && (
        <>
          <div className="flex gap-3">
            <ProfileImage
              displayName={profile?.display_name}
              imageUrl={profile?.image_url}
              size="md"
            />
            <div className="flex-1">
              <form ref={formRef} action={action}>
                <fieldset className="flex gap-2">
                  <legend className="hidden">댓글 등록</legend>
                  <Input type="hidden" name="postId" value={postId} />
                  {editingCommentId && (
                    <Input type="hidden" name="commentId" value={editingCommentId} />
                  )}
                  <TextArea
                    name="comment"
                    className="w-full h-20 dark:bg-[#1e2939] dark:text-gray-300 dark:placeholder:text-gray-400 border-color-transparent"
                    placeholder="댓글을 입력하세요..."
                    disabled={pending}
                  />
                  {!isEditing && (
                    <Button
                      type="submit"
                      className="w-30 dark:bg-[#1e2939] dark:from-[#6B8FA3] dark:to-[#7A8FB8]"
                      variant="submit"
                      disabled={pending}
                    >
                      {pending ? "등록중..." : "작성"}
                    </Button>
                  )}
                  {isEditing && (
                    <div className="flex flex-col gap-1">
                      <Button
                        type="submit"
                        className="flex-1 w-30 min-h-0 py-1 rounded-lg  dark:from-[#6B8FA3] dark:to-[#7A8FB8]"
                        variant="submit"
                        disabled={pending}
                      >
                        {pending ? "수정중..." : "수정"}
                      </Button>
                      <Button
                        className="flex-1"
                        variant="edit"
                        onClick={handleCancel}
                        disabled={pending}
                      >
                        취소
                      </Button>
                    </div>
                  )}
                </fieldset>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
}
