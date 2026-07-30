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

  it("rings the dot when marked live", () => {
    const { container } = render(
      <StatusPill tone="good" dot live>
        Working
      </StatusPill>,
    );
    expect(container.querySelector(".ml-status-pill-dot-live")).toBeInTheDocument();
  });

  it("does not mark the dot live by default", () => {
    const { container } = render(
      <StatusPill tone="good" dot>
        Ready
      </StatusPill>,
    );
    expect(container.querySelector(".ml-status-pill-dot-live")).not.toBeInTheDocument();
  });

  it("keeps the live treatment static — no looping animation", () => {
    // Contract: design spec §"Never animate" bans looping elements ("nothing
    // that draws the eye on repeat"). A status pill in a list is exactly what
    // that protects, so `live` must never grow an animation or keyframes.
    const liveRule = tagsCss.slice(tagsCss.indexOf(".ml-status-pill-dot-live"));
    const block = liveRule.slice(0, liveRule.indexOf("}"));
    expect(block).not.toMatch(/animation/);
    expect(tagsCss).not.toMatch(/@keyframes[^{]*status-pill/);
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
