"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Package } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/empty-state";
import { useAuth } from "@/lib/auth-context";
import { getSellerProducts } from "@/lib/seller";
import { formatIDR, lowestPrice } from "@/lib/format";
import type { Product } from "@/types";

export default function SellerProductsPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[] | null>(null);

  useEffect(() => {
    if (!token) return;
    getSellerProducts(token)
      .then((p) => setProducts(p.content))
      .catch(() => setProducts([]));
  }, [token]);

  return (
    <div>
      <h1 className="text-xl font-semibold">Produk Saya</h1>
      <div className="mt-6 space-y-3">
        {products === null ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)
        ) : products.length === 0 ? (
          <EmptyState icon={Package} title="Belum ada produk" description="Produk yang Anda buat akan muncul di sini." />
        ) : (
          products.map((p) => {
            const price = lowestPrice(p.skus?.map((s) => Number(s.price)) ?? []);
            const stock = p.skus?.reduce((n, s) => n + (s.stock ?? 0), 0) ?? 0;
            return (
              <Card key={p.id}>
                <CardContent className="flex items-center gap-4 p-3">
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-md bg-muted">
                    {p.images?.[0]?.url && <Image src={p.images[0].url} alt={p.name} fill sizes="56px" className="object-cover" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{formatIDR(price)} · stok {stock}</p>
                  </div>
                  <Badge variant={p.status === "ACTIVE" ? "default" : "secondary"}>{p.status}</Badge>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
