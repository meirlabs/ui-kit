import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { StatusPill } from "./StatusPill";

const tagsCss = readFileSync(resolve(process.cwd(), "src/styles/tags.css"), "utf8");

describe("StatusPill", () => {
  it("renders the neutral tone as gray (never the blue accent)", () => {
    render(
      <StatusPill tone="neutral" data-testid="pill">
        Draft
      </StatusPill>,
    );
    expect(screen.getByTestId("pill")).toHaveClass("ml-status-pill-neutral");
    // Contract: neutral must be monochrome — no blue/purple accent token is
    // ever referenced in the stylesheet, so it can never render blue.
    expect(tagsCss).not.toMatch(/var\(--ml-color-primary/);
    expect(tagsCss).not.toMatch(/var\(--ml-color-purple/);
  });

  it("supports the danger tone (parity with Badge)", () => {
    render(
      <StatusPill tone="danger" data-testid="pill">
        Failed
      </StatusPill>,
    );
    expect(screen.getByTestId("pill")).toHaveClass("ml-status-pill-danger");
  });

  it("defaults to the neutral tone", () => {
    render(<StatusPill data-testid="pill">Draft</StatusPill>);
    expect(screen.getByTestId("pill")).toHaveClass("ml-status-pill-neutral");
  });

  it("renders a leading dot when requested", () => {
    const { container } = render(
      <StatusPill tone="good" dot>
        Active
      </StatusPill>,
    );
    expect(container.querySelector(".ml-status-pill-dot")).toBeInTheDocument();
  });

  it("does not render a dot by default", () => {
    const { container } = render(<StatusPill tone="good">Active</StatusPill>);
    expect(container.querySelector(".ml-status-pill-dot")).not.toBeInTheDocument();
  });

  it("pulses the good-tone dot by default (live/active state)", () => {
    const { container } = render(
      <StatusPill tone="good" dot>
        Online
      </StatusPill>,
    );
    expect(container.querySelector(".ml-status-pill-dot")).toHaveClass("ml-status-pill-dot-pulse");
  });

  it("does not pulse non-good tone dots by default", () => {
    const { container } = render(
      <StatusPill tone="warn" dot>
        Degraded
      </StatusPill>,
    );
    expect(container.querySelector(".ml-status-pill-dot")).not.toHaveClass(
      "ml-status-pill-dot-pulse",
    );
  });

  it("disables the pulse when pulse={false}", () => {
    const { container } = render(
      <StatusPill tone="good" dot pulse={false}>
        Online
      </StatusPill>,
    );
    expect(container.querySelector(".ml-status-pill-dot")).not.toHaveClass(
      "ml-status-pill-dot-pulse",
    );
  });

  it("forces the pulse on any tone when pulse is set", () => {
    const { container } = render(
      <StatusPill tone="danger" dot pulse>
        Critical
      </StatusPill>,
    );
    expect(container.querySelector(".ml-status-pill-dot")).toHaveClass("ml-status-pill-dot-pulse");
  });

  it("never emits the pulse class without a dot", () => {
    const { container } = render(
      <StatusPill tone="good" pulse>
        Active
      </StatusPill>,
    );
    expect(container.querySelector(".ml-status-pill-dot")).not.toBeInTheDocument();
    expect(container.querySelector(".ml-status-pill-dot-pulse")).not.toBeInTheDocument();
  });

  it("gates all keyframe motion behind prefers-reduced-motion: no-preference", () => {
    // Entrance + pulse keyframes must only run when the user has not asked for
    // reduced motion, so a reduced-motion user gets a completely static pill.
    expect(tagsCss).toMatch(/@media \(prefers-reduced-motion: no-preference\)/);
    expect(tagsCss).toMatch(/animation: ml-status-pill-enter/);
    expect(tagsCss).toMatch(/animation: ml-status-pill-pulse/);

    // Motion is compositor-only: the keyframe blocks must animate transform /
    // opacity only, never layout properties.
    const start = tagsCss.indexOf("@keyframes ml-status-pill-enter");
    const end = tagsCss.indexOf("── Tag ──");
    expect(start).toBeGreaterThan(-1);
    expect(end).toBeGreaterThan(start);
    const keyframes = tagsCss.slice(start, end);
    expect(keyframes).toMatch(/transform:/);
    expect(keyframes).toMatch(/opacity:/);
    expect(keyframes).not.toMatch(/(width|height|margin|padding|top|left):/);
  });

  it("renders a provided icon", () => {
    render(
      <StatusPill tone="warn" icon={<svg data-testid="icon" />}>
        Pending
      </StatusPill>,
    );
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("forwards the ref and passes through native props", () => {
    let node: HTMLSpanElement | null = null;
    render(
      <StatusPill ref={(el) => (node = el)} tone="good" className="custom">
        Active
      </StatusPill>,
    );
    expect(node).toBeInstanceOf(HTMLSpanElement);
    expect(node).toHaveClass("custom");
  });
});
