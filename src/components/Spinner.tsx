import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "../utils/cn";

export type SpinnerSize = "sm" | "md" | "lg";

const sizeClass: Record<SpinnerSize, string> = {
  sm: "ml-spinner-sm",
  md: "ml-spinner-md",
  lg: "ml-spinner-lg",
};

export interface SpinnerProps extends ComponentPropsWithoutRef<"span"> {
  /** 16 / 20 / 24px. */
  size?: SpinnerSize;
  /** Visually-hidden accessible name announced to screen readers. */
  label?: string;
}

/**
 * Spinner — a standalone loading indicator for arbitrary async regions. A
 * `currentColor` ring (inherits `--ml-text-muted` by default) that spins;
 * reduced-motion freezes the sweep to a static ring. `role="status"` with a
 * visually-hidden label. (Button ships its own inline spinner to stay
 * decoupled — use this one anywhere else.)
 */
export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  { size = "md", label = "Loading", className, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cn("ml-spinner", sizeClass[size], className)}
      role="status"
      aria-live="polite"
      {...rest}
    >
      <span className="ml-spinner-ring" aria-hidden="true" />
      <span className="ml-visually-hidden">{label}</span>
    </span>
  );
});
