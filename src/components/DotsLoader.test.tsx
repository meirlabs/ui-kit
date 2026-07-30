import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DotsLoader } from "./DotsLoader";

describe("DotsLoader", () => {
  it("exposes a polite status region with a default hidden label", () => {
    render(<DotsLoader />);
    const region = screen.getByRole("status");
    expect(region).toHaveAttribute("aria-live", "polite");
    expect(region).toHaveTextContent("Loading");
  });

  it("announces a custom label", () => {
    render(<DotsLoader label="Sending" />);
    expect(screen.getByRole("status")).toHaveTextContent("Sending");
  });

  it("renders three dots, hidden from the accessibility tree", () => {
    const { container } = render(<DotsLoader />);
    const row = container.querySelector(".ml-dots-row");
    expect(row).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelectorAll(".ml-dots-dot")).toHaveLength(3);
  });

  it("applies the size class", () => {
    render(<DotsLoader size="lg" data-testid="loader" />);
    expect(screen.getByTestId("loader")).toHaveClass("ml-dots", "ml-dots-lg");
  });

  it("merges a custom className", () => {
    render(<DotsLoader className="extra" data-testid="loader" />);
    expect(screen.getByTestId("loader")).toHaveClass("ml-dots", "extra");
  });
});
