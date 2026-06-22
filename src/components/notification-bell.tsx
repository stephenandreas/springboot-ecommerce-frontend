"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { getUnreadCount } from "@/lib/notifications";

export function NotificationBell() {
  const { token } = useAuth();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!token) return;
    getUnreadCount(token).then(setCount);
  }, [token]);

  if (!token) return null;

  return (
    <Button variant="ghost" size="icon" aria-label="Notifikasi" className="relative" asChild>
      <Link href="/notifications">
        <Bell className="size-5" />
        {count > 0 && (
          <span className="absolute right-1 top-1 grid size-4 place-items-center rounded-full bg-primary text-[9px] font-semibold text-primary-foreground tabular-nums">
            {count > 9 ? "9" : count}
          </span>
        )}
      </Link>
    </Button>
  );
}
