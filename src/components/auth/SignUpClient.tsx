"use client";

import confetti from "canvas-confetti";
import { Activity, ChangeEvent, useEffect, useState } from "react";
import Input from "../common/Input";
import TextArea from "../common/TextArea";
import Button from "../common/Button";
import { ArrowRight, User } from "lucide-react";
import { save } from "@/utils/actions";
import { toast } from "sonner";
import ProfileImage from "../common/ProfileImage";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

export default function SignUpClient({
  userId,
  userName,
  userImage,
}: {
  userId: string;
  userName?: string | null;
  userImage?: string | null;
}) {
  const [isDone, setIsDone] = useState(false);
  const [displayName, setDisplayName] = useState(userName || "");
  const [bio, setBio] = useState("");
  const [displayNameCount, setDisplayNameCount] = useState(displayName.length);
  const [bioCount, setBioCount] = useState(bio.length);

  // 폼 제출 안하고 다음 단계로 이동
  const handleForm = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDone((prev) => !prev);
  };

  // 이름, 자기소개 입력 핸들러
  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDisplayName(e.target.value);
    setDisplayNameCount(e.target.value.length);
  };
  const handleBioChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setBio(e.target.value);
    setBioCount(e.target.value.length);
  };

  // 저장 핸들러
  const handleSave = () => {
    if (!displayName || displayName.trim() === "") {
      toast.error("닉네임을 입력해주세요.");
      setIsDone((prev) => !prev);
      return;
    }

    save(userId, displayName, bio);
    toast.success("프로필 설정이 완료되었습니다!");
  };

  // 폭죽 효과
  useEffect(() => {
    const runConfetti = () => {
      const end = Date.now() + 100;
      const frame = () => {
        if (Date.now() > end) return;
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          startVelocity: 60,
          origin: { x: 0, y: 0.5 },
        });
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          startVelocity: 60,
          origin: { x: 1, y: 0.5 },
        });
        requestAnimationFrame(frame);
      };
      frame();
    };

    runConfetti();

    // 10초마다 반복 실행
    const interval = setInterval(runConfetti, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="grid grid-cols-2 gap-2 w-full h-2 text-[0px]">
        <div
          className={twMerge(
            "rounded-4xl shadow-xs shadow-slate-300 dark:shadow-slate-900/50",
            isDone
              ? "bg-slate-200 dark:bg-slate-700"
              : "bg-linear-to-b from-sky-100 to-violet-200 dark:from-[#6B8FA3] dark:to-[#7A8FB8]",
          )}
        >
          프로필 설정 단계
        </div>
        <div
          className={twMerge(
            "rounded-4xl shadow-xs shadow-slate-300 dark:shadow-slate-900/50",
            !isDone
              ? "bg-slate-200 dark:bg-slate-700"
              : "bg-linear-to-b from-sky-100 to-violet-200 dark:from-[#6B8FA3] dark:to-[#7A8FB8]",
          )}
        >
          시작하기
        </div>
      </div>
      <div className="flex flex-col gap-5 items-center text-center">
        <div className="flex justify-center items-center w-20 h-20 rounded-full bg-linear-to-r from-sky-200 to-violet-300 dark:from-[#6B8FA3] dark:to-[#7A8FB8]">
          <Image src="/logo/ant.svg" width={40} height={40} alt="업다운로고" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold">환영합니다!</h2>
          <p className="text-slate-500  dark:text-slate-400">
            감정 시장 업다운의 새로운 개미가 되신 것을 환영합니다.
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-5 p-8 rounded-2xl shadow-lg shadow-slate-200/50 bg-white border border-slate-200 dark:bg-[#101828] dark:border-slate-700/20 dark:shadow-slate-900/50">
        <Activity mode={isDone ? "hidden" : "visible"}>
          <div className="flex items-center gap-4">
            <div className="flex justify-center items-center w-10 h-10 rounded-full text-blue-500 bg-blue-100">
              <User size={20} />
            </div>
            <div className="flex flex-col">
              <h2 className="text-lg font-bold">프로필 설정</h2>
              <p className="text-sm text-slate-500">다른 개미들에게 보여질 정보입니다.</p>
            </div>
          </div>
          <form onSubmit={handleForm}>
            <fieldset className="flex flex-col gap-4">
              <div className="flex gap-2 flex-col">
                <label
                  htmlFor="display_name"
                  className="text-sm font-bold text-slate-900 dark:text-slate-200"
                >
                  이름 <span className="text-red-500">*</span>
                </label>
                <Input
                  className="w-full text-md"
                  name="display_name"
                  maxLength={20}
                  placeholder="닉네임을 적어주세요"
                  value={displayName}
                  onChange={handleNameChange}
                />
                <p className="text-right text-xs text-slate-500">{displayNameCount}/20</p>
              </div>
              <div className="flex gap-2 flex-col">
                <label
                  htmlFor="display_name"
                  className="text-sm font-bold text-slate-900 dark:text-slate-200"
                >
                  자기소개
                </label>
                <TextArea
                  name="bio"
                  rows={4}
                  maxLength={200}
                  placeholder="간단한 소개를 적어주세요"
                  value={bio}
                  onChange={handleBioChange}
                />
                <p className="text-right text-xs text-slate-500">{bioCount}/200</p>
              </div>
              <Button className="w-full" variant="submit">
                다음
                <ArrowRight size={16} />
              </Button>
            </fieldset>
          </form>
        </Activity>
        <Activity mode={isDone ? "visible" : "hidden"}>
          <div className="text-center">
            <h2 className="text-2xl font-bold dark:text-slate-200">거의 다 왔어요!</h2>
            <p className="text-center text-slate-600 dark:text-slate-400">
              입력하신 정보를 확인해주세요.
            </p>
          </div>
          <div className="flex flex-col p-6 border border-slate-50 bg-slate-50 rounded-2xl gap-4 dark:bg-[#141d2b] dark:border-[#364153]">
            <div className="flex items-center gap-4">
              <ProfileImage displayName={displayName} imageUrl={userImage} />
              <div className="flex flex-col gap-0.5 flex-1">
                <strong className="text-xl text-slate-900 font-bold dark:text-slate-50">
                  {displayName}
                </strong>
                <p className="text-sm text-slate-700 dark:text-slate-400">
                  {bio || "작성한 자기소개가 없습니다."}
                </p>
              </div>
            </div>
            <ul className="pt-4 border-t border-slate-200 grid grid-cols-3 text-center gap-3">
              <li>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-50">0</p>
                <strong className="text-xs font-medium text-slate-500">게시글</strong>
              </li>
              <li>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-50">0</p>
                <strong className="text-xs font-medium text-slate-500">팔로잉</strong>
              </li>
              <li>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-50">0</p>
                <strong className="text-xs font-medium text-slate-500">팔로워</strong>
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-2 w-full">
            <Button
              variant="edit"
              onClick={handleForm}
              className="border border-slate-200 bg-white hover:bg-slate-200 rounded-2xl"
            >
              이전
            </Button>
            <Button className="w-full" variant="submit" onClick={handleSave}>
              시작하기
              <ArrowRight size={16} />
            </Button>
          </div>
        </Activity>
      </div>
    </>
  );
}
