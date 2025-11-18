import { InputProps } from "@/types/form";
import { twMerge } from "tailwind-merge";
import { paperlogy } from "@/../public/fonts/local_fonts";

export default function Input(props: InputProps) {
  const { className = "", type, children, ...rest } = props;
  return (
    <>
      {!children && (
        <input
          type={type}
          className={twMerge(
            "flex items-center gap-2 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium placeholder:text-slate-500 focus:outline-0 focus:placeholder:text-[0px] dark:bg-slate-700/50 dark:border-slate-600",
            className,
            paperlogy.className,
          )}
          {...rest}
        />
      )}
      {children && (
        <label
          className={twMerge(
            "flex items-center gap-2 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium placeholder:text-slate-500",
            className,
            paperlogy.className,
          )}
        >
          {children}
          <input
            className="w-full focus:outline-0 focus:placeholder:text-[0px]"
            type={type}
            {...rest}
          />
        </label>
      )}
    </>
  );
}
