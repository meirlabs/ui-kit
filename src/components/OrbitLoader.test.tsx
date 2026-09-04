import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { OrbitLoader } from "./OrbitLoader";

describe("OrbitLoader", () => {
  it("exposes a polite status region with a default hidden label", () => {
    render(<OrbitLoader />);
    const region = screen.getByRole("status");
    expect(region).toHaveAttribute("aria-live", "polite");
    expect(region).toHaveTextContent("Loading");
  });

  it("announces a custom label", () => {
    render(<OrbitLoader label="Connecting" />);
    expect(screen.getByRole("status")).toHaveTextContent("Connecting");
  });

  it("renders a static track, a head dot, and a two-dot trail, hidden from the accessibility tree", () => {
    const { container } = render(<OrbitLoader />);
    const track = container.querySelector(".ml-orbit-track");
    const arm = container.querySelector(".ml-orbit-arm");
    expect(track).toHaveAttribute("aria-hidden", "true");
    expect(arm).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelectorAll(".ml-orbit-dot-head")).toHaveLength(1);
    expect(container.querySelectorAll(".ml-orbit-dot-echo")).toHaveLength(2);
  });

  it("fades the trail dots more than the head", () => {
    const { container } = render(<OrbitLoader />);
    const echoOpacities = Array.from(container.querySelectorAll(".ml-orbit-dot-echo")).map(
      (dot) => parseFloat((dot as HTMLElement).style.opacity),
    );
    for (const opacity of echoOpacities) {
      expect(opacity).toBeLessThan(1);
    }
  });

  it("applies the size class", () => {
    render(<OrbitLoader size="lg" data-testid="loader" />);
    expect(screen.getByTestId("loader")).toHaveClass("ml-orbit", "ml-orbit-lg");
  });

  it("merges a custom className", () => {
    render(<OrbitLoader className="extra" data-testid="loader" />);
    expect(screen.getByTestId("loader")).toHaveClass("ml-orbit", "extra");
  });
});
