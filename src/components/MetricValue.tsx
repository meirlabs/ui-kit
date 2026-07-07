import { forwardRef, type ComponentPropsWithoutRef } from "react";
import NumberFlow, { type Format } from "@number-flow/react";
import { cn } from "../utils/cn";

/**
 * Wrap several `animated` MetricValues so their transitions run in sync
 * (re-export of NumberFlowGroup). Purely behavioral — renders no DOM.
 */
export { NumberFlowGroup as MetricGroup } from "@number-flow/react";

/**
 * Formatting options for the animated path: `Intl.NumberFormatOptions` minus
 * the notations NumberFlow can't animate (scientific/engineering).
 */
export type MetricFormat = Format;

interface MetricValueBaseProps
  extends Omit<ComponentPropsWithoutRef<"span">, "children" | "prefix"> {
  /** The numeric value to display. */
  value: number;
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

export interface MetricValueStaticProps extends MetricValueBaseProps {
  /** Static rendering (default). Set `true` for the NumberFlow variant. */
  animated?: false;
  /** Formats the value for display. Defaults to `String`. */
  formatter?: (value: number) => string;
  /** @deprecated Only valid with `animated` — use `formatter` here. */
  format?: never;
  /** @deprecated Only valid with `animated`. */
  locales?: never;
  /** @deprecated Only valid with `animated`. */
  prefix?: never;
  /** @deprecated Only valid with `animated`. */
  suffix?: never;
}

export interface MetricValueAnimatedProps extends MetricValueBaseProps {
  /**
   * Animate value changes with NumberFlow (digits roll into place).
   * Respects `prefers-reduced-motion` automatically. Because the digits are
   * animated individually, formatting is declared as `Intl.NumberFormatOptions`
   * (`format`) plus `prefix`/`suffix` strings — a `formatter` function can't
   * be used on this path.
   */
  animated: true;
  /** @deprecated Only valid on the static path — use `format`/`prefix`/`suffix`. */
  formatter?: never;
  /**
   * Intl.NumberFormat options applied to the value (e.g. currency, digits).
   * Scientific/engineering notation is excluded — NumberFlow can't animate it.
   */
  format?: MetricFormat;
  /** Locale(s) for number formatting. Defaults to the runtime locale. */
  locales?: Intl.LocalesArgument;
  /** Literal string rendered before the number (e.g. "$"). */
  prefix?: string;
  /** Literal string rendered after the number (e.g. "%"). */
  suffix?: string;
}

export type MetricValueProps = MetricValueStaticProps | MetricValueAnimatedProps;

export const MetricValue = forwardRef<HTMLSpanElement, MetricValueProps>(
  function MetricValue(
    {
      value,
      animated,
      formatter,
      format,
      locales,
      prefix,
      suffix,
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

    let valueEl;
    if (animated && Number.isFinite(value)) {
      valueEl = (
        <NumberFlow
          value={value}
          format={format}
          locales={locales}
          prefix={prefix}
          suffix={suffix}
          // Numbers stay LTR even inside RTL (Hebrew) pages.
          dir="ltr"
        />
      );
    } else if (animated) {
      // Non-finite (NaN/Infinity) can't roll digits — same formatting, static.
      valueEl = `${prefix ?? ""}${new Intl.NumberFormat(locales, format).format(value)}${suffix ?? ""}`;
    } else {
      valueEl = (formatter ?? String)(value);
    }

    return (
      <span
        ref={ref}
        className={cn("ml-metric ml-tabular", valueTone, className)}
        // tabular-nums inline so it holds even without the WS1 utility class.
        style={{ fontVariantNumeric: "tabular-nums", ...style }}
        {...rest}
      >
        {valueEl}
        {deltaEl}
      </span>
    );
  },
);
