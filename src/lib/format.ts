import type { ProductSku } from "@/types";

const idr = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

/** Format a number (or BigDecimal-as-string from the backend) as Indonesian Rupiah. */
export function formatIDR(value: number | string | null | undefined): string {
  if (value === null || value === undefined) return idr.format(0);
  const n = typeof value === "string" ? Number(value) : value;
  return idr.format(Number.isFinite(n) ? n : 0);
}

/** Lowest SKU price for a product — what listings show as "mulai dari". */
export function lowestPrice(prices: number[]): number {
  return prices.length ? Math.min(...prices) : 0;
}

/** The price a buyer pays now for a SKU (discounted when active). */
export function effectivePrice(s: ProductSku): number {
  return Number(s.effectivePrice ?? s.price);
}

/**
 * Pricing for a product card/detail: the cheapest SKU's effective price, plus the
 * struck-through original when that SKU is currently discounted.
 */
export function skuPricing(skus: ProductSku[]): { price: number; original: number | null } {
  if (!skus?.length) return { price: 0, original: null };
  const best = skus.reduce((a, b) => (effectivePrice(b) < effectivePrice(a) ? b : a), skus[0]);
  const eff = effectivePrice(best);
  const list = Number(best.price);
  return { price: eff, original: best.discountActive && list > eff ? list : null };
}
