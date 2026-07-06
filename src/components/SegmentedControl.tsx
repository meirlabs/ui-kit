import {
  type ComponentPropsWithoutRef,
  type ReactNode,
  useCallback,
  useRef,
} from "react";
import { cn } from "../utils/cn";

export interface SegmentedControlOption {
  label: string;
  value: string;
  /** Optional count suffix (`· N`), shown only when > 0 — never "· 0". */
  count?: number;
  /** Optional leading icon (icon-agnostic ReactNode), rendered before the label. */
  icon?: ReactNode;
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
 * between **2–3 sibling views** (sub-tabs within a page). Follows the APG
 * Tabs pattern: a roving tabindex keeps a single tab in the tab sequence and
 * ArrowLeft/Right (Home/End) move focus **and** selection.
 *
 * Equal columns so the thumb is exactly one cell wide; the thumb moves by
 * `transform` only (never `left`/`width`, reduced-motion guarded), and color is
 * the only thing that changes between states, so the row never shifts. Counts
 * use `tabular-nums`.
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
  const btnRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeIndex = Math.max(
    0,
    options.findIndex((o) => o.value === value),
  );
  const count = options.length;

  const move = useCallback(
    (index: number) => {
      const opt = options[index];
      if (!opt) return;
      btnRefs.current[index]?.focus();
      onChange(opt.value);
    },
    [onChange, options],
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      const n = options.length;
      let target: number | null = null;
      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
          target = (index + 1) % n;
          break;
        case "ArrowLeft":
        case "ArrowUp":
          target = (index - 1 + n) % n;
          break;
        case "Home":
          target = 0;
          break;
        case "End":
          target = n - 1;
          break;
        default:
          return;
      }
      if (target != null) {
        e.preventDefault();
        move(target);
      }
    },
    [move, options.length],
  );

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
      {options.map((opt, i) => {
        const selected = opt.value === value;
        return (
          <button
            key={opt.value}
            ref={(el) => {
              btnRefs.current[i] = el;
            }}
            type="button"
            role="tab"
            aria-selected={selected}
            tabIndex={i === activeIndex ? 0 : -1}
            className="ml-segmented-btn"
            onClick={() => onChange(opt.value)}
            onKeyDown={(e) => onKeyDown(e, i)}
          >
            {opt.icon != null && (
              <span className="ml-segmented-icon" aria-hidden="true">
                {opt.icon}
              </span>
            )}
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
