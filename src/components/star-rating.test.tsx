import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StarRating } from "./star-rating";

describe("StarRating", () => {
  it("exposes an accessible rating label", () => {
    render(<StarRating value={4.5} />);
    expect(screen.getByLabelText("4.5 dari 5")).toBeInTheDocument();
  });

  it("shows the numeric value and count", () => {
    render(<StarRating value={3.2} count={12} />);
    expect(screen.getByText("3.2")).toBeInTheDocument();
    expect(screen.getByText("(12)")).toBeInTheDocument();
  });

  it("can hide the numeric value", () => {
    render(<StarRating value={5} showValue={false} />);
    expect(screen.queryByText("5.0")).not.toBeInTheDocument();
  });
});
