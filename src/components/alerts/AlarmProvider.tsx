"use client";
import { useNotificationStore } from "@/store/alarmStore";
import { useProfile } from "@/store/useStore";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useMemo, useRef } from "react";
import { RealtimeChannel } from "@supabase/supabase-js";

export default function AlarmProvider() {
  const profile = useProfile();
  const addNotification = useNotificationStore((s) => s.addNotification);
  const supabase = useMemo(() => createClient(), []);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const subscribedRef = useRef(false);

  useEffect(() => {
    async function subscribeRealtime() {
      if (!profile?.id) return;
      if (subscribedRef.current) return;
      console.log("AlarmProvider: subscribing realtime...");

      const channel = supabase
        .channel("notifications-realtime")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "notifications",
            filter: `receiver_id=eq.${profile.id}`,
          },
          async (payload) => {
            console.log("Realtime payload:", payload);
            const inserted = payload.new as { id: string };
            const { data, error } = await supabase
              .from("notifications")
              .select(
                `
              id,
              type,
              post_id,
              is_read,
              created_at,
              sender: users!sender_id (
              id,
              display_name,
              image_url
              ),
              post:post_id (
              id
              ),
              comment:comment_id (
              id,
              content
              )
            `,
              )
              .eq("id", inserted.id)
              .single();
            if (error) {
              console.error("Select error", error);
              return;
            }
            if (!data) return;
            addNotification(data as unknown as Notification);
          },
        )
        .subscribe((state) => console.log(state));
      channelRef.current = channel;
      subscribedRef.current = true;
      return () => {
        if (channelRef.current) {
          supabase.removeChannel(channelRef.current);
          channelRef.current = null;
          subscribedRef.current = false;
        }
      };
    }
    subscribeRealtime();
  }, [addNotification, profile?.id, supabase]);

  return null;
}
