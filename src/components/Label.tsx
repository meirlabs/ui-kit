import { type ComponentPropsWithoutRef } from "react";
import { cn } from "../utils/cn";

export interface LabelProps extends ComponentPropsWithoutRef<"span"> {
  size?: "sm" | "md";
  tone?: "muted" | "default";
}

/**
 * Label — the uppercase, tracked **eyebrow micro-label** (12px/500, contract
 * §6). Use it as a section eyebrow or in-card micro-label. This is NOT the form
 * field label — that lives on `Field` (WS6).
 */
export function Label({
  size = "md",
  tone = "default",
  className,
  children,
  ...rest
}: LabelProps) {
  return (
    <span
      className={cn(
        "ml-label",
        size === "sm" && "ml-label-sm",
        tone === "muted" && "ml-label-muted",
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
