import { apiFetch } from "@/lib/api";
import type { AppNotification, PagedResponse } from "@/types";

export async function getNotifications(token: string, page = 0, size = 20): Promise<AppNotification[]> {
  try {
    return (await apiFetch<PagedResponse<AppNotification>>(`/notifications?page=${page}&size=${size}`, { token })).content;
  } catch {
    return [];
  }
}
export async function getUnreadCount(token: string): Promise<number> {
  try {
    const r = await apiFetch<number | { count: number }>("/notifications/unread-count", { token });
    return typeof r === "number" ? r : (r?.count ?? 0);
  } catch {
    return 0;
  }
}
export function markNotificationRead(id: string, token: string): Promise<void> {
  return apiFetch<void>(`/notifications/${id}/read`, { method: "PUT", token });
}
export function markAllNotificationsRead(token: string): Promise<void> {
  return apiFetch<void>("/notifications/read-all", { method: "PUT", token });
}
