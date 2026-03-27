import { type ComponentPropsWithoutRef } from "react";
import { cn } from "../utils/cn";

export interface FieldProps extends ComponentPropsWithoutRef<"div"> {
  label: string;
  children: React.ReactNode;
}

export function Field({ label, className, children, ...rest }: FieldProps) {
  return (
    <div className={cn("ml-field", className)} {...rest}>
      <span className="ml-field-label">{label}</span>
      {children}
    </div>
  );
}
