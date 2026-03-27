import { type ComponentPropsWithoutRef } from "react";
import { cn } from "../utils/cn";

export interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  variant?: "primary" | "ghost" | "danger";
}

export function Button({ variant = "primary", className, children, ...rest }: ButtonProps) {
  return (
    <button
      className={cn("ml-btn", `ml-btn-${variant}`, className)}
      type="button"
      {...rest}
    >
      {children}
    </button>
  );
}
