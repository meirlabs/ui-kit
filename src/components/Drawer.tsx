import {
  type ComponentPropsWithoutRef,
  type ReactNode,
  type RefObject,
  useEffect,
  useId,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "../utils/cn";
import { useFocusTrap } from "../hooks/useFocusTrap";
import { useScrollLock } from "../hooks/useScrollLock";

export type DrawerSide = "left" | "right" | "top" | "bottom";
export type DrawerSize = "sm" | "md" | "lg";

export interface DrawerProps extends Omit<ComponentPropsWithoutRef<"div">, "title"> {
  open: boolean;
  onClose: () => void;
  /** Edge the panel slides in from. Default `right`. */
  side?: DrawerSide;
  /** Panel size along its axis: sm ~320 · md ~420 · lg ~560. */
  size?: DrawerSize;
  title?: ReactNode;
  footer?: ReactNode;
  initialFocusRef?: RefObject<HTMLElement | null>;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

const EXIT_MS = 200;

function usePresence(open: boolean, duration: number) {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf);
    }
    setVisible(false);
    const t = setTimeout(() => setMounted(false), duration);
    return () => clearTimeout(t);
  }, [open, duration]);

  return { mounted, visible };
}

/**
 * Drawer — a slide-over panel for edit/detail flows without leaving context.
 * Portal + focus trap + scroll lock + backdrop, closes on Escape / overlay
 * click, returns focus on close. The panel translates in from `side` and
 * dissolves on exit; reduced-motion collapses to an instant fade (no transform).
 */
export function Drawer({
  open,
  onClose,
  side = "right",
  size = "md",
  title,
  footer,
  initialFocusRef,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className,
  children,
  ...rest
}: DrawerProps) {
  const titleId = useId();
  const { mounted, visible } = usePresence(open, EXIT_MS);

  const containerRef = useFocusTrap<HTMLDivElement>(open, {
    initialFocus: initialFocusRef,
  });
  useScrollLock(open);

  if (!mounted || typeof document === "undefined") return null;

  const state = visible ? "open" : "closed";

  return createPortal(
    <div
      className="ml-overlay ml-drawer-overlay"
      data-state={state}
      data-side={side}
      onClick={
        closeOnOverlayClick
          ? (e) => {
              if (e.target === e.currentTarget) onClose();
            }
          : undefined
      }
    >
      <div
        ref={containerRef}
        className={cn("ml-drawer", `ml-drawer-${size}`, className)}
        data-state={state}
        data-side={side}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
        onKeyDown={(e) => {
          if (closeOnEscape && e.key === "Escape") {
            e.stopPropagation();
            onClose();
          }
        }}
        {...rest}
      >
        {title && (
          <div className="ml-drawer-header">
            <h2 id={titleId} className="ml-drawer-title">
              {title}
            </h2>
            <button
              type="button"
              className="ml-drawer-close"
              onClick={onClose}
              aria-label="Close"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path
                  d="M3 3L11 11M3 11L11 3"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        )}
        <div className="ml-drawer-body">{children}</div>
        {footer && <div className="ml-drawer-footer">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
