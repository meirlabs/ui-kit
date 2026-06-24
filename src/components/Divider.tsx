import { type ComponentPropsWithoutRef } from "react";
import { cn } from "../utils/cn";

export type DividerVariant = "solid" | "dashed" | "decorative" | "diamond";

type DividerProps = Omit<ComponentPropsWithoutRef<"hr">, "children"> & {
  /**
   * solid      — a thin subtle line (default)
   * dashed     — a thin subtle dashed line
   * decorative — a faded line each side of a small centered diamond
   * diamond    — a small centered diamond glyph alone, no line
   */
  variant?: DividerVariant;
};

export function Divider({ variant = "solid", className, ...rest }: DividerProps) {
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
