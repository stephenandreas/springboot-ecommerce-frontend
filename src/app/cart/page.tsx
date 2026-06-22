"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, Store, ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/components/empty-state";
import { formatIDR } from "@/lib/format";
import { useCart } from "@/lib/cart-context";

export default function CartPage() {
  const { lines, byStore, subtotal, setQty, remove, count } = useCart();
  const groups = byStore();

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <EmptyState
          icon={ShoppingCart}
          title="Keranjang kosong"
          description="Yuk jelajahi produk dan tambahkan ke keranjang."
          action={
            <Button render={<Link href="/" />}>Mulai Belanja</Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="text-xl font-semibold">Keranjang ({count})</h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          {groups.map((g) => (
            <Card key={g.storeId}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Store className="size-4 text-muted-foreground" /> {g.storeName}
                </div>
                <Separator className="my-3" />
                <ul className="space-y-4">
                  {g.lines.map((l) => (
                    <li key={l.skuId} className="flex gap-3">
                      <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-muted">
                        {l.imageUrl && <Image src={l.imageUrl} alt={l.productName} fill sizes="64px" className="object-cover" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <Link href={`/products/${l.slug}`} className="line-clamp-1 text-sm font-medium hover:underline">
                          {l.productName}
                        </Link>
                        <p className="text-xs text-muted-foreground">{l.skuName}</p>
                        <p className="mt-1 text-sm font-semibold">{formatIDR(l.unitPrice)}</p>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <Button variant="ghost" size="icon" className="size-7 text-muted-foreground" onClick={() => remove(l.skuId)} aria-label="Hapus">
                          <Trash2 className="size-4" />
                        </Button>
                        <div className="inline-flex items-center rounded-full bg-muted">
                          <Button variant="ghost" size="icon" className="size-7" onClick={() => setQty(l.skuId, l.quantity - 1)} aria-label="Kurangi">
                            <Minus className="size-3.5" />
                          </Button>
                          <span className="w-8 text-center text-xs tabular-nums">{l.quantity}</span>
                          <Button variant="ghost" size="icon" className="size-7" onClick={() => setQty(l.skuId, l.quantity + 1)} aria-label="Tambah">
                            <Plus className="size-3.5" />
                          </Button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <Separator className="my-3" />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal toko</span>
                  <span className="font-medium">{formatIDR(g.subtotal)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <aside className="lg:sticky lg:top-20 lg:h-fit">
          <Card>
            <CardContent className="space-y-3 p-4">
              <p className="font-semibold">Ringkasan</p>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatIDR(subtotal)}</span>
              </div>
              <p className="text-xs text-muted-foreground">Ongkir dihitung saat checkout oleh server.</p>
              <Separator />
              <Button className="w-full" render={<Link href="/checkout" />}>
                Checkout
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
