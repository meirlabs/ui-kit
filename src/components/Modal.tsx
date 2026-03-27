import { type ComponentPropsWithoutRef } from "react";
import { cn } from "../utils/cn";

export interface ModalProps extends ComponentPropsWithoutRef<"div"> {
  open: boolean;
  onClose: () => void;
  title?: string;
}

export function Modal({ open, onClose, title, className, children, ...rest }: ModalProps) {
  if (!open) return null;

  return (
    <div className="ml-overlay" onClick={onClose}>
      <div
        className={cn("ml-modal", className)}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        {...rest}
      >
        {title && (
          <div className="ml-modal-header">
            <h2>{title}</h2>
            <button type="button" onClick={onClose} aria-label="Close">
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
        <div className="ml-modal-body">{children}</div>
      </div>
    </div>
  );
}
