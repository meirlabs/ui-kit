import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "../utils/cn";

export type CometLoaderSize = "sm" | "md" | "lg";

const sizeClass: Record<CometLoaderSize, string> = {
  sm: "ml-comet-sm",
  md: "ml-comet-md",
  lg: "ml-comet-lg",
};

// Cells of a 4×4 grid in clockwise-inward spiral order (top row L→R, right
// column down, bottom row R→L, left column up, then the inner 2×2).
const SPIRAL_ORDER = [0, 1, 2, 3, 7, 11, 15, 14, 13, 12, 8, 4, 5, 6, 10, 9];
const COLS = 4;
const MARGIN = 4;
const PITCH = (24 - MARGIN * 2) / (COLS - 1);
const RADIUS = 1.7;
// Must match the ml-comet-dot animation duration in comet.css.
const DURATION_S = 1.5;

// cell index → negative delay placing the dot on the spiral path. The
// (N - pos) % N mapping runs the head forward (clockwise) while keeping every
// dot active from t=0 — no first-cycle fill-in glitch.
const DELAYS = SPIRAL_ORDER.reduce<number[]>((acc, cell, pos) => {
  acc[cell] = -(((SPIRAL_ORDER.length - pos) % SPIRAL_ORDER.length) / SPIRAL_ORDER.length) * DURATION_S;
  return acc;
}, []);

export interface CometLoaderProps extends ComponentPropsWithoutRef<"span"> {
  /** 16 / 20 / 24px. */
  size?: CometLoaderSize;
  /** Visually-hidden accessible name announced to screen readers. */
  label?: string;
}

/**
 * CometLoader — an indeterminate loader for AI / agentic work-in-progress: a
 * 4×4 `currentColor` dot grid whose bright head + fading tail orbits a
 * clockwise-inward spiral (inherits `--ml-text-muted` by default).
 * Reduced-motion freezes the orbit to a static grid with a soft opacity
 * pulse. `role="status"` with a visually-hidden label. (Spinner remains the
 * generic async default — reach for this one when the wait is an AI thinking.)
 */
export const CometLoader = forwardRef<HTMLSpanElement, CometLoaderProps>(function CometLoader(
  { size = "md", label = "Loading", className, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cn("ml-comet", sizeClass[size], className)}
      role="status"
      aria-live="polite"
      {...rest}
    >
      <svg viewBox="0 0 24 24" className="ml-comet-grid" aria-hidden="true">
        {DELAYS.map((delay, cell) => (
          <circle
            key={cell}
            cx={MARGIN + (cell % COLS) * PITCH}
            cy={MARGIN + Math.floor(cell / COLS) * PITCH}
            r={RADIUS}
            style={{ animationDelay: `${delay.toFixed(3)}s` }}
          />
        ))}
      </svg>
      <span className="ml-visually-hidden">{label}</span>
    </span>
  );
});
