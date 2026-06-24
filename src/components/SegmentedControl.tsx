import { type ComponentPropsWithoutRef } from "react";
import { cn } from "../utils/cn";

export interface SegmentedControlOption {
  label: string;
  value: string;
  /** Optional count suffix (`· N`), shown only when > 0 — never "· 0". */
  count?: number;
}

export interface SegmentedControlProps
  extends Omit<ComponentPropsWithoutRef<"div">, "onChange"> {
  options: SegmentedControlOption[];
  value: string;
  onChange: (value: string) => void;
  /** Required — names the group of views for assistive tech. */
  "aria-label": string;
}

/**
 * SegmentedControl — one bordered track with a sliding thumb, for switching
 * between **2–3 sibling views** (sub-tabs within a page). Equal columns so the
 * thumb is exactly one cell wide; the thumb moves by `transform` only (never
 * `left`/`width`), and color is the only thing that changes between states, so
 * the row never shifts.
 *
 * Use this for one-of-N *views* (tablist). For picking a *value* (a form-style
 * choice) reach for {@link Toggle} (radiogroup) instead. For >3 options or long
 * labels, use a Dropdown or a horizontal chip rail.
 */
export function SegmentedControl({
  options,
  value,
  onChange,
  className,
  ...rest
}: SegmentedControlProps) {
  const activeIndex = Math.max(
    0,
    options.findIndex((o) => o.value === value),
  );
  const count = options.length;

  return (
    <div
      className={cn("ml-segmented", className)}
      role="tablist"
      style={{ "--ml-seg-count": count } as React.CSSProperties}
      {...rest}
    >
      <span
        aria-hidden="true"
        className="ml-segmented-thumb"
        style={{ transform: `translateX(calc(${activeIndex} * 100%))` }}
      />
      {options.map((opt) => {
        const selected = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={selected}
            className="ml-segmented-btn"
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
            {opt.count != null && opt.count > 0 && (
              <span className="ml-segmented-count"> · {opt.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
