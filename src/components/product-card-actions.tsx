"use client";

import { useState } from "react";
import { Heart, Plus, Check } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { useCart, type CartLine } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { toggleWishlist } from "@/lib/account";

/** Minimal hover actions on a ProductCard — wishlist + instant add-to-cart (optimistic). */
export function ProductCardActions({ line, disabled }: { line: Omit<CartLine, "quantity">; disabled?: boolean }) {
  const { add } = useCart();
  const { token } = useAuth();
  const [added, setAdded] = useState(false);
  const [wished, setWished] = useState(false);

  function stop(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
  }

  async function onWish(e: React.MouseEvent) {
    stop(e);
    const next = !wished;
    setWished(next);
    if (token) {
      try {
        await toggleWishlist(line.productId, token);
      } catch {
        setWished(!next);
        toast.error("Gagal memperbarui wishlist");
      }
    } else {
      toast.info("Masuk untuk menyimpan ke wishlist");
    }
  }

  return (
    <>
      <button
        type="button"
        aria-label={wished ? "Hapus dari wishlist" : "Simpan"}
        onClick={onWish}
        className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-background/80 text-foreground backdrop-blur transition-colors hover:bg-background"
      >
        <Heart className={cn("size-4", wished && "fill-sale text-sale")} />
      </button>

      <motion.button
        type="button"
        disabled={disabled}
        aria-label="Tambah ke keranjang"
        whileTap={{ scale: 0.96 }}
        onClick={(e) => {
          stop(e);
          if (disabled) return;
          add(line, 1);
          setAdded(true);
          toast.success("Ditambahkan", { description: line.productName });
          setTimeout(() => setAdded(false), 1200);
        }}
        className="absolute bottom-3 left-3 right-3 flex items-center justify-center gap-1.5 rounded-full bg-primary py-2.5 text-sm font-medium text-primary-foreground opacity-0 transition-opacity duration-200 group-hover:opacity-100 focus-visible:opacity-100"
      >
        {added ? <Check className="size-4" /> : <Plus className="size-4" />}
        {added ? "Ditambahkan" : "Tambah"}
      </motion.button>
    </>
  );
}
