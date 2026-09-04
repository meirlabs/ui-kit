import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PulseLoader } from "./PulseLoader";

describe("PulseLoader", () => {
  it("exposes a polite status region with a default hidden label", () => {
    render(<PulseLoader />);
    const region = screen.getByRole("status");
    expect(region).toHaveAttribute("aria-live", "polite");
    expect(region).toHaveTextContent("Loading");
  });

  it("announces a custom label", () => {
    render(<PulseLoader label="Syncing" />);
    expect(screen.getByRole("status")).toHaveTextContent("Syncing");
  });

  it("renders a static core and two expanding rings, hidden from the accessibility tree", () => {
    const { container } = render(<PulseLoader />);
    const rings = container.querySelector(".ml-pulse-rings");
    const core = container.querySelector(".ml-pulse-core");
    expect(rings).toHaveAttribute("aria-hidden", "true");
    expect(core).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelectorAll(".ml-pulse-ring")).toHaveLength(2);
  });

  it("staggers every ring with a unique non-positive delay", () => {
    const { container } = render(<PulseLoader />);
    const delays = Array.from(container.querySelectorAll(".ml-pulse-ring")).map(
      (ring) => (ring as HTMLElement).style.animationDelay,
    );
    expect(new Set(delays).size).toBe(2);
    for (const delay of delays) {
      expect(parseFloat(delay)).toBeLessThanOrEqual(0);
    }
  });

  it("applies the size class", () => {
    render(<PulseLoader size="lg" data-testid="loader" />);
    expect(screen.getByTestId("loader")).toHaveClass("ml-pulse", "ml-pulse-lg");
  });

  it("merges a custom className", () => {
    render(<PulseLoader className="extra" data-testid="loader" />);
    expect(screen.getByTestId("loader")).toHaveClass("ml-pulse", "extra");
  });
});
