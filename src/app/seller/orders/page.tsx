"use client";

import { useCallback, useEffect, useState } from "react";
import { ClipboardList } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/empty-state";
import { OrderStatusBadge } from "@/components/order-status-badge";
import { useAuth } from "@/lib/auth-context";
import { getSellerOrders, acceptSubOrder, rejectSubOrder, shipSubOrder } from "@/lib/seller";
import { formatIDR } from "@/lib/format";
import { ApiError } from "@/lib/api";
import type { SubOrder } from "@/types";

export default function SellerOrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<SubOrder[] | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(() => {
    if (!token) return;
    getSellerOrders(token)
      .then((p) => setOrders(p.content))
      .catch(() => setOrders([]));
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  async function act(id: string, fn: () => Promise<unknown>, msg: string) {
    setBusy(id);
    try {
      await fn();
      toast.success(msg);
      load();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Aksi gagal");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div>
      <h1 className="text-xl font-semibold">Pesanan Masuk</h1>
      <div className="mt-6 space-y-3">
        {orders === null ? (
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)
        ) : orders.length === 0 ? (
          <EmptyState icon={ClipboardList} title="Belum ada pesanan masuk" />
        ) : (
          orders.map((sub) => (
            <Card key={sub.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <p className="font-mono text-xs text-muted-foreground">#{sub.id}</p>
                  <OrderStatusBadge status={sub.status} />
                </div>
                <p className="mt-2 text-sm">
                  {sub.items?.length ?? 0} item · {formatIDR(sub.sellerAmount)}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {sub.status === "PENDING" && (
                    <>
                      <Button size="sm" disabled={busy === sub.id} onClick={() => act(sub.id, () => acceptSubOrder(sub.id, token!), "Pesanan diterima")}>
                        Terima
                      </Button>
                      <Button size="sm" variant="outline" disabled={busy === sub.id} onClick={() => act(sub.id, () => rejectSubOrder(sub.id, token!), "Pesanan ditolak")}>
                        Tolak
                      </Button>
                    </>
                  )}
                  {sub.status === "PROCESSING" && (
                    <Button
                      size="sm"
                      disabled={busy === sub.id}
                      onClick={() => {
                        const trk = window.prompt("Nomor resi:");
                        if (trk) act(sub.id, () => shipSubOrder(sub.id, trk, token!), "Pesanan dikirim");
                      }}
                    >
                      Kirim
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
