import type { DBUserRow } from "../types/db";
import type { SearchUser } from "@/components/search/types";

export const mapRowToSearchUser = (r: DBUserRow): SearchUser => ({
  id: r.id,
  display_name: r.display_name,
  image_url: r.image_url,
  bio: r.bio,
  isFollowing: false,
  isMe: false,
});
