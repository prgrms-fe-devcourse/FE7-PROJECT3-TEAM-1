"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { twMerge } from "tailwind-merge";

export function ImageModal({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
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
        className={twMerge(
          "fixed top-0 left-0 flex justify-center items-center w-full h-full bg-[rgba(0,0,0,0.3)] z-80 backdrop-blur-sm",
          className,
        )}
        onClick={closeModal}
        aria-modal="true"
        role="dialog"
      >
        {children}
      </div>
    </>
  );
}
