import {
  type ReactElement,
  type ReactNode,
  type Ref,
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "../utils/cn";
import {
  type AnchoredPlacement,
  useAnchoredPosition,
} from "../hooks/useAnchoredPosition";

export interface TooltipProps {
  /** Tooltip body. Keep it short and non-interactive (use Popover for panels). */
  content: ReactNode;
  /** A single focusable element the tooltip describes. */
  children: ReactElement;
  /** Preferred placement. Defaults to `"top"`. */
  placement?: AnchoredPlacement;
  /** Open delay in ms (hover/focus). Defaults to `300`. */
  delay?: number;
  /** Close delay in ms. Defaults to `60`. */
  closeDelay?: number;
  /** Suppress the tooltip entirely (child still renders). */
  disabled?: boolean;
  /** Class applied to the tooltip surface. */
  className?: string;
}

const isBrowser = typeof document !== "undefined";

/** Merge our ref onto whatever ref the child element already carries. */
function setRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (typeof ref === "function") ref(value);
  else if (ref && typeof ref === "object") {
    (ref as { current: T | null }).current = value;
  }
}

/**
 * Tooltip — a small dark label shown on hover **and** keyboard focus, wired to
 * its child via `aria-describedby`. Never traps focus and never holds
 * interactive content; reach for {@link Popover} when the panel needs to be
 * clicked into.
 */
export function Tooltip({
  content,
  children,
  placement = "top",
  delay = 300,
  closeDelay = 60,
  disabled = false,
  className,
}: TooltipProps) {
  const id = useId();
  const anchorRef = useRef<HTMLElement | null>(null);
  const floatingRef = useRef<HTMLDivElement | null>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [open, setOpen] = useState(false);
  // Kept mounted briefly through the exit transition.
  const [mounted, setMounted] = useState(false);

  const { floatingStyle, placement: resolved } = useAnchoredPosition(
    anchorRef,
    floatingRef,
    { open: mounted, placement, offset: 6 },
  );

  const clearTimers = useCallback(() => {
    if (openTimer.current) clearTimeout(openTimer.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);
    openTimer.current = null;
    closeTimer.current = null;
  }, []);

  const show = useCallback(() => {
    if (disabled) return;
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMounted(true);
    openTimer.current = setTimeout(() => setOpen(true), delay);
  }, [disabled, delay]);

  const hide = useCallback(
    (immediate = false) => {
      if (openTimer.current) clearTimeout(openTimer.current);
      setOpen(false);
      closeTimer.current = setTimeout(() => setMounted(false), immediate ? 0 : 200);
    },
    [],
  );

  useEffect(() => clearTimers, [clearTimers]);

  // Global Escape dismiss while visible.
  useEffect(() => {
    if (!mounted) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") hide(true);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mounted, hide]);

  if (!isValidElement(children)) return children ?? null;

  const child = children as ReactElement<Record<string, unknown>>;
  const childProps = child.props;
  const describedBy = disabled
    ? childProps["aria-describedby"]
    : [childProps["aria-describedby"], id].filter(Boolean).join(" ");

  const trigger = cloneElement(child, {
    "aria-describedby": describedBy || undefined,
    ref: (node: HTMLElement | null) => {
      anchorRef.current = node;
      setRef(
        (child as unknown as { ref?: Ref<HTMLElement> }).ref,
        node,
      );
    },
    onMouseEnter: (e: MouseEvent) => {
      (childProps.onMouseEnter as ((e: MouseEvent) => void) | undefined)?.(e);
      show();
    },
    onMouseLeave: (e: MouseEvent) => {
      (childProps.onMouseLeave as ((e: MouseEvent) => void) | undefined)?.(e);
      hide();
    },
    onFocus: (e: FocusEvent) => {
      (childProps.onFocus as ((e: FocusEvent) => void) | undefined)?.(e);
      show();
    },
    onBlur: (e: FocusEvent) => {
      (childProps.onBlur as ((e: FocusEvent) => void) | undefined)?.(e);
      hide(true);
    },
  } as Record<string, unknown>);

  return (
    <>
      {trigger}
      {isBrowser && mounted && !disabled
        ? createPortal(
            <div
              ref={floatingRef}
              role="tooltip"
              id={id}
              className={cn("ml-tooltip", className)}
              data-placement={resolved}
              data-open={open ? "true" : "false"}
              style={{
                ...floatingStyle,
                zIndex: "var(--ml-z-tooltip, 1080)" as unknown as number,
              }}
              // Let the pointer pass through so leaving the anchor always closes.
              onMouseEnter={() => {
                if (closeTimer.current) clearTimeout(closeTimer.current);
              }}
              onMouseLeave={() => hide()}
            >
              {content}
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
