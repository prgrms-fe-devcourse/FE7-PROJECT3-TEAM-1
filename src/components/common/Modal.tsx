"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { twMerge } from "tailwind-merge";

export function Modal({ className, children }: { className?: string; children: React.ReactNode }) {
  const router = useRouter();

  const closeModal = () => {
    router.back();
  };

  useEffect(() => {
    const prevStyle = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevStyle;
    };
  }, []);

  return (
    <>
      <div
        className="fixed top-0 left-0 flex justify-center items-center w-full h-full bg-[rgba(0,0,0,0.3)] z-80 backdrop-blur-sm"
        onClick={(e) => {
          if (e.target === e.currentTarget) closeModal();
        }}
        aria-modal="true"
        role="dialog"
      >
        <div
          className={twMerge(
            "min-w-100 p-6 rounded-lg bg-white border border-slate-200 shadow-lg",
            className,
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </>
  );
}
