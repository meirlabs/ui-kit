import { Children, forwardRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "../utils/cn";

const gapClass = {
  sm: "ml-chip-row-gap-sm",
  md: "ml-chip-row-gap-md",
} as const;

export interface ChipRowProps extends ComponentPropsWithoutRef<"div"> {
  /** Gap between chips. `sm` = 8px (default), `md` = 12px. */
  gap?: "sm" | "md";
}

/**
 * A wrapping row of chips/tags. Exposes `role="list"` and wraps each child as
 * a `role="listitem"`. Carries no outer margin — the parent owns vertical
 * rhythm, so a ChipRow sits flush inside a table cell.
 */
export const ChipRow = forwardRef<HTMLDivElement, ChipRowProps>(function ChipRow(
  { gap = "sm", className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      role="list"
      className={cn("ml-chip-row", gapClass[gap], className)}
      {...rest}
    >
      {Children.map(children, (child) => {
        if (child == null || child === false || child === true) return null;
        return (
          <span role="listitem" className="ml-chip-row-item">
            {child}
          </span>
        );
      })}
    </div>
  );
});
