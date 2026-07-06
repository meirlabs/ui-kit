import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CometLoader } from "./CometLoader";

describe("CometLoader", () => {
  it("exposes a polite status region with a default hidden label", () => {
    render(<CometLoader />);
    const region = screen.getByRole("status");
    expect(region).toHaveAttribute("aria-live", "polite");
    expect(region).toHaveTextContent("Loading");
  });

  it("announces a custom label", () => {
    render(<CometLoader label="Analyzing domain" />);
    expect(screen.getByRole("status")).toHaveTextContent("Analyzing domain");
  });

  it("renders the full 4×4 dot grid, hidden from the accessibility tree", () => {
    const { container } = render(<CometLoader />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelectorAll("circle")).toHaveLength(16);
  });

  it("staggers every dot with a unique non-positive delay", () => {
    const { container } = render(<CometLoader />);
    const delays = Array.from(container.querySelectorAll("circle")).map(
      (dot) => (dot as SVGCircleElement).style.animationDelay,
    );
    expect(new Set(delays).size).toBe(16);
    for (const delay of delays) {
      expect(parseFloat(delay)).toBeLessThanOrEqual(0);
    }
  });

  it("applies the size class", () => {
    render(<CometLoader size="lg" data-testid="loader" />);
    expect(screen.getByTestId("loader")).toHaveClass("ml-comet", "ml-comet-lg");
  });

  it("merges a custom className", () => {
    render(<CometLoader className="extra" data-testid="loader" />);
    expect(screen.getByTestId("loader")).toHaveClass("ml-comet", "extra");
  });
});
