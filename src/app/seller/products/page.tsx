"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Package, Plus, Pencil, Eye, EyeOff, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/empty-state";
import { useAuth } from "@/lib/auth-context";
import { getSellerProducts, publishProduct, unpublishProduct, deleteProduct } from "@/lib/seller";
import { formatIDR, lowestPrice } from "@/lib/format";
import { ApiError } from "@/lib/api";
import type { Product } from "@/types";

export default function SellerProductsPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[] | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(() => {
    if (!token) return;
    getSellerProducts(token, 0, 100)
      .then((p) => setProducts(p.content))
      .catch(() => setProducts([]));
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
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Produk Saya</h1>
        <Button asChild size="sm" className="rounded-full">
          <Link href="/seller/products/new"><Plus className="size-4" /> Tambah</Link>
        </Button>
      </div>
      <div className="mt-6 space-y-3">
        {products === null ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)
        ) : products.length === 0 ? (
          <EmptyState
            icon={Package}
            title="Belum ada produk"
            description="Tambahkan produk pertama Anda."
            action={<Button asChild><Link href="/seller/products/new">Tambah Produk</Link></Button>}
          />
        ) : (
          products.map((p) => {
            const price = lowestPrice(p.skus?.map((s) => Number(s.price)) ?? []);
            const stock = p.skus?.reduce((n, s) => n + (s.stock ?? 0), 0) ?? 0;
            const active = p.status === "ACTIVE";
            return (
              <Card key={p.id}>
                <CardContent className="flex flex-wrap items-center gap-4 p-3">
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-md bg-muted">
                    {p.images?.[0]?.url && <Image src={p.images[0].url} alt={p.name} fill sizes="56px" className="object-cover" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{formatIDR(price)} · stok {stock}</p>
                  </div>
                  <Badge variant={active ? "default" : "secondary"}>{p.status}</Badge>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="size-8" asChild aria-label="Edit">
                      <Link href={`/seller/products/${p.id}/edit`}><Pencil className="size-4" /></Link>
                    </Button>
                    <Button
                      variant="ghost" size="icon" className="size-8" disabled={busy === p.id}
                      aria-label={active ? "Sembunyikan" : "Publikasikan"}
                      onClick={() => act(p.id, () => (active ? unpublishProduct(p.id, token!) : publishProduct(p.id, token!)), active ? "Disembunyikan" : "Dipublikasikan")}
                    >
                      {active ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </Button>
                    <Button
                      variant="ghost" size="icon" className="size-8 text-destructive" disabled={busy === p.id}
                      aria-label="Hapus"
                      onClick={() => {
                        if (confirm(`Hapus "${p.name}"?`)) act(p.id, () => deleteProduct(p.id, token!), "Produk dihapus");
                      }}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
