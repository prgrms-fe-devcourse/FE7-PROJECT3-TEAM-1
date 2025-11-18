export type FeelType = "UP" | "DOWN" | "HOLD";

export type User = {
  display_name: string;
  image_url?: string | null;
};

export interface CommunityPost {
  id: string;
  created_at: string;
  title: string;
  content: string;
  likes_count: number;
  comments_count: number;
  users: {
    display_name: string;
    image_url: string | null;
  };
  feels: { type: FeelType }[];
  tags: string[];
  // 어떤 유저들이 좋아요 눌렀는지 (지금은 길이만 쓰지만, 확장성 위해 남겨둠)
  likes: {
    post_id: string;
    user_id: string;
  }[];
  // 현재 로그인한 유저 기준으로, 내가 좋아요를 눌렀는지 여부
  is_liked_by_me: boolean;
}

export type SearchUser = {
  id: string;
  display_name: string;
  image_url?: string | null;
  bio?: string | null;
  isFollowing: boolean; // 내가 이 사람을 팔로우 중인지
  isMe: boolean; // 나 자신인지 (나 자신이면 버튼 안 보이게)
};

export type SearchTag = {
  content: string;
  // 태그 사용 횟수 등을 붙이고 싶으면
  // count?: number;
};
