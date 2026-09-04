import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "../utils/cn";

export type DotsLoaderSize = "sm" | "md" | "lg";

const sizeClass: Record<DotsLoaderSize, string> = {
  sm: "ml-dots-sm",
  md: "ml-dots-md",
  lg: "ml-dots-lg",
};

const DOT_COUNT = 3;
// Must match the ml-dots-bounce animation duration in dots.css.
const DURATION_S = 0.9;

// Negative delays spread evenly across the cycle so all three dots are
// mid-bounce from t=0 (no first-cycle pop-in), same technique CometLoader
// uses for its spiral dots.
const DELAYS = Array.from({ length: DOT_COUNT }, (_, i) => (-i * DURATION_S) / DOT_COUNT);

export interface DotsLoaderProps extends ComponentPropsWithoutRef<"span"> {
  /** 16 / 20 / 24px. */
  size?: DotsLoaderSize;
  /** Visually-hidden accessible name announced to screen readers. */
  label?: string;
}

/**
 * DotsLoader — an indeterminate loader for compact inline spots (buttons,
 * table cells, chat bubbles): three `currentColor` dots bouncing in a
 * staggered wave (inherits `--ml-text-muted` by default). Reduced-motion
 * freezes the wave to a static soft opacity pulse. `role="status"` with a
 * visually-hidden label.
 */
export const DotsLoader = forwardRef<HTMLSpanElement, DotsLoaderProps>(function DotsLoader(
  { size = "md", label = "Loading", className, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cn("ml-dots", sizeClass[size], className)}
      role="status"
      aria-live="polite"
      {...rest}
    >
      <span className="ml-dots-track" aria-hidden="true">
        {DELAYS.map((delay, i) => (
          <span key={i} className="ml-dots-dot" style={{ animationDelay: `${delay.toFixed(3)}s` }} />
        ))}
      </span>
      <span className="ml-visually-hidden">{label}</span>
    </span>
  );
});
