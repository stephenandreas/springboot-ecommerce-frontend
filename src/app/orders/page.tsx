"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Package } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/empty-state";
import { OrderStatusBadge } from "@/components/order-status-badge";
import { useAuth } from "@/lib/auth-context";
import { getMyOrders } from "@/lib/orders";
import { formatIDR } from "@/lib/format";
import type { Order } from "@/types";

export default function OrdersPage() {
  const { token, isReady } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    if (!isReady) return;
    if (!token) {
      router.replace("/login?next=/orders");
      return;
    }
    getMyOrders(token)
      .then((p) => setOrders(p.content))
      .catch(() => setOrders([]));
  }, [isReady, token, router]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="text-xl font-semibold">Pesanan Saya</h1>

      <div className="mt-6 space-y-3">
        {orders === null ? (
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-xl" />)
        ) : orders.length === 0 ? (
          <EmptyState
            icon={Package}
            title="Belum ada pesanan"
            description="Pesanan yang Anda buat akan muncul di sini."
            action={<Button render={<Link href="/" />}>Mulai Belanja</Button>}
          />
        ) : (
          orders.map((o) => (
            <Link key={o.id} href={`/orders/${o.id}`}>
              <Card className="transition-shadow hover:shadow-md">
                <CardContent className="flex items-center justify-between gap-4 p-4">
                  <div className="min-w-0">
                    <p className="truncate font-mono text-xs text-muted-foreground">#{o.id}</p>
                    <p className="mt-1 text-sm">{o.subOrders?.length ?? 0} toko · {formatIDR(o.totalAmount)}</p>
                  </div>
                  <OrderStatusBadge status={o.status} />
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
