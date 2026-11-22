import { readFileSync } from "node:fs";
import { join } from "node:path";
import { cleanup, render, screen, fireEvent, within } from "@testing-library/react";
import { afterEach, describe, it, expect, vi } from "vitest";
import { Dropdown, type DropdownAlign, type DropdownMenuItem } from "./Dropdown";

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

  describe("first open", () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("moves focus into the menu once it is visible, so the keyboard works", () => {
      // Browsers refuse to focus inside a `visibility: hidden` subtree — which
      // is what the menu is until it has been measured. jsdom focuses anyway,
      // so reproduce the browser rule here.
      const realFocus = HTMLElement.prototype.focus;
      vi.spyOn(HTMLElement.prototype, "focus").mockImplementation(function (
        this: HTMLElement,
        ...args: Parameters<HTMLElement["focus"]>
      ) {
        const menu = this.closest<HTMLElement>('[role="menu"]');
        if (menu && menu.style.visibility === "hidden") return;
        realFocus.apply(this, args);
      });

      const { trigger } = renderDropdown();
      fireEvent.click(trigger);

      const first = screen.getByRole("menuitem", { name: "Edit" });
      expect(screen.getByRole("menu").style.visibility).toBe("visible");
      expect(document.activeElement).toBe(first);

      fireEvent.keyDown(document.activeElement!, { key: "ArrowDown" });
      expect(document.activeElement).toBe(
        screen.getByRole("menuitem", { name: "Duplicate" }),
      );

      fireEvent.keyDown(document.activeElement!, { key: "Escape" });
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
      expect(document.activeElement).toBe(trigger);
    });
  });

  describe("menu width", () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("hands the trigger's width to the stylesheet instead of overriding the menu's minimum", () => {
      // A narrow trigger (an icon button) must not shrink the menu: an inline
      // min-width would beat the stylesheet's default minimum.
      vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
        left: 300, right: 332, top: 100, bottom: 132, width: 32, height: 32,
        x: 300, y: 100, toJSON: () => ({}),
      });
      const { trigger } = renderDropdown();
      fireEvent.click(trigger);
      const menu = screen.getByRole("menu");
      expect(menu.style.minWidth).toBe("");
      expect(menu.style.getPropertyValue("--ml-dropdown-trigger-width")).toBe("32px");
    });

    it("is at least its default minimum and at least as wide as the trigger", () => {
      // vitest runs with cwd at the package root.
      const style = document.createElement("style");
      style.textContent = readFileSync(
        join(process.cwd(), "src/styles/overlays.css"),
        "utf8",
      );
      document.head.append(style);
      try {
        const rule = Array.from(style.sheet!.cssRules).find(
          (r) => (r as CSSStyleRule).selectorText === ".ml-dropdown-menu",
        ) as CSSStyleRule;
        expect(rule.style.getPropertyValue("min-width")).toBe(
          "max(180px, var(--ml-dropdown-trigger-width, 0px))",
        );
      } finally {
        style.remove();
      }
    });
  });

  describe("align follows the reading direction", () => {
    // jsdom has no layout: fake a 100px trigger at x=300..400 and a 160px menu.
    const TRIGGER = { left: 300, right: 400, top: 100, bottom: 130, width: 100, height: 30 };
    const MENU_W = 160;

    afterEach(() => {
      vi.restoreAllMocks();
      document.documentElement.removeAttribute("dir");
    });

    function openAt(align: DropdownAlign | undefined, dir?: "rtl") {
      if (dir) document.documentElement.setAttribute("dir", dir);
      vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
        ...TRIGGER,
        x: TRIGGER.left,
        y: TRIGGER.top,
        toJSON: () => ({}),
      });
      vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(MENU_W);
      render(
        <Dropdown
          trigger={<button>Actions</button>}
          items={items}
          onSelect={() => {}}
          align={align}
        />,
      );
      fireEvent.click(screen.getByRole("button", { name: "Actions" }));
      return screen.getByRole("menu").style.left;
    }

    it("LTR: start (the default) lines up left edges", () => {
      expect(openAt(undefined)).toBe(`${TRIGGER.left}px`);
    });

    it("LTR: end lines up right edges", () => {
      expect(openAt("end")).toBe(`${TRIGGER.right - MENU_W}px`);
    });

    it("RTL: start lines up right edges", () => {
      expect(openAt("start", "rtl")).toBe(`${TRIGGER.right - MENU_W}px`);
    });

    it("RTL: end lines up left edges", () => {
      expect(openAt("end", "rtl")).toBe(`${TRIGGER.left}px`);
    });

    it("grows from the corner it is lined up with", () => {
      // The entrance scales from the trigger's corner: the menu's own aligned
      // edge, which is the physical side `data-origin` names.
      const originAt = (align: DropdownAlign | undefined, dir?: "rtl") => {
        openAt(align, dir);
        const origin = screen.getByRole("menu").dataset.origin;
        cleanup();
        vi.restoreAllMocks();
        document.documentElement.removeAttribute("dir");
        return origin;
      };
      expect(originAt(undefined)).toBe("left");
      expect(originAt("end")).toBe("right");
      expect(originAt("start", "rtl")).toBe("right");
      expect(originAt("end", "rtl")).toBe("left");
    });

    it("re-measures once the trigger's width lands, so the far edge lines up on first open", () => {
      // The menu can change width once it learns the trigger's width (its
      // min-width is the larger of the two): 180px on the first pass, 120px
      // after — any change will do for this test.
      document.documentElement.setAttribute("dir", "rtl");
      vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
        ...TRIGGER,
        x: TRIGGER.left,
        y: TRIGGER.top,
        toJSON: () => ({}),
      });
      vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockImplementation(
        function (this: HTMLElement) {
          return this.style.getPropertyValue("--ml-dropdown-trigger-width") ? 120 : 180;
        },
      );
      render(
        <Dropdown trigger={<button>Actions</button>} items={items} onSelect={() => {}} />,
      );
      fireEvent.click(screen.getByRole("button", { name: "Actions" }));
      expect(screen.getByRole("menu").style.left).toBe(`${TRIGGER.right - 120}px`);
    });
  });
});
