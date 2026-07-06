import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type CSSProperties,
} from "react";
import { cn } from "../utils/cn";

export type SkeletonVariant = "text" | "rect" | "circle";

const variantClass: Record<SkeletonVariant, string> = {
  text: "ml-skeleton-text",
  rect: "ml-skeleton-rect",
  circle: "ml-skeleton-circle",
};

export interface SkeletonProps extends ComponentPropsWithoutRef<"span"> {
  variant?: SkeletonVariant;
  width?: number | string;
  height?: number | string;
  /** Border radius override (number → px). */
  radius?: number | string;
}

function toCss(value: number | string | undefined): string | undefined {
  if (value == null) return undefined;
  return typeof value === "number" ? `${value}px` : value;
}

/**
 * Skeleton — a decorative placeholder that occupies the final content's exact
 * dimensions so no layout shift occurs when real content lands. A subtle
 * shimmer plays between surface tokens; reduced-motion falls back to a static
 * muted block. `aria-hidden` — the live region is owned by the parent.
 */
export const Skeleton = forwardRef<HTMLSpanElement, SkeletonProps>(function Skeleton(
  { variant = "text", width, height, radius, className, style, ...rest },
  ref,
) {
  const mergedStyle: CSSProperties = {
    width: toCss(width),
    height: toCss(height),
    borderRadius: toCss(radius),
    ...style,
  };

  return (
    <span
      ref={ref}
      className={cn("ml-skeleton", variantClass[variant], className)}
      style={mergedStyle}
      aria-hidden="true"
      {...rest}
    />
  );
});

export interface SkeletonTextProps
  extends Omit<SkeletonProps, "variant" | "children"> {
  /** Number of text lines to render. */
  lines?: number;
}

/**
 * SkeletonText — a convenience block of stacked text-line skeletons. The last
 * line is shortened to read like a paragraph tail.
 */
export const SkeletonText = forwardRef<HTMLDivElement, SkeletonTextProps>(
  function SkeletonText({ lines = 3, className, width, ...rest }, ref) {
    const count = Math.max(1, lines);
    return (
      <div ref={ref} className={cn("ml-skeleton-block", className)} aria-hidden="true">
        {Array.from({ length: count }, (_, i) => (
          <Skeleton
            key={i}
            variant="text"
            width={i === count - 1 && count > 1 ? "60%" : width}
            {...rest}
          />
        ))}
      </div>
    );
  },
);
