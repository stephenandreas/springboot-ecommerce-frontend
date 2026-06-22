"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/empty-state";
import { useAuth } from "@/lib/auth-context";
import { getAdminWithdrawals, approveWithdrawal, rejectWithdrawal } from "@/lib/admin";
import { formatIDR } from "@/lib/format";
import { ApiError } from "@/lib/api";
import { Banknote } from "lucide-react";
import type { Withdrawal } from "@/lib/seller";

export default function AdminWithdrawalsPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<Withdrawal[] | null>(null);

  const load = useCallback(() => {
    if (!token) return;
    getAdminWithdrawals(token).then((p) => setItems(p.content)).catch(() => setItems([]));
  }, [token]);
  useEffect(() => { load(); }, [load]);

  async function act(fn: () => Promise<unknown>, msg: string) {
    try { await fn(); toast.success(msg); load(); }
    catch (err) { toast.error(err instanceof ApiError ? err.message : "Gagal"); }
  }

  return (
    <div>
      <h1 className="text-xl font-semibold">Penarikan Dana</h1>
      <div className="mt-6 space-y-2">
        {items === null ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)
          : items.length === 0 ? <EmptyState icon={Banknote} title="Tidak ada penarikan" />
          : items.map((w) => (
            <div key={w.id} className="flex flex-wrap items-center gap-3 rounded-xl bg-muted/50 p-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{formatIDR(w.amount)}</p>
                <p className="truncate text-xs text-muted-foreground">{w.bankName} · {w.bankAccount}</p>
              </div>
              <Badge variant="secondary">{w.status}</Badge>
              {w.status === "PENDING" && (
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => act(() => approveWithdrawal(w.id, token!), "Disetujui")}><Check className="size-3.5" /> Setujui</Button>
                  <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-destructive" onClick={() => act(() => rejectWithdrawal(w.id, token!), "Ditolak")}><X className="size-3.5" /> Tolak</Button>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
