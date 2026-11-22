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
import { type Direction, getDirection } from "../utils/direction";

/**
 * `start`/`end` follow the reading direction (`end` is the right edge in LTR,
 * the left edge in RTL); `left`/`right`/`top`/`bottom` are physical edges.
 */
export type DrawerSide = "start" | "end" | "left" | "right" | "top" | "bottom";
export type DrawerPhysicalSide = "left" | "right" | "top" | "bottom";
export type DrawerSize = "sm" | "md" | "lg";

/** Map a (possibly logical) `side` to the physical edge it means in `dir`. */
export function resolveDrawerSide(
  side: DrawerSide,
  dir: Direction,
): DrawerPhysicalSide {
  if (side === "start") return dir === "rtl" ? "right" : "left";
  if (side === "end") return dir === "rtl" ? "left" : "right";
  return side;
}

export interface DrawerProps extends Omit<ComponentPropsWithoutRef<"div">, "title"> {
  open: boolean;
  onClose: () => void;
  /**
   * Edge the panel slides in from. Default `end` (the right edge in LTR).
   * `start`/`end` resolve against the `dir` prop when given, otherwise against
   * the document's direction (the drawer portals into `document.body`).
   */
  side?: DrawerSide;
  /** Panel size along its axis: sm ~320 · md ~420 · lg ~560. */
  size?: DrawerSize;
  title?: ReactNode;
  footer?: ReactNode;
  initialFocusRef?: RefObject<HTMLElement | null>;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  /** Accessible name of the header close button. Default `"Close"`. */
  closeLabel?: string;
}

const EXIT_MS = 200;

/* The body reserves a stable scrollbar gutter. On machines with classic
   scrollbars that gutter would add to the end padding and push the content off
   the header/footer edge — so hand its width to the stylesheet, which takes it
   out of the padding. Overlay scrollbars measure 0. */
function reportBodyGutter(body: HTMLDivElement | null) {
  if (!body) return;
  const gutter = Math.max(0, body.offsetWidth - body.clientWidth);
  body.style.setProperty("--ml-drawer-gutter", `${gutter}px`);
}

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
 * `side="start" | "end"` mirror under RTL — anchoring, borders and the slide-in
 * direction all follow the resolved physical edge.
 */
export function Drawer({
  open,
  onClose,
  side = "end",
  size = "md",
  title,
  footer,
  initialFocusRef,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  closeLabel = "Close",
  className,
  children,
  dir,
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
  // Always a physical edge in the DOM, so the CSS never has to know direction.
  const physicalSide = resolveDrawerSide(
    side,
    dir === "rtl" || dir === "ltr" ? dir : getDirection(),
  );

  return createPortal(
    <div
      className="ml-overlay ml-drawer-overlay"
      data-state={state}
      data-side={physicalSide}
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
        data-side={physicalSide}
        dir={dir}
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
              aria-label={closeLabel}
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
        <div ref={reportBodyGutter} className="ml-drawer-body">
          {children}
        </div>
        {footer && <div className="ml-drawer-footer">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
