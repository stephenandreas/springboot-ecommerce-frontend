import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const replace = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace, push: vi.fn() }),
  useSearchParams: () => new URLSearchParams("next=/orders"),
}));

import { AuthProvider } from "@/lib/auth-context";
import { Toaster } from "@/components/ui/sonner";
import LoginPage from "./page";

function b64url(o: object) {
  return btoa(JSON.stringify(o)).replace(/\+/g, "-").replace(/\//g, "_");
}
const TOKEN = `h.${b64url({ role: "ROLE_CUSTOMER" })}.s`;

function renderPage() {
  return render(
    <AuthProvider>
      <LoginPage />
      <Toaster />
    </AuthProvider>,
  );
}

beforeEach(() => {
  replace.mockClear();
  localStorage.clear();
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => ({ success: true, data: { accessToken: TOKEN, refreshToken: "r" } }) }),
  );
});
afterEach(() => vi.unstubAllGlobals());

describe("LoginPage", () => {
  it("logs in and redirects to the `next` target", async () => {
    renderPage();
    await userEvent.type(await screen.findByLabelText("Email"), "buyer@test.com");
    await userEvent.type(screen.getByLabelText("Password"), "Passw0rd1");
    await userEvent.click(screen.getByRole("button", { name: "Masuk" }));
    await waitFor(() => expect(replace).toHaveBeenCalledWith("/orders"));
    expect(localStorage.getItem("sc_auth")).toContain("buyer@test.com");
  });
});
