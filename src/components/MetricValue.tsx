import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "../utils/cn";

export interface MetricValueProps
  extends Omit<ComponentPropsWithoutRef<"span">, "children"> {
  /** The numeric value to display. */
  value: number;
  /** Formats the value for display. Defaults to `String`. */
  formatter?: (value: number) => string;
  /** Optional period-over-period delta rendered as a trailing indicator. */
  delta?: number;
  /**
   * Direction of the delta. `auto` (default) derives it from the delta sign;
   * `up` reads as success, `down` as danger.
   */
  deltaDirection?: "up" | "down" | "auto";
  /** Formats the delta. Defaults to its absolute value (the arrow conveys sign). */
  deltaFormatter?: (value: number) => string;
}

export const MetricValue = forwardRef<HTMLSpanElement, MetricValueProps>(
  function MetricValue(
    {
      value,
      formatter = String,
      delta,
      deltaDirection = "auto",
      deltaFormatter,
      className,
      style,
      ...rest
    },
    ref,
  ) {
    const valueTone =
      value > 0 ? "ml-metric-positive" : value < 0 ? "ml-metric-negative" : undefined;

    let deltaEl = null;
    if (delta !== undefined) {
      const dir = deltaDirection === "auto" ? (delta >= 0 ? "up" : "down") : deltaDirection;
      const deltaTone = dir === "up" ? "ml-metric-positive" : "ml-metric-negative";
      const fmt = deltaFormatter ?? ((v: number) => `${Math.abs(v)}`);
      deltaEl = (
        <span className={cn("ml-metric-delta", deltaTone)}>
          <span aria-hidden="true">{dir === "up" ? "↑" : "↓"}</span>
          {fmt(delta)}
        </span>
      );
    }

    return (
      <span
        ref={ref}
        className={cn("ml-metric ml-tabular", valueTone, className)}
        // tabular-nums inline so it holds even without the WS1 utility class.
        style={{ fontVariantNumeric: "tabular-nums", ...style }}
        {...rest}
      >
        {formatter(value)}
        {deltaEl}
      </span>
    );
  },
);
