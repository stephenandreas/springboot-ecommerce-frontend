"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, Pause, Play } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth-context";
import { getAdminStores, approveStore, suspendStore, activateStore } from "@/lib/admin";
import { ApiError } from "@/lib/api";
import type { Store } from "@/types";

export default function AdminStoresPage() {
  const { token } = useAuth();
  const [stores, setStores] = useState<Store[] | null>(null);

  const load = useCallback(() => {
    if (!token) return;
    getAdminStores(token).then((p) => setStores(p.content)).catch(() => setStores([]));
  }, [token]);
  useEffect(() => { load(); }, [load]);

  async function act(fn: () => Promise<unknown>, msg: string) {
    try { await fn(); toast.success(msg); load(); }
    catch (err) { toast.error(err instanceof ApiError ? err.message : "Gagal"); }
  }

  return (
    <div>
      <h1 className="text-xl font-semibold">Toko</h1>
      <div className="mt-6 space-y-2">
        {stores === null ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)
          : stores.map((s) => (
            <div key={s.id} className="flex flex-wrap items-center gap-3 rounded-xl bg-muted/50 p-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{s.name}</p>
                <p className="truncate text-xs text-muted-foreground">/{s.slug}</p>
              </div>
              <Badge variant={s.status === "ACTIVE" ? "default" : "secondary"}>{s.status}</Badge>
              <div className="flex gap-1">
                {s.status === "PENDING" && <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => act(() => approveStore(s.id, token!), "Toko disetujui")}><Check className="size-3.5" /> Setujui</Button>}
                {s.status === "ACTIVE"
                  ? <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-destructive" onClick={() => act(() => suspendStore(s.id, token!), "Toko ditangguhkan")}><Pause className="size-3.5" /> Tangguhkan</Button>
                  : <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => act(() => activateStore(s.id, token!), "Toko diaktifkan")}><Play className="size-3.5" /> Aktifkan</Button>}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
