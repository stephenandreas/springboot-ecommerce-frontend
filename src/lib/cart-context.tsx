"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export interface CartLine {
  productId: string;
  slug: string;
  skuId: string;
  productName: string;
  skuName: string;
  unitPrice: number;
  imageUrl?: string | null;
  storeId: string;
  storeName: string;
  quantity: number;
}

interface CartState {
  lines: CartLine[];
  count: number;
  subtotal: number;
  add: (line: Omit<CartLine, "quantity">, qty?: number) => void;
  setQty: (skuId: string, qty: number) => void;
  remove: (skuId: string) => void;
  clear: () => void;
  /** Lines grouped per store — mirrors backend sub-orders. */
  byStore: () => { storeId: string; storeName: string; lines: CartLine[]; subtotal: number }[];
}

const STORAGE_KEY = "sc_cart";
const CartContext = createContext<CartState | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // Client-only hydration from localStorage (not available during SSR).
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setLines(JSON.parse(raw) as CartLine[]);
    } catch {
      // ignore
    }
  }, []);

  const save = useCallback((next: CartLine[]) => {
    setLines(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const add = useCallback<CartState["add"]>(
    (line, qty = 1) => {
      setLines((prev) => {
        const existing = prev.find((l) => l.skuId === line.skuId);
        const next = existing
          ? prev.map((l) => (l.skuId === line.skuId ? { ...l, quantity: l.quantity + qty } : l))
          : [...prev, { ...line, quantity: qty }];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    },
    [],
  );

  const setQty = useCallback(
    (skuId: string, qty: number) => {
      setLines((prev) => {
        const next = prev
          .map((l) => (l.skuId === skuId ? { ...l, quantity: Math.max(1, qty) } : l))
          .filter((l) => l.quantity > 0);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    },
    [],
  );

  const remove = useCallback((skuId: string) => {
    setLines((prev) => {
      const next = prev.filter((l) => l.skuId !== skuId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const clear = useCallback(() => save([]), [save]);

  const byStore = useCallback(() => {
    const map = new Map<string, { storeId: string; storeName: string; lines: CartLine[]; subtotal: number }>();
    for (const l of lines) {
      const g = map.get(l.storeId) ?? { storeId: l.storeId, storeName: l.storeName, lines: [], subtotal: 0 };
      g.lines.push(l);
      g.subtotal += l.unitPrice * l.quantity;
      map.set(l.storeId, g);
    }
    return [...map.values()];
  }, [lines]);

  const value = useMemo<CartState>(
    () => ({
      lines,
      count: lines.reduce((n, l) => n + l.quantity, 0),
      subtotal: lines.reduce((n, l) => n + l.unitPrice * l.quantity, 0),
      add,
      setQty,
      remove,
      clear,
      byStore,
    }),
    [lines, add, setQty, remove, clear, byStore],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartState {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}
