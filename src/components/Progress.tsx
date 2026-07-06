import {
  forwardRef,
  useId,
  type ComponentPropsWithoutRef,
  type CSSProperties,
} from "react";
import { cn } from "../utils/cn";

export type ProgressSize = "sm" | "md" | "lg";
export type ProgressTone = "neutral" | "success" | "warning" | "danger";

const sizeClass: Record<ProgressSize, string> = {
  sm: "ml-progress-sm",
  md: "ml-progress-md",
  lg: "ml-progress-lg",
};

const toneClass: Record<ProgressTone, string> = {
  neutral: "ml-progress-neutral",
  success: "ml-progress-success",
  warning: "ml-progress-warning",
  danger: "ml-progress-danger",
};

export interface ProgressProps
  extends Omit<ComponentPropsWithoutRef<"div">, "role"> {
  /** 0–max. Omit for an indeterminate bar. */
  value?: number;
  max?: number;
  size?: ProgressSize;
  /** Fill color. Defaults to monochrome `--ml-text`. */
  tone?: ProgressTone;
  /** Accessible name for the progressbar. */
  label?: string;
  /** Render the numeric percentage beside the track. */
  showValue?: boolean;
}

/**
 * Progress — a determinate or indeterminate progress bar. The determinate fill
 * scales via `transform: scaleX` (≤200ms). Indeterminate runs a subtle looping
 * sweep, replaced by a static neutral track under reduced-motion.
 * `role="progressbar"` with aria value attributes (omitted when indeterminate).
 */
export const Progress = forwardRef<HTMLDivElement, ProgressProps>(function Progress(
  {
    value,
    max = 100,
    size = "md",
    tone = "neutral",
    label,
    showValue = false,
    className,
    ...rest
  },
  ref,
) {
  const labelId = useId();
  const indeterminate = value == null;
  const clamped = indeterminate
    ? 0
    : Math.min(max, Math.max(0, value as number));
  const ratio = max > 0 ? clamped / max : 0;
  const percent = Math.round(ratio * 100);

  const fillStyle: CSSProperties = indeterminate
    ? {}
    : { transform: `scaleX(${ratio})` };

  return (
    <div className={cn("ml-progress-wrap", className)}>
      {label != null && (
        <div className="ml-progress-labels">
          <span id={labelId} className="ml-progress-label">
            {label}
          </span>
          {showValue && !indeterminate && (
            <span className="ml-progress-value">{percent}%</span>
          )}
        </div>
      )}
      <div
        ref={ref}
        className={cn(
          "ml-progress",
          sizeClass[size],
          toneClass[tone],
          indeterminate && "ml-progress-indeterminate",
        )}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={indeterminate ? undefined : clamped}
        aria-label={label == null ? "Loading" : undefined}
        aria-labelledby={label != null ? labelId : undefined}
        {...rest}
      >
        <div className="ml-progress-track">
          <div className="ml-progress-fill" style={fillStyle} />
        </div>
      </div>
      {showValue && label == null && !indeterminate && (
        <span className="ml-progress-value ml-progress-value-standalone">
          {percent}%
        </span>
      )}
    </div>
  );
});
