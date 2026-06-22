import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/lib/cart-context";
import { AuthProvider } from "@/lib/auth-context";
import { ProductCard } from "./product-card";
import type { Product } from "@/types";

const product: Product = {
  id: "p1",
  storeId: "store-1",
  sellerId: "seller-1",
  categoryId: "c1",
  name: "Kaos Polos Premium",
  slug: "kaos-polos-premium",
  brand: "E2E",
  images: [],
  skus: [{ skuId: "s1", name: "M", price: 120000, stock: 10 }],
  status: "ACTIVE",
  rating: 4.5,
  reviewCount: 8,
};

function renderCard(p: Product = product) {
  return render(
    <AuthProvider>
      <CartProvider>
        <ProductCard product={p} />
        <Toaster />
      </CartProvider>
    </AuthProvider>,
  );
}

beforeEach(() => localStorage.clear());

describe("ProductCard", () => {
  it("renders name, price and a link to the detail page", () => {
    renderCard();
    expect(screen.getByText("Kaos Polos Premium")).toBeInTheDocument();
    expect(screen.getByText(/120\.000/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Kaos Polos Premium" })).toHaveAttribute(
      "href",
      "/products/kaos-polos-premium",
    );
  });

  it("quick-adds to the cart", async () => {
    renderCard();
    await userEvent.click(screen.getByRole("button", { name: "Tambah ke keranjang" }));
    expect(localStorage.getItem("sc_cart")).toContain("s1");
  });

  it("marks out-of-stock products and hides the add button", () => {
    renderCard({ ...product, skus: [{ skuId: "s1", name: "M", price: 120000, stock: 0 }] });
    expect(screen.getByText("Habis")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Tambah ke keranjang" })).not.toBeInTheDocument();
  });

  it("shows the discount badge and struck-through list price when on sale", () => {
    renderCard({
      ...product,
      skus: [{ skuId: "s1", name: "M", price: 100000, stock: 10, effectivePrice: 75000, discountActive: true }],
    });
    expect(screen.getAllByText("-25%").length).toBeGreaterThan(0);
    expect(screen.getByText(/75\.000/)).toBeInTheDocument();
    expect(screen.getByText(/100\.000/)).toHaveClass("line-through");
  });

  it("quick-adds the discounted (effective) price to the cart", async () => {
    renderCard({
      ...product,
      skus: [{ skuId: "s1", name: "M", price: 100000, stock: 10, effectivePrice: 75000, discountActive: true }],
    });
    await userEvent.click(screen.getByRole("button", { name: "Tambah ke keranjang" }));
    expect(localStorage.getItem("sc_cart")).toContain("75000");
  });
});
