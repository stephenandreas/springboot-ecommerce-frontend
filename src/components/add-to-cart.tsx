"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatIDR } from "@/lib/format";
import { useCart } from "@/lib/cart-context";
import type { Product } from "@/types";

export function AddToCart({ product }: { product: Product }) {
  const router = useRouter();
  const { add } = useCart();
  const skus = product.skus ?? [];
  const [skuId, setSkuId] = useState(skus[0]?.skuId ?? "");
  const [qty, setQty] = useState(1);

  const sku = skus.find((s) => s.skuId === skuId) ?? skus[0];
  const maxQty = sku?.stock ?? 0;
  const outOfStock = maxQty <= 0;

  function buildLine() {
    return {
      productId: product.id,
      slug: product.slug,
      skuId: sku.skuId,
      productName: product.name,
      skuName: sku.name,
      unitPrice: Number(sku.price),
      imageUrl: product.images?.[0]?.url ?? sku.imageUrl ?? null,
      storeId: product.storeId,
      storeName: "Toko",
    };
  }

  function addToCart() {
    add(buildLine(), qty);
    toast.success("Ditambahkan ke keranjang", { description: `${product.name} · ${sku.name} ×${qty}` });
  }

  function buyNow() {
    add(buildLine(), qty);
    router.push("/cart");
  }

  return (
    <div className="rounded-xl border p-5">
      <p className="text-2xl font-bold">{formatIDR(Number(sku?.price ?? 0))}</p>

      {skus.length > 1 && (
        <div className="mt-4">
          <p className="mb-2 text-sm font-medium">Varian</p>
          <div className="flex flex-wrap gap-2">
            {skus.map((s) => (
              <Button
                key={s.skuId}
                type="button"
                size="sm"
                variant={s.skuId === skuId ? "default" : "outline"}
                onClick={() => {
                  setSkuId(s.skuId);
                  setQty(1);
                }}
              >
                {s.name}
              </Button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4">
        <p className="mb-2 text-sm font-medium">Jumlah</p>
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center rounded-md border">
            <Button type="button" variant="ghost" size="icon" className="size-9" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} aria-label="Kurangi">
              <Minus className="size-4" />
            </Button>
            <span className="w-10 text-center text-sm tabular-nums">{qty}</span>
            <Button type="button" variant="ghost" size="icon" className="size-9" onClick={() => setQty((q) => Math.min(maxQty, q + 1))} disabled={qty >= maxQty} aria-label="Tambah">
              <Plus className="size-4" />
            </Button>
          </div>
          <span className="text-sm text-muted-foreground">{maxQty} tersedia</span>
        </div>
      </div>

      <Separator className="my-5" />

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button variant="outline" className="flex-1" onClick={addToCart} disabled={outOfStock}>
          <ShoppingCart className="size-4" /> Keranjang
        </Button>
        <Button className="flex-1" onClick={buyNow} disabled={outOfStock}>
          Beli Sekarang
        </Button>
      </div>
      {outOfStock && <p className="mt-3 text-center text-sm text-destructive">Stok habis</p>}
    </div>
  );
}
