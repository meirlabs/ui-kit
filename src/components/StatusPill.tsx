import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { cn } from "../utils/cn";

const toneClass = {
  good: "ml-status-pill-good",
  warn: "ml-status-pill-warn",
  danger: "ml-status-pill-danger",
  neutral: "ml-status-pill-neutral",
} as const;

export type StatusPillTone = keyof typeof toneClass;

export interface StatusPillProps extends ComponentPropsWithoutRef<"span"> {
  /** Status tone. `neutral` renders gray (never the blue accent). */
  tone?: StatusPillTone;
  /** Show a leading status dot colored by tone. */
  dot?: boolean;
  /** Optional leading icon (icon-agnostic ReactNode). */
  icon?: ReactNode;
}

export const StatusPill = forwardRef<HTMLSpanElement, StatusPillProps>(function StatusPill(
  { tone = "neutral", dot = false, icon, className, children, ...rest },
  ref,
) {
  return (
    <span ref={ref} className={cn("ml-status-pill", toneClass[tone], className)} {...rest}>
      {dot ? <span className="ml-status-pill-dot" aria-hidden="true" /> : null}
      {icon ? (
        <span className="ml-status-pill-icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      {children}
    </span>
  );
});
