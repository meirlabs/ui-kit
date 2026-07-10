import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Card } from "./Card";

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
});
