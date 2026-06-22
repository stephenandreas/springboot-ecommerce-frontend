import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));

import { AuthProvider } from "@/lib/auth-context";
import { FollowButton } from "./follow-button";

function renderBtn() {
  return render(
    <AuthProvider>
      <FollowButton storeId="store-1" slug="toko-a" initialCount={5} />
    </AuthProvider>,
  );
}

beforeEach(() => {
  push.mockClear();
  localStorage.clear();
});

describe("FollowButton", () => {
  it("renders the follower count and a follow CTA when signed out", () => {
    renderBtn();
    expect(screen.getByRole("button", { name: /Ikuti/ })).toBeInTheDocument();
    expect(screen.getByText(/· 5/)).toBeInTheDocument();
  });

  it("redirects to login when an anonymous user tries to follow", async () => {
    renderBtn();
    await userEvent.click(screen.getByRole("button", { name: /Ikuti/ }));
    expect(push).toHaveBeenCalledWith(expect.stringContaining("/login"));
  });
});
