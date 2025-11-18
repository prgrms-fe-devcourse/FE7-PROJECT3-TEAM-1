interface Notification {
  id: string;
  type: "like" | "comment" | "follow";
  post_id: string | null;
  is_read: boolean;
  created_at: string;
  sender: Sender;
  post: Post | null;
  comment: NotificationComment | null; // ← 변경
}

interface Sender {
  id: string;
  display_name: string;
  image_url: string | null;
}

interface Post {
  id: string;
}

interface NotificationComment {
  id: string;
  content: string;
}
