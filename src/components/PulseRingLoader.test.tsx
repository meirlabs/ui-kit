import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PulseRingLoader } from "./PulseRingLoader";

describe("PulseRingLoader", () => {
  it("exposes a polite status region with a default hidden label", () => {
    render(<PulseRingLoader />);
    const region = screen.getByRole("status");
    expect(region).toHaveAttribute("aria-live", "polite");
    expect(region).toHaveTextContent("Loading");
  });

  it("announces a custom label", () => {
    render(<PulseRingLoader label="Connecting" />);
    expect(screen.getByRole("status")).toHaveTextContent("Connecting");
  });

  it("renders the wave and core, hidden from the accessibility tree", () => {
    const { container } = render(<PulseRingLoader />);
    const visual = container.querySelector(".ml-pulse-ring-visual");
    expect(visual).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelector(".ml-pulse-ring-wave")).toBeInTheDocument();
    expect(container.querySelector(".ml-pulse-ring-core")).toBeInTheDocument();
  });

  it("applies the size class", () => {
    render(<PulseRingLoader size="lg" data-testid="loader" />);
    expect(screen.getByTestId("loader")).toHaveClass("ml-pulse-ring", "ml-pulse-ring-lg");
  });

  it("merges a custom className", () => {
    render(<PulseRingLoader className="extra" data-testid="loader" />);
    expect(screen.getByTestId("loader")).toHaveClass("ml-pulse-ring", "extra");
  });
});
