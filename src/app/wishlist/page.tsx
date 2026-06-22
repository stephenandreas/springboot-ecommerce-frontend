"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { ProductCard } from "@/components/product-card";
import { EmptyState } from "@/components/empty-state";
import { useAuth } from "@/lib/auth-context";
import { getWishlist } from "@/lib/account";
import type { Product } from "@/types";

export default function WishlistPage() {
  const { token, isReady } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<Product[] | null>(null);

  useEffect(() => {
    if (!isReady) return;
    if (!token) {
      router.replace("/login?next=/wishlist");
      return;
    }
    getWishlist(token).then(setItems).catch(() => setItems([]));
  }, [isReady, token, router]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <h1 className="text-xl font-semibold">Wishlist</h1>
      <div className="mt-6">
        {items === null ? (
          <ProductGridSkeleton count={10} />
        ) : items.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="Wishlist kosong"
            description="Simpan produk favorit dengan menekan ikon hati."
            action={<Button asChild><Link href="/">Jelajahi Produk</Link></Button>}
          />
        ) : (
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
