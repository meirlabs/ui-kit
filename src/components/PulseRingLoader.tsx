import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "../utils/cn";

export type PulseRingLoaderSize = "sm" | "md" | "lg";

const sizeClass: Record<PulseRingLoaderSize, string> = {
  sm: "ml-pulse-ring-sm",
  md: "ml-pulse-ring-md",
  lg: "ml-pulse-ring-lg",
};

export interface PulseRingLoaderProps extends ComponentPropsWithoutRef<"span"> {
  /** 16 / 20 / 26px. */
  size?: PulseRingLoaderSize;
  /** Visually-hidden accessible name announced to screen readers. */
  label?: string;
}

/**
 * PulseRingLoader — a solid `currentColor` core with a ring that expands and
 * fades outward on loop (inherits `--ml-text-muted` by default). Reads as a
 * live/listening/connecting state — a websocket handshake, a call
 * connecting. Reduced-motion freezes the ring at rest and pulses its opacity
 * only. `role="status"` with a visually-hidden label.
 */
export const PulseRingLoader = forwardRef<HTMLSpanElement, PulseRingLoaderProps>(
  function PulseRingLoader({ size = "md", label = "Loading", className, ...rest }, ref) {
    return (
      <span
        ref={ref}
        className={cn("ml-pulse-ring", sizeClass[size], className)}
        role="status"
        aria-live="polite"
        {...rest}
      >
        <span className="ml-pulse-ring-visual" aria-hidden="true">
          <span className="ml-pulse-ring-wave" />
          <span className="ml-pulse-ring-core" />
        </span>
        <span className="ml-visually-hidden">{label}</span>
      </span>
    );
  },
);
