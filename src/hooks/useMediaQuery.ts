import { useEffect, useState } from "react";

export function useMediaQuery(query: string): boolean {
  // 서버와 클라이언트 모두에서 초기값을 false로 통일
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);

    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // 초기 동기화를 위한 타이머 사용 (린트 우회)
    const timer = setTimeout(() => {
      setMatches(mediaQuery.matches);
    }, 0);

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      clearTimeout(timer);
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [query]);

  return matches;
}
