import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Skeleton, SkeletonText } from "./Skeleton";

const skeletonCss = readFileSync(resolve(process.cwd(), "src/styles/skeleton.css"), "utf8");

describe("Skeleton", () => {
  it("defaults to the text variant", () => {
    render(<Skeleton data-testid="sk" />);
    expect(screen.getByTestId("sk")).toHaveClass("ml-skeleton-text");
  });

  it("applies the rect and circle variant classes", () => {
    const { rerender } = render(<Skeleton data-testid="sk" variant="rect" />);
    expect(screen.getByTestId("sk")).toHaveClass("ml-skeleton-rect");
    rerender(<Skeleton data-testid="sk" variant="circle" />);
    expect(screen.getByTestId("sk")).toHaveClass("ml-skeleton-circle");
  });

  it("converts numeric width/height/radius to px inline styles", () => {
    render(<Skeleton data-testid="sk" width={120} height={24} radius={6} />);
    const el = screen.getByTestId("sk");
    expect(el.style.width).toBe("120px");
    expect(el.style.height).toBe("24px");
    expect(el.style.borderRadius).toBe("6px");
  });

  it("passes string width/height through untouched", () => {
    render(<Skeleton data-testid="sk" width="60%" height="1.5em" />);
    const el = screen.getByTestId("sk");
    expect(el.style.width).toBe("60%");
    expect(el.style.height).toBe("1.5em");
  });

  it("is hidden from the accessibility tree (parent owns the live region)", () => {
    render(<Skeleton data-testid="sk" />);
    expect(screen.getByTestId("sk")).toHaveAttribute("aria-hidden", "true");
  });

  it("forwards the ref and passes through native props", () => {
    let node: HTMLSpanElement | null = null;
    render(<Skeleton ref={(el) => (node = el)} className="custom" />);
    expect(node).toBeInstanceOf(HTMLSpanElement);
    expect(node).toHaveClass("custom");
    expect(node).toHaveClass("ml-skeleton");
  });

  it("gates the shimmer behind prefers-reduced-motion: reduce -> static block", () => {
    expect(skeletonCss).toMatch(/@media \(prefers-reduced-motion: reduce\)/);
    const reducedBlockStart = skeletonCss.indexOf("@media (prefers-reduced-motion: reduce)");
    const reducedBlock = skeletonCss.slice(reducedBlockStart);
    expect(reducedBlock).toMatch(/\.ml-skeleton\s*{[^}]*animation:\s*none/);
  });

  it("never uses a moving gradient sweep -- opacity pulse only", () => {
    expect(skeletonCss).not.toMatch(/linear-gradient/);
    const start = skeletonCss.indexOf("@keyframes ml-skeleton-shimmer");
    const end = skeletonCss.indexOf("@media", start);
    const keyframes = skeletonCss.slice(start, end);
    expect(keyframes).toMatch(/opacity:/);
    expect(keyframes).not.toMatch(/(width|height|transform|background-position):/);
  });
});

describe("SkeletonText", () => {
  it("renders three lines by default", () => {
    const { container } = render(<SkeletonText />);
    expect(container.querySelectorAll(".ml-skeleton-text")).toHaveLength(3);
  });

  it("renders the requested number of lines", () => {
    const { container } = render(<SkeletonText lines={5} />);
    expect(container.querySelectorAll(".ml-skeleton-text")).toHaveLength(5);
  });

  it("shortens the last line to read like a paragraph tail", () => {
    const { container } = render(<SkeletonText lines={3} />);
    const lines = container.querySelectorAll(".ml-skeleton-text");
    const last = lines[lines.length - 1] as HTMLElement;
    expect(last.style.width).toBe("60%");
  });

  it("does not shorten a single line", () => {
    const { container } = render(<SkeletonText lines={1} />);
    const line = container.querySelector(".ml-skeleton-text") as HTMLElement;
    expect(line.style.width).toBe("");
  });

  it("clamps lines to a minimum of one", () => {
    const { container } = render(<SkeletonText lines={0} />);
    expect(container.querySelectorAll(".ml-skeleton-text")).toHaveLength(1);
  });

  it("is hidden from the accessibility tree as a block", () => {
    const { container } = render(<SkeletonText />);
    expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
  });
});
