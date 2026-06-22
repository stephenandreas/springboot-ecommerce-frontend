import Image from "next/image";
import Link from "next/link";
import { Store as StoreIcon, ImageOff } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/star-rating";
import { PriceTag } from "@/components/price-tag";
import { ProductCardActions } from "@/components/product-card-actions";
import { lowestPrice } from "@/lib/format";
import type { Product } from "@/types";

export function ProductCard({ product, storeName }: { product: Product; storeName?: string }) {
  const skus = product.skus ?? [];
  const price = lowestPrice(skus.map((s) => Number(s.price)));
  const sku = skus.find((s) => Number(s.price) === price) ?? skus[0];
  const totalStock = skus.reduce((n, s) => n + (s.stock ?? 0), 0);
  const image = product.images?.[0]?.url ?? sku?.imageUrl ?? null;
  const outOfStock = totalStock === 0;

  return (
    <Link
      href={`/products/${product.slug}`}
      aria-label={product.name}
      className="group relative flex flex-col overflow-hidden rounded-xl bg-card ring-1 ring-foreground/8 outline-none transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1280px) 25vw, 20vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-1 text-muted-foreground">
            <ImageOff className="size-6" />
            <span className="text-[10px]">Tanpa gambar</span>
          </div>
        )}
        {outOfStock && (
          <div className="absolute inset-0 grid place-items-center bg-background/60 backdrop-blur-[1px]">
            <Badge variant="secondary" className="bg-background font-semibold">Stok habis</Badge>
          </div>
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

      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <h3 className="line-clamp-2 min-h-[2.5rem] text-sm leading-snug">{product.name}</h3>
        <PriceTag price={price} />
        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <StarRating value={product.rating ?? 0} count={product.reviewCount ?? 0} />
        </div>
        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <StoreIcon className="size-3 shrink-0" />
          <span className="truncate">{storeName ?? "Toko Resmi"}</span>
        </div>
      </div>
    </Link>
  );
}
