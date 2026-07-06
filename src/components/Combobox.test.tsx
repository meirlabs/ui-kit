import { render, screen, fireEvent, within } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useState } from "react";
import { Combobox, type ComboboxOption } from "./Combobox";

const options: ComboboxOption[] = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "blueberry", label: "Blueberry" },
  { value: "cherry", label: "Cherry", disabled: true },
];

describe("Combobox", () => {
  it("renders a combobox input", () => {
    render(<Combobox aria-label="Fruit" options={options} placeholder="Search" />);
    const input = screen.getByRole("combobox", { name: "Fruit" });
    expect(input).toHaveAttribute("aria-autocomplete", "list");
    expect(input).toHaveAttribute("aria-expanded", "false");
  });

  it("opens and filters options by substring", () => {
    render(<Combobox aria-label="Fruit" options={options} />);
    const input = screen.getByRole("combobox", { name: "Fruit" });
    fireEvent.change(input, { target: { value: "b" } });
    expect(input).toHaveAttribute("aria-expanded", "true");
    const list = screen.getByRole("listbox");
    const names = within(list)
      .getAllByRole("option")
      .map((o) => o.textContent);
    expect(names).toEqual(["Banana", "Blueberry"]);
  });

  it("selects the highlighted option with Enter", () => {
    const onValueChange = vi.fn();
    render(<Combobox aria-label="Fruit" options={options} onValueChange={onValueChange} />);
    const input = screen.getByRole("combobox", { name: "Fruit" });
    fireEvent.change(input, { target: { value: "blue" } }); // Blueberry auto-highlighted
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onValueChange).toHaveBeenCalledWith("blueberry");
    expect(input).toHaveValue("Blueberry");
  });

  it("navigates with arrow keys", () => {
    const onValueChange = vi.fn();
    render(<Combobox aria-label="Fruit" options={options} onValueChange={onValueChange} />);
    const input = screen.getByRole("combobox", { name: "Fruit" });
    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: "ArrowDown" }); // open (highlight apple)
    fireEvent.keyDown(input, { key: "ArrowDown" }); // banana
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onValueChange).toHaveBeenCalledWith("banana");
  });

  it("shows the empty state when nothing matches", () => {
    render(
      <Combobox aria-label="Fruit" options={options} emptyState="Nothing here" />,
    );
    const input = screen.getByRole("combobox", { name: "Fruit" });
    fireEvent.change(input, { target: { value: "zzz" } });
    expect(screen.getByText("Nothing here")).toBeInTheDocument();
    expect(screen.queryAllByRole("option")).toHaveLength(0);
  });

  it("commits a custom value when allowed", () => {
    const onValueChange = vi.fn();
    render(
      <Combobox
        aria-label="Fruit"
        options={options}
        allowCustomValue
        onValueChange={onValueChange}
      />,
    );
    const input = screen.getByRole("combobox", { name: "Fruit" });
    fireEvent.change(input, { target: { value: "kiwi" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onValueChange).toHaveBeenCalledWith("kiwi");
  });

  it("supports multi-select with chips and Backspace removal", () => {
    function Multi() {
      const [value, setValue] = useState<string[]>([]);
      return (
        <Combobox
          aria-label="Fruit"
          options={options}
          multiple
          value={value}
          onValueChange={(v) => setValue(v as string[])}
        />
      );
    }
    render(<Multi />);
    const input = screen.getByRole("combobox", { name: "Fruit" });
    fireEvent.change(input, { target: { value: "app" } });
    fireEvent.keyDown(input, { key: "Enter" }); // add Apple
    expect(screen.getByRole("button", { name: "Remove Apple" })).toBeInTheDocument();
    // Input is cleared after adding a chip; Backspace removes the last chip.
    fireEvent.keyDown(input, { key: "Backspace" });
    expect(screen.queryByRole("button", { name: "Remove Apple" })).not.toBeInTheDocument();
  });

  it("does not select disabled options", () => {
    const onValueChange = vi.fn();
    render(<Combobox aria-label="Fruit" options={options} onValueChange={onValueChange} />);
    const input = screen.getByRole("combobox", { name: "Fruit" });
    fireEvent.change(input, { target: { value: "cherry" } });
    fireEvent.click(screen.getByRole("option", { name: "Cherry" }));
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
