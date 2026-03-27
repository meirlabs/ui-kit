import { type ComponentPropsWithoutRef } from "react";
import { cn } from "../utils/cn";

export function Tag({ className, children, ...rest }: ComponentPropsWithoutRef<"span">) {
  return (
    <span className={cn("ml-tag", className)} {...rest}>
      {children}
    </span>
  );
}
