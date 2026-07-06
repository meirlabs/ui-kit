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

export type ModalSize = "sm" | "md" | "lg" | "fullscreen";

export interface ModalProps extends Omit<ComponentPropsWithoutRef<"div">, "title"> {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  /** Optional supporting copy under the title; wired to `aria-describedby`. */
  description?: ReactNode;
  /** Rendered in the bottom action bar (`.ml-modal-footer`). */
  footer?: ReactNode;
  /** Panel width: sm ~400px · md ~560px · lg ~760px · fullscreen 100vw. */
  size?: ModalSize;
  /** Focus this element on open instead of the first focusable child. */
  initialFocusRef?: RefObject<HTMLElement | null>;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

const EXIT_MS = 200;

/** Mount/unmount with an entrance + exit transition window. */
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
 * Modal — a centered, focus-trapped dialog rendered in a portal on
 * `document.body`. Locks body scroll, closes on Escape / overlay click, and
 * returns focus to the trigger on close. Entrance fades + lifts (scale/blur);
 * exit dissolves; both reduced-motion guarded via CSS.
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  footer,
  size = "md",
  initialFocusRef,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className,
  children,
  ...rest
}: ModalProps) {
  const titleId = useId();
  const descId = useId();
  const { mounted, visible } = usePresence(open, EXIT_MS);

  const containerRef = useFocusTrap<HTMLDivElement>(open, {
    initialFocus: initialFocusRef,
  });
  useScrollLock(open);

  if (!mounted || typeof document === "undefined") return null;

  const state = visible ? "open" : "closed";

  return createPortal(
    <div
      className="ml-overlay"
      data-state={state}
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
        className={cn("ml-modal", `ml-modal-${size}`, className)}
        data-state={state}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descId : undefined}
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
          <div className="ml-modal-header">
            <h2 id={titleId} className="ml-modal-title">
              {title}
            </h2>
            <button
              type="button"
              className="ml-modal-close"
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
        <div className="ml-modal-body">
          {description && (
            <p id={descId} className="ml-modal-description">
              {description}
            </p>
          )}
          {children}
        </div>
        {footer && <div className="ml-modal-footer">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
