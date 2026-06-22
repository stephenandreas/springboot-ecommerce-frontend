"use client";

import { useCallback, useEffect, useState } from "react";
import { Ban, Check } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth-context";
import { getAdminUsers, banUser, unbanUser } from "@/lib/admin";
import { ApiError } from "@/lib/api";
import type { UserProfile } from "@/types";

export default function AdminUsersPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState<UserProfile[] | null>(null);

  const load = useCallback(() => {
    if (!token) return;
    getAdminUsers(token).then((p) => setUsers(p.content)).catch(() => setUsers([]));
  }, [token]);
  useEffect(() => { load(); }, [load]);

  async function act(fn: () => Promise<unknown>, msg: string) {
    try { await fn(); toast.success(msg); load(); }
    catch (err) { toast.error(err instanceof ApiError ? err.message : "Gagal"); }
  }

  return (
    <div>
      <h1 className="text-xl font-semibold">Pengguna</h1>
      <div className="mt-6 space-y-2">
        {users === null ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)
          : users.map((u) => (
            <div key={u.id} className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{u.fullName}</p>
                <p className="truncate text-xs text-muted-foreground">{u.email}</p>
              </div>
              <Badge variant="secondary">{u.role.replace("ROLE_", "")}</Badge>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-destructive" onClick={() => act(() => banUser(u.id, token!), "Pengguna diblokir")}><Ban className="size-3.5" /> Blokir</Button>
                <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => act(() => unbanUser(u.id, token!), "Blokir dicabut")}><Check className="size-3.5" /> Aktifkan</Button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
