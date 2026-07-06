import { render, screen, fireEvent, within } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useState } from "react";
import { Select } from "./Select";

function BasicSelect(props: {
  onValueChange?: (v: string) => void;
  defaultValue?: string;
  name?: string;
}) {
  return (
    <Select
      placeholder="Pick a fruit"
      defaultValue={props.defaultValue}
      onValueChange={props.onValueChange}
      name={props.name}
    >
      <Select.Trigger aria-label="Fruit" />
      <Select.Content>
        <Select.Item value="apple">Apple</Select.Item>
        <Select.Item value="banana">Banana</Select.Item>
        <Select.Item value="cherry" disabled>
          Cherry
        </Select.Item>
        <Select.Item value="date">Date</Select.Item>
      </Select.Content>
    </Select>
  );
}

describe("Select", () => {
  it("renders a combobox trigger with the placeholder", () => {
    render(<BasicSelect />);
    const trigger = screen.getByRole("combobox", { name: "Fruit" });
    expect(trigger).toHaveTextContent("Pick a fruit");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("opens with keyboard and exposes a listbox", () => {
    render(<BasicSelect />);
    const trigger = screen.getByRole("combobox", { name: "Fruit" });
    trigger.focus();
    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getAllByRole("option")).toHaveLength(4);
  });

  it("selects an option with keyboard (arrow + enter)", () => {
    const onValueChange = vi.fn();
    render(<BasicSelect onValueChange={onValueChange} />);
    const trigger = screen.getByRole("combobox", { name: "Fruit" });
    trigger.focus();
    fireEvent.keyDown(trigger, { key: "ArrowDown" }); // open, active = apple
    fireEvent.keyDown(trigger, { key: "ArrowDown" }); // active = banana
    fireEvent.keyDown(trigger, { key: "Enter" });
    expect(onValueChange).toHaveBeenCalledWith("banana");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveTextContent("Banana");
  });

  it("skips disabled options during keyboard navigation", () => {
    const onValueChange = vi.fn();
    render(<BasicSelect onValueChange={onValueChange} />);
    const trigger = screen.getByRole("combobox", { name: "Fruit" });
    trigger.focus();
    fireEvent.keyDown(trigger, { key: "ArrowDown" }); // apple
    fireEvent.keyDown(trigger, { key: "ArrowDown" }); // banana
    fireEvent.keyDown(trigger, { key: "ArrowDown" }); // date (cherry skipped)
    fireEvent.keyDown(trigger, { key: "Enter" });
    expect(onValueChange).toHaveBeenCalledWith("date");
  });

  it("supports typeahead", () => {
    const onValueChange = vi.fn();
    render(<BasicSelect onValueChange={onValueChange} />);
    const trigger = screen.getByRole("combobox", { name: "Fruit" });
    trigger.focus();
    fireEvent.keyDown(trigger, { key: "ArrowDown" }); // open
    fireEvent.keyDown(trigger, { key: "d" }); // -> Date
    fireEvent.keyDown(trigger, { key: "Enter" });
    expect(onValueChange).toHaveBeenCalledWith("date");
  });

  it("marks the selected option with aria-selected", () => {
    render(<BasicSelect defaultValue="banana" />);
    const trigger = screen.getByRole("combobox", { name: "Fruit" });
    fireEvent.click(trigger);
    const list = screen.getByRole("listbox");
    expect(within(list).getByRole("option", { name: "Banana" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(within(list).getByRole("option", { name: "Apple" })).toHaveAttribute(
      "aria-selected",
      "false",
    );
  });

  it("works as a controlled component", () => {
    function Controlled() {
      const [value, setValue] = useState("apple");
      return (
        <Select value={value} onValueChange={setValue}>
          <Select.Trigger aria-label="Fruit" />
          <Select.Content>
            <Select.Item value="apple">Apple</Select.Item>
            <Select.Item value="banana">Banana</Select.Item>
          </Select.Content>
        </Select>
      );
    }
    render(<Controlled />);
    const trigger = screen.getByRole("combobox", { name: "Fruit" });
    expect(trigger).toHaveTextContent("Apple");
    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole("option", { name: "Banana" }));
    expect(trigger).toHaveTextContent("Banana");
  });

  it("emits a hidden input for form submission", () => {
    const { container } = render(<BasicSelect name="fruit" defaultValue="apple" />);
    const hidden = container.querySelector('input[type="hidden"][name="fruit"]');
    expect(hidden).toHaveValue("apple");
  });

  it("closes on Escape and returns focus to the trigger", () => {
    render(<BasicSelect />);
    const trigger = screen.getByRole("combobox", { name: "Fruit" });
    trigger.focus();
    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    fireEvent.keyDown(trigger, { key: "Escape" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveFocus();
  });
});
