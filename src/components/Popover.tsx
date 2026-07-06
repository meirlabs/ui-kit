import {
  type ComponentPropsWithoutRef,
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "../utils/cn";
import {
  type AnchoredPlacement,
  useAnchoredPosition,
} from "../hooks/useAnchoredPosition";

const isBrowser = typeof document !== "undefined";

const FOCUSABLE =
  'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

interface PopoverContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  anchorRef: React.RefObject<HTMLElement | null>;
  triggerId: string;
  contentId: string;
  placement: AnchoredPlacement;
}

const PopoverContext = createContext<PopoverContextValue | null>(null);

function usePopover(component: string): PopoverContextValue {
  const ctx = useContext(PopoverContext);
  if (!ctx) {
    throw new Error(`${component} must be used within <Popover>`);
  }
  return ctx;
}

export interface PopoverProps {
  children: ReactNode;
  /** Controlled open state. */
  open?: boolean;
  /** Called when the open state should change. */
  onOpenChange?: (open: boolean) => void;
  /** Initial open state (uncontrolled). */
  defaultOpen?: boolean;
  /** Preferred placement. Defaults to `"bottom-start"`. */
  placement?: AnchoredPlacement;
  /**
   * External anchor to position against instead of `Popover.Trigger`. Supply
   * this when using controlled mode without a rendered trigger.
   */
  anchor?: React.RefObject<HTMLElement | null>;
}

/**
 * Popover — anchored, interactive panel (`role="dialog"`) for filters, inline
 * forms, or date pickers. Focus moves into the panel on open; Escape and
 * click-outside close it and return focus to the trigger. Use {@link Tooltip}
 * for non-interactive labels.
 */
export function Popover({
  children,
  open: controlledOpen,
  onOpenChange,
  defaultOpen = false,
  placement = "bottom-start",
  anchor,
}: PopoverProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = controlledOpen != null;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const internalAnchor = useRef<HTMLElement | null>(null);
  const anchorRef = anchor ?? internalAnchor;
  const triggerId = useId();
  const contentId = useId();

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  const value = useMemo<PopoverContextValue>(
    () => ({ open, setOpen, anchorRef, triggerId, contentId, placement }),
    [open, setOpen, anchorRef, triggerId, contentId, placement],
  );

  return <PopoverContext.Provider value={value}>{children}</PopoverContext.Provider>;
}

export interface PopoverTriggerProps extends ComponentPropsWithoutRef<"button"> {}

function PopoverTrigger({
  className,
  onClick,
  children,
  ...rest
}: PopoverTriggerProps) {
  const { open, setOpen, anchorRef, triggerId, contentId } =
    usePopover("Popover.Trigger");

  return (
    <button
      type="button"
      id={triggerId}
      ref={(node) => {
        anchorRef.current = node;
      }}
      className={cn("ml-popover-trigger", className)}
      aria-haspopup="dialog"
      aria-expanded={open}
      aria-controls={open ? contentId : undefined}
      onClick={(e) => {
        onClick?.(e);
        setOpen(!open);
      }}
      {...rest}
    >
      {children}
    </button>
  );
}

export interface PopoverContentProps extends ComponentPropsWithoutRef<"div"> {
  /** Accessible name for the dialog. */
  "aria-label"?: string;
}

function PopoverContent({
  className,
  children,
  style,
  "aria-label": ariaLabel,
  ...rest
}: PopoverContentProps) {
  const { open, setOpen, anchorRef, triggerId, contentId, placement } =
    usePopover("Popover.Content");
  const floatingRef = useRef<HTMLDivElement | null>(null);

  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);

  const { floatingStyle, placement: resolved } = useAnchoredPosition(
    anchorRef,
    floatingRef,
    { open: mounted, placement, offset: 8 },
  );

  // Mount/unmount around the enter/exit transition.
  useEffect(() => {
    if (open) {
      setMounted(true);
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf);
    }
    setVisible(false);
    const t = setTimeout(() => setMounted(false), 200);
    return () => clearTimeout(t);
  }, [open]);

  // Focus management: move focus in on open, restore to trigger on close.
  useEffect(() => {
    if (!mounted || !open) return;
    const panel = floatingRef.current;
    if (!panel) return;
    const restore = anchorRef.current;
    const first = panel.querySelector<HTMLElement>(FOCUSABLE);
    (first ?? panel).focus({ preventScroll: true });
    return () => {
      restore?.focus({ preventScroll: true });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, open]);

  // Escape + click-outside dismiss, and a lightweight focus trap on Tab.
  useEffect(() => {
    if (!mounted || !open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const panel = floatingRef.current;
      if (!panel) return;
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      );
      if (items.length === 0) {
        e.preventDefault();
        panel.focus({ preventScroll: true });
        return;
      }
      const firstEl = items[0];
      const lastEl = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === firstEl || active === panel)) {
        e.preventDefault();
        lastEl.focus({ preventScroll: true });
      } else if (!e.shiftKey && active === lastEl) {
        e.preventDefault();
        firstEl.focus({ preventScroll: true });
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      const panel = floatingRef.current;
      const target = e.target as Node;
      if (panel?.contains(target)) return;
      if (anchorRef.current?.contains(target)) return;
      setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown, true);
    document.addEventListener("pointerdown", onPointerDown, true);
    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      document.removeEventListener("pointerdown", onPointerDown, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, open]);

  if (!isBrowser || !mounted) return null;

  return createPortal(
    <div
      ref={floatingRef}
      id={contentId}
      role="dialog"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabel ? undefined : triggerId}
      tabIndex={-1}
      className={cn("ml-popover", className)}
      data-placement={resolved}
      data-open={visible ? "true" : "false"}
      style={{
        ...floatingStyle,
        ...style,
        zIndex: "var(--ml-z-popover, 1070)" as unknown as number,
      }}
      {...rest}
    >
      {children}
    </div>,
    document.body,
  );
}

Popover.Trigger = PopoverTrigger;
Popover.Content = PopoverContent;
