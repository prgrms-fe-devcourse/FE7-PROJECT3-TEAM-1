// stores/notificationStore.ts
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { createClient } from "@/utils/supabase/client";

export type AlarmStore = {
  notifications: Notification[];
  unReadCount: number;

  setUnReadCount: (value: number | ((prev: number) => number)) => void;
  setNotifications: (list: Notification[]) => void;
  addNotification: (notification: Notification) => void;

  fetchNotifications: (uid: string) => Promise<void>;
  markAllRead: (uid: string) => Promise<void>;
};

export const useNotificationStore = create<AlarmStore>()(
  immer((set) => ({
    notifications: [],
    unReadCount: 0,

    setUnReadCount: (value) =>
      set((state) => {
        state.unReadCount = typeof value === "function" ? value(state.unReadCount) : value;
      }),

    setNotifications: (list) =>
      set((state) => {
        state.notifications = list;
      }),

    addNotification: (n) =>
      set((state) => {
        state.notifications.unshift(n);
        state.unReadCount += 1;
      }),

    fetchNotifications: async (uid: string) => {
      const supabase = createClient();

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
        .eq("receiver_id", uid)
        .order("created_at", { ascending: false });

      if (!error && data) {
        set((state) => {
          state.notifications = data as Notification[];
          state.unReadCount = data.filter((n) => !n.is_read).length;
        });
      }
    },

    markAllRead: async (uid: string) => {
      await fetch("/api/notifications/read-all", {
        method: "POST",
        body: JSON.stringify({ uid }),
      });

      set((state) => {
        state.notifications = state.notifications.map((n) => ({
          ...n,
          is_read: true,
        }));
        state.unReadCount = 0;
      });
    },
  })),
);
