import { ButtonProps, ButtonType } from "@/types/form";
import { twMerge } from "tailwind-merge";

const variantStyles: Record<ButtonType, string> = {
  submit:
    "min-h-12 px-4 py-4 rounded-2xl font-semibold text-md bg-gradient-to-r from-[#A8E0FF] to-[#C5C8FF] text-white dark:from-[#6B8FA3] dark:to-[#7A8FB8]",
  edit: "px-2 py-1 bg-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300",
  delete: "px-2 py-1 bg-red-500 text-white ",
  common: "p-0 bg-transparent text-slate-500",
};

export default function Button({
  variant = "common",
  className = "",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={twMerge(
        "flex items-center justify-center gap-1 rounded-lg font-medium text-sm transition hover:opacity-70 cursor-pointer",
        variantStyles[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
