import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PriceTag } from "./price-tag";

describe("PriceTag", () => {
  it("renders the current price", () => {
    render(<PriceTag price={150000} />);
    expect(screen.getByText(/150\.000/)).toBeInTheDocument();
  });

  it("shows discount % and struck-through original when discounted", () => {
    render(<PriceTag price={80000} original={100000} />);
    expect(screen.getByText("-20%")).toBeInTheDocument();
    const original = screen.getByText(/100\.000/);
    expect(original).toHaveClass("line-through");
  });

  it("hides discount when there is no original price", () => {
    render(<PriceTag price={100000} />);
    expect(screen.queryByText(/-\d+%/)).not.toBeInTheDocument();
  });
});
