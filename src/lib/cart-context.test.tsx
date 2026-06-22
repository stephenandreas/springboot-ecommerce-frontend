import { describe, it, expect, beforeEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { CartProvider, useCart, type CartLine } from "./cart-context";

const wrapper = ({ children }: { children: React.ReactNode }) => <CartProvider>{children}</CartProvider>;

const lineA: Omit<CartLine, "quantity"> = {
  productId: "p1", slug: "p-1", skuId: "s1", productName: "Kaos", skuName: "M",
  unitPrice: 100000, imageUrl: null, storeId: "store-1", storeName: "Toko A",
};
const lineB: Omit<CartLine, "quantity"> = {
  productId: "p2", slug: "p-2", skuId: "s2", productName: "Topi", skuName: "Default",
  unitPrice: 50000, imageUrl: null, storeId: "store-2", storeName: "Toko B",
};

beforeEach(() => localStorage.clear());

describe("useCart", () => {
  it("adds items and computes count + subtotal", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.add(lineA, 2));
    expect(result.current.count).toBe(2);
    expect(result.current.subtotal).toBe(200000);
  });

  it("merges quantity when adding the same sku", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.add(lineA, 1));
    act(() => result.current.add(lineA, 3));
    expect(result.current.lines).toHaveLength(1);
    expect(result.current.count).toBe(4);
  });

  it("updates and clamps quantity, removes at zero floor", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.add(lineA, 1));
    act(() => result.current.setQty("s1", 5));
    expect(result.current.count).toBe(5);
    act(() => result.current.setQty("s1", 0)); // clamps to min 1
    expect(result.current.count).toBe(1);
  });

  it("removes an item and clears the cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.add(lineA, 1);
      result.current.add(lineB, 1);
    });
    act(() => result.current.remove("s1"));
    expect(result.current.lines).toHaveLength(1);
    act(() => result.current.clear());
    expect(result.current.lines).toHaveLength(0);
  });

  it("groups lines per store (mirrors backend sub-orders)", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.add(lineA, 2); // store-1
      result.current.add(lineB, 1); // store-2
    });
    const groups = result.current.byStore();
    expect(groups).toHaveLength(2);
    const a = groups.find((g) => g.storeId === "store-1");
    expect(a?.subtotal).toBe(200000);
  });

  it("persists to localStorage", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.add(lineA, 1));
    expect(localStorage.getItem("sc_cart")).toContain("p1");
  });
});
