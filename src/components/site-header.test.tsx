import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));

import { AuthProvider } from "@/lib/auth-context";
import { CartProvider } from "@/lib/cart-context";
import { SiteHeader } from "./site-header";

function b64url(o: object) {
  return btoa(JSON.stringify(o)).replace(/\+/g, "-").replace(/\//g, "_");
}

function renderHeader() {
  return render(
    <AuthProvider>
      <CartProvider>
        <SiteHeader />
      </CartProvider>
    </AuthProvider>,
  );
}

beforeEach(() => localStorage.clear());

describe("SiteHeader", () => {
  it("shows a login link when signed out", () => {
    renderHeader();
    expect(screen.getByRole("link", { name: "Masuk" })).toHaveAttribute("href", "/login");
  });

  it("opens the account menu when signed in", async () => {
    localStorage.setItem("sc_auth", JSON.stringify({ token: `h.${b64url({ role: "ROLE_CUSTOMER" })}.s`, email: "buyer@test.com" }));
    renderHeader();
    await userEvent.click(screen.getByRole("button", { name: "Akun" }));
    expect(await screen.findByText("buyer@test.com")).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /Pesanan/ })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /Keluar/ })).toBeInTheDocument();
  });
});
