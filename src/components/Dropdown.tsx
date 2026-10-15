import {
  type ComponentPropsWithoutRef,
  type ReactElement,
  type ReactNode,
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useId,
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
  /**
   * Nested items — renders this item as a submenu trigger instead of a
   * selectable action (its own `onSelect` never fires). Opens on hover with a
   * triangle "safe zone": while the cursor is moving from the trigger toward
   * the open submenu, brief diagonal drift off the trigger doesn't close it.
   * Only one level of nesting is supported; `items` on a submenu item is
   * ignored.
   */
  items?: DropdownMenuItem[];
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

function hasSubmenu(
  item: DropdownMenuItem,
): item is DropdownItem & { items: DropdownMenuItem[] } {
  return !isSeparator(item) && !!item.items && item.items.length > 0;
}

function focusableIndicesOf(list: DropdownMenuItem[]) {
  return list
    .map((item, i) => (!isSeparator(item) && !item.disabled ? i : -1))
    .filter((i) => i !== -1);
}

/** Sign of the cross product — used by {@link pointInTriangle}. */
function sign(p1: [number, number], p2: [number, number], p3: [number, number]) {
  return (p1[0] - p3[0]) * (p2[1] - p3[1]) - (p2[0] - p3[0]) * (p1[1] - p3[1]);
}

function pointInTriangle(
  pt: [number, number],
  a: [number, number],
  b: [number, number],
  c: [number, number],
) {
  const d1 = sign(pt, a, b);
  const d2 = sign(pt, b, c);
  const d3 = sign(pt, c, a);
  const hasNeg = d1 < 0 || d2 < 0 || d3 < 0;
  const hasPos = d1 > 0 || d2 > 0 || d3 > 0;
  return !(hasNeg && hasPos);
}

interface Coords {
  top: number;
  left: number;
  minWidth: number;
  placement: "top" | "bottom";
}

interface SubmenuCoords {
  top: number;
  left: number;
  placement: "left" | "right";
}

interface SafeZone {
  apex: [number, number];
  near: [number, number];
  far: [number, number];
  /** Epoch ms after which the zone stops protecting the submenu, even if the
   *  cursor never generates a move event that lands outside the triangle
   *  (e.g. it comes to rest exactly on the boundary) — keeps a stalled
   *  pointer from pinning a submenu open indefinitely. */
  expires: number;
}

const SUBMENU_CLOSE_DELAY = 250;
const SAFE_ZONE_MAX_LIFETIME = SUBMENU_CLOSE_DELAY * 4;

function ChevronRight() {
  return (
    <svg
      className="ml-dropdown-item-chevron"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 3l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Dropdown — an accessible menu button. The trigger is a real button (or cloned
 * to gain button semantics) exposing `aria-haspopup="menu"` + `aria-expanded`;
 * the menu renders in a portal (`role="menu"`) with full keyboard support:
 * Arrow roving focus, Home/End, typeahead, Enter/Space to activate, Escape/Tab
 * to close (Escape returns focus to the trigger). Closes on outside click.
 *
 * Items may carry nested `items` to render as a submenu, opened on hover or
 * with ArrowRight/Enter. A triangle safe zone keeps the submenu open while
 * the cursor is moving diagonally toward it (see `handleItemMouseLeave`).
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
  const uid = useId();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [coords, setCoords] = useState<Coords | null>(null);

  const [submenuOpenIndex, setSubmenuOpenIndex] = useState<number | null>(null);
  const [submenuActiveIndex, setSubmenuActiveIndex] = useState(-1);
  const [submenuCoords, setSubmenuCoords] = useState<SubmenuCoords | null>(null);

  const triggerRef = useRef<HTMLElement | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const typeahead = useRef({ query: "", timer: 0 });

  const submenuRef = useRef<HTMLDivElement>(null);
  const submenuItemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const submenuTypeahead = useRef({ query: "", timer: 0 });
  const closeTimerRef = useRef<number | undefined>(undefined);
  const safeZoneRef = useRef<SafeZone | null>(null);
  const hoveredIndexRef = useRef<number | null>(null);
  const submenuRectRef = useRef<{ left: number; right: number; top: number; bottom: number } | null>(
    null,
  );
  const submenuPlacementRef = useRef<"left" | "right">("right");

  const focusableIndices = focusableIndicesOf(items);
  const openSubmenuItems =
    submenuOpenIndex !== null && hasSubmenu(items[submenuOpenIndex])
      ? (items[submenuOpenIndex] as DropdownItem).items!
      : [];
  const submenuFocusableIndices = focusableIndicesOf(openSubmenuItems);

  const openMenu = useCallback((index: number) => {
    setOpen(true);
    setActiveIndex(index);
  }, []);

  const closeMenu = useCallback((returnFocus = true) => {
    window.clearTimeout(closeTimerRef.current);
    safeZoneRef.current = null;
    setOpen(false);
    setActiveIndex(-1);
    setSubmenuOpenIndex(null);
    setSubmenuActiveIndex(-1);
    if (returnFocus) triggerRef.current?.focus();
  }, []);

  function scheduleClose() {
    window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = window.setTimeout(function tick() {
      // Still inside the safe zone (cursor moving toward the submenu) —
      // hold open and re-check shortly rather than closing underneath it,
      // unless the zone has outlived its max lifetime (stalled cursor).
      if (safeZoneRef.current && Date.now() < safeZoneRef.current.expires) {
        closeTimerRef.current = window.setTimeout(tick, SUBMENU_CLOSE_DELAY);
        return;
      }
      safeZoneRef.current = null;
      setSubmenuOpenIndex(null);
      setSubmenuActiveIndex(-1);
    }, SUBMENU_CLOSE_DELAY);
  }

  function openSubmenu(index: number, focusFirst = false) {
    window.clearTimeout(closeTimerRef.current);
    safeZoneRef.current = null;
    setSubmenuOpenIndex(index);
    if (!focusFirst) {
      setSubmenuActiveIndex(-1);
      return;
    }
    // Compute against the target item directly — `submenuFocusableIndices`
    // is closed over the *currently* open submenu, which is stale here when
    // switching from one open submenu to another (or opening the first one).
    const targetItem = items[index];
    const targetItems = hasSubmenu(targetItem) ? targetItem.items : [];
    setSubmenuActiveIndex(focusableIndicesOf(targetItems)[0] ?? -1);
  }

  function closeSubmenu(returnFocus = true) {
    window.clearTimeout(closeTimerRef.current);
    safeZoneRef.current = null;
    const idx = submenuOpenIndex;
    setSubmenuOpenIndex(null);
    setSubmenuActiveIndex(-1);
    if (returnFocus && idx !== null) {
      setActiveIndex(idx);
      itemRefs.current[idx]?.focus();
    }
  }

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

  // Measure + place the submenu against its trigger item, flipping to the
  // left edge when it would overflow the viewport on the right.
  useLayoutEffect(() => {
    if (submenuOpenIndex === null) return;
    const triggerEl = itemRefs.current[submenuOpenIndex];
    const submenuEl = submenuRef.current;
    if (!triggerEl || !submenuEl) return;

    function place() {
      if (!triggerEl || !submenuEl) return;
      const rect = triggerEl.getBoundingClientRect();
      const subW = submenuEl.offsetWidth;
      const subH = submenuEl.offsetHeight;
      const gap = 4;
      const margin = 8;
      const spaceRight = window.innerWidth - rect.right;

      const placeLeft = spaceRight < subW + gap + margin && rect.left > subW + gap + margin;
      const left = placeLeft ? rect.left - subW - gap : rect.right + gap;
      const top = Math.max(margin, Math.min(rect.top, window.innerHeight - subH - margin));

      submenuPlacementRef.current = placeLeft ? "left" : "right";
      submenuRectRef.current = { left, right: left + subW, top, bottom: top + subH };
      setSubmenuCoords({ top, left, placement: placeLeft ? "left" : "right" });
    }

    place();
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
    };
  }, [submenuOpenIndex, openSubmenuItems.length]);

  // Roving focus: move DOM focus to the active item.
  useEffect(() => {
    if (open && submenuOpenIndex === null && activeIndex >= 0) {
      itemRefs.current[activeIndex]?.focus();
    }
  }, [open, activeIndex, submenuOpenIndex]);

  useEffect(() => {
    if (submenuOpenIndex !== null && submenuActiveIndex >= 0) {
      submenuItemRefs.current[submenuActiveIndex]?.focus();
    }
  }, [submenuOpenIndex, submenuActiveIndex]);

  // Close on outside click (root menu, submenu, or trigger are all "inside").
  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent) {
      const target = e.target as Node;
      if (menuRef.current?.contains(target)) return;
      if (submenuRef.current?.contains(target)) return;
      if (triggerRef.current?.contains(target)) return;
      closeMenu(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open, closeMenu]);

  // Triangle safe zone: while the cursor stays inside the triangle formed by
  // the point it left the trigger at and the submenu's near-side corners,
  // treat it as "moving toward the submenu" and never let it fall outside
  // the zone unnoticed. Breaking out clears the zone so the pending close
  // (scheduled on mouseleave) or a newly-hovered trigger can take over.
  useEffect(() => {
    if (submenuOpenIndex === null) return;
    function onMove(e: MouseEvent) {
      const zone = safeZoneRef.current;
      if (!zone) return;
      if (!pointInTriangle([e.clientX, e.clientY], zone.apex, zone.near, zone.far)) {
        safeZoneRef.current = null;
      }
    }
    document.addEventListener("mousemove", onMove);
    return () => document.removeEventListener("mousemove", onMove);
  }, [submenuOpenIndex]);

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

  function moveSubmenuFocus(dir: 1 | -1) {
    if (submenuFocusableIndices.length === 0) return;
    const pos = submenuFocusableIndices.indexOf(submenuActiveIndex);
    const nextPos =
      pos === -1
        ? dir === 1
          ? 0
          : submenuFocusableIndices.length - 1
        : (pos + dir + submenuFocusableIndices.length) % submenuFocusableIndices.length;
    setSubmenuActiveIndex(submenuFocusableIndices[nextPos]);
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

  function runSubmenuTypeahead(char: string) {
    const state = submenuTypeahead.current;
    window.clearTimeout(state.timer);
    state.query += char.toLowerCase();
    state.timer = window.setTimeout(() => {
      state.query = "";
    }, 500);

    const match = submenuFocusableIndices.find((i) => {
      const item = openSubmenuItems[i] as DropdownItem;
      return typeof item.label === "string" && item.label.toLowerCase().startsWith(state.query);
    });
    if (match !== undefined) setSubmenuActiveIndex(match);
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
      case "ArrowRight": {
        const item = items[activeIndex];
        if (item && hasSubmenu(item)) {
          e.preventDefault();
          openSubmenu(activeIndex, true);
        }
        break;
      }
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

  function onSubmenuKeyDown(e: React.KeyboardEvent) {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        moveSubmenuFocus(1);
        break;
      case "ArrowUp":
        e.preventDefault();
        moveSubmenuFocus(-1);
        break;
      case "Home":
        e.preventDefault();
        if (submenuFocusableIndices.length) setSubmenuActiveIndex(submenuFocusableIndices[0]);
        break;
      case "End":
        e.preventDefault();
        if (submenuFocusableIndices.length)
          setSubmenuActiveIndex(submenuFocusableIndices[submenuFocusableIndices.length - 1]);
        break;
      case "ArrowLeft":
      case "Escape":
        e.preventDefault();
        closeSubmenu();
        break;
      case "Tab":
        closeMenu(false);
        break;
      default:
        if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
          runSubmenuTypeahead(e.key);
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

  function handleItemMouseEnter(i: number, item: DropdownItem) {
    hoveredIndexRef.current = i;
    if (item.disabled) return;
    setActiveIndex(i);
    if (!hasSubmenu(item)) {
      // Hovering a plain item while a sibling submenu is open — close it,
      // unless the cursor is still inside the safe zone heading toward it.
      if (submenuOpenIndex !== null && !safeZoneRef.current) {
        scheduleClose();
      }
      return;
    }
    if (submenuOpenIndex === i) {
      window.clearTimeout(closeTimerRef.current);
      safeZoneRef.current = null;
      return;
    }
    if (safeZoneRef.current) return; // still moving toward the currently-open submenu
    openSubmenu(i);
  }

  function handleItemMouseLeave(i: number, e: React.MouseEvent) {
    if (submenuOpenIndex !== i) return;
    const rect = submenuRectRef.current;
    if (rect) {
      const nearX = submenuPlacementRef.current === "right" ? rect.left : rect.right;
      safeZoneRef.current = {
        apex: [e.clientX, e.clientY],
        near: [nearX, rect.top],
        far: [nearX, rect.bottom],
        expires: Date.now() + SAFE_ZONE_MAX_LIFETIME,
      };
    }
    scheduleClose();
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
              const itemHasSubmenu = hasSubmenu(item);
              const itemId = `${uid}-item-${i}`;
              return (
                <button
                  key={item.value}
                  id={itemId}
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  type="button"
                  // aria-checked is only valid on menuitemradio/checkbox — when
                  // this Dropdown carries a selection (`active`), the items are a
                  // mutually-exclusive radio set (ARIA spec / APG).
                  role={active != null && !itemHasSubmenu ? "menuitemradio" : "menuitem"}
                  aria-checked={active != null && !itemHasSubmenu ? selected : undefined}
                  aria-disabled={item.disabled || undefined}
                  aria-haspopup={itemHasSubmenu ? "menu" : undefined}
                  aria-expanded={itemHasSubmenu ? submenuOpenIndex === i : undefined}
                  disabled={item.disabled}
                  tabIndex={i === activeIndex ? 0 : -1}
                  className={cn(
                    "ml-dropdown-item",
                    item.destructive && "ml-dropdown-item-destructive",
                    selected && "is-selected",
                  )}
                  onClick={() => {
                    if (item.disabled) return;
                    if (itemHasSubmenu) {
                      if (submenuOpenIndex === i) closeSubmenu(false);
                      else openSubmenu(i, true);
                      return;
                    }
                    onSelect(item.value);
                    closeMenu();
                  }}
                  onMouseEnter={() => handleItemMouseEnter(i, item)}
                  onMouseLeave={(e) => handleItemMouseLeave(i, e)}
                >
                  {item.icon != null && <span className="ml-dropdown-item-icon">{item.icon}</span>}
                  <span className="ml-dropdown-item-label">{item.label}</span>
                  {selected && !itemHasSubmenu && (
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
                  {itemHasSubmenu && <ChevronRight />}
                </button>
              );
            })}
          </div>,
          document.body,
        )}
      {submenuOpenIndex !== null &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={submenuRef}
            className="ml-dropdown-menu ml-dropdown-submenu"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby={`${uid}-item-${submenuOpenIndex}`}
            data-placement={submenuCoords?.placement}
            style={{
              position: "fixed",
              top: submenuCoords?.top ?? -9999,
              left: submenuCoords?.left ?? -9999,
              visibility: submenuCoords ? "visible" : "hidden",
            }}
            onKeyDown={onSubmenuKeyDown}
            onMouseEnter={() => {
              window.clearTimeout(closeTimerRef.current);
              safeZoneRef.current = null;
            }}
            onMouseLeave={() => scheduleClose()}
          >
            {openSubmenuItems.map((item, i) => {
              if (isSeparator(item)) {
                return <div key={`sub-sep-${i}`} role="separator" className="ml-dropdown-separator" />;
              }
              const selected = item.value === active;
              return (
                <button
                  key={item.value}
                  ref={(el) => {
                    submenuItemRefs.current[i] = el;
                  }}
                  type="button"
                  role={active != null ? "menuitemradio" : "menuitem"}
                  aria-checked={active != null ? selected : undefined}
                  aria-disabled={item.disabled || undefined}
                  disabled={item.disabled}
                  tabIndex={i === submenuActiveIndex ? 0 : -1}
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
                  onMouseEnter={() => {
                    if (!item.disabled) setSubmenuActiveIndex(i);
                  }}
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
