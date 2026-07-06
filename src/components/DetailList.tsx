import {
  type ComponentPropsWithoutRef,
  type ReactNode,
  forwardRef,
} from "react";
import { cn } from "../utils/cn";

export interface DetailListItem {
  label: string;
  value: ReactNode;
  /** Span the full width of the list (both columns when `columns={2}`). */
  fullWidth?: boolean;
  /**
   * Show a copy affordance next to the value. Called with `copyValue` (or the
   * raw string value) on click; if omitted, the built-in clipboard write runs.
   */
  onCopy?: (value: string) => void;
  /** String written to the clipboard (defaults to the value if it's a string). */
  copyValue?: string;
}

export interface DetailListProps extends ComponentPropsWithoutRef<"dl"> {
  items: DetailListItem[];
  /** Number of columns on wide viewports. Default 2. Stacks to 1 under 480px. */
  columns?: 1 | 2;
}

function CopyIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect
        x="5.5"
        y="5.5"
        width="8"
        height="8"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <path
        d="M10.5 5.5V4A1.5 1.5 0 0 0 9 2.5H4A1.5 1.5 0 0 0 2.5 4v5A1.5 1.5 0 0 0 4 10.5h1.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * `DetailList` — a key/value description list rendered as semantic
 * `<dl>/<dt>/<dd>`.
 *
 * Two responsive columns by default (`columns`), stacking to one under 480px so
 * it fits drawers and modals. Items can span the full width (`fullWidth`) and
 * carry a copy affordance (`onCopy` / `copyValue`).
 */
export const DetailList = forwardRef<HTMLDListElement, DetailListProps>(
  function DetailList({ items, columns = 2, className, ...rest }, ref) {
    function handleCopy(item: DetailListItem) {
      const text =
        item.copyValue ??
        (typeof item.value === "string" ? item.value : "");
      item.onCopy?.(text);
      if (
        item.onCopy == null &&
        text &&
        typeof navigator !== "undefined" &&
        navigator.clipboard
      ) {
        void navigator.clipboard.writeText(text);
      }
    }

    return (
      <dl
        ref={ref}
        className={cn("ml-detail-list", `ml-detail-list-cols-${columns}`, className)}
        {...rest}
      >
        {items.map((item) => {
          const showCopy = item.onCopy != null || item.copyValue != null;
          return (
            <div
              key={item.label}
              className={cn(
                "ml-detail-item",
                item.fullWidth && "ml-detail-item-full",
              )}
            >
              <dt>{item.label}</dt>
              <dd>
                <span className="ml-detail-value">{item.value}</span>
                {showCopy && (
                  <button
                    type="button"
                    className="ml-detail-copy"
                    aria-label={`Copy ${item.label}`}
                    onClick={() => handleCopy(item)}
                  >
                    <CopyIcon />
                  </button>
                )}
              </dd>
            </div>
          );
        })}
      </dl>
    );
  },
);
