"use client";

import Image from "next/image";
import Link from "next/link";
import { ImageOff } from "lucide-react";
import { motion } from "motion/react";

import { formatIDR, lowestPrice } from "@/lib/format";
import { ProductCardActions } from "@/components/product-card-actions";
import type { Product } from "@/types";

export function ProductCard({ product, storeName }: { product: Product; storeName?: string }) {
  const skus = product.skus ?? [];
  const price = lowestPrice(skus.map((s) => Number(s.price)));
  const sku = skus.find((s) => Number(s.price) === price) ?? skus[0];
  const totalStock = skus.reduce((n, s) => n + (s.stock ?? 0), 0);
  const image = product.images?.[0]?.url ?? sku?.imageUrl ?? null;
  const outOfStock = totalStock === 0;

  return (
    <Link href={`/products/${product.slug}`} aria-label={product.name} className="group block outline-none">
      <motion.div initial="rest" whileHover="hover" animate="rest" className="relative overflow-hidden bg-muted">
        <div className="relative aspect-square">
          {image ? (
            <motion.div variants={{ rest: { scale: 1 }, hover: { scale: 1.04 } }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="absolute inset-0">
              <Image src={image} alt={product.name} fill sizes="(max-width:640px) 50vw, (max-width:1280px) 25vw, 20vw" className="object-cover" />
            </motion.div>
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <ImageOff className="size-7" />
            </div>
          )}
          {outOfStock && (
            <span className="absolute left-3 top-3 bg-background px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide">Habis</span>
          )}
          {sku && !outOfStock && (
            <ProductCardActions
              line={{
                productId: product.id,
                slug: product.slug,
                skuId: sku.skuId,
                productName: product.name,
                skuName: sku.name,
                unitPrice: Number(sku.price),
                imageUrl: image,
                storeId: product.storeId,
                storeName: storeName ?? "Toko",
              }}
            />
          )}
        </div>
      </motion.div>

      <div className="space-y-0.5 pt-3">
        {product.brand && <p className="text-xs text-muted-foreground">{product.brand}</p>}
        <h3 className="line-clamp-1 text-sm font-medium group-hover:underline">{product.name}</h3>
        <p className="text-sm font-semibold">{formatIDR(price)}</p>
      </div>
    </Link>
  );
}
