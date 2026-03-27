import { type ComponentPropsWithoutRef } from "react";
import { cn } from "../utils/cn";

export function ChipRow({ className, children, ...rest }: ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("ml-chip-row", className)} {...rest}>
      {children}
    </div>
  );
}
