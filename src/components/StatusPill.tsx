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
  /**
   * Soft "breathing" pulse on the leading dot to signal a live/active status.
   * Strictly opt-in — pass `true` to enable it, on any tone. Never defaults
   * on, including for the `good` tone. No effect without `dot`. Honors
   * `prefers-reduced-motion` — a reduced-motion user always sees a static dot.
   */
  pulse?: boolean;
  /**
   * Mark this status as live — something is actively happening right now
   * (a job running, a stage in progress). Rings the dot so it reads as
   * distinct at a glance in a list of pills. Requires `dot`.
   *
   * Deliberately static, NOT a pulse: design spec §"Never animate" bans
   * looping elements ("nothing that draws the eye on repeat"), and a status
   * pill in a list is exactly what that rule protects against. `live` is the
   * spec-clean way to say the same thing `pulse` says with motion; prefer it.
   * The two compose, but there is no reason to pass both.
   */
  live?: boolean;
  /** Optional leading icon (icon-agnostic ReactNode). */
  icon?: ReactNode;
}

export const StatusPill = forwardRef<HTMLSpanElement, StatusPillProps>(function StatusPill(
  { tone = "neutral", dot = false, pulse, live = false, icon, className, children, ...rest },
  ref,
) {
  const shouldPulse = dot && pulse === true;
  return (
    <span ref={ref} className={cn("ml-status-pill", toneClass[tone], className)} {...rest}>
      {dot ? (
        <span
          className={cn(
            "ml-status-pill-dot",
            shouldPulse && "ml-status-pill-dot-pulse",
            live && "ml-status-pill-dot-live",
          )}
          aria-hidden="true"
        />
      ) : null}
      {icon ? (
        <span className="ml-status-pill-icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      {children}
    </span>
  );
});
