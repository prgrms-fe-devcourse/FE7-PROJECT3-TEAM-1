import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import EditClient from "./EditClient";

export default async function ProfileEditPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/sign-in");

  const { data: me } = await supabase
    .from("users")
    .select("id, display_name, bio, image_url")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <EditClient
      userId={user.id}
      nameInit={me?.display_name ?? ""}
      bioInit={me?.bio ?? ""}
      avatarInit={me?.image_url ?? null}
    />
  );
}
