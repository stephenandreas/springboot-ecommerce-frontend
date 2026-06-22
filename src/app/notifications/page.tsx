"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, CheckCheck } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/empty-state";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { getNotifications, markNotificationRead, markAllNotificationsRead } from "@/lib/notifications";
import type { AppNotification } from "@/types";

export default function NotificationsPage() {
  const { token, isReady } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<AppNotification[] | null>(null);

  const load = useCallback(() => {
    if (!token) return;
    getNotifications(token).then(setItems);
  }, [token]);

  useEffect(() => {
    if (!isReady) return;
    if (!token) {
      router.replace("/login?next=/notifications");
      return;
    }
    load();
  }, [isReady, token, router, load]);

  async function readOne(n: AppNotification) {
    if (n.read || !token) return;
    setItems((arr) => arr?.map((x) => (x.id === n.id ? { ...x, read: true } : x)) ?? null);
    try {
      await markNotificationRead(n.id, token);
    } catch {
      /* ignore */
    }
  }

  async function readAll() {
    if (!token) return;
    try {
      await markAllNotificationsRead(token);
      setItems((arr) => arr?.map((x) => ({ ...x, read: true })) ?? null);
      toast.success("Semua ditandai dibaca");
    } catch {
      toast.error("Gagal");
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Notifikasi</h1>
        {items && items.some((n) => !n.read) && (
          <Button variant="ghost" size="sm" onClick={readAll}>
            <CheckCheck className="size-4" /> Tandai semua
          </Button>
        )}
      </div>

      <div className="mt-6 space-y-2">
        {items === null ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)
        ) : items.length === 0 ? (
          <EmptyState icon={Bell} title="Belum ada notifikasi" />
        ) : (
          items.map((n) => (
            <button
              key={n.id}
              onClick={() => readOne(n)}
              className={cn(
                "flex w-full gap-3 rounded-xl p-4 text-left transition-colors",
                n.read ? "bg-muted/30" : "bg-primary/5 hover:bg-primary/10",
              )}
            >
              <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", n.read ? "bg-transparent" : "bg-primary")} />
              <div className="min-w-0">
                <p className="text-sm font-medium">{n.title}</p>
                <p className="text-sm text-muted-foreground">{n.message}</p>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
