import { type ComponentPropsWithoutRef } from "react";
import { cn } from "../utils/cn";

export type DividerVariant = "solid" | "dashed" | "decorative" | "diamond";
export type DividerOrientation = "horizontal" | "vertical";

type DividerProps = Omit<ComponentPropsWithoutRef<"hr">, "children"> & {
  /**
   * solid      — a thin subtle line (default)
   * dashed     — a thin subtle dashed line
   * decorative — **deprecated**: a faded line each side of a small centered
   *              diamond. Decorative glyphs violate the no-decoration rule
   *              (contract §0); kept only so existing callers don't break. Use
   *              `solid` instead.
   * diamond    — **deprecated**: a small centered diamond glyph alone. Same
   *              reasoning as `decorative`; prefer `solid` or whitespace.
   */
  variant?: DividerVariant;
  /**
   * `horizontal` (default) or `vertical`. Vertical is a 1px rule for toolbars /
   * inline separators; it renders a `role="separator"` element with
   * `aria-orientation="vertical"`.
   */
  orientation?: DividerOrientation;
};

export function Divider({
  variant = "solid",
  orientation = "horizontal",
  className,
  ...rest
}: DividerProps) {
  // Vertical separators can't be an <hr>; render a role=separator element.
  if (orientation === "vertical") {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={cn("ml-divider-vertical", className)}
        {...(rest as ComponentPropsWithoutRef<"div">)}
      />
    );
  }

  // The glyph variants can't live on an <hr>, so render a separator element.
  if (variant === "decorative" || variant === "diamond") {
    return (
      <div
        role="separator"
        aria-orientation="horizontal"
        className={cn(`ml-divider-${variant}`, className)}
        {...(rest as ComponentPropsWithoutRef<"div">)}
      >
        <span className="ml-divider-glyph" aria-hidden="true">
          ◇
        </span>
      </div>
    );
  }

  return (
    <hr
      className={cn("ml-divider", variant === "dashed" && "ml-divider-dashed", className)}
      {...rest}
    />
  );
}
