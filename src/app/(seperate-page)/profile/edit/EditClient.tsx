// app/(public)/profile/edit/EditClient.tsx
"use client";

import type React from "react";
import { useState, useRef } from "react";
import Image from "next/image";
import { ArrowLeft, Camera, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { uploadAvatar, resetAvatar, saveProfile } from "./actions";
import { toast } from "sonner";

interface EditClientProps {
  userId: string;
  nameInit?: string;
  bioInit?: string;
  avatarInit?: string | null;
}

export default function EditClient({
  userId,
  nameInit = "",
  bioInit = "",
  avatarInit = null,
}: EditClientProps) {
  const router = useRouter();

  const [name, setName] = useState(nameInit);
  const [bio, setBio] = useState(bioInit);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(avatarInit); // 파일 URL 또는 public URL
  const [isPending, setIsPending] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const NAME_MAX = 20;
  const BIO_MAX = 200;

  const onPickFile = () => {
    fileInputRef.current?.click();
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const fileExt = file.name.includes(".") ? file.name.split(".").pop() : "jpg";
    const now = new Date();
    const timestamp = now.toISOString().replace(/[-:]/g, "").replace("T", "-").substring(0, 15); // YYYYMMDD-hhmmss
    const randomId = crypto.randomUUID().replace(/-/g, "").substring(0, 5);
    const fileName = `${timestamp}-${randomId}.${fileExt}`;

    const renamedFile = new File([file], fileName, { type: file.type });

    const previewUrl = URL.createObjectURL(file);
    setAvatarUrl(previewUrl);

    try {
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("file", renamedFile);

      const res = await uploadAvatar(formData);

      if (!res.ok) {
        console.error(res.message);
        toast.error(res.message);
        setAvatarUrl(avatarInit ?? null);
        return;
      }

      if (res.url) {
        setAvatarUrl(res.url);
        router.refresh();
      }
    } catch (err) {
      console.error("Avatar upload failed:", err);
      toast.error("프로필 사진 업로드 중 오류가 발생했습니다.");
      setAvatarUrl(avatarInit ?? null);
    }
  };

  const onResetAvatar = async () => {
    setAvatarUrl(null);

    try {
      const formData = new FormData();
      formData.append("userId", userId);

      const res = await resetAvatar(formData);

      if (!res.ok) {
        console.error(res.message);
        toast.error(res.message);
      } else {
        router.refresh();
      }
    } catch (err) {
      console.error("Avatar reset failed:", err);
      toast.error("프로필 사진 초기화 중 오류가 발생했습니다.");
    }
  };

  // 프로필 저장
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isPending) return;
    setIsPending(true);

    try {
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("display_name", name);
      formData.append("bio", bio);

      const res = await saveProfile(formData);

      if (!res.ok) {
        console.error(res.message);
        toast.error(res.message);
        return;
      }

      router.push("/profile");
    } catch (err) {
      console.error("Profile update failed:", err);
      toast.error("프로필 저장 중 오류가 발생했습니다.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <div className="mx-auto w-full max-w-5xl px-4 pt-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/profile")}
            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-slate-600 hover:bg-slate-100"
          >
            <ArrowLeft size={20} />
            <span className="text-sm">돌아가기</span>
          </button>

          <h1 className="ml-1 text-2xl font-semibold text-slate-800">프로필 수정</h1>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFileChange}
      />

      {/* 폼 */}
      <section className="mx-auto mt-8 w-full max-w-5xl px-4 pb-24">
        <form
          onSubmit={onSubmit}
          className="w-full rounded-2xl bg-white px-20 py-20 shadow ring-1 ring-slate-200"
        >
          <div className="mb-10 flex flex-col items-center">
            <div className="relative">
              <div className="relative size-32 sm:size-36 overflow-hidden rounded-full bg-slate-200/60 ring-1 ring-slate-200">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt="프로필 사진"
                    fill
                    sizes="144px"
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="grid size-full place-content-center">
                    <span className="text-sm text-slate-400">프로필 사진</span>
                  </div>
                )}

                <div className="absolute inset-0 flex items-center justify-center gap-3 bg-white/60">
                  <button
                    type="button"
                    onClick={onPickFile}
                    className="grid size-9 place-content-center rounded-full bg-white text-sky-500 shadow border border-sky-200 hover:bg-sky-50"
                    aria-label="프로필 사진 변경"
                  >
                    <Camera size={18} />
                  </button>

                  {avatarUrl && (
                    <button
                      type="button"
                      onClick={onResetAvatar}
                      className="grid size-9 place-content-center rounded-full bg-rose-500 text-white shadow hover:bg-rose-600"
                      aria-label="프로필 사진 삭제"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* 안내 문구 */}
            <p className="mt-4 text-sm text-slate-500 text-center">
              프로필 사진을 변경하려면 카메라 버튼을, 삭제하려면 X 버튼을 클릭하세요.
            </p>
          </div>

          {/* 이름 */}
          <div className="mb-8">
            <label className="mb-2 block text-sm font-medium text-slate-700">이름</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, NAME_MAX))}
              placeholder="닉네임을 적어주세요"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-violet-300 focus:ring-2 focus:ring-violet-200"
            />
            <div className="mt-1 text-xs text-slate-500">{`${name.length}/${NAME_MAX}`}</div>
          </div>

          {/* 자기소개 */}
          <div className="mb-10">
            <label className="mb-2 block text-sm font-medium text-slate-700">자기소개</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value.slice(0, BIO_MAX))}
              rows={8}
              placeholder="자신을 소개해주세요..."
              className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-violet-300 focus:ring-2 focus:ring-violet-200"
            />
            <div className="mt-1 text-xs text-slate-500">{`${bio.length}/${BIO_MAX}`}</div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              disabled={isPending}
              className={`rounded-xl bg-violet-500 px-7 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-200 ${
                isPending ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              {isPending ? (
                <svg className="h-5 w-5 animate-spin text-white" viewBox="0 0 24 24">
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                "저장"
              )}
            </button>
          </div>
        </form>
      </section>
    </>
  );
}
