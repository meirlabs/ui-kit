import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "../utils/cn";

export interface SelectionToolbarAction {
  /** Stable key for the action. */
  id: string;
  /** Visible and accessible label. */
  label: string;
  /** Optional leading icon (decorative — the visible label carries meaning). */
  icon?: ReactNode;
  /** Called with the currently selected text when this action is chosen. */
  onSelect: (selectedText: string) => void;
  disabled?: boolean;
}

export interface SelectionToolbarProps {
  /** The element to watch for text selections; selections outside it are ignored. */
  containerRef: RefObject<HTMLElement | null>;
  /** Actions rendered as buttons, in order. */
  actions: SelectionToolbarAction[];
  /** Minimum selected character count (after trimming) before the toolbar appears. Defaults to `1`. */
  minLength?: number;
  /** Accessible name for the toolbar (e.g. `"Text selection actions"`). */
  "aria-label": string;
  className?: string;
}

interface SelectionState {
  text: string;
  rect: DOMRect;
}

const isBrowser = typeof document !== "undefined";

/**
 * SelectionToolbar — a floating action bar that appears above (or below, if
 * clipped) a text selection inside `containerRef`, e.g. "Explain / Improve /
 * Shorten" actions over highlighted text. Unlike {@link Popover} or
 * {@link Tooltip}, it anchors to a live selection `Range`, not a persistent
 * element, so it re-measures on every `selectionchange` and dismisses on
 * scroll, resize, outside pointer-down, or Escape.
 *
 * Buttons sit in normal tab order (no roving-tabindex — this is a small,
 * transient bar, not a full menu). `prefers-reduced-motion` is respected by
 * the CSS in `selection-toolbar.css` (no motion is used here beyond that).
 */
export function SelectionToolbar({
  containerRef,
  actions,
  minLength = 1,
  "aria-label": ariaLabel,
  className,
}: SelectionToolbarProps) {
  const toolbarRef = useRef<HTMLDivElement | null>(null);
  const [selection, setSelection] = useState<SelectionState | null>(null);
  const [placement, setPlacement] = useState<{
    top: number;
    left: number;
    visible: boolean;
  }>({ top: 0, left: 0, visible: false });

  const dismiss = useCallback(() => setSelection(null), []);

  // Track the live selection, scoped to containerRef.
  useEffect(() => {
    if (!isBrowser) return;

    const onSelectionChange = () => {
      const sel = document.getSelection();
      const container = containerRef.current;
      if (!sel || sel.isCollapsed || !container) {
        dismiss();
        return;
      }
      const text = sel.toString();
      if (text.trim().length < minLength) {
        dismiss();
        return;
      }
      const anchorNode = sel.anchorNode;
      const focusNode = sel.focusNode;
      if (
        !anchorNode ||
        !focusNode ||
        !container.contains(anchorNode) ||
        !container.contains(focusNode)
      ) {
        dismiss();
        return;
      }
      const rect = sel.getRangeAt(0).getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) {
        dismiss();
        return;
      }
      setSelection({ text, rect });
    };

    document.addEventListener("selectionchange", onSelectionChange);
    return () => document.removeEventListener("selectionchange", onSelectionChange);
  }, [containerRef, minLength, dismiss]);

  // Measure the toolbar and place it above the selection, flipping below and
  // clamping to the viewport when it would overflow — same intent as
  // useAnchoredPosition, simplified for a Range rect instead of an element.
  useLayoutEffect(() => {
    if (!selection) {
      setPlacement((p) => (p.visible ? { top: 0, left: 0, visible: false } : p));
      return;
    }
    const el = toolbarRef.current;
    if (!el) return;

    const { rect } = selection;
    const tw = el.offsetWidth;
    const th = el.offsetHeight;
    const vw = document.documentElement.clientWidth;
    const vh = window.innerHeight;
    const pad = 8;
    const gap = 8;

    const fitsAbove = rect.top - gap - th >= pad;
    const top = fitsAbove ? rect.top - gap - th : rect.bottom + gap;
    const clampedTop = Math.min(Math.max(top, pad), Math.max(pad, vh - th - pad));
    const left = rect.left + rect.width / 2 - tw / 2;
    const clampedLeft = Math.min(Math.max(left, pad), Math.max(pad, vw - tw - pad));

    setPlacement({ top: clampedTop, left: clampedLeft, visible: true });
  }, [selection]);

  // Dismiss on Escape, outside pointer-down, or scroll/resize (selection UIs
  // like this don't track scroll — they close, matching e.g. Google Docs).
  useEffect(() => {
    if (!selection || !isBrowser) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    const onPointerDown = (e: PointerEvent) => {
      if (toolbarRef.current?.contains(e.target as Node)) return;
      dismiss();
    };
    const onScrollOrResize = () => dismiss();

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [selection, dismiss]);

  if (!selection || !isBrowser) return null;

  const { text } = selection;

  return createPortal(
    <div
      ref={toolbarRef}
      role="toolbar"
      aria-label={ariaLabel}
      className={cn("ml-selection-toolbar", className)}
      style={{
        position: "fixed",
        top: placement.top,
        left: placement.left,
        visibility: placement.visible ? "visible" : "hidden",
        zIndex: "var(--ml-z-popover, 1200)" as unknown as number,
      }}
      // A mousedown on the toolbar would otherwise collapse the live text
      // selection before the click's onSelect can read it.
      onMouseDown={(e) => e.preventDefault()}
    >
      {actions.map((action) => (
        <button
          key={action.id}
          type="button"
          className="ml-selection-toolbar-action"
          disabled={action.disabled}
          onClick={() => {
            action.onSelect(text);
            dismiss();
          }}
        >
          {action.icon && (
            <span className="ml-selection-toolbar-icon" aria-hidden="true">
              {action.icon}
            </span>
          )}
          {action.label}
        </button>
      ))}
    </div>,
    document.body,
  );
}
