import { describe, it, expect } from "vitest";
import { formatIDR, lowestPrice, effectivePrice, skuPricing } from "./format";
import type { ProductSku } from "@/types";

const sku = (over: Partial<ProductSku>): ProductSku => ({
  skuId: "s", name: "x", price: 100000, stock: 5, ...over,
});

describe("formatIDR", () => {
  it("formats a number as IDR without decimals", () => {
    const out = formatIDR(50000);
    expect(out).toContain("Rp");
    expect(out).toContain("50.000");
    expect(out).not.toContain(",00");
  });

  it("accepts a numeric string from the backend", () => {
    expect(formatIDR("150000")).toContain("150.000");
  });

  it("falls back to Rp 0 for null/undefined/NaN", () => {
    expect(formatIDR(null)).toContain("0");
    expect(formatIDR(undefined)).toContain("0");
    expect(formatIDR("abc")).toContain("0");
  });
});

describe("lowestPrice", () => {
  it("returns the minimum price", () => {
    expect(lowestPrice([3000, 1000, 2000])).toBe(1000);
  });
  it("returns 0 for an empty list", () => {
    expect(lowestPrice([])).toBe(0);
  });
});

describe("effectivePrice", () => {
  it("uses the backend effectivePrice when present", () => {
    expect(effectivePrice(sku({ price: 100000, effectivePrice: 80000 }))).toBe(80000);
  });
  it("falls back to the list price", () => {
    expect(effectivePrice(sku({ price: 100000 }))).toBe(100000);
  });
});

describe("skuPricing", () => {
  it("returns no original when nothing is discounted", () => {
    expect(skuPricing([sku({ price: 100000 })])).toEqual({ price: 100000, original: null });
  });

  it("exposes the struck-through original for a discounted sku", () => {
    const s = sku({ price: 100000, effectivePrice: 75000, discountActive: true });
    expect(skuPricing([s])).toEqual({ price: 75000, original: 100000 });
  });

  it("picks the cheapest effective price across skus", () => {
    const a = sku({ skuId: "a", price: 100000 });
    const b = sku({ skuId: "b", price: 120000, effectivePrice: 60000, discountActive: true });
    expect(skuPricing([a, b])).toEqual({ price: 60000, original: 120000 });
  });
});
