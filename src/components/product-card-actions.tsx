"use client";

import { useState } from "react";
import { Heart, ShoppingCart, Check } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { useCart, type CartLine } from "@/lib/cart-context";

/** Hover/quick actions overlaid on a ProductCard — wishlist + instant add-to-cart (optimistic). */
export function ProductCardActions({ line, disabled }: { line: Omit<CartLine, "quantity">; disabled?: boolean }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const [wished, setWished] = useState(false);

  function stop(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
  }

  return (
    <>
      <button
        type="button"
        aria-label={wished ? "Hapus dari wishlist" : "Tambah ke wishlist"}
        onClick={(e) => {
          stop(e);
          setWished((w) => !w);
        }}
        className="absolute right-2 top-2 grid size-8 place-items-center rounded-full bg-background/90 text-muted-foreground shadow-sm backdrop-blur transition-colors hover:text-sale"
      >
        <Heart className={cn("size-4", wished && "fill-sale text-sale")} />
      </button>

      <button
        type="button"
        disabled={disabled}
        aria-label="Tambah ke keranjang"
        onClick={(e) => {
          stop(e);
          if (disabled) return;
          add(line, 1);
          setAdded(true);
          toast.success("Ditambahkan ke keranjang", { description: line.productName });
          setTimeout(() => setAdded(false), 1200);
        }}
        className="absolute bottom-2 right-2 grid size-9 translate-y-1 place-items-center rounded-full bg-primary text-primary-foreground opacity-0 shadow-md transition-all duration-200 hover:bg-primary/90 disabled:opacity-40 group-hover:translate-y-0 group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100"
      >
        {added ? <Check className="size-4" /> : <ShoppingCart className="size-4" />}
      </button>
    </>
  );
}
