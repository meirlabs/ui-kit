import {
  type ComponentPropsWithoutRef,
  type ReactNode,
  useCallback,
  useRef,
} from "react";
import { cn } from "../utils/cn";

export interface ToggleOption {
  label: string;
  value: string;
  disabled?: boolean;
  /** Optional leading icon (icon-agnostic ReactNode), rendered before the label. */
  icon?: ReactNode;
}

export interface ToggleProps
  extends Omit<ComponentPropsWithoutRef<"div">, "onChange"> {
  options: ToggleOption[];
  active: string;
  onChange: (value: string) => void;
}

/**
 * Toggle — an APG radiogroup for **picking a value** (a form-style choice among
 * mutually exclusive options). Roving tabindex + Arrow keys move selection,
 * skipping disabled options. The selected pill uses the neutral inverted
 * treatment (`--ml-text` fill / `--ml-bg` label) — the same monochrome language
 * as {@link SegmentedControl}, so the two sibling controls agree. Weight/size/
 * padding never change between states; only color moves.
 *
 * Use this for "pick a value"; for switching between *views* reach for
 * {@link SegmentedControl} (tablist) instead.
 */
export function Toggle({
  options,
  active,
  onChange,
  className,
  ...rest
}: ToggleProps) {
  const btnRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const activeIndex = Math.max(
    0,
    options.findIndex((o) => o.value === active),
  );

  const nextEnabled = useCallback(
    (from: number, dir: 1 | -1) => {
      const n = options.length;
      for (let step = 1; step <= n; step++) {
        const i = (from + dir * step + n * step) % n;
        if (!options[i]?.disabled) return i;
      }
      return from;
    },
    [options],
  );

  const move = useCallback(
    (index: number) => {
      const opt = options[index];
      if (!opt || opt.disabled) return;
      btnRefs.current[index]?.focus();
      onChange(opt.value);
    },
    [onChange, options],
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      let target: number | null = null;
      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
          target = nextEnabled(index, 1);
          break;
        case "ArrowLeft":
        case "ArrowUp":
          target = nextEnabled(index, -1);
          break;
        case "Home":
          target = nextEnabled(-1, 1);
          break;
        case "End":
          target = nextEnabled(0, -1);
          break;
        default:
          return;
      }
      if (target != null) {
        e.preventDefault();
        move(target);
      }
    },
    [move, nextEnabled],
  );

  return (
    <div className={cn("ml-toggle", className)} role="radiogroup" {...rest}>
      {options.map((opt, i) => {
        const checked = opt.value === active;
        return (
          <button
            key={opt.value}
            ref={(el) => {
              btnRefs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={checked}
            aria-disabled={opt.disabled || undefined}
            disabled={opt.disabled}
            tabIndex={i === activeIndex ? 0 : -1}
            className={cn(checked && "active")}
            onClick={() => {
              if (!opt.disabled) onChange(opt.value);
            }}
            onKeyDown={(e) => onKeyDown(e, i)}
          >
            {opt.icon != null && (
              <span className="ml-toggle-icon" aria-hidden="true">
                {opt.icon}
              </span>
            )}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
