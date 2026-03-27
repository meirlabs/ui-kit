import { type ComponentPropsWithoutRef } from "react";
import { cn } from "../utils/cn";

export interface SectionProps extends ComponentPropsWithoutRef<"section"> {
  title?: string;
}

export function Section({ title, className, children, ...rest }: SectionProps) {
  return (
    <section className={cn("ml-section", className)} {...rest}>
      {title && <h2 className="ml-section-title">{title}</h2>}
      {children}
    </section>
  );
}
