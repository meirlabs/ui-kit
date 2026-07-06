import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("neutral tone is gray and never emits a primary/blue class", () => {
    const { container } = render(<Badge tone="neutral">Draft</Badge>);
    const badge = container.querySelector(".ml-badge")!;
    expect(badge).toHaveClass("ml-badge-muted");
    // the blue legacy neutral class and any primary class must be absent
    expect(badge.className).not.toContain("ml-badge-neutral");
    expect(badge.className).not.toContain("primary");
  });

  it("maps status tones to their -muted tint classes", () => {
    const { container } = render(<Badge tone="success">Active</Badge>);
    expect(container.querySelector(".ml-badge")).toHaveClass("ml-badge-success");
  });

  it("renders a leading status dot when dot is set", () => {
    const { container } = render(
      <Badge tone="success" dot>
        Live
      </Badge>,
    );
    expect(container.querySelector(".ml-badge-dot")).not.toBeNull();
  });

  it("renders a leading icon slot", () => {
    render(<Badge icon={<span data-testid="i" />}>Tagged</Badge>);
    expect(screen.getByTestId("i")).toBeInTheDocument();
  });

  it("applies the sm size class", () => {
    const { container } = render(<Badge size="sm">x</Badge>);
    expect(container.querySelector(".ml-badge")).toHaveClass("ml-badge-sm");
  });
});
