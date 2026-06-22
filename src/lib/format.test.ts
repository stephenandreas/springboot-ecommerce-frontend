import { describe, it, expect } from "vitest";
import { formatIDR, lowestPrice } from "./format";

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
