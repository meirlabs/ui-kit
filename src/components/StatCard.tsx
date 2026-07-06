import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import { cn } from "../utils/cn";

export type StatCardTrend = "up" | "down" | "neutral";

export interface StatCardProps
  extends Omit<ComponentPropsWithoutRef<"div">, "title"> {
  /** The headline figure. Rendered with tabular-nums so it never reflows. */
  value: ReactNode;
  /**
   * Muted label above the value. Usually a string; accepts any node so it can
   * carry, e.g., a Tooltip-wrapped term without an added icon.
   */
  label: ReactNode;
  /** Optional leading icon (ReactNode — the kit stays icon-agnostic). */
  icon?: ReactNode;
  /**
   * Period-over-period delta. Colored with functional success/danger tokens
   * (never decorative). Sign is conveyed by the trend arrow.
   */
  delta?: number;
  /** Direction of the delta. Defaults to the sign of `delta`. */
  trend?: StatCardTrend;
  /** Formats the delta. Defaults to its absolute value (arrow carries the sign). */
  deltaFormatter?: (value: number) => string;
  /** Reserve value/label height with a skeleton while data loads. */
  loading?: boolean;
}

const TREND_ARROW: Record<StatCardTrend, string> = {
  up: "↑",
  down: "↓",
  neutral: "→",
};

/**
 * StatCard — a single dashboard metric. No shadow at rest (card rule): border +
 * surface only. The value uses semibold 600 (never 700) and tabular-nums so
 * in-place updates don't nudge neighbors. An optional `delta`/`trend` renders as
 * a functional success/danger indicator, visually aligned with `MetricValue`.
 */
export function StatCard({
  value,
  label,
  icon,
  delta,
  trend,
  deltaFormatter,
  loading = false,
  className,
  ...rest
}: StatCardProps) {
  const resolvedTrend: StatCardTrend =
    trend ?? (delta == null ? "neutral" : delta > 0 ? "up" : delta < 0 ? "down" : "neutral");

  const fmtDelta = deltaFormatter ?? ((v: number) => `${Math.abs(v)}`);

  return (
    <div
      className={cn("ml-stat-card", loading && "ml-stat-card--loading", className)}
      aria-busy={loading || undefined}
      {...rest}
    >
      <div className="ml-stat-card-head">
        <p className="ml-stat-card-label">{label}</p>
        {icon != null && <span className="ml-stat-card-icon">{icon}</span>}
      </div>

      {loading ? (
        <span className="ml-stat-card-value-skel" aria-hidden="true" />
      ) : (
        <div className="ml-stat-card-value-row">
          <span
            className="ml-stat-card-value ml-tabular"
            // tabular-nums inline so it holds even before the CSS utility loads.
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {value}
          </span>
          {delta != null && (
            <span
              className={cn("ml-stat-card-delta", `ml-stat-card-delta--${resolvedTrend}`)}
            >
              <span aria-hidden="true" className="ml-stat-card-delta-arrow">
                {TREND_ARROW[resolvedTrend]}
              </span>
              {fmtDelta(delta)}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
