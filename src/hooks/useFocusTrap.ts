import { type RefObject, useEffect, useRef } from "react";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "area[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
  "[contenteditable='true']",
].join(",");

function isVisible(el: HTMLElement): boolean {
  if (el.hidden) return false;
  if (typeof getComputedStyle === "function") {
    const style = getComputedStyle(el);
    if (style.display === "none" || style.visibility === "hidden") return false;
  }
  return el.closest("[inert]") === null;
}

function getFocusable(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
  ).filter(isVisible);
}

export interface UseFocusTrapOptions {
  /** Element to focus first when the trap activates. Falls back to the first
   *  focusable descendant, then the container itself. */
  initialFocus?: RefObject<HTMLElement | null>;
  /** Return focus to the element that was focused before activation, on close.
   *  Default true. */
  returnFocus?: boolean;
}

/**
 * Traps Tab / Shift+Tab focus within the returned ref's element while `active`.
 *
 * On activation it records the currently focused element (the trigger),
 * autofocuses `initialFocus` (or the first focusable child, or the container),
 * and on deactivation returns focus to the trigger. Attach the returned ref to
 * the overlay panel and give that panel `tabIndex={-1}` so the container itself
 * is a valid focus fallback for empty overlays.
 *
 * SSR-safe: all work happens inside the effect.
 */
export function useFocusTrap<T extends HTMLElement = HTMLElement>(
  active: boolean,
  options: UseFocusTrapOptions = {},
): RefObject<T | null> {
  const { initialFocus, returnFocus = true } = options;
  const containerRef = useRef<T>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) return;
    const container = containerRef.current;
    if (!container || typeof document === "undefined") return;

    triggerRef.current = document.activeElement as HTMLElement | null;

    const target =
      initialFocus?.current ?? getFocusable(container)[0] ?? container;
    // Focus after the portal has painted; preventScroll avoids a jump.
    target.focus({ preventScroll: true });

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== "Tab") return;
      const node = containerRef.current;
      if (!node) return;

      const focusable = getFocusable(node);
      if (focusable.length === 0) {
        e.preventDefault();
        node.focus({ preventScroll: true });
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const activeEl = document.activeElement;

      if (e.shiftKey) {
        if (activeEl === first || !node.contains(activeEl)) {
          e.preventDefault();
          last.focus();
        }
      } else if (activeEl === last || !node.contains(activeEl)) {
        e.preventDefault();
        first.focus();
      }
    }

    container.addEventListener("keydown", handleKeyDown);
    return () => {
      container.removeEventListener("keydown", handleKeyDown);
      if (returnFocus && triggerRef.current && document.contains(triggerRef.current)) {
        triggerRef.current.focus({ preventScroll: true });
      }
    };
  }, [active, initialFocus, returnFocus]);

  return containerRef;
}
