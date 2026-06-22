"use client";

import { useEffect, useState } from "react";
import { Users, Store, ShoppingBag, TrendingUp, Coins, Wallet } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth-context";
import { getAdminAnalytics, type AdminAnalytics } from "@/lib/admin";
import { formatIDR } from "@/lib/format";

export default function AdminDashboard() {
  const { token } = useAuth();
  const [a, setA] = useState<AdminAnalytics | null>(null);

  useEffect(() => {
    if (!token) return;
    getAdminAnalytics(token).then(setA).catch(() => setA(null));
  }, [token]);

  const stats = a && [
    { icon: Users, label: "Pengguna", value: String(a.totalUsers) },
    { icon: Store, label: "Toko", value: String(a.totalStores) },
    { icon: ShoppingBag, label: "Pesanan", value: String(a.totalOrders) },
    { icon: TrendingUp, label: "GMV", value: formatIDR(a.gmv) },
    { icon: Coins, label: "Komisi Platform", value: formatIDR(a.platformCommission) },
    { icon: Wallet, label: "Escrow Tertahan", value: formatIDR(a.totalEscrow) },
  ];

  return (
    <div>
      <h1 className="text-xl font-semibold">Ringkasan Platform</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {!stats
          ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)
          : stats.map((s) => (
              <div key={s.label} className="rounded-2xl bg-muted/50 p-5">
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><s.icon className="size-4" /> {s.label}</div>
                <p className="mt-2 text-2xl font-bold">{s.value}</p>
              </div>
            ))}
      </div>
    </div>
  );
}
