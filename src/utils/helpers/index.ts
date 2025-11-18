// 초기 페이지값 (무한스크롤)
export const PAGE_SIZE = 10;

// 입력받은 날짜, 현재시간 기준으로 상대시간 구하기
export function formatRelativeTime(iso?: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 0) return "방금 전";
  const sec = Math.floor(diff / 1000);
  const min = Math.floor(sec / 60);
  const hr = Math.floor(min / 60);
  const day = Math.floor(hr / 24);
  if (day >= 1)
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
  if (hr >= 1) return `${hr}시간 전`;
  if (min >= 1) return `${min}분 전`;
  return "방금 전";
}

// 전체 랭크
export function setTrendTagsRank(
  tags: { content: string; created_at?: string }[],
  count: number = 10,
) {
  const tokens = tags.flatMap((tag) => tag.content.split(",")).filter((tag) => tag.length > 0);
  const frequencyMap: {
    [key: string]: number;
  } = {};

  tokens.forEach((token) => {
    frequencyMap[token] = (frequencyMap[token] || 0) + 1;
  });

  const tagRanks = Object.entries(frequencyMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([tag, count]) => ({ tag, count }));

  return tagRanks;
}

// 해시태그 배열로 변환
export function getHashtagArray(hashtags: { content: string }[] | string[]) {
  if (hashtags.length > 0) {
    if (typeof hashtags[0] === "string" && hashtags[0] !== "") {
      return hashtags[0].split(",");
    }
    if (typeof hashtags[0] === "object" && hashtags[0].content !== "") {
      return hashtags[0].content.split(",");
    }
  }
  return null;
}
