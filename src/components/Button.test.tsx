import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("applies variant + size classes", () => {
    render(<Button variant="secondary" size="lg">Save</Button>);
    const btn = screen.getByRole("button", { name: "Save" });
    expect(btn).toHaveClass("ml-btn");
    expect(btn).toHaveClass("ml-btn-secondary");
    expect(btn).toHaveClass("ml-btn-size-lg");
  });

  it("defaults to the primary charcoal variant at md size", () => {
    render(<Button>Go</Button>);
    const btn = screen.getByRole("button", { name: "Go" });
    expect(btn).toHaveClass("ml-btn-primary");
    expect(btn).toHaveClass("ml-btn-size-md");
  });

  it("loading sets aria-busy + disables + reserves the label width", () => {
    render(<Button loading>Submit</Button>);
    const btn = screen.getByRole("button");
    expect(btn).toHaveAttribute("aria-busy", "true");
    expect(btn).toBeDisabled();
    expect(btn).toHaveClass("ml-btn-loading");
    // label stays in the DOM (width reserved via visibility, not display:none)
    expect(screen.getByText("Submit")).toBeInTheDocument();
    // spinner is rendered on top
    expect(btn.querySelector(".ml-btn-spinner")).not.toBeNull();
  });

  it("icon variant carries the square hit-area class", () => {
    render(
      <Button variant="icon" aria-label="Close">
        <svg />
      </Button>,
    );
    const btn = screen.getByRole("button", { name: "Close" });
    expect(btn).toHaveClass("ml-btn-icon");
  });

  it("renders leading and trailing icon slots", () => {
    render(
      <Button leftIcon={<span data-testid="left" />} rightIcon={<span data-testid="right" />}>
        Next
      </Button>,
    );
    expect(screen.getByTestId("left")).toBeInTheDocument();
    expect(screen.getByTestId("right")).toBeInTheDocument();
  });

  it("as='a' / href renders a styled anchor with role=button", () => {
    render(
      <Button href="/pricing" variant="primary">
        Pricing
      </Button>,
    );
    const link = screen.getByRole("button", { name: "Pricing" });
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/pricing");
    expect(link).toHaveClass("ml-btn-primary");
  });

  it("a disabled link drops its href and becomes unfocusable", () => {
    render(
      <Button href="/x" disabled>
        Nope
      </Button>,
    );
    const link = screen.getByRole("button", { name: "Nope" });
    expect(link).not.toHaveAttribute("href");
    expect(link).toHaveAttribute("aria-disabled", "true");
    expect(link).toHaveAttribute("tabindex", "-1");
    expect(link).toHaveClass("ml-btn-disabled");
  });
});
