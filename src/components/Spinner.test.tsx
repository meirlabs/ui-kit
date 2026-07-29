import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Spinner } from "./Spinner";

describe("Spinner", () => {
  it("exposes a polite status region with a default hidden label", () => {
    render(<Spinner />);
    const region = screen.getByRole("status");
    expect(region).toHaveAttribute("aria-live", "polite");
    expect(region).toHaveTextContent("Loading");
  });

  it("announces a custom label", () => {
    render(<Spinner label="Saving" />);
    expect(screen.getByRole("status")).toHaveTextContent("Saving");
  });

  it("renders the ring hidden from the accessibility tree", () => {
    const { container } = render(<Spinner />);
    const ring = container.querySelector(".ml-spinner-ring");
    expect(ring).toHaveAttribute("aria-hidden", "true");
  });

  it("applies the size class", () => {
    render(<Spinner size="lg" data-testid="spinner" />);
    expect(screen.getByTestId("spinner")).toHaveClass("ml-spinner", "ml-spinner-lg");
  });

  it("merges a custom className", () => {
    render(<Spinner className="extra" data-testid="spinner" />);
    expect(screen.getByTestId("spinner")).toHaveClass("ml-spinner", "extra");
  });
});
