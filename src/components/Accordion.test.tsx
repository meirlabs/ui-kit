import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Accordion, type AccordionProps } from "./Accordion";

function renderBasic(props: AccordionProps = {}) {
  return render(
    <Accordion {...props}>
      <Accordion.Item value="a" title="First">
        Panel A
      </Accordion.Item>
      <Accordion.Item value="b" title="Second">
        Panel B
      </Accordion.Item>
      <Accordion.Item value="c" title="Third">
        Panel C
      </Accordion.Item>
    </Accordion>,
  );
}

describe("Accordion", () => {
  it("wires aria-expanded / aria-controls and a labelled region", () => {
    renderBasic({ defaultValue: "a" });
    const first = screen.getByRole("button", { name: "First" });
    expect(first).toHaveAttribute("aria-expanded", "true");
    const panelId = first.getAttribute("aria-controls");
    const region = screen.getByRole("region", { name: "First" });
    expect(region.id).toBe(panelId);
    expect(screen.getByRole("button", { name: "Second" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("toggles uncontrolled and closes others in single mode", () => {
    renderBasic({ defaultValue: "a" });
    const first = screen.getByRole("button", { name: "First" });
    const second = screen.getByRole("button", { name: "Second" });

    fireEvent.click(second);
    expect(second).toHaveAttribute("aria-expanded", "true");
    expect(first).toHaveAttribute("aria-expanded", "false");

    // clicking the open one collapses it
    fireEvent.click(second);
    expect(second).toHaveAttribute("aria-expanded", "false");
  });

  it("keeps multiple panels open in multiple mode", () => {
    renderBasic({ type: "multiple", defaultValue: ["a"] });
    const first = screen.getByRole("button", { name: "First" });
    const second = screen.getByRole("button", { name: "Second" });
    fireEvent.click(second);
    expect(first).toHaveAttribute("aria-expanded", "true");
    expect(second).toHaveAttribute("aria-expanded", "true");
  });

  it("supports controlled mode via value + onValueChange", () => {
    const onValueChange = vi.fn();
    const { rerender } = render(
      <Accordion type="single" value="a" onValueChange={onValueChange}>
        <Accordion.Item value="a" title="First">
          A
        </Accordion.Item>
        <Accordion.Item value="b" title="Second">
          B
        </Accordion.Item>
      </Accordion>,
    );
    const second = screen.getByRole("button", { name: "Second" });
    fireEvent.click(second);
    expect(onValueChange).toHaveBeenCalledWith("b");
    // still controlled: value prop hasn't changed, so second stays closed
    expect(second).toHaveAttribute("aria-expanded", "false");

    rerender(
      <Accordion type="single" value="b" onValueChange={onValueChange}>
        <Accordion.Item value="a" title="First">
          A
        </Accordion.Item>
        <Accordion.Item value="b" title="Second">
          B
        </Accordion.Item>
      </Accordion>,
    );
    expect(second).toHaveAttribute("aria-expanded", "true");
  });

  it("moves focus with ArrowDown / ArrowUp / Home / End", () => {
    renderBasic();
    const [first, second, third] = screen.getAllByRole("button");
    first.focus();

    fireEvent.keyDown(first, { key: "ArrowDown" });
    expect(second).toHaveFocus();

    fireEvent.keyDown(second, { key: "End" });
    expect(third).toHaveFocus();

    fireEvent.keyDown(third, { key: "ArrowDown" });
    expect(first).toHaveFocus(); // wraps

    fireEvent.keyDown(first, { key: "ArrowUp" });
    expect(third).toHaveFocus(); // wraps back

    fireEvent.keyDown(third, { key: "Home" });
    expect(first).toHaveFocus();
  });

  it("toggles via Enter/Space on the focused header (native button)", () => {
    renderBasic();
    const first = screen.getByRole("button", { name: "First" });
    expect(first).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(first); // native button activation for Enter/Space
    expect(first).toHaveAttribute("aria-expanded", "true");
  });
});
