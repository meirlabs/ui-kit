import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import { cn } from "../utils/cn";

export interface StatCardProps extends ComponentPropsWithoutRef<"div"> {
  value: ReactNode;
  label: string;
}

export function StatCard({ value, label, className, ...rest }: StatCardProps) {
  return (
    <div className={cn("ml-stat-card", className)} {...rest}>
      <strong className="ml-stat-card-value">{value}</strong>
      <p className="ml-stat-card-label">{label}</p>
    </div>
  );
}
