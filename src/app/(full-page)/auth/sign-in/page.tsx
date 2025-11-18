import Button from "@/components/common/Button";
import { githubLogin, googleLogin, discordLogin } from "@/utils/actions/index";
import { ChartNoAxesCombined, Quote, Sparkles, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" {...props}>
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
      <path d="M1 1h22v22H1z" fill="none" />
    </svg>
  );
}
function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" role="img" aria-label="GitHub" {...props}>
      <path d="M12 .5A11.5 11.5 0 0 0 .5 12c0 5.07 3.29 9.36 7.86 10.88.58.1.79-.26.79-.57v-2.02c-3.2.7-3.87-1.36-3.87-1.36-.53-1.35-1.3-1.71-1.3-1.71-1.06-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.73 1.27 3.4.97.1-.76.4-1.27.72-1.56-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.04 0 0 .98-.31 3.2 1.18a11.1 11.1 0 0 1 5.83 0c2.22-1.49 3.2-1.18 3.2-1.18.63 1.58.23 2.75.11 3.04.74.81 1.19 1.83 1.19 3.09 0 4.42-2.68 5.39-5.24 5.68.42.36.77 1.07.77 2.16v3.2c0 .31.2.68.8.56A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5z" />
    </svg>
  );
}
function DiscordIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 256 199" role="img" aria-label="Discord" {...props}>
      <path
        fill="currentColor"
        d="M216.856 16.596A208.53 208.53 0 0 0 170.04 4.37a144.09 144.09 0 0 0-6.72 13.94 199.74 199.74 0 0 0-59.717 0 144.16 144.16 0 0 0-6.72-13.94 208.692 208.692 0 0 0-46.84 12.226C18.487 53.404 9.38 89.27 12.467 124.73c19.64 14.66 38.63 23.61 57.25 29.55a161.77 161.77 0 0 0 12.41-19.62c-6.84-2.61-13.33-5.84-19.42-9.64 1.62-1.2 3.21-2.45 4.76-3.74 36.94 17.32 77.02 17.32 113.63 0 1.56 1.29 3.15 2.54 4.77 3.74-6.11 3.8-12.61 7.03-19.46 9.65a161.42 161.42 0 0 0 12.48 19.67c18.62-5.94 37.6-14.89 57.24-29.55 4.7-52.19-8.08-87.76-35.25-108.14ZM95.95 115.69c-10.99 0-19.95-9.99-19.95-22.31 0-12.33 8.86-22.32 19.95-22.32 11.1 0 20.06 10 19.95 22.32 0 12.32-8.86 22.31-19.95 22.31Zm63.98 0c-10.99 0-19.95-9.99-19.95-22.31 0-12.33 8.86-22.32 19.95-22.32 11.1 0 20.06 10 19.95 22.32 0 12.32-8.85 22.31-19.95 22.31Z"
      />
    </svg>
  );
}

export default function SignInPage() {
  return (
    <main className="min-h-screen flex items-center justify-center py-10 text-center">
      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h1>
            <Link href="/" className="inline-block align-top">
              <Image
                src="/logo/logo.svg"
                alt="logo"
                width={224}
                height={89}
                className="object-contain"
                priority
              />
            </Link>
          </h1>
          <div className="flex flex-col gap-2">
            <h2 className="font-bold text-2xl lg:text-3xl">업다운에 오신 것을 환영합니다</h2>
            <p className="text-slate-700">오늘의 감정을 주식처럼 기록하고 공유하세요</p>
          </div>
          <ul className="flex bg-linear-to-r from-sky-50 to-violet-200 rounded-2xl border border-slate-200 p-6 shadow-lg shadow-slate-200/50">
            <li className="flex-1 flex flex-col items-center gap-2">
              <span className="w-12 h-12 rouned-full flex items-center justify-center rounded-full bg-white text-blue-600">
                <TrendingUp size={20} />
              </span>
              <strong className="text-xs font-semibold text-slate-900">감정 기록</strong>
            </li>
            <li className="flex-1 flex flex-col items-center gap-2">
              <span className="w-12 h-12 rouned-full flex items-center justify-center rounded-full bg-white text-violet-500">
                <Sparkles />
              </span>
              <strong className="text-xs font-semibold text-slate-900">커뮤니티</strong>
            </li>
            <li className="flex-1 flex flex-col items-center gap-2">
              <span className="w-12 h-12 rouned-full flex items-center justify-center rounded-full bg-white text-green-600">
                <ChartNoAxesCombined />
              </span>
              <strong className="text-xs font-semibold text-slate-900">감정 분석</strong>
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-5 p-8 rounded-2xl shadow-lg shadow-slate-200/50 bg-white border border-slate-200">
          <h3 className="text-lg font-bold">소셜 계정으로 시작하기</h3>
          <form aria-label="로그인 폼">
            <fieldset className="flex flex-col gap-4 min-w-100">
              <Button
                className="gap-3 py-4 bg-slate-900 text-white font-bold"
                onClick={githubLogin}
              >
                <GithubIcon className="w-5 h-5" />
                <span className="min-w-30">GitHub로 계속하기</span>
              </Button>
              <Button
                className="gap-3 py-4 border border-slate-300 text-slate-900 font-bold"
                onClick={googleLogin}
              >
                <GoogleIcon className="w-5 h-5" />
                <span className="min-w-30">Google로 계속하기</span>
              </Button>
              <Button
                className="gap-3 py-4 bg-blue-600 text-white font-bold"
                onClick={discordLogin}
              >
                <DiscordIcon className="w-5 h-5" />
                <span className="min-w-30">Discord로 계속하기</span>
              </Button>
              <div className="text-gray-500 text-xs">
                <p>
                  계속 진행하면{" "}
                  <span className="text-slate-900 underline underline-offset-1">서비스 약관</span>{" "}
                  및{" "}
                  <span className="text-slate-900 underline underline-offset-1">
                    개인정보 처리방침
                  </span>
                  에 동의하는 것으로 간주됩니다
                </p>
              </div>
            </fieldset>
          </form>
        </div>

        <div className="flex flex-col items-center gap-5 p-8 rounded-2xl shadow-lg shadow-slate-200/50 bg-white border border-slate-200">
          <Quote className="stroke-slate-900 fill-slate-900" />
          <div className="">
            <p>감정은 늘 변하지만, 아무도 그 변화를 기록하지 않는다.</p>
            <span className="text-slate-500">─ UpDown 개미들의 철학</span>
          </div>
        </div>
      </section>
    </main>
  );
}
