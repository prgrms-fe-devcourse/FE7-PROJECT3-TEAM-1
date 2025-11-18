import { FeelBadgeProps } from "@/types/community";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { twMerge } from "tailwind-merge";

const feelConfig = {
  up: {
    icon: TrendingUp,
    label: "UP",
    bgColor: "bg-red-200",
    textColor: "text-red-500",
  },
  down: {
    icon: TrendingDown,
    label: "DOWN",
    bgColor: "bg-blue-200",
    textColor: "text-blue-500",
  },
  hold: {
    icon: Minus,
    label: "HOLD",
    bgColor: "bg-slate-200",
    textColor: "text-slate-500",
  },
};

export default function FeelBadge({
  type,
  className = "",
  showIcon = true,
  size = "md",
}: FeelBadgeProps) {
  const config = feelConfig[type];
  const Icon = config.icon;

  return (
    <div
      className={twMerge(
        "flex justify-center items-center font-medium rounded-2xl",
        config.bgColor,
        config.textColor,
        className,
        "px-2 py-0.5 text-xs gap-0.5",
        "md:px-3 md:py-1 md:text-sm md:gap-1",
        "xl:px-4 xl:py-2 xl:text-base xl:gap-2",
      )}
    >
      {showIcon && <Icon className={twMerge("w-4 h-4", "md:w-5 md:h-5", "lg:w-6 lg:h-6")} />}
      <span>{config.label}</span>
    </div>
  );
}
