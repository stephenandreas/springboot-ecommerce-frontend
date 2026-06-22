import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const replace = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace, push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

import { AuthProvider } from "@/lib/auth-context";
import { Toaster } from "@/components/ui/sonner";
import RegisterPage from "./page";

function renderPage() {
  return render(
    <AuthProvider>
      <RegisterPage />
      <Toaster />
    </AuthProvider>,
  );
}

beforeEach(() => {
  replace.mockClear();
  localStorage.clear();
});

describe("RegisterPage", () => {
  it("renders the registration form", () => {
    renderPage();
    expect(screen.getByRole("heading", { name: "Daftar" })).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("shows validation errors on empty submit and does not navigate", async () => {
    renderPage();
    await userEvent.click(screen.getByRole("button", { name: "Daftar" }));
    expect(await screen.findByText(/Nama minimal 2 karakter/i)).toBeInTheDocument();
    expect(screen.getByText(/Email tidak valid/i)).toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });

  it("validates password complexity", async () => {
    renderPage();
    await userEvent.type(screen.getByLabelText("Nama lengkap"), "Budi");
    await userEvent.type(screen.getByLabelText("Email"), "budi@test.com");
    await userEvent.type(screen.getByLabelText("Password"), "short");
    await userEvent.click(screen.getByRole("button", { name: "Daftar" }));
    expect(await screen.findByText(/minimal 8 karakter/i)).toBeInTheDocument();
  });
});
