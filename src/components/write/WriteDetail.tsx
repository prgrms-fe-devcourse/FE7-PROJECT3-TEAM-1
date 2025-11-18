"use client";
import Image from "next/image";
import UP from "@/assets/write/up.svg";
import DOWN from "@/assets/write/down.svg";
import HOLD from "@/assets/write/hold.svg";
import { up, down, hold } from "./hashtags";
import { useEffect, useRef, useState } from "react";
import * as Slider from "@radix-ui/react-slider";
import closeButton from "@/assets/write/closeButton.svg";
import { createClient } from "@/utils/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { badWords } from "./badWords";
import { toast } from "sonner";
import { ImagePlus } from "lucide-react";

// 감정 버튼 설정
const emotions = [
  { key: "up", label: "UP", color: "#FF6467", bg: "#FFF5F5", img: UP },
  { key: "down", label: "DOWN", color: "#51A2FF", bg: "#F2F8FF", img: DOWN },
  { key: "hold", label: "HOLD", color: "#99A1AF", bg: "#F6F6F7", img: HOLD },
] as const;

export default function WriteDetail() {
  const searchParams = useSearchParams();
  const pageId = searchParams.get("post_id"); // 1
  const supabase = createClient();
  const router = useRouter();

  const imageUploadInput = useRef<HTMLInputElement>(null);

  const [hasBadTitle, setHasBadTitle] = useState(false);
  const [hasBadContent, setHasBadContent] = useState(false);
  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [imageUploadPreview, setImageUploadPreview] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUpload, setImageUpload] = useState<File | null>(null);
  const [pick, setPick] = useState<"up" | "down" | "hold" | "">("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sliderValue, setSliderValue] = useState([4]); // 현재 단계 (0~9)
  const [hadInitialImage, setHadInitialImage] = useState(false); // 초기 로드 시 이미지가 있었는지 추적
  const totalSteps = 10;

  // 의미 있는 특수문자들
  const escapeRegex = (src: string) => {
    return src.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };

  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValueTitle = e.target.value;

    if (inputValueTitle.length <= 40) setTitle(inputValueTitle);

    // 욕설
    const hasBad = badWords.some((word) => {
      const safeWord = escapeRegex(word);
      const regex = new RegExp(safeWord, "i");
      return regex.test(inputValueTitle); // ← 최신 입력값으로 검사
    });

    setHasBadTitle(hasBad);
  };

  const handleChangeContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValueTitle = e.target.value;

    if (inputValueTitle.length <= 500) setContent(inputValueTitle);

    // 욕설
    const hasBad = badWords.some((word) => {
      const safeWord = escapeRegex(word);
      const regex = new RegExp(safeWord, "i");
      return regex.test(inputValueTitle); // ← 최신 입력값으로 검사
    });

    setHasBadContent(hasBad);
  };

  // pick에 따라 hashtag 배열 가져오기
  const hashtags = pick === "up" ? up : pick === "down" ? down : pick === "hold" ? hold : [];

  // 해시태그 클릭 시 토글 동작
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const imageUploadHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];

    if (!file || !file.type.startsWith("image/")) return;

    if (file) {
      const imagePreviewUrl = URL.createObjectURL(file);
      setImageUploadPreview(imagePreviewUrl);
      setImageUpload(file);
    }
  };

  const handlePublish = async () => {
    if (hasBadContent || hasBadTitle) {
      toast.error("적절하지 못한 내용을 포함하고 있습니다");
      return;
    }
    if (pick === "") {
      toast.error("감정을 선택해주세요");
      return;
    }

    if (title.trim() === "") {
      toast.error("제목을 입력해주세요");
      return;
    }

    if (content.trim() === "") {
      toast.error("내용을 입력해주세요");
      return;
    }

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        toast.error("로그인이 필요합니다");
        return;
      }

      // postId 먼저 확인 또는 생성
      let postId: string;
      if (!pageId) {
        // 새 포스트: postId 먼저 생성
        const { data: postData, error: postError } = await supabase
          .from("posts")
          .insert([
            {
              user_id: user.id,
              title,
              content,
              image_url: null, // 이미지는 나중에 업데이트
            },
          ])
          .select("id")
          .single();

        if (postError) throw postError;
        postId = postData.id;
      } else {
        // 수정: 기존 postId 사용
        postId = pageId;
      }

      // 이미지 업로드
      let imageUrl = null;
      if (imageUpload) {
        const fileExt = imageUpload.name.split(".").pop();
        // 날짜 형식: YYYYMMDD-hhmmss-랜덤5자리
        const now = new Date();
        const timestamp = now.toISOString().replace(/[-:]/g, "").replace("T", "-").substring(0, 15); // YYYYMMDD-hhmmss
        const randomId = crypto.randomUUID().replace(/-/g, "").substring(0, 5);
        const fileName = `${timestamp}-${randomId}.${fileExt}`;
        const filePath = `${postId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("post_image")
          .upload(filePath, imageUpload, {
            upsert: false,
            contentType: imageUpload.type,
          });

        if (uploadError) {
          if (process.env.NODE_ENV === "development") {
            // 개발환경 디버깅용
            console.error("Image upload failed:", uploadError);
            console.error("Error details:", {
              message: uploadError.message,
              name: uploadError.name,
              filePath,
              fileName: imageUpload.name,
              fileSize: imageUpload.size,
              fileType: imageUpload.type,
            });
          }
          alert(`이미지 업로드 중 오류가 발생했습니다: ${uploadError.message}`);

          // 이미지 첨부 발생 중 오류가 생겼을 시 생성되었던 post 삭제
          const { error: deletePostError } = await supabase.from("posts").delete().eq("id", postId);

          if (deletePostError && process.env.NODE_ENV === "development") {
            console.error(
              "Failed to delete orphaned post after image upload failure:",
              deletePostError,
            );
          }

          return;
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from("post_image").getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      if (!pageId) {
        // 이미지 URL 업데이트
        if (imageUrl) {
          const { error: updateError } = await supabase
            .from("posts")
            .update({ image_url: imageUrl })
            .eq("id", postId);

          if (updateError) throw updateError;
        }

        let insertAmount = 0;
        if (pick === "down") insertAmount = (sliderValue[0] + 1) * -1;
        else if (pick === "hold") insertAmount = 0;
        else insertAmount = sliderValue[0] + 1;

        const { error: feelError } = await supabase.from("feels").insert([
          {
            post_id: postId,
            type: pick,
            amount: insertAmount,
            user_id: user.id,
          },
        ]);

        if (feelError) throw feelError;

        const tagString = selectedTags.join(",");
        const { error: tagError } = await supabase
          .from("hashtags")
          .insert([{ post_id: postId, content: tagString }]);

        if (tagError) throw tagError;

        toast.success("글이 성공적으로 등록되었습니다!");
        router.push("/community");
      } else {
        // 수정
        let insertImage: string | null;

        if (imageUpload) {
          // 새 이미지 업로드 or 기존 이미지 첨부가 없었다가 새로 생긴 경우
          insertImage = imageUrl;
        } else if (hadInitialImage && existingImage === null) {
          // 초기 이미지가 있었는데 삭제한 경우
          insertImage = null;
        } else {
          // 기존 이미지 그대로 유지하는 경우
          insertImage = existingImage;
        }
        const { error: postError } = await supabase
          .from("posts")
          .update({
            user_id: user.id,
            title,
            content,
            image_url: insertImage,
          })
          .eq("id", pageId)
          .eq("user_id", user.id);

        if (postError) throw postError;

        let insertAmount = 0;
        if (pick === "down") insertAmount = (sliderValue[0] + 1) * -1;
        else if (pick === "hold") insertAmount = 0;
        else insertAmount = sliderValue[0] + 1;

        const { error: feelError } = await supabase
          .from("feels")
          .update({
            post_id: postId,
            type: pick,
            amount: insertAmount,
            user_id: user.id,
          })
          .eq("post_id", pageId)
          .eq("user_id", user.id);

        if (feelError) throw feelError;

        const tagString = selectedTags.join(",");
        const { error: tagError } = await supabase
          .from("hashtags")
          .update({ post_id: postId, content: tagString })
          .eq("post_id", pageId);

        if (tagError) throw tagError;

        toast.success("글이 성공적으로 수정되었습니다!");
        router.push(`/community/${pageId}`);
      }
    } catch (e) {
      console.error(e);
      toast.error("글 작성 중 오류가 발생했습니다");
    }
  };

  useEffect(() => {
    if (!pageId) return;
    (async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (!user || userError) {
        toast.error("로그인 후 수정이 가능합니다");
        router.replace("/auth/sign-in");
        return;
      }

      const { data, error } = await supabase
        .from("posts")
        .select(
          `
    id,
    title,
    content,
    user_id,
    image_url,
    hashtags(*),
    feels(*)
    `,
        )
        .eq("id", pageId)
        .eq("user_id", user?.id ?? "")
        .single();

      if (!data || error) {
        toast.error("내 게시글만 수정 가능합니다");
        router.replace("/");
        return;
      }

      const feels = data.feels[0];
      const hashtags = data.hashtags[0];

      setImageUploadPreview(data.image_url);
      setExistingImage(data.image_url);
      setHadInitialImage(data.image_url !== null); // 초기 이미지 존재 여부 저장
      setTitle(data.title ?? "");
      setContent(data.content ?? "");
      setPick(feels.type);
      if (feels.type === "down") {
        setSliderValue([(feels.amount + 1) * -1]);
      } else if (feels.type === "hold") {
        setSliderValue([4]);
      } else {
        setSliderValue([feels.amount - 1]);
      }

      if (Array.isArray(hashtags.content)) {
        setSelectedTags(hashtags.content);
      } else if (typeof hashtags.content === "string") {
        setSelectedTags(
          hashtags.content
            .split(",")
            .map((t) => t.trim())
            .filter((t) => t !== ""),
        );
      }
    })();
  }, [pageId, router, supabase]);

  return (
    <div
      className="flex justify-center items-center flex-col w-full h-full rounded-2xl 
    
    dark:shadow-[0_4px_12px_rgba(0,0,0,0.06)] dark:bg-[#141d2b] dark:border-[#364153] shadow-[0_4px_12px_rgba(0,0,0,0.06)] bg-white p-8 overflow-y-auto"
    >
      <p className="font-bold pt-4 text-2xl text-[#1A2035] dark:text-slate-300">오늘의 감정 기록</p>

      {/* 감정 선택 영역 */}
      <div className="flex justify-start items-center flex-col text-base w-full">
        <p className="text-[#4B5563] mr-auto ml-1 pb-4 mt-4 dark:text-slate-400">
          오늘의 감정은 어떠신가요?
        </p>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 w-full text-base">
          {emotions.map((e) => (
            <button
              key={e.key}
              onClick={() => {
                setPick(e.key);
                setSelectedTags([]);
              }}
              className={`flex justify-center items-center flex-col flex-1 w-full sm:w-auto min-h-20 rounded-xl cursor-pointer transition-transform duration-200 transform hover:scale-102 py-4
                  ${
                    pick === e.key
                      ? `border-2 border-[${e.color}] bg-[${e.bg}] dark:border-slate-700 dark:bg-[#141d2b]`
                      : "border border-[#E5E7EB] hover:bg-[#E5E7EB] dark:border-slate-700 dark:bg-[#141d2b]"
                  }`}
            >
              <Image src={e.img} alt={e.label} />
              <span style={{ color: e.color }} className="text-slate-900 dark:text-slate-300">
                {e.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div
        className={`transition-all duration-200 w-full ${
          pick ? "translate-y-6 opacity-100 dark:text-slate-300" : "translate-y-0 opacity-0"
        } dark:bg-[#141d2b]`}
      >
        {pick ? (
          <div className="relative w-full flex justify-center mb-3 px-2">
            {/* 숫자 말풍선 */}
            <div
              className={`absolute -top-9 flex justify-center items-center w-7 h-7 ${pick === "up" ? "bg-[#FF6467]" : pick === "down" ? "bg-[#51A2FF]" : pick === "hold" ? "bg-[#99A1AF]" : ""} text-white text-sm rounded-full shadow-md transition-all duration-100`}
              style={{
                left: `${(sliderValue[0] / (totalSteps - 1)) * 100}%`,
                transform: "translateX(-50%)",
              }}
            >
              {sliderValue[0] + 1}
            </div>
            {/* 슬라이더 */}
            <Slider.Root
              className="relative flex items-center select-none touch-none w-full h-5"
              value={sliderValue}
              onValueChange={setSliderValue}
              max={totalSteps - 1}
              step={1}
            >
              {/* 트랙 */}
              <Slider.Track className="bg-gray-200 relative grow rounded-full h-2">
                <Slider.Range
                  className={`absolute ${pick === "up" ? "bg-[#FF6467]" : pick === "down" ? "bg-[#51A2FF]" : pick === "hold" ? "bg-[#99A1AF]" : ""} rounded-full h-full`}
                />
              </Slider.Track>

              {/* 작은 점들 */}
              {[...Array(totalSteps)].map((_, i) => (
                <div
                  key={i}
                  className={`border absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${
                    i <= sliderValue[0]
                      ? pick === "up"
                        ? "border-[#FF6467]"
                        : pick === "down"
                          ? "border-[#51A2FF]"
                          : pick === "hold"
                            ? "border-[#99A1AF]"
                            : ""
                      : "border-gray-300"
                  } ${i <= sliderValue[0] ? `bg-white ` : "bg-gray-300"}`}
                  style={{
                    left: `${(i / (totalSteps - 1)) * 100}%`,
                    transform: "translateX(-50%)",
                  }}
                />
              ))}

              {/* 손잡이 */}
              <Slider.Thumb
                className={`relative z-10 block w-5 h-5 border-[3px] ${pick === "up" ? "border-[#FF6467]" : pick === "down" ? "border-[#51A2FF]" : pick === "hold" ? "border-[#99A1AF]" : ""} cursor-pointer bg-white rounded-full shadow-md hover:scale-110 transition-transform outline-none`}
                style={{
                  left: `${(sliderValue[0] / (totalSteps - 1)) * 100}%`,
                  transform: "translateX(-50%)",
                }}
                aria-label="Emotion level"
              />
            </Slider.Root>
          </div>
        ) : (
          ""
        )}
        {/* 해시태그 영역 */}
        <div className="w-full flex flex-row flex-wrap lg:justify-between gap-2 text-[#4A5565] mb-6 px-2 dark:text-slate-400">
          {hashtags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`cursor-pointer px-3 py-1 text-xs border rounded-full transition-colors duration-150 select-none
                    ${
                      selectedTags.includes(tag)
                        ? pick === "up"
                          ? "bg-[#FF6467] text-white border-[#ff6467] dark:text-white"
                          : pick === "down"
                            ? "bg-[#51A2FF] text-white border-[#51A2FF] dark:text-white"
                            : "bg-[#99A1AF] text-white border-[#99A1AF] dark:text-white"
                        : "border-[#E5E7EB] text-[#4A5565] hover:text-black hover:bg-black/5 dark:border-slate-700 dark:bg-[#141d2b] dark:text-slate-200 dark:hover:text-white dark:hover:bg-slate-700"
                    }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* 제목 */}
      <div className="relative w-full outline-none focus:outline-none select-none ">
        <input
          className="bg-[#F9FAFB] border rounded-xl border-[#E5E7EB] w-full h-12 mt-4 resize-none outline-none focus:scale-102 transform transition-transform duration-200 px-4 dark:bg-[#141d2b] dark:border-slate-700 dark:text-slate-300"
          placeholder="오늘의 메모를 남겨보세요..."
          value={title}
          onChange={handleChangeTitle}
        />
        <span className="absolute bottom-2 right-4 font-normal text-[#AAAAAA] text-sm dark:text-slate-400">
          {title.length} / 40
        </span>
        {hasBadTitle ? (
          <p className="mt-0.5 ml-2 absolute text-[#c85c5c] text-sm dark:text-slate-400">
            적절하지 못한 제목입니다
          </p>
        ) : (
          ""
        )}
      </div>

      {/* 메모 */}
      <div className="relative w-full flex-1 min-h-0 outline-none focus:outline-none select-none ">
        <textarea
          className="bg-[#F9FAFB] border rounded-xl border-[#E5E7EB] w-full h-full min-h-60 mt-4 resize-none outline-none focus:scale-102 transform transition-transform duration-200 px-4 py-3 dark:bg-[#141d2b] dark:border-slate-700 dark:text-slate-300"
          placeholder="오늘의 메모를 남겨보세요..."
          value={content}
          onChange={handleChangeContent}
        />
        <span className="absolute bottom-0 right-4 font-normal text-[#AAAAAA] text-sm dark:text-slate-400">
          {content.length} / 500
        </span>
        {hasBadContent ? (
          <p className="absolute ml-2 text-[#c85c5c] text-sm dark:text-slate-400">
            적절하지 못한 내용입니다
          </p>
        ) : (
          ""
        )}
      </div>

      {/* 업로드된 이미지 */}
      <input
        type="file"
        className="hidden"
        ref={imageUploadInput}
        accept="image/*"
        onChange={(e) => {
          imageUploadHandler(e);
        }}
      />
      <div
        className="relative group/image mt-10 w-full min-h-[250px] max-h-[250px] rounded-2xl flex justify-center items-center border-2 border-dashed border-gray-300 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors overflow-hidden dark:bg-[#141d2b] dark:border-slate-700"
        onClick={() => {
          if (!imageUploadPreview) imageUploadInput.current?.click();
        }}
      >
        {imageUploadPreview ? (
          <>
            <Image
              src={imageUploadPreview}
              alt="업로드 이미지"
              fill
              className="object-contain select-none"
            />
            {/* hover 시 나타나는 X버튼 */}
            <div className="opacity-0 group-hover/image:opacity-100 transition-opacity duration-200 absolute inset-0 flex justify-center items-center pointer-events-none bg-black/20 rounded-2xl">
              <button
                type="button"
                className="pointer-events-auto cursor-pointer close-btn hover:scale-110"
                onClick={(e) => {
                  e.stopPropagation();
                  setImageUploadPreview(null);
                  setImageUpload(null);
                  // 수정 모드에서 기존 이미지 삭제 시 existingImage도 null로 설정
                  if (pageId) {
                    setExistingImage(null);
                  }
                }}
              >
                <Image
                  src={closeButton}
                  alt="이미지 삭제"
                  width={36}
                  height={36}
                  draggable={false}
                />
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2">
            <ImagePlus className="w-12 h-12 text-gray-400" />
            <p className="text-gray-500 text-xl dark:text-slate-400">
              업로드할 이미지를 선택하세요
            </p>
          </div>
        )}
      </div>
      <button
        className="mt-4 mb-4 flex justify-center items-center dark:text-slate-300 text-[#ffffff] w-full h-14 shadow-[0_2px_4px_rgba(0,0,0,0.1),0_4px_6px_rgba(0,0,0,0.1)] rounded-xl bg-linear-to-r from-[#A8E0FF] to-[#C5C8FF] cursor-pointer hover:scale-101 transform transition-transform duration-150 active:scale-[.99] px-2 dark:bg-[#141d2b] dark:border-slate-700 dark:shadow-[0_2px_4px_rgba(0,0,0,0.1),0_4px_6px_rgba(0,0,0,0.1)] dark:from-[#6B8FA3] dark:to-[#7A8FB8]"
        onClick={handlePublish}
      >
        기록 완료
      </button>
    </div>
  );
}
