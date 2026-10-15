import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Card } from "./Card";

const squircleCss = readFileSync(resolve(process.cwd(), "src/styles/squircle.css"), "utf8");

describe("Card", () => {
  it("renders a plain div with the base class and default padding", () => {
    render(<Card data-testid="card">Body</Card>);
    const card = screen.getByTestId("card");
    expect(card.tagName).toBe("DIV");
    expect(card).toHaveClass("ml-card");
    expect(card).not.toHaveClass("ml-card-compact");
    expect(card).not.toHaveAttribute("role");
    expect(card).not.toHaveAttribute("tabindex");
  });

  it("applies the compact padding class", () => {
    render(
      <Card padding="compact" data-testid="card">
        Body
      </Card>,
    );
    expect(screen.getByTestId("card")).toHaveClass("ml-card-compact");
  });

  it("applies the interactive class on hover-capable cards", () => {
    render(
      <Card interactive data-testid="card">
        Body
      </Card>,
    );
    expect(screen.getByTestId("card")).toHaveClass("ml-card-interactive");
  });

  it("renders as a native button when as='button', with no extra a11y shim", () => {
    render(<Card as="button">Click me</Card>);
    const card = screen.getByRole("button", { name: "Click me" });
    expect(card.tagName).toBe("BUTTON");
    // Native interactive elements don't need the role/tabIndex emulation.
    expect(card).not.toHaveAttribute("tabindex");
  });

  it("gives a clickable div a button role and tabIndex 0", () => {
    const onClick = vi.fn();
    render(
      <Card onClick={onClick} data-testid="card">
        Body
      </Card>,
    );
    const card = screen.getByTestId("card");
    expect(card).toHaveAttribute("role", "button");
    expect(card).toHaveAttribute("tabindex", "0");
  });

  it("activates a clickable div's onClick on Enter and Space", () => {
    const onClick = vi.fn();
    render(
      <Card onClick={onClick} data-testid="card">
        Body
      </Card>,
    );
    const card = screen.getByTestId("card");
    fireEvent.keyDown(card, { key: "Enter" });
    expect(onClick).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(card, { key: " " });
    expect(onClick).toHaveBeenCalledTimes(2);
    // Other keys are ignored.
    fireEvent.keyDown(card, { key: "a" });
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it("forwards the ref and passes through native props", () => {
    let node: HTMLElement | null = null;
    render(
      <Card ref={(el) => (node = el)} className="custom" data-testid="card">
        Body
      </Card>,
    );
    expect(node).toBeInstanceOf(HTMLDivElement);
    expect(screen.getByTestId("card")).toHaveClass("custom");
  });

  it("applies the squircle class when opted in", () => {
    render(
      <Card squircle data-testid="card">
        Body
      </Card>,
    );
    expect(screen.getByTestId("card")).toHaveClass("ml-squircle");
  });

  it("does not apply the squircle class by default", () => {
    render(<Card data-testid="card">Body</Card>);
    expect(screen.getByTestId("card")).not.toHaveClass("ml-squircle");
  });

  it("gates the squircle corner-shape behind @supports (zero-change fallback)", () => {
    // Contract: browsers without `corner-shape` must render today's plain
    // border-radius, unchanged. If `corner-shape` ever escapes the
    // `@supports` block, unsupported browsers stop getting a no-op fallback.
    expect(squircleCss).toMatch(/@supports \(corner-shape: squircle\)/);
    const supportsStart = squircleCss.indexOf("@supports (corner-shape: squircle)");
    const supportsBlock = squircleCss.slice(supportsStart);
    expect(supportsBlock).toMatch(/\.ml-card\.ml-squircle\s*{[^}]*corner-shape:\s*squircle/);
    const cssBeforeSupports = squircleCss
      .slice(0, supportsStart)
      .replace(/\/\*[\s\S]*?\*\//g, "");
    expect(cssBeforeSupports).not.toMatch(/corner-shape:\s*squircle/);
  });

  it("scales the squircle radius up so it reads softer, not sharper, than the plain radius", () => {
    // corner-shape: squircle (superellipse n=2) is mathematically squarer
    // than a circular arc at the same radius, so the radius must grow under
    // the same @supports block or the effect looks sharper than plain.
    const supportsBlock = squircleCss.slice(
      squircleCss.indexOf("@supports (corner-shape: squircle)"),
    );
    expect(supportsBlock).toMatch(
      /\.ml-card\.ml-squircle\s*{[^}]*border-radius:\s*calc\(var\(--ml-radius-lg\)\s*\*\s*var\(--ml-squircle-radius-scale/,
    );
  });
});
