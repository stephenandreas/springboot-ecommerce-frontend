import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatIDR, lowestPrice } from "@/lib/format";
import type { Product } from "@/types";

export function ProductCard({ product }: { product: Product }) {
  const price = lowestPrice(product.skus?.map((s) => Number(s.price)) ?? []);
  const totalStock = product.skus?.reduce((n, s) => n + (s.stock ?? 0), 0) ?? 0;
  const image = product.images?.[0]?.url;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label={product.name}
    >
      <Card className="h-full overflow-hidden p-0 transition-shadow group-hover:shadow-md">
        <div className="relative aspect-square overflow-hidden bg-muted">
          {image ? (
            <Image
              src={image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 20vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
              Tanpa gambar
            </div>
          )}
          {totalStock === 0 && (
            <Badge variant="destructive" className="absolute left-2 top-2">
              Stok habis
            </Badge>
          )}
        </div>

        <CardContent className="space-y-1 p-3">
          <h3 className="line-clamp-2 text-sm font-medium leading-snug">{product.name}</h3>
          <p className="text-lg font-semibold">{formatIDR(price)}</p>
        </CardContent>

        <CardFooter className="flex items-center gap-1 p-3 pt-0 text-xs text-muted-foreground">
          <Star className="size-3.5 fill-amber-400 text-amber-400" aria-hidden />
          <span aria-label={`${product.rating ?? 0} dari 5`}>{(product.rating ?? 0).toFixed(1)}</span>
          <span aria-hidden>·</span>
          <span>{product.reviewCount ?? 0} ulasan</span>
        </CardFooter>
      </Card>
    </Link>
  );
}
