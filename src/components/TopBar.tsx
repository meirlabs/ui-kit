import { type ComponentPropsWithoutRef } from "react";
import { cn } from "../utils/cn";

export function TopBar({ className, children, ...rest }: ComponentPropsWithoutRef<"header">) {
  return (
    <header className={cn("ml-top-bar", className)} {...rest}>
      {children}
    </header>
  );
}
