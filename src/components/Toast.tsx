import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "../utils/cn";
import type { ToastItem } from "../hooks/useToast";

export type ToastPlacement =
  | "bottom-right"
  | "bottom-left"
  | "bottom-center"
  | "top-right"
  | "top-left"
  | "top-center";

const toneClass: Record<ToastItem["tone"], string> = {
  neutral: "ml-toast-neutral",
  success: "ml-toast-success",
  warning: "ml-toast-warning",
  danger: "ml-toast-danger",
};

interface ToastProps {
  toast: ToastItem;
  onDismiss: (id: string) => void;
  onPause: (id: string) => void;
  onResume: (id: string) => void;
}

/**
 * Toast — a single transient message. Enters with a slide+fade (driven by the
 * `data-state` flip on mount), exits by dissolving. Hover/focus pause the
 * parent's auto-dismiss timer. Danger tones assert (`role="alert"`); all others
 * announce politely (`role="status"`).
 */
function Toast({ toast, onDismiss, onPause, onResume }: ToastProps) {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const state = toast.dismissing ? "closed" : entered ? "open" : "closed";
  const assertive = toast.tone === "danger";

  return (
    <li
      className={cn("ml-toast", toneClass[toast.tone])}
      data-state={state}
      role={assertive ? "alert" : "status"}
      aria-live={assertive ? "assertive" : "polite"}
      aria-atomic="true"
      onMouseEnter={() => onPause(toast.id)}
      onMouseLeave={() => onResume(toast.id)}
      onFocus={() => onPause(toast.id)}
      onBlur={() => onResume(toast.id)}
    >
      <div className="ml-toast-content">
        <p className="ml-toast-title">{toast.title}</p>
        {toast.description != null && (
          <p className="ml-toast-description">{toast.description}</p>
        )}
      </div>
      {toast.action && (
        <button
          type="button"
          className="ml-toast-action"
          onClick={() => {
            toast.action!.onClick();
            onDismiss(toast.id);
          }}
        >
          {toast.action.label}
        </button>
      )}
      <button
        type="button"
        className="ml-toast-close"
        aria-label="Dismiss notification"
        onClick={() => onDismiss(toast.id)}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path
            d="M3.5 3.5L10.5 10.5M3.5 10.5L10.5 3.5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </li>
  );
}

export interface ToasterProps {
  toasts: ToastItem[];
  placement?: ToastPlacement;
  onDismiss: (id: string) => void;
  onPause: (id: string) => void;
  onResume: (id: string) => void;
  /** Accessible name for the notification region. */
  label?: string;
}

/**
 * Toaster — the portal region that stacks toasts in a viewport corner. Rendered
 * once by `ToastProvider`; kept mounted (even when empty) so the live region is
 * stable before messages are inserted. Not usually used directly.
 */
export function Toaster({
  toasts,
  placement = "bottom-right",
  onDismiss,
  onPause,
  onResume,
  label = "Notifications",
}: ToasterProps) {
  if (typeof document === "undefined") return null;

  return createPortal(
    <ol
      className={cn("ml-toaster", `ml-toaster-${placement}`)}
      role="region"
      aria-label={label}
      tabIndex={-1}
    >
      {toasts.map((t) => (
        <Toast
          key={t.id}
          toast={t}
          onDismiss={onDismiss}
          onPause={onPause}
          onResume={onResume}
        />
      ))}
    </ol>,
    document.body,
  );
}
