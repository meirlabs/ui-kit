import { type ComponentPropsWithoutRef } from "react";
import { cn } from "../utils/cn";

export function Label({ className, children, ...rest }: ComponentPropsWithoutRef<"span">) {
  return (
    <span className={cn("ml-label", className)} {...rest}>
      {children}
    </span>
  );
}
