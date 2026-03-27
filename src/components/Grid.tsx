import { type ComponentPropsWithoutRef } from "react";
import { cn } from "../utils/cn";

export function Grid({ className, children, ...rest }: ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("ml-grid", className)} {...rest}>
      {children}
    </div>
  );
}
