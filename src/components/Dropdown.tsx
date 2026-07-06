import {
  type ComponentPropsWithoutRef,
  type ReactElement,
  type ReactNode,
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "../utils/cn";

export interface DropdownItem {
  label: ReactNode;
  value: string;
  /** Optional leading icon (ReactNode — icon-agnostic). */
  icon?: ReactNode;
  disabled?: boolean;
  /** Functional danger styling for destructive actions (e.g. Delete). */
  destructive?: boolean;
}

export interface DropdownSeparator {
  separator: true;
}

export type DropdownMenuItem = DropdownItem | DropdownSeparator;

export type DropdownAlign = "start" | "end";

export interface DropdownProps
  extends Omit<ComponentPropsWithoutRef<"div">, "onSelect" | "children"> {
  /** Trigger element (cloned to receive button semantics + handlers) or content. */
  trigger: ReactNode;
  items: DropdownMenuItem[];
  /** Currently-selected value (rendered with a check + `aria-checked`). */
  active?: string;
  onSelect: (value: string) => void;
  /** Horizontal alignment of the menu to the trigger. Default `start`. */
  align?: DropdownAlign;
}

function isSeparator(item: DropdownMenuItem): item is DropdownSeparator {
  return "separator" in item;
}

interface Coords {
  top: number;
  left: number;
  minWidth: number;
  placement: "top" | "bottom";
}

/**
 * Dropdown — an accessible menu button. The trigger is a real button (or cloned
 * to gain button semantics) exposing `aria-haspopup="menu"` + `aria-expanded`;
 * the menu renders in a portal (`role="menu"`) with full keyboard support:
 * Arrow roving focus, Home/End, typeahead, Enter/Space to activate, Escape/Tab
 * to close (Escape returns focus to the trigger). Closes on outside click.
 */
export function Dropdown({
  trigger,
  items,
  active,
  onSelect,
  align = "start",
  className,
  ...rest
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [coords, setCoords] = useState<Coords | null>(null);

  const triggerRef = useRef<HTMLElement | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const typeahead = useRef({ query: "", timer: 0 });

  const focusableIndices = items
    .map((item, i) => (!isSeparator(item) && !item.disabled ? i : -1))
    .filter((i) => i !== -1);

  const openMenu = useCallback(
    (index: number) => {
      setOpen(true);
      setActiveIndex(index);
    },
    [],
  );

  const closeMenu = useCallback((returnFocus = true) => {
    setOpen(false);
    setActiveIndex(-1);
    if (returnFocus) triggerRef.current?.focus();
  }, []);

  const position = useCallback(() => {
    const triggerEl = triggerRef.current;
    const menuEl = menuRef.current;
    if (!triggerEl || !menuEl) return;

    const rect = triggerEl.getBoundingClientRect();
    const menuH = menuEl.offsetHeight;
    const menuW = menuEl.offsetWidth;
    const gap = 4;
    const margin = 8;
    const spaceBelow = window.innerHeight - rect.bottom;

    const placeTop = spaceBelow < menuH + gap + margin && rect.top > menuH + gap + margin;
    const top = placeTop ? rect.top - menuH - gap : rect.bottom + gap;

    let left = align === "end" ? rect.right - menuW : rect.left;
    left = Math.max(margin, Math.min(left, window.innerWidth - menuW - margin));

    setCoords({ top, left, minWidth: rect.width, placement: placeTop ? "top" : "bottom" });
  }, [align]);

  // Measure + place once the menu is in the DOM, and keep it anchored.
  useLayoutEffect(() => {
    if (!open) return;
    position();
    const onScroll = () => position();
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
    };
  }, [open, position, items.length]);

  // Roving focus: move DOM focus to the active item.
  useEffect(() => {
    if (open && activeIndex >= 0) {
      itemRefs.current[activeIndex]?.focus();
    }
  }, [open, activeIndex]);

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent) {
      const target = e.target as Node;
      if (menuRef.current?.contains(target)) return;
      if (triggerRef.current?.contains(target)) return;
      closeMenu(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open, closeMenu]);

  function moveFocus(dir: 1 | -1) {
    if (focusableIndices.length === 0) return;
    const pos = focusableIndices.indexOf(activeIndex);
    const nextPos =
      pos === -1
        ? dir === 1
          ? 0
          : focusableIndices.length - 1
        : (pos + dir + focusableIndices.length) % focusableIndices.length;
    setActiveIndex(focusableIndices[nextPos]);
  }

  function runTypeahead(char: string) {
    const state = typeahead.current;
    window.clearTimeout(state.timer);
    state.query += char.toLowerCase();
    state.timer = window.setTimeout(() => {
      state.query = "";
    }, 500);

    const match = focusableIndices.find((i) => {
      const item = items[i] as DropdownItem;
      return typeof item.label === "string" && item.label.toLowerCase().startsWith(state.query);
    });
    if (match !== undefined) setActiveIndex(match);
  }

  function onMenuKeyDown(e: React.KeyboardEvent) {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        moveFocus(1);
        break;
      case "ArrowUp":
        e.preventDefault();
        moveFocus(-1);
        break;
      case "Home":
        e.preventDefault();
        if (focusableIndices.length) setActiveIndex(focusableIndices[0]);
        break;
      case "End":
        e.preventDefault();
        if (focusableIndices.length) setActiveIndex(focusableIndices[focusableIndices.length - 1]);
        break;
      case "Escape":
        e.preventDefault();
        closeMenu();
        break;
      case "Tab":
        closeMenu(false);
        break;
      default:
        if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
          runTypeahead(e.key);
        }
    }
  }

  function onTriggerKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openMenu(focusableIndices[0] ?? -1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      openMenu(focusableIndices[focusableIndices.length - 1] ?? -1);
    }
  }

  function toggle() {
    if (open) closeMenu();
    else openMenu(focusableIndices[0] ?? -1);
  }

  const triggerProps = {
    ref: (node: HTMLElement | null) => {
      triggerRef.current = node;
    },
    "aria-haspopup": "menu" as const,
    "aria-expanded": open,
    onClick: toggle,
    onKeyDown: onTriggerKeyDown,
  };

  const renderedTrigger = isValidElement(trigger) ? (
    cloneElement(trigger as ReactElement<Record<string, unknown>>, triggerProps)
  ) : (
    <button type="button" className="ml-dropdown-trigger" {...triggerProps}>
      {trigger}
    </button>
  );

  return (
    <div className={cn("ml-dropdown", className)} {...rest}>
      {renderedTrigger}
      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={menuRef}
            className="ml-dropdown-menu"
            role="menu"
            aria-orientation="vertical"
            data-placement={coords?.placement}
            style={{
              position: "fixed",
              top: coords?.top ?? -9999,
              left: coords?.left ?? -9999,
              minWidth: coords?.minWidth,
              visibility: coords ? "visible" : "hidden",
            }}
            onKeyDown={onMenuKeyDown}
          >
            {items.map((item, i) => {
              if (isSeparator(item)) {
                return <div key={`sep-${i}`} role="separator" className="ml-dropdown-separator" />;
              }
              const selected = item.value === active;
              return (
                <button
                  key={item.value}
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  type="button"
                  // aria-checked is only valid on menuitemradio/checkbox — when
                  // this Dropdown carries a selection (`active`), the items are a
                  // mutually-exclusive radio set (ARIA spec / APG).
                  role={active != null ? "menuitemradio" : "menuitem"}
                  aria-checked={active != null ? selected : undefined}
                  aria-disabled={item.disabled || undefined}
                  disabled={item.disabled}
                  tabIndex={i === activeIndex ? 0 : -1}
                  className={cn(
                    "ml-dropdown-item",
                    item.destructive && "ml-dropdown-item-destructive",
                    selected && "is-selected",
                  )}
                  onClick={() => {
                    if (item.disabled) return;
                    onSelect(item.value);
                    closeMenu();
                  }}
                  onMouseEnter={() => !item.disabled && setActiveIndex(i)}
                >
                  {item.icon != null && <span className="ml-dropdown-item-icon">{item.icon}</span>}
                  <span className="ml-dropdown-item-label">{item.label}</span>
                  {selected && (
                    <svg
                      className="ml-dropdown-item-check"
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M3 7.5L6 10.5L11 4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>,
          document.body,
        )}
    </div>
  );
}
