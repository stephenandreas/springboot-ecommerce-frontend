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
