"use client";

import { useEffect, useState, useCallback } from "react";
import { getStudentNotifications, getAdminNotifications } from "@/lib/api";

type Portal = "student" | "admin";

export function useUnreadCount(portal: Portal) {
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchCount = useCallback(async () => {
    try {
      const notifications =
        portal === "admin"
          ? await getAdminNotifications()
          : await getStudentNotifications();
      setUnreadCount(notifications.filter((n) => !n.isRead).length);
    } catch {
      // Non-fatal — badge simply won't show if fetch fails
    }
  }, [portal]);

  useEffect(() => {
    void fetchCount();
  }, [fetchCount]);

  // Re-fetch when the tab regains focus so the badge updates after
  // the user visits the notifications page and marks items as read
  useEffect(() => {
    const onFocus = () => { fetchCount().catch(() => {}); };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [fetchCount]);

  return unreadCount;
}
