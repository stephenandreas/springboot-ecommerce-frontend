import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));

import { CartProvider } from "@/lib/cart-context";
import { Toaster } from "@/components/ui/sonner";
import { AddToCart } from "./add-to-cart";
import type { Product } from "@/types";

const product: Product = {
  id: "p1", storeId: "store-1", sellerId: "s", categoryId: "c1",
  name: "Kaos", slug: "kaos", images: [],
  skus: [
    { skuId: "s1", name: "M", price: 100000, stock: 5 },
    { skuId: "s2", name: "L", price: 120000, stock: 3 },
  ],
  status: "ACTIVE", rating: 4, reviewCount: 2,
};

function renderBuyBox() {
  return render(
    <CartProvider>
      <AddToCart product={product} />
      <Toaster />
    </CartProvider>,
  );
}

beforeEach(() => {
  push.mockClear();
  localStorage.clear();
});

describe("AddToCart (buy box)", () => {
  it("adds the selected variant to the cart", async () => {
    renderBuyBox();
    await userEvent.click(screen.getByRole("button", { name: "L" }));
    await userEvent.click(screen.getByRole("button", { name: /Tambah ke Keranjang/i }));
    expect(localStorage.getItem("sc_cart")).toContain("s2");
  });

  it("buy now adds and routes to the cart", async () => {
    renderBuyBox();
    await userEvent.click(screen.getByRole("button", { name: "Beli Sekarang" }));
    expect(push).toHaveBeenCalledWith("/cart");
    expect(localStorage.getItem("sc_cart")).toContain("s1");
  });

  it("respects stock when increasing quantity", async () => {
    renderBuyBox();
    const plus = screen.getByRole("button", { name: "Tambah" });
    for (let i = 0; i < 10; i++) await userEvent.click(plus); // stock = 5 for default sku
    expect(screen.getByText("5")).toBeInTheDocument();
  });
});
