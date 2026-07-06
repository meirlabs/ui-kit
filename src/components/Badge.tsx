import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import { cn } from "../utils/cn";

export type BadgeTone = "neutral" | "success" | "warning" | "danger";

/**
 * Tone → class. `neutral` maps to the GRAY `.ml-badge-muted` (surface + muted
 * text), never the blue legacy `.ml-badge-neutral` (contract §0/§8, gap G10).
 * Legacy `good`/`warn` values are aliased so existing callers keep working.
 */
const toneClass = {
  neutral: "ml-badge-muted",
  success: "ml-badge-success",
  warning: "ml-badge-warning",
  danger: "ml-badge-danger",
  // legacy aliases (deprecated) — prefer success/warning
  good: "ml-badge-success",
  warn: "ml-badge-warning",
} as const;

export interface BadgeProps extends ComponentPropsWithoutRef<"span"> {
  /** Status tone. `neutral` is gray (monochrome default). */
  tone?: keyof typeof toneClass;
  size?: "sm" | "md";
  /** Leading status dot in the tone's solid color. */
  dot?: boolean;
  /** Leading 12–14px icon (ReactNode). */
  icon?: ReactNode;
}

export function Badge({
  tone = "neutral",
  size = "md",
  dot = false,
  icon,
  className,
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={cn(
        "ml-badge",
        toneClass[tone],
        size === "sm" && "ml-badge-sm",
        className,
      )}
      {...rest}
    >
      {dot && <span className="ml-badge-dot" aria-hidden="true" />}
      {icon != null && (
        <span className="ml-badge-icon" aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </span>
  );
}
