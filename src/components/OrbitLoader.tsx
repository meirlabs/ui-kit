import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "../utils/cn";

export type OrbitLoaderSize = "sm" | "md" | "lg";

const sizeClass: Record<OrbitLoaderSize, string> = {
  sm: "ml-orbit-sm",
  md: "ml-orbit-md",
  lg: "ml-orbit-lg",
};

// Fixed angular offsets (behind the head, opposite the spin direction) that
// give the head dot a short fading trail as the arm rotates.
const TRAIL_ANGLES_DEG = [26, 52];

export interface OrbitLoaderProps extends ComponentPropsWithoutRef<"span"> {
  /** 16 / 20 / 24px. */
  size?: OrbitLoaderSize;
  /** Visually-hidden accessible name announced to screen readers. */
  label?: string;
}

/**
 * OrbitLoader — an indeterminate loader for a "satellite" feel: a bright
 * `currentColor` dot with a short fading trail orbits a static track ring
 * (inherits `--ml-text-muted` by default). Reduced-motion freezes the orbit
 * with the dot at rest on the track and the trail hidden. `role="status"`
 * with a visually-hidden label.
 */
export const OrbitLoader = forwardRef<HTMLSpanElement, OrbitLoaderProps>(function OrbitLoader(
  { size = "md", label = "Loading", className, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cn("ml-orbit", sizeClass[size], className)}
      role="status"
      aria-live="polite"
      {...rest}
    >
      <span className="ml-orbit-track" aria-hidden="true" />
      <span className="ml-orbit-arm" aria-hidden="true">
        <span className="ml-orbit-dot ml-orbit-dot-head" />
        {TRAIL_ANGLES_DEG.map((angle, i) => (
          <span
            key={angle}
            className="ml-orbit-echo"
            style={{ transform: `rotate(-${angle}deg)` }}
          >
            <span
              className="ml-orbit-dot ml-orbit-dot-echo"
              style={{ opacity: 0.5 / (i + 1) }}
            />
          </span>
        ))}
      </span>
      <span className="ml-visually-hidden">{label}</span>
    </span>
  );
});
