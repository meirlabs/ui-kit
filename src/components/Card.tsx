import { type ComponentPropsWithoutRef } from "react";
import { cn } from "../utils/cn";

export function Card({ className, children, ...rest }: ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("ml-card", className)} {...rest}>
      {children}
    </div>
  );
}
