import { type ComponentPropsWithoutRef } from "react";
import { cn } from "../utils/cn";

export function EmptyState({ className, children, ...rest }: ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("ml-empty-state", className)} {...rest}>
      {children}
    </div>
  );
}
