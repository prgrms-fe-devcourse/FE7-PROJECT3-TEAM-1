export type DBPostRow = {
  id: string;
  user_id: string;
  created_at: string;
  title: string | null;
  content: string | null;
  likes_count: number | null;
  comments_count: number | null;
  users: { id: string; display_name: string; image_url: string | null } | null;
  hashtags: { content: string }[] | null;
  feels: { type: string; amount: number | null }[] | null;
};

export type DBUserRow = {
  id: string;
  display_name: string;
  image_url: string | null;
  bio: string | null;
};

export type DBTagRow = {
  content: string;
};
