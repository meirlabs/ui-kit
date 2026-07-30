import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "../utils/cn";

export type BarsLoaderSize = "sm" | "md" | "lg";

const sizeClass: Record<BarsLoaderSize, string> = {
  sm: "ml-bars-sm",
  md: "ml-bars-md",
  lg: "ml-bars-lg",
};

export interface BarsLoaderProps extends ComponentPropsWithoutRef<"span"> {
  /** 14 / 18 / 24px tall. */
  size?: BarsLoaderSize;
  /** Visually-hidden accessible name announced to screen readers. */
  label?: string;
}

/**
 * BarsLoader — four `currentColor` bars scaling in a staggered equalizer
 * rhythm (inherits `--ml-text-muted` by default). Reads as active background
 * work — an upload, a render, a sync. Reduced-motion freezes the bars to a
 * static uneven skyline with a soft whole-group opacity pulse.
 * `role="status"` with a visually-hidden label.
 */
export const BarsLoader = forwardRef<HTMLSpanElement, BarsLoaderProps>(function BarsLoader(
  { size = "md", label = "Loading", className, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cn("ml-bars", sizeClass[size], className)}
      role="status"
      aria-live="polite"
      {...rest}
    >
      <span className="ml-bars-row" aria-hidden="true">
        <span className="ml-bars-bar" />
        <span className="ml-bars-bar" />
        <span className="ml-bars-bar" />
        <span className="ml-bars-bar" />
      </span>
      <span className="ml-visually-hidden">{label}</span>
    </span>
  );
});
