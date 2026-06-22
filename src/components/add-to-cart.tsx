"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { PriceTag } from "@/components/price-tag";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";
import type { Product } from "@/types";

export function AddToCart({ product, storeName }: { product: Product; storeName?: string }) {
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
      storeName: storeName ?? "Toko",
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
    <div className="rounded-xl border bg-card p-5">
      <PriceTag price={Number(sku?.price ?? 0)} size="lg" />

      {skus.length > 1 && (
        <div className="mt-5">
          <p className="mb-2 text-sm font-medium">Pilih Varian</p>
          <div className="flex flex-wrap gap-2">
            {skus.map((s) => {
              const selected = s.skuId === skuId;
              const oos = (s.stock ?? 0) <= 0;
              return (
                <button
                  key={s.skuId}
                  type="button"
                  disabled={oos}
                  onClick={() => {
                    setSkuId(s.skuId);
                    setQty(1);
                  }}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-sm transition-colors",
                    selected ? "border-primary bg-primary/5 font-medium text-primary" : "hover:border-foreground/40",
                    oos && "cursor-not-allowed opacity-40 line-through",
                  )}
                >
                  {s.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-5">
        <p className="mb-2 text-sm font-medium">Jumlah</p>
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center rounded-lg border">
            <Button type="button" variant="ghost" size="icon" className="size-9 rounded-r-none" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} aria-label="Kurangi">
              <Minus className="size-4" />
            </Button>
            <span className="w-12 text-center text-sm font-medium tabular-nums">{qty}</span>
            <Button type="button" variant="ghost" size="icon" className="size-9 rounded-l-none" onClick={() => setQty((q) => Math.min(maxQty, q + 1))} disabled={qty >= maxQty} aria-label="Tambah">
              <Plus className="size-4" />
            </Button>
          </div>
          <span className={cn("text-sm", maxQty <= 5 && maxQty > 0 ? "font-medium text-warning" : "text-muted-foreground")}>
            {outOfStock ? "Stok habis" : `${maxQty} tersedia`}
          </span>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <Button variant="outline" size="lg" className="flex-1 border-primary text-primary hover:bg-primary/5" onClick={addToCart} disabled={outOfStock}>
          <ShoppingCart className="size-4" /> Keranjang
        </Button>
        <Button size="lg" className="flex-1" onClick={buyNow} disabled={outOfStock}>
          Beli Sekarang
        </Button>
      </div>
    </div>
  );
}
