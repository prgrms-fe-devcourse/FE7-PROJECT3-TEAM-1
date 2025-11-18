"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  TrendingUp,
  TrendingDown,
  UserIcon,
  Moon,
  Sun,
  LayoutDashboard,
  Users,
  Search,
  Bell,
  PenTool,
  X,
  Menu,
} from "lucide-react";
import type { Database } from "@/utils/supabase/supabase";
import { twMerge } from "tailwind-merge";
import { useBreakpoint } from "@/hooks/useBreakPoint";
import Button from "./Button";
import ProfileImage from "./ProfileImage";

type Profile = Database["public"]["Tables"]["users"]["Row"];

const Icon = {
  dashboard: ({ className }: { className?: string }) => (
    <LayoutDashboard size={18} className={className} />
  ),
  community: ({ className }: { className?: string }) => <Users size={18} className={className} />,
  search: ({ className }: { className?: string }) => <Search size={18} className={className} />,
  profile: ({ className }: { className?: string }) => <UserIcon size={18} className={className} />,
  bell: ({ className }: { className?: string }) => <Bell size={18} className={className} />,
  write: ({ className }: { className?: string }) => <PenTool size={18} className={className} />,
};

type NavItem = {
  key: string;
  label: string;
  href: string;
  Icon: React.FC<{ className?: string }>;
};

const NAV: NavItem[] = [
  { key: "dashboard", label: "대시보드", href: "/", Icon: Icon.dashboard },
  { key: "community", label: "커뮤니티", href: "/community", Icon: Icon.community },
  { key: "search", label: "검색", href: "/search", Icon: Icon.search },
  { key: "profile", label: "프로필", href: "/profile", Icon: Icon.profile },
  { key: "alerts", label: "알림", href: "/alerts", Icon: Icon.bell },
];

interface HeaderProps {
  // 현재 활성화된 메뉴 키 (예: 'search')
  activeKey?: string;
  // 사용자 정보 (하단 프로필 영역): 이름과 프로필 이미지
  userProfile?: { display_name: string; image_url: string };
  // 오늘의 감정 지수 카드에 보여줄 값
  todayScore?: { value: number; finalResult: number };
  initialProfile?: Profile | null;
  className?: string;
}

// 헤더 컴포넌트
// activeKey: 현재 활성화된 메뉴 키
// userName: 사용자 이름
// todayScore: 오늘의 감정 지수 정보
// initialProfile: SSR에서 가져온 초기 프로필
export default function Header({
  activeKey = "dashboard",
  todayScore = { value: 1240, finalResult: 1.8 },
  initialProfile,
  className,
}: HeaderProps) {
  const pathname = usePathname();

  const [visible, setVisible] = useState(false);
  const { isMobile, isXl } = useBreakpoint();

  // SSR 프로필을 우선 사용하고, 클라이언트 사이드에서 업데이트되면 그것을 사용
  const userProfile = initialProfile || null;

  const computedActiveKey = React.useMemo(() => {
    // 글 작성 시 Header 탭 커뮤니티 활성화
    if (pathname === "/write" || pathname.startsWith("/write/")) {
      return "community";
    }

    for (const n of NAV) {
      if (n.href === "/") {
        if (pathname === "/") return n.key;
      } else {
        if (pathname === n.href || pathname.startsWith(n.href + "/")) return n.key;
      }
    }
    return activeKey;
  }, [pathname, activeKey]);

  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  // 헤더 렌더링
  const headerHandler = (e: React.MouseEvent) => {
    e.preventDefault();
    setVisible(!visible);
    if (visible) {
      document.body.style.overflow = "auto";
    } else {
      document.body.style.overflow = "hidden";
    }
  };

  // 링크 클릭 시 메뉴 닫기
  const handleLinkClick = () => {
    if (visible) {
      setVisible(false);
      document.body.style.overflow = "auto";
    }
  };

  return (
    <>
      {/* 모바일 헤더 - CSS로 반응형 처리 */}
      <header
        className={twMerge(
          "fixed top-0 left-0 w-full h-18 bg-white/85 backdrop-blur-2xl shadow-sm flex justify-center items-center z-61",
          "xl:hidden", // 데스크탑에서 숨김
          visible && "bg-white",
          "dark:bg-[#101828] dark:border-b dark:border-slate-700",
        )}
      >
        {/* Logo */}
        <Link
          href="/"
          className={twMerge("flex items-center justify-center")}
          onClick={handleLinkClick}
        >
          <Image
            src="/logo/logo.svg"
            alt="logo"
            width={98}
            height={39}
            className="object-contain dark:invert"
            priority
          />
        </Link>
        <Button className="absolute left-6 text-black dark:text-slate-200" onClick={headerHandler}>
          {visible ? <X /> : <Menu />}
        </Button>
      </header>
      <div
        className={twMerge(
          "xl:z-0 xl:pl-4 xl:py-6 xl:sticky xl:top-0 xl:bottom-6 xl:h-dvh xl:w-full xl:min-w-64 xl:max-w-64",
          "fixed top-0 right-0 bottom-0 left-0 -z-60",
          !isXl && visible && "bg-slate-900/30 backdrop-blur-xs z-60",
          className,
        )}
        onClick={headerHandler}
      >
        <aside
          className={twMerge(
            "h-full flex-col p-4 gap-4 shadow-sm ",
            "shrink-0",
            "font-semibold",
            "xl:pt-4 xl:min-w-60 xl:max-w-60 xl:flex xl:rounded-lg xl:bg-white/85 xl:backdrop-blur", // 반응형 작업
            visible ? "flex" : "hidden",
            "bg-white w-4/5 max-w-200 pt-25",
            isMobile && "w-full min-w-auto max-w-auto",
            "dark:bg-[#101828] dark:border-r dark:border-slate-700",
          )}
          aria-label="헤더"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Logo - 데스크톱에서만 보이기 */}
          <Link
            href="/"
            className={twMerge("hidden xl:flex items-center justify-center h-[89px]")}
            onClick={handleLinkClick}
          >
            <Image
              src="/logo/logo.svg"
              alt="logo"
              width={144}
              height={57}
              className="object-contain dark:invert"
              priority
            />
          </Link>

          {/* 오늘의 감정 지수 카드 */}
          <section>
            <div className="w-full rounded-2xl bg-black text-white p-4 shadow-sm dark:bg-[#141d2b]">
              <p className="text-[14px] text-gray-300">오늘의 감정 지수</p>
              <div className="mt-3 flex gap-y-0.5 gap-x-3 max-[1215px]:flex-wrap min-[1216px]:flex-nowrap items-end justify-between">
                <span className="text-[26px] font-extrabold tabular-nums tracking-tight max-[1215px]:text-[28px] min-[1216px]:text-[34px]">
                  {todayScore.value.toLocaleString()}
                </span>
                <span
                  className={`inline-flex shrink-0 items-center gap-1 rounded-lg font-semibold backdrop-blur bg-transparent px-0 py-0 text-[14px] ${
                    todayScore.finalResult >= 0 ? "text-emerald-500" : "text-rose-500"
                  }`}
                >
                  {todayScore.finalResult >= 0 ? "+" : ""}
                  {Math.abs(todayScore.finalResult).toFixed(2)}%
                  {todayScore.finalResult >= 0 ? (
                    <TrendingUp className="h-5 w-5 sm:h-7 sm:w-7" />
                  ) : (
                    <TrendingDown className="h-5 w-5 sm:h-7 sm:w-7" />
                  )}
                </span>
              </div>
            </div>
          </section>

          {/* 네비게이션 */}
          <nav className="mt-2 flex-1">
            <ul className="flex flex-col gap-1">
              {NAV.map(({ key, label, href, Icon: I }) => {
                const active = key === computedActiveKey;
                return (
                  <li key={key}>
                    <Link
                      href={href}
                      className={[
                        "group flex items-center justify-between rounded-xl px-3 py-2",
                        active
                          ? "bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-gray-200"
                          : "text-gray-400 transition-colors duration-200 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200",
                      ].join(" ")}
                      aria-current={active ? "page" : undefined}
                      onClick={handleLinkClick}
                    >
                      <div className="flex items-center gap-3">
                        <I className={active ? "" : " grayscale opacity-60"} />
                        <span>{label}</span>
                      </div>
                      {active ? (
                        <Image
                          src="/header/active-indicator.svg"
                          alt="active"
                          width={8}
                          height={8}
                        />
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* 하단 CTA & 프로필 */}
          <div className="mt-auto flex flex-col gap-6 dark:bg-[#101828]">
            {/* CTA 버튼 */}
            <Link
              href="/write"
              className="h-12 flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-[#A8E0FF] to-[#C5C8FF] text-white px-4 py-4 font-semibold  hover:opacity-90 active:scale-[.99] transition dark:from-[#6B8FA3] dark:to-[#7A8FB8]"
              onClick={handleLinkClick}
            >
              <Icon.write />
              <span className="text-[14px]">오늘의 감정 작성</span>
            </Link>

            {/* 구분선 */}
            <hr className="border-t border-gray-200 dark:border-[#364153]" />

            {/* 프로필 영역 & 테마 토글 */}
            {userProfile && (
              <div className="flex justify-between items-center pl-3 py-2 rounded-2xl transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-600">
                <Link href="/profile" className="flex-1">
                  <div className="flex items-center gap-3">
                    <ProfileImage
                      displayName={userProfile.display_name}
                      imageUrl={userProfile?.image_url}
                      className="w-10 h-10"
                    />

                    <div className="flex flex-col justify-center">
                      <p className="text-[14px] font-bold text-black leading-tight dark:text-gray-400">
                        {userProfile ? userProfile.display_name : "Unknown"}
                      </p>
                    </div>
                  </div>
                </Link>
                <button
                  onClick={() => setIsDark((prev) => !prev)}
                  className="p-2 rounded-xl transition-colors duration-200 cursor-pointer"
                  aria-label="Toggle Theme"
                >
                  <Sun className="h-6 w-6 hidden dark:block dark:text-gray-400" />
                  <Moon className="h-6 w-6 block dark:hidden text-black" />
                </button>
              </div>
            )}
            {!userProfile && (
              <div className="flex justify-between items-center pl-3 py-2 rounded-2xl transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-600">
                <Link href="/profile" className="flex-1">
                  <div className="flex items-center gap-3 ">
                    <UserIcon className="h-6 w-6 text-gray-500" />
                    <div className="flex flex-col justify-center">
                      <p className="text-[14px] font-bold text-black leading-tight dark:text-gray-400">
                        로그인
                      </p>
                    </div>
                  </div>
                </Link>
                <button
                  onClick={() => setIsDark((prev) => !prev)}
                  className="p-2 rounded-xl transition-colors duration-200 cursor-pointer"
                  aria-label="Toggle Theme"
                >
                  <Sun className="h-6 w-6 hidden dark:block dark:text-gray-400" />
                  <Moon className="h-6 w-6 block dark:hidden text-black" />
                </button>
              </div>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}
