import { type ComponentPropsWithoutRef } from "react";
import { cn } from "../utils/cn";

export function Shell({ className, children, ...rest }: ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("ml-shell", className)} {...rest}>
      {children}
    </div>
  );
}
