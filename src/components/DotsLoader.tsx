import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "../utils/cn";

export type DotsLoaderSize = "sm" | "md" | "lg";

const sizeClass: Record<DotsLoaderSize, string> = {
  sm: "ml-dots-sm",
  md: "ml-dots-md",
  lg: "ml-dots-lg",
};

export interface DotsLoaderProps extends ComponentPropsWithoutRef<"span"> {
  /** 16 / 20 / 24px. */
  size?: DotsLoaderSize;
  /** Visually-hidden accessible name announced to screen readers. */
  label?: string;
}

/**
 * DotsLoader — three `currentColor` dots pulsing in sequence (inherits
 * `--ml-text-muted` by default). The most minimal indeterminate loader, for
 * tight inline spaces — a send button, an inline "typing" state. Reduced-
 * motion freezes the sequence to a static soft opacity pulse. `role="status"`
 * with a visually-hidden label.
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
      <span className="ml-dots-row" aria-hidden="true">
        <span className="ml-dots-dot" />
        <span className="ml-dots-dot" />
        <span className="ml-dots-dot" />
      </span>
      <span className="ml-visually-hidden">{label}</span>
    </span>
  );
});
