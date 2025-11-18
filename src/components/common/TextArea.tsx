"use client";

import { TextAreaProps } from "@/types/form";
import { twMerge } from "tailwind-merge";
import { paperlogy } from "@/../public/fonts/local_fonts";

export default function TextArea(props: TextAreaProps) {
  const { className = "", children, ...rest } = props;

  return (
    <>
      <label
        className={twMerge(
          "flex items-center gap-2 p-4 bg-slate-50 border border-slate-200 text-md rounded-2xl font-medium dark:bg-slate-700/50 dark:border-slate-600",
          className,
          paperlogy.className,
        )}
      >
        {children}
        <textarea
          className="w-full h-full resize-none focus:outline-0 focus:placeholder:text-[0px] placeholder:text-slate-500"
          {...rest}
        />
      </label>
    </>
  );
}
