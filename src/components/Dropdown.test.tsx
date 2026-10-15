import { render, screen, fireEvent, within, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from "vitest";
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

const submenuItems: DropdownMenuItem[] = [
  { label: "Edit", value: "edit" },
  {
    label: "Share",
    value: "share",
    items: [
      { label: "Copy link", value: "copy-link" },
      { label: "Email", value: "email" },
    ],
  },
  { label: "Delete", value: "delete", destructive: true },
];

function renderSubmenuDropdown(onSelect = vi.fn()) {
  render(<Dropdown trigger={<button>Actions</button>} items={submenuItems} onSelect={onSelect} />);
  return { onSelect, trigger: screen.getByRole("button", { name: "Actions" }) };
}

/** jsdom reports a 0x0 rect by default — give an element a real one. */
function mockRect(el: HTMLElement, rect: Partial<DOMRect>) {
  el.getBoundingClientRect = () =>
    ({
      width: 0,
      height: 0,
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      x: 0,
      y: 0,
      toJSON: () => ({}),
      ...rect,
    }) as DOMRect;
}

describe("Dropdown submenu (triangle safe zone)", () => {
  beforeAll(() => {
    // jsdom has no layout engine — give every element a realistic size so
    // the submenu panel positions somewhere the triangle math can reason
    // about (default 0x0 boxes would make near === far, a degenerate zone).
    Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
      configurable: true,
      value: 160,
    });
    Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
      configurable: true,
      value: 160,
    });
  });

  beforeEach(() => {
    // Only fake what the safe-zone timer/expiry logic needs — faking
    // everything (rAF, MessageChannel, microtasks) risks starving React's
    // own scheduler.
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "Date"] });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("exposes submenu-trigger semantics and opens on hover", () => {
    const { trigger } = renderSubmenuDropdown();
    fireEvent.click(trigger);
    const share = screen.getByRole("menuitem", { name: /Share/ });
    expect(share).toHaveAttribute("aria-haspopup", "menu");
    expect(share).toHaveAttribute("aria-expanded", "false");

    mockRect(share, { top: 100, bottom: 130, left: 50, right: 200 });
    act(() => {
      fireEvent.mouseEnter(share);
    });

    expect(share).toHaveAttribute("aria-expanded", "true");
    const menus = screen.getAllByRole("menu");
    expect(menus).toHaveLength(2);
    expect(within(menus[1]).getByRole("menuitem", { name: "Copy link" })).toBeInTheDocument();
  });

  it("keeps the submenu open while the cursor moves diagonally toward it (inside the safe zone)", () => {
    const { trigger } = renderSubmenuDropdown();
    fireEvent.click(trigger);
    const share = screen.getByRole("menuitem", { name: /Share/ });
    mockRect(share, { top: 100, bottom: 130, left: 50, right: 200 });

    act(() => {
      fireEvent.mouseEnter(share);
    });
    expect(screen.getAllByRole("menu")).toHaveLength(2);

    // Leave the trigger heading toward the submenu, which opens to the
    // right starting around x=204 (mocked rect.right=200 + the 4px gap).
    act(() => {
      fireEvent.mouseLeave(share, { clientX: 190, clientY: 115 });
    });

    // A mousemove landing inside the safe-zone triangle suspends the close —
    // the submenu survives past the normal close delay.
    act(() => {
      fireEvent.mouseMove(document, { clientX: 199, clientY: 172 });
      vi.advanceTimersByTime(260);
    });
    expect(screen.getAllByRole("menu")).toHaveLength(2);
  });

  it("closes the submenu after the normal delay once the cursor moves away from it", () => {
    const { trigger } = renderSubmenuDropdown();
    fireEvent.click(trigger);
    const share = screen.getByRole("menuitem", { name: /Share/ });
    mockRect(share, { top: 100, bottom: 130, left: 50, right: 200 });

    act(() => {
      fireEvent.mouseEnter(share);
    });
    act(() => {
      fireEvent.mouseLeave(share, { clientX: 190, clientY: 115 });
    });

    // A mousemove landing well outside the triangle breaks the safe zone,
    // freeing the pending close timer to fire.
    act(() => {
      fireEvent.mouseMove(document, { clientX: 10, clientY: 10 });
      vi.advanceTimersByTime(260);
    });
    expect(screen.getAllByRole("menu")).toHaveLength(1);
  });

  it("eventually closes even if the cursor never confirms a direction (bounded safe-zone lifetime)", () => {
    const { trigger } = renderSubmenuDropdown();
    fireEvent.click(trigger);
    const share = screen.getByRole("menuitem", { name: /Share/ });
    mockRect(share, { top: 100, bottom: 130, left: 50, right: 200 });

    act(() => {
      fireEvent.mouseEnter(share);
    });
    act(() => {
      fireEvent.mouseLeave(share, { clientX: 190, clientY: 115 });
    });

    // No further mousemove ever arrives — a stalled cursor must not pin the
    // submenu open forever.
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(screen.getAllByRole("menu")).toHaveLength(1);
  });

  it("opens and navigates the submenu from the keyboard, then returns focus on ArrowLeft", () => {
    const { trigger } = renderSubmenuDropdown();
    trigger.focus();
    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    const menu = screen.getByRole("menu");
    fireEvent.keyDown(menu, { key: "ArrowDown" }); // Edit -> Share
    expect(document.activeElement).toHaveTextContent("Share");

    fireEvent.keyDown(menu, { key: "ArrowRight" });
    const submenu = screen.getAllByRole("menu")[1];
    expect(document.activeElement).toHaveTextContent("Copy link");

    fireEvent.keyDown(submenu, { key: "ArrowDown" });
    expect(document.activeElement).toHaveTextContent("Email");

    fireEvent.keyDown(submenu, { key: "ArrowLeft" });
    expect(screen.queryAllByRole("menu")).toHaveLength(1);
    expect(document.activeElement).toHaveTextContent("Share");
  });

  it("selects a submenu item and closes the entire menu, returning focus to the trigger", () => {
    const { trigger, onSelect } = renderSubmenuDropdown();
    fireEvent.click(trigger);
    const share = screen.getByRole("menuitem", { name: /Share/ });
    mockRect(share, { top: 100, bottom: 130, left: 50, right: 200 });
    act(() => {
      fireEvent.mouseEnter(share);
    });

    fireEvent.click(screen.getByRole("menuitem", { name: "Email" }));
    expect(onSelect).toHaveBeenCalledWith("email");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(document.activeElement).toBe(trigger);
  });

  it("closes the whole menu, including an open submenu, on outside click", () => {
    const { trigger } = renderSubmenuDropdown();
    fireEvent.click(trigger);
    const share = screen.getByRole("menuitem", { name: /Share/ });
    mockRect(share, { top: 100, bottom: 130, left: 50, right: 200 });
    act(() => {
      fireEvent.mouseEnter(share);
    });
    expect(screen.getAllByRole("menu")).toHaveLength(2);

    fireEvent.mouseDown(document.body);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });
});
