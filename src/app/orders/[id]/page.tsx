"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderStatusBadge } from "@/components/order-status-badge";
import { useAuth } from "@/lib/auth-context";
import { getOrder, initiatePayment, confirmReceived } from "@/lib/orders";
import { formatIDR } from "@/lib/format";
import { ApiError } from "@/lib/api";
import type { Order } from "@/types";

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { token, isReady } = useAuth();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    if (!token) return;
    getOrder(id, token).then(setOrder).catch(() => setOrder(null));
  }, [id, token]);

  useEffect(() => {
    if (!isReady) return;
    if (!token) {
      router.replace(`/login?next=/orders/${id}`);
      return;
    }
    load();
  }, [isReady, token, id, router, load]);

  async function run(action: () => Promise<unknown>, success: string) {
    if (!token) return;
    setBusy(true);
    try {
      await action();
      toast.success(success);
      load();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Aksi gagal");
    } finally {
      setBusy(false);
    }
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-4 h-40 w-full rounded-xl" />
      </div>
    );
  }

  const canPay = order.status === "PENDING_PAYMENT";
  const canConfirm = order.status === "PAID" && order.subOrders.every((s) => s.status === "SHIPPED" || s.status === "CANCELLED");

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold">Detail Pesanan</h1>
          <p className="font-mono text-xs text-muted-foreground">#{order.id}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="mt-6 space-y-4">
        {order.subOrders.map((sub) => (
          <Card key={sub.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Toko</span>
                <OrderStatusBadge status={sub.status} />
              </div>
              {sub.trackingNumber && <p className="mt-1 text-xs text-muted-foreground">Resi: {sub.trackingNumber}</p>}
              <Separator className="my-3" />
              <ul className="space-y-3">
                {sub.items.map((it) => (
                  <li key={it.id} className="flex gap-3">
                    <div className="relative size-12 shrink-0 overflow-hidden rounded-md bg-muted">
                      {it.imageUrl && <Image src={it.imageUrl} alt={it.productName} fill sizes="48px" className="object-cover" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 text-sm">{it.productName}</p>
                      <p className="text-xs text-muted-foreground">{it.skuName} · ×{it.quantity}</p>
                    </div>
                    <span className="text-sm font-medium">{formatIDR(it.subtotal)}</span>
                  </li>
                ))}
              </ul>
              <Separator className="my-3" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Ongkir</span>
                <span>{formatIDR(sub.shippingCost)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-4">
        <CardContent className="space-y-3 p-4">
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>{formatIDR(order.totalAmount)}</span>
          </div>
          {canPay && (
            <Button className="w-full" disabled={busy} onClick={() => run(() => initiatePayment(order.id, token!), "Pembayaran diinisiasi")}>
              Bayar Sekarang
            </Button>
          )}
          {canConfirm && (
            <Button className="w-full" disabled={busy} onClick={() => run(() => confirmReceived(order.id, token!), "Pesanan dikonfirmasi diterima")}>
              Konfirmasi Diterima
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
