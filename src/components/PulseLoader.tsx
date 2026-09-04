import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "../utils/cn";

export type PulseLoaderSize = "sm" | "md" | "lg";

const sizeClass: Record<PulseLoaderSize, string> = {
  sm: "ml-pulse-sm",
  md: "ml-pulse-md",
  lg: "ml-pulse-lg",
};

const RING_COUNT = 2;
// Must match the ml-pulse-ring animation duration in pulse.css.
const DURATION_S = 1.8;

// Negative delays spread the rings evenly across the cycle so a ring is
// always mid-expansion from t=0 (no first-cycle gap before the first ping).
const DELAYS = Array.from({ length: RING_COUNT }, (_, i) => (-i * DURATION_S) / RING_COUNT);

export interface PulseLoaderProps extends ComponentPropsWithoutRef<"span"> {
  /** 16 / 20 / 24px. */
  size?: PulseLoaderSize;
  /** Visually-hidden accessible name announced to screen readers. */
  label?: string;
}

/**
 * PulseLoader — an indeterminate loader for a calm "still working" signal: a
 * static `currentColor` core with rings that expand outward and fade like a
 * sonar ping (inherits `--ml-text-muted` by default). Reduced-motion freezes
 * the rings to a single static ring at rest. `role="status"` with a
 * visually-hidden label.
 */
export const PulseLoader = forwardRef<HTMLSpanElement, PulseLoaderProps>(function PulseLoader(
  { size = "md", label = "Loading", className, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cn("ml-pulse", sizeClass[size], className)}
      role="status"
      aria-live="polite"
      {...rest}
    >
      <span className="ml-pulse-rings" aria-hidden="true">
        {DELAYS.map((delay, i) => (
          <span key={i} className="ml-pulse-ring" style={{ animationDelay: `${delay.toFixed(3)}s` }} />
        ))}
      </span>
      <span className="ml-pulse-core" aria-hidden="true" />
      <span className="ml-visually-hidden">{label}</span>
    </span>
  );
});
