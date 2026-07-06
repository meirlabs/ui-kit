import { render, screen, fireEvent, within } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Dropdown, type DropdownMenuItem } from "./Dropdown";

const items: DropdownMenuItem[] = [
  { label: "Edit", value: "edit" },
  { label: "Duplicate", value: "duplicate" },
  { separator: true },
  { label: "Archive", value: "archive", disabled: true },
  { label: "Delete", value: "delete", destructive: true },
];

function renderDropdown(onSelect = vi.fn()) {
  render(
    <Dropdown
      trigger={<button>Actions</button>}
      items={items}
      onSelect={onSelect}
    />,
  );
  return { onSelect, trigger: screen.getByRole("button", { name: "Actions" }) };
}

describe("Dropdown", () => {
  it("exposes menu-button semantics on the trigger", () => {
    const { trigger } = renderDropdown();
    expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("opens on click and exposes a menu with menuitems", () => {
    const { trigger } = renderDropdown();
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    const menu = screen.getByRole("menu");
    expect(within(menu).getAllByRole("menuitem")).toHaveLength(4);
    // Focus moves to the first item on open.
    expect(document.activeElement).toHaveTextContent("Edit");
  });

  it("opens with ArrowDown and moves roving focus, skipping disabled items", () => {
    const { trigger } = renderDropdown();
    trigger.focus();
    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    expect(document.activeElement).toHaveTextContent("Edit");

    const menu = screen.getByRole("menu");
    fireEvent.keyDown(menu, { key: "ArrowDown" });
    expect(document.activeElement).toHaveTextContent("Duplicate");

    // Next ArrowDown skips the disabled "Archive" and lands on "Delete".
    fireEvent.keyDown(menu, { key: "ArrowDown" });
    expect(document.activeElement).toHaveTextContent("Delete");

    // End jumps to last enabled, Home to first.
    fireEvent.keyDown(menu, { key: "Home" });
    expect(document.activeElement).toHaveTextContent("Edit");
    fireEvent.keyDown(menu, { key: "End" });
    expect(document.activeElement).toHaveTextContent("Delete");
  });

  it("selects an item on click and closes", () => {
    const { trigger, onSelect } = renderDropdown();
    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole("menuitem", { name: "Duplicate" }));
    expect(onSelect).toHaveBeenCalledWith("duplicate");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("closes on Escape and returns focus to the trigger", () => {
    const { trigger } = renderDropdown();
    trigger.focus();
    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    expect(screen.getByRole("menu")).toBeInTheDocument();

    fireEvent.keyDown(screen.getByRole("menu"), { key: "Escape" });
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(document.activeElement).toBe(trigger);
  });

  it("does not select a disabled item", () => {
    const { trigger, onSelect } = renderDropdown();
    fireEvent.click(trigger);
    const archive = screen.getByRole("menuitem", { name: "Archive" });
    fireEvent.click(archive);
    expect(onSelect).not.toHaveBeenCalled();
  });
});
