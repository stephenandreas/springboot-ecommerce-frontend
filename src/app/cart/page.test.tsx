import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { CartProvider, type CartLine } from "@/lib/cart-context";
import CartPage from "./page";

const line: CartLine = {
  productId: "p1", slug: "kaos", skuId: "s1", productName: "Kaos E2E", skuName: "M",
  unitPrice: 120000, imageUrl: null, storeId: "store-1", storeName: "Toko A", quantity: 2,
};

function renderCart() {
  return render(
    <CartProvider>
      <CartPage />
    </CartProvider>,
  );
}

beforeEach(() => localStorage.clear());

describe("CartPage", () => {
  it("shows the empty state when the cart is empty", () => {
    renderCart();
    expect(screen.getByText("Keranjang kosong")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Mulai Belanja" })).toBeInTheDocument();
  });

  it("renders seeded items grouped with a checkout link", () => {
    localStorage.setItem("sc_cart", JSON.stringify([line]));
    renderCart();
    expect(screen.getByText("Kaos E2E")).toBeInTheDocument();
    expect(screen.getByText("Toko A")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Checkout" })).toHaveAttribute("href", "/checkout");
  });
});
