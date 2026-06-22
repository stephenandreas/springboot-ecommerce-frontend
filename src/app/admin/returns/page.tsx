"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, X, Undo2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/empty-state";
import { useAuth } from "@/lib/auth-context";
import { getAdminReturns, resolveReturn } from "@/lib/admin";
import { ApiError } from "@/lib/api";
import type { ReturnRequest } from "@/types";

export default function AdminReturnsPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<ReturnRequest[] | null>(null);

  const load = useCallback(() => {
    if (!token) return;
    getAdminReturns(token).then(setItems).catch(() => setItems([]));
  }, [token]);
  useEffect(() => { load(); }, [load]);

  async function resolve(r: ReturnRequest, approve: boolean) {
    if (!token) return;
    let refundAmount: number | undefined;
    if (approve) {
      const v = window.prompt("Jumlah refund (Rp):", "0");
      if (v === null) return;
      refundAmount = Number(v) || 0;
    }
    try {
      await resolveReturn(r.id, { status: approve ? "APPROVED" : "REJECTED", refundAmount }, token);
      toast.success(approve ? "Retur disetujui" : "Retur ditolak");
      load();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Gagal");
    }
  }

  return (
    <div>
      <h1 className="text-xl font-semibold">Pengajuan Retur</h1>
      <div className="mt-6 space-y-3">
        {items === null ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)
          : items.length === 0 ? <EmptyState icon={Undo2} title="Tidak ada retur" />
          : items.map((r) => (
            <div key={r.id} className="rounded-2xl bg-muted/50 p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="font-mono text-xs text-muted-foreground">#{r.orderId.slice(0, 8)}</p>
                <Badge variant="secondary">{r.status}</Badge>
              </div>
              <p className="mt-2 text-sm">{r.reason}</p>
              {r.status === "PENDING" && (
                <div className="mt-3 flex gap-2">
                  <Button size="sm" className="rounded-full" onClick={() => resolve(r, true)}><Check className="size-4" /> Setujui</Button>
                  <Button size="sm" variant="secondary" className="rounded-full bg-background" onClick={() => resolve(r, false)}><X className="size-4" /> Tolak</Button>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
