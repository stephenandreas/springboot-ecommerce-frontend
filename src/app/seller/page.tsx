"use client";

import { useEffect, useState } from "react";
import { Wallet, Package, ClipboardList } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth-context";
import { getSellerBalance, getSellerProducts, getSellerOrders } from "@/lib/seller";
import { formatIDR } from "@/lib/format";

export default function SellerDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState<{ balance: number; products: number; orders: number } | null>(null);

  useEffect(() => {
    if (!token) return;
    Promise.allSettled([getSellerBalance(token), getSellerProducts(token), getSellerOrders(token)]).then(
      ([balance, products, orders]) => {
        setStats({
          balance: balance.status === "fulfilled" ? Number(balance.value.balance ?? balance.value.available ?? 0) : 0,
          products: products.status === "fulfilled" ? products.value.totalElements : 0,
          orders: orders.status === "fulfilled" ? orders.value.totalElements : 0,
        });
      },
    );
  }, [token]);

  return (
    <div>
      <h1 className="text-xl font-semibold">Dashboard Penjual</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {stats === null ? (
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)
        ) : (
          <>
            <Stat icon={Wallet} label="Saldo" value={formatIDR(stats.balance)} />
            <Stat icon={Package} label="Produk" value={String(stats.products)} />
            <Stat icon={ClipboardList} label="Pesanan" value={String(stats.orders)} />
          </>
        )}
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Icon className="size-4" /> {label}
        </div>
        <p className="mt-2 text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}
