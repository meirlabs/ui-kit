import { type ComponentPropsWithoutRef } from "react";
import { cn } from "../utils/cn";

export interface DangerZoneProps extends ComponentPropsWithoutRef<"div"> {
  title?: string;
}

export function DangerZone({ title, className, children, ...rest }: DangerZoneProps) {
  return (
    <div className={cn("ml-danger-zone", className)} {...rest}>
      {title && <h3 className="ml-danger-zone-title">{title}</h3>}
      {children}
    </div>
  );
}
