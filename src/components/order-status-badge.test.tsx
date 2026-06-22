import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { OrderStatusBadge } from "./order-status-badge";

describe("OrderStatusBadge", () => {
  it("maps order statuses to Indonesian labels", () => {
    render(<OrderStatusBadge status="PENDING_PAYMENT" />);
    expect(screen.getByText("Menunggu Pembayaran")).toBeInTheDocument();
  });

  it("maps sub-order statuses", () => {
    const { rerender } = render(<OrderStatusBadge status="SHIPPED" />);
    expect(screen.getByText("Dikirim")).toBeInTheDocument();
    rerender(<OrderStatusBadge status="COMPLETED" />);
    expect(screen.getByText("Selesai")).toBeInTheDocument();
  });
});
