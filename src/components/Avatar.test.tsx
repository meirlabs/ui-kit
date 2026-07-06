import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Avatar } from "./Avatar";

describe("Avatar", () => {
  it("shows initials when there is no image", () => {
    const { container } = render(<Avatar fallback="MR" />);
    expect(container.querySelector("img")).toBeNull();
    expect(screen.getByText("MR")).toBeInTheDocument();
  });

  it("derives initials from alt when no fallback given", () => {
    render(<Avatar alt="Meir Rosenschein" />);
    expect(screen.getByText("MR")).toBeInTheDocument();
  });

  it("falls back to initials when the image errors (never a broken glyph)", () => {
    const { container } = render(<Avatar src="/broken.png" fallback="AB" alt="AB" />);
    const img = container.querySelector("img")!;
    expect(img).not.toBeNull();
    fireEvent.error(img);
    // image is dropped, initials take over
    expect(container.querySelector("img")).toBeNull();
    expect(screen.getByText("AB")).toBeInTheDocument();
  });

  it("renders a presence dot for the given status", () => {
    const { container } = render(<Avatar fallback="X" status="online" />);
    const dot = container.querySelector(".ml-avatar-status");
    expect(dot).not.toBeNull();
    expect(dot).toHaveClass("ml-avatar-status-online");
  });

  it("interactive renders a focusable button wrapper", () => {
    render(<Avatar fallback="X" interactive aria-label="Account menu" />);
    const btn = screen.getByRole("button", { name: "Account menu" });
    expect(btn.tagName).toBe("BUTTON");
    expect(btn).toHaveClass("ml-avatar-interactive");
  });

  it("applies size classes", () => {
    const { container } = render(<Avatar fallback="X" size="xs" />);
    expect(container.querySelector(".ml-avatar")).toHaveClass("ml-avatar-xs");
  });
});
