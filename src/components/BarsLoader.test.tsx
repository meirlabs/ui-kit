import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BarsLoader } from "./BarsLoader";

describe("BarsLoader", () => {
  it("exposes a polite status region with a default hidden label", () => {
    render(<BarsLoader />);
    const region = screen.getByRole("status");
    expect(region).toHaveAttribute("aria-live", "polite");
    expect(region).toHaveTextContent("Loading");
  });

  it("announces a custom label", () => {
    render(<BarsLoader label="Uploading" />);
    expect(screen.getByRole("status")).toHaveTextContent("Uploading");
  });

  it("renders four bars, hidden from the accessibility tree", () => {
    const { container } = render(<BarsLoader />);
    const row = container.querySelector(".ml-bars-row");
    expect(row).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelectorAll(".ml-bars-bar")).toHaveLength(4);
  });

  it("applies the size class", () => {
    render(<BarsLoader size="sm" data-testid="loader" />);
    expect(screen.getByTestId("loader")).toHaveClass("ml-bars", "ml-bars-sm");
  });

  it("merges a custom className", () => {
    render(<BarsLoader className="extra" data-testid="loader" />);
    expect(screen.getByTestId("loader")).toHaveClass("ml-bars", "extra");
  });
});
