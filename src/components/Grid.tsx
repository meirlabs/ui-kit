import {
  type ComponentPropsWithoutRef,
  type CSSProperties,
  forwardRef,
} from "react";
import { cn } from "../utils/cn";

export interface GridProps extends ComponentPropsWithoutRef<"div"> {
  /**
   * Fixed number of equal columns, or `"auto"` (default) for a responsive
   * `auto-fit` fill based on `minColWidth`.
   */
  columns?: number | "auto";
  /** Minimum column width (px) when `columns="auto"`. Default 180. */
  minColWidth?: number;
  /** Gap between cells: `sm` 12px · `md` 16px · `lg` 24px. Default `md`. */
  gap?: "sm" | "md" | "lg";
}

/**
 * `Grid` — a responsive layout grid.
 *
 * With `columns="auto"` (default) it fills the row with as many columns as fit
 * at `minColWidth`. With a numeric `columns` it renders that many equal
 * columns. Either way it collapses to a single column under 640px.
 *
 * ```tsx
 * <Grid columns={3} gap="lg">…</Grid>
 * <Grid minColWidth={220}>…</Grid>
 * ```
 */
export const Grid = forwardRef<HTMLDivElement, GridProps>(function Grid(
  {
    columns = "auto",
    minColWidth = 180,
    gap = "md",
    className,
    style,
    children,
    ...rest
  },
  ref,
) {
  const template =
    columns === "auto"
      ? `repeat(auto-fit, minmax(${minColWidth}px, 1fr))`
      : `repeat(${columns}, minmax(0, 1fr))`;

  return (
    <div
      ref={ref}
      className={cn("ml-grid", `ml-grid-gap-${gap}`, className)}
      style={{ "--ml-grid-template": template, ...style } as CSSProperties}
      {...rest}
    >
      {children}
    </div>
  );
});
