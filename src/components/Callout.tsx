import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { cn } from "../utils/cn";

/**
 * Tone → token recipe, shared with `Banner` (WS2) so they read as one family.
 * `info` is deliberately neutral gray (NOT blue) per the monochrome contract.
 * The difference is scope: Banner is page-level; Callout is inline, sitting
 * inside prose or a form section.
 */
export type CalloutTone = "neutral" | "info" | "success" | "warning" | "danger";

const toneClass: Record<CalloutTone, string> = {
  neutral: "ml-callout-neutral",
  info: "ml-callout-info",
  success: "ml-callout-success",
  warning: "ml-callout-warning",
  danger: "ml-callout-danger",
};

export interface CalloutProps extends Omit<ComponentPropsWithoutRef<"div">, "title"> {
  tone?: CalloutTone;
  title?: ReactNode;
  /** Leading icon node (icon-agnostic; pass any ReactNode). */
  icon?: ReactNode;
  /** When provided, renders a dismiss button in the corner. */
  onDismiss?: () => void;
}

/**
 * Callout — an inline, form/doc-level admonition, smaller than `Banner`. A
 * left-accent tinted surface built from functional tokens. `danger` announces
 * as `role="alert"`; every other tone is `role="note"`.
 */
export const Callout = forwardRef<HTMLDivElement, CalloutProps>(function Callout(
  { tone = "neutral", title, icon, onDismiss, className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn("ml-callout", toneClass[tone], className)}
      role={tone === "danger" ? "alert" : "note"}
      {...rest}
    >
      {icon != null && (
        <span className="ml-callout-icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <div className="ml-callout-body">
        {title != null && <p className="ml-callout-title">{title}</p>}
        {children != null && <div className="ml-callout-content">{children}</div>}
      </div>
      {onDismiss && (
        <button
          type="button"
          className="ml-callout-close"
          aria-label="Dismiss"
          onClick={onDismiss}
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
      )}
    </div>
  );
});
