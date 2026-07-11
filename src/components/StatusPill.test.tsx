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

  it("does not pulse the good-tone dot by default (pulse is strictly opt-in)", () => {
    const { container } = render(
      <StatusPill tone="good" dot>
        Online
      </StatusPill>,
    );
    expect(container.querySelector(".ml-status-pill-dot")).not.toHaveClass(
      "ml-status-pill-dot-pulse",
    );
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

  it("pulses the good-tone dot when pulse is explicitly true", () => {
    const { container } = render(
      <StatusPill tone="good" dot pulse>
        Online
      </StatusPill>,
    );
    expect(container.querySelector(".ml-status-pill-dot")).toHaveClass("ml-status-pill-dot-pulse");
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

  it("ships no unconditional entrance animation (in-app motion, not landing)", () => {
    // Status pills live in tables/dashboards; per motion.md, in-app entrance
    // motion is landing-only. The pill must not animate on every mount.
    expect(tagsCss).not.toMatch(/ml-status-pill-enter/);
    expect(tagsCss).not.toMatch(/^\s*animation:\s*ml-status-pill-enter/m);
  });

  it("gates the pulse keyframe behind prefers-reduced-motion: no-preference", () => {
    // The pulse keyframe must only run when the user has not asked for
    // reduced motion, so a reduced-motion user gets a completely static dot.
    expect(tagsCss).toMatch(/@media \(prefers-reduced-motion: no-preference\)/);
    expect(tagsCss).toMatch(/animation: ml-status-pill-pulse/);

    // Ambient carve-out shape (motion.md "Never animate"): cycle >= 6s,
    // opacity-only (no scale), compositor-friendly.
    const start = tagsCss.indexOf("@keyframes ml-status-pill-pulse");
    const end = tagsCss.indexOf("── Tag ──");
    expect(start).toBeGreaterThan(-1);
    expect(end).toBeGreaterThan(start);
    const keyframes = tagsCss.slice(start, end);
    expect(keyframes).toMatch(/opacity:/);
    expect(keyframes).not.toMatch(/(width|height|margin|padding|top|left):/);

    const durationMatch = tagsCss.match(/animation:\s*ml-status-pill-pulse\s+(\d+(?:\.\d+)?)s/);
    expect(durationMatch).not.toBeNull();
    expect(Number(durationMatch?.[1])).toBeGreaterThanOrEqual(6);
  });

  it("still flattens the pulse to instant under prefers-reduced-motion: reduce", () => {
    expect(tagsCss).toMatch(/@media \(prefers-reduced-motion: reduce\)/);
    const reducedBlockStart = tagsCss.indexOf("@media (prefers-reduced-motion: reduce)");
    const reducedBlock = tagsCss.slice(reducedBlockStart);
    expect(reducedBlock).toMatch(/\.ml-status-pill\s*{[^}]*transition-duration:\s*0\.01ms/);
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
