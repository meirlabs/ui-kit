import { type ComponentPropsWithoutRef } from "react";
import { cn } from "../utils/cn";

export interface PageHeaderProps extends ComponentPropsWithoutRef<"div"> {
  title: string;
  subtitle?: string;
}

export function PageHeader({ title, subtitle, className, children, ...rest }: PageHeaderProps) {
  return (
    <div className={cn("ml-page-header", className)} {...rest}>
      <h1 className="ml-page-title">{title}</h1>
      {subtitle && <p className="ml-page-subtitle">{subtitle}</p>}
      {children}
    </div>
  );
}
