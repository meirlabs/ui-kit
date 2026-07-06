import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import { cn } from "../utils/cn";

export type BannerTone = "info" | "success" | "warning" | "danger" | "error";

/**
 * Tone → class. `info` is neutral GRAY, never blue (contract §0/§8). Banner and
 * `Callout` (WS9) share this tone recipe: `-muted` tint fill + solid text for
 * status tones.
 */
const toneClass: Record<BannerTone, string> = {
  info: "ml-banner-info",
  success: "ml-banner-success",
  warning: "ml-banner-warning",
  danger: "ml-banner-danger",
  error: "ml-banner-error",
};

export interface BannerProps
  extends Omit<ComponentPropsWithoutRef<"div">, "title"> {
  tone?: BannerTone;
  /** Optional leading icon slot (ReactNode). */
  icon?: ReactNode;
  /** Bold title line above the description/children. */
  title?: ReactNode;
  /** Body text. `children` is used when `description` is omitted. */
  description?: ReactNode;
  /** When provided, renders a dismiss icon-button (≥32px hit area, focus ring). */
  onDismiss?: () => void;
}

/** Small inline X — self-contained so the library adds no icon dependency. */
function DismissIcon() {
  return (
    <svg viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M3.5 3.5l7 7M10.5 3.5l-7 7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Banner({
  tone = "info",
  icon,
  title,
  description,
  onDismiss,
  className,
  children,
  ...rest
}: BannerProps) {
  // Errors interrupt (assertive); everything else is a polite status update.
  const role = tone === "error" || tone === "danger" ? "alert" : "status";
  const body = description ?? children;

  return (
    <div
      role={role}
      className={cn("ml-banner", toneClass[tone], className)}
      {...rest}
    >
      {icon != null && (
        <span className="ml-banner-icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <div className="ml-banner-content">
        {title != null && <div className="ml-banner-title">{title}</div>}
        {body != null && <div className="ml-banner-desc">{body}</div>}
      </div>
      {onDismiss && (
        <button
          type="button"
          className="ml-banner-dismiss"
          aria-label="Dismiss"
          onClick={onDismiss}
        >
          <DismissIcon />
        </button>
      )}
    </div>
  );
}
