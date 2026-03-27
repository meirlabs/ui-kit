import { type ComponentPropsWithoutRef } from "react";
import { cn } from "../utils/cn";

export interface MetricValueProps extends Omit<ComponentPropsWithoutRef<"span">, "children"> {
  value: number;
  formatter?: (value: number) => string;
}

export function MetricValue({
  value,
  formatter = String,
  className,
  ...rest
}: MetricValueProps) {
  const tone = value > 0 ? "ml-metric-positive" : value < 0 ? "ml-metric-negative" : undefined;

  return (
    <span className={cn(tone, className)} {...rest}>
      {formatter(value)}
    </span>
  );
}
