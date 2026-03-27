import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import { cn } from "../utils/cn";

export interface WizardProps extends ComponentPropsWithoutRef<"div"> {
  steps: number;
  current: number;
  children: ReactNode;
  footer?: ReactNode;
}

export function Wizard({ steps, current, className, children, footer, ...rest }: WizardProps) {
  return (
    <div className={cn(className)} {...rest}>
      <div className="ml-wizard-progress">
        {Array.from({ length: steps }, (_, i) => (
          <div
            key={i}
            className={cn("ml-wizard-segment", i <= current && "filled")}
          />
        ))}
      </div>
      {children}
      {footer && <div className="ml-wizard-footer">{footer}</div>}
    </div>
  );
}
