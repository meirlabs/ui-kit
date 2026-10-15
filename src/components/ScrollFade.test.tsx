import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ScrollFade } from "./ScrollFade";

describe("ScrollFade", () => {
  it("defaults to the y-axis fade class", () => {
    const { container } = render(<ScrollFade>content</ScrollFade>);
    expect(container.firstChild).toHaveClass("ml-scroll-fade-y");
  });

  it("switches the fade class per axis", () => {
    const { container: x } = render(<ScrollFade axis="x">content</ScrollFade>);
    expect(x.firstChild).toHaveClass("ml-scroll-fade-x");

    const { container: both } = render(<ScrollFade axis="both">content</ScrollFade>);
    expect(both.firstChild).toHaveClass("ml-scroll-fade-both");
  });

  it("sets the fade size as a CSS custom property", () => {
    const { container } = render(<ScrollFade size={64}>content</ScrollFade>);
    const el = container.firstChild as HTMLElement;
    expect(el.style.getPropertyValue("--ml-scroll-fade-size")).toBe("64px");
  });

  it("defaults the fade size to 48px", () => {
    const { container } = render(<ScrollFade>content</ScrollFade>);
    const el = container.firstChild as HTMLElement;
    expect(el.style.getPropertyValue("--ml-scroll-fade-size")).toBe("48px");
  });

  it("merges a custom className and forwards other div props", () => {
    const { container } = render(
      <ScrollFade className="custom" data-testid="scroller">
        content
      </ScrollFade>,
    );
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveClass("ml-scroll-fade-y");
    expect(el).toHaveClass("custom");
    expect(el.dataset.testid).toBe("scroller");
  });

  it("renders children", () => {
    const { getByText } = render(<ScrollFade>Hello</ScrollFade>);
    expect(getByText("Hello")).toBeInTheDocument();
  });
});
