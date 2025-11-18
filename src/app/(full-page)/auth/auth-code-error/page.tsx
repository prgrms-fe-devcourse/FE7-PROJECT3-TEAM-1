import { AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AuthCodeError() {
  return (
    <div className="max-w-md mx-auto pt-16">
      <div className="space-y-8">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
              <AlertCircle size={32} className="text-red-500" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">로그인에 실패했습니다.</h1>
            <p className="text-slate-400 text-sm">로그인할 수 없습니다. 다시 시도해 주세요.</p>
          </div>
        </div>

        <div className="border border-slate-200 rounded-lg p-6 bg-white">
          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-sm font-medium text-slate-900">일반적인 문제:</h2>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-slate-600 mt-0.5">•</span>
                  <span>계정 정보가 올바르지 않을 수 있습니다</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-slate-600 mt-0.5">•</span>
                  <span>네트워크 연결 문제</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-slate-600 mt-0.5">•</span>
                  <span>외부 인증 서비스를 사용할 수 없음</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {/* TODO: /login말고 다른경로로 */}
          <a
            href="/login"
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-slate-200 bg-white text-black hover:bg-slate-200/50 transition-colors text-sm font-medium"
          >
            다시 시도하기
          </a>
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-slate-200 hover:bg-slate-200/50 transition-all text-sm"
          >
            <ArrowLeft size={16} />
            홈으로 돌아가기
          </Link>
        </div>

        <p className="text-center text-xs text-slate-500">
          도움이 필요하신가요? 고객지원팀에 문의해 주세요
        </p>
      </div>
    </div>
  );
}
