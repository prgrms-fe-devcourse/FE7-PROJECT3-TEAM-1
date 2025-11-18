import { useMediaQuery } from "@/hooks/useMediaQuery";

export function useBreakpoint() {
  const isXs = useMediaQuery("(max-width: 39.99rem)"); // ~639px
  const isSm = useMediaQuery("(min-width: 40rem)"); // 640px
  const isMd = useMediaQuery("(min-width: 48rem)"); // 768px
  const isLg = useMediaQuery("(min-width: 64rem)"); // 1024px
  const isXl = useMediaQuery("(min-width: 80rem)"); // 1280px
  const is2xl = useMediaQuery("(min-width: 96rem)"); // 1536px

  return {
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,
    is2xl,
    isMobile: !isSm,
    isTablet: isMd && !isLg,
    isWearable: !isLg,
    isDesktop: isLg,
  };
}
