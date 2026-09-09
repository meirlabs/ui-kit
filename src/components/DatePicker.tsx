import {
  type ComponentPropsWithoutRef,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "../utils/cn";
import {
  type AnchoredPlacement,
  useAnchoredPosition,
} from "../hooks/useAnchoredPosition";
import { useFocusTrap } from "../hooks/useFocusTrap";

const isBrowser = typeof document !== "undefined";

function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function addMonths(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth() + n, 1);
}

/** Like {@link addMonths} but keeps the day of month, clamped to the target
 *  month's last day (e.g. Jan 31 + 1 month → Feb 28). Used for the *focused*
 *  date, where jumping to the 1st on every PageUp/PageDown would lose the
 *  user's place. */
function addMonthsPreserveDay(d: Date, n: number): Date {
  const targetFirst = addMonths(d, n);
  const daysInTarget = new Date(
    targetFirst.getFullYear(),
    targetFirst.getMonth() + 1,
    0,
  ).getDate();
  return new Date(
    targetFirst.getFullYear(),
    targetFirst.getMonth(),
    Math.min(d.getDate(), daysInTarget),
  );
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

function isBefore(a: Date, b: Date): boolean {
  return startOfDay(a).getTime() < startOfDay(b).getTime();
}

function isAfter(a: Date, b: Date): boolean {
  return startOfDay(a).getTime() > startOfDay(b).getTime();
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function dateKey(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function toIsoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** 6 full weeks (42 days) covering `viewMonth`, so the grid height never shifts. */
function buildMonthGrid(viewMonth: Date, weekStartsOn: 0 | 1): Date[] {
  const first = startOfMonth(viewMonth);
  const offset = (first.getDay() - weekStartsOn + 7) % 7;
  const gridStart = addDays(first, -offset);
  return Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
}

function defaultFormatDate(d: Date): string {
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function longDateLabel(d: Date): string {
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export interface DatePickerProps
  extends Omit<
    ComponentPropsWithoutRef<"div">,
    "onChange" | "defaultValue" | "children"
  > {
  /** Controlled selected date. `null` clears the selection. */
  value?: Date | null;
  /** Initial selected date (uncontrolled). */
  defaultValue?: Date | null;
  /** Called when a day is selected. */
  onValueChange?: (date: Date) => void;
  /** Shown on the trigger when nothing is selected. */
  placeholder?: string;
  disabled?: boolean;
  /** Emits a hidden input (`yyyy-mm-dd`) so the value posts with a native form. */
  name?: string;
  minDate?: Date;
  maxDate?: Date;
  isDateDisabled?: (date: Date) => boolean;
  /** Preferred panel placement. Defaults to `"bottom-start"`. */
  placement?: AnchoredPlacement;
  /** Formats the trigger's displayed value. Defaults to a short localized date. */
  formatDate?: (date: Date) => string;
  /** First day of the week column. `0` = Sunday (default), `1` = Monday. */
  weekStartsOn?: 0 | 1;
  /** Accessible name for the trigger. */
  "aria-label"?: string;
}

const CalendarIcon = () => (
  <svg
    className="ml-datepicker-icon"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
  >
    <rect x="2" y="3" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
    <path d="M2 6.5h12" stroke="currentColor" strokeWidth="1.4" />
    <path d="M5 1.5v3M11 1.5v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const ChevronIcon = ({ dir }: { dir: "left" | "right" }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d={dir === "left" ? "M10 3L6 8l4 5" : "M6 3l4 5-4 5"}
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * DatePicker — an anchored calendar panel (`role="dialog"`) following the APG
 * date-picker-dialog pattern: a `role="grid"` of days with roving-tabindex
 * arrow navigation, Home/End for week bounds, PageUp/PageDown for month
 * navigation, and Escape/outside-click to dismiss and return focus. Month
 * changes get a short slide+fade transition (disabled under
 * `prefers-reduced-motion`). Positioned with {@link useAnchoredPosition} and
 * Tab-trapped with {@link useFocusTrap}, the same primitives `Popover` and
 * `Select` use.
 */
export function DatePicker({
  value: controlledValue,
  defaultValue = null,
  onValueChange,
  placeholder = "Select date…",
  disabled = false,
  name,
  minDate,
  maxDate,
  isDateDisabled,
  placement = "bottom-start",
  formatDate = defaultFormatDate,
  weekStartsOn = 0,
  className,
  "aria-label": ariaLabel,
  ...rest
}: DatePickerProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState<Date | null>(defaultValue);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolledValue;

  const [open, setOpenState] = useState(false);
  const today = useMemo(() => startOfDay(new Date()), []);
  const [viewMonth, setViewMonth] = useState(() => startOfMonth(value ?? today));
  const [focusedDate, setFocusedDate] = useState(() => value ?? today);
  const [direction, setDirection] = useState<"next" | "prev" | null>(null);

  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const floatingRef = useRef<HTMLDivElement | null>(null);
  const dayRefs = useRef(new Map<string, HTMLButtonElement>());
  // Only the day-grid keyboard handlers (arrows/Home/End/PageUp/PageDown) should
  // pull DOM focus onto the roving cell. Header nav-button clicks update the
  // grid too, but must leave focus on the button that was activated.
  const followFocusRef = useRef(false);
  const latestValueRef = useRef(value);
  latestValueRef.current = value;

  const contentId = useId();
  const titleId = useId();

  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  const { floatingStyle, placement: resolved } = useAnchoredPosition(
    triggerRef,
    floatingRef,
    { open: mounted, placement, offset: 8 },
  );

  const isDisabled = useCallback(
    (d: Date) => {
      if (minDate && isBefore(d, minDate)) return true;
      if (maxDate && isAfter(d, maxDate)) return true;
      return isDateDisabled?.(d) ?? false;
    },
    [minDate, maxDate, isDateDisabled],
  );

  const setOpen = useCallback((next: boolean) => {
    setOpenState(next);
  }, []);

  const goToMonth = useCallback((next: Date, dir: "next" | "prev" | null) => {
    setDirection(dir);
    setViewMonth(startOfMonth(next));
  }, []);

  const commitFocusedDate = useCallback(
    (next: Date, dir: "next" | "prev" | null = null) => {
      followFocusRef.current = true;
      setFocusedDate(next);
      if (!isSameMonth(next, viewMonth)) goToMonth(next, dir ?? (isAfter(next, viewMonth) ? "next" : "prev"));
    },
    [viewMonth, goToMonth],
  );

  const select = useCallback(
    (d: Date) => {
      if (isDisabled(d)) return;
      if (!isControlled) setUncontrolledValue(d);
      onValueChange?.(d);
      setFocusedDate(d);
      setOpen(false);
      triggerRef.current?.focus({ preventScroll: true });
    },
    [isControlled, isDisabled, onValueChange, setOpen],
  );

  // Reset the view/focus to the current value on the closed->open edge only.
  // Reads `value` via a ref (not a dependency) so a controlled `value` that's a
  // fresh Date instance each render (e.g. `new Date(iso)`) doesn't reset an
  // already-open panel's navigation on every unrelated parent re-render.
  useEffect(() => {
    if (!open) return;
    const anchor = latestValueRef.current ?? today;
    setViewMonth(startOfMonth(anchor));
    setFocusedDate(anchor);
    setDirection(null);
  }, [open, today]);

  // Mount/unmount around the enter/exit transition (matches Popover/Select).
  useEffect(() => {
    if (open) {
      setMounted(true);
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf);
    }
    setVisible(false);
    const t = setTimeout(() => setMounted(false), 200);
    return () => clearTimeout(t);
  }, [open]);

  // Move DOM focus to the roving cell whenever it changes while open — but
  // only when the change came from a grid keyboard interaction. Header
  // nav-button clicks also move `focusedDate`/`viewMonth`, and must leave
  // focus on the button that was activated instead of stealing it.
  useEffect(() => {
    if (!mounted || !open) return;
    if (!followFocusRef.current) return;
    followFocusRef.current = false;
    const el = dayRefs.current.get(dateKey(focusedDate));
    el?.focus({ preventScroll: true });
  }, [mounted, open, focusedDate, viewMonth]);

  // Escape + outside-click dismiss (matches Popover.Content).
  useEffect(() => {
    if (!mounted || !open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.stopPropagation();
      setOpen(false);
      triggerRef.current?.focus({ preventScroll: true });
    };
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (floatingRef.current?.contains(target)) return;
      if (triggerRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown, true);
    document.addEventListener("pointerdown", onPointerDown, true);
    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      document.removeEventListener("pointerdown", onPointerDown, true);
    };
  }, [mounted, open, setOpen]);

  const trapRef = useFocusTrap<HTMLDivElement>(mounted && open, { returnFocus: false });
  // useFocusTrap owns Tab-cycling; DatePicker owns the floating panel's DOM ref.
  const setFloatingRef = useCallback(
    (node: HTMLDivElement | null) => {
      floatingRef.current = node;
      trapRef.current = node;
    },
    [trapRef],
  );

  function onGridKeyDown(e: React.KeyboardEvent) {
    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        commitFocusedDate(addDays(focusedDate, -1));
        break;
      case "ArrowRight":
        e.preventDefault();
        commitFocusedDate(addDays(focusedDate, 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        commitFocusedDate(addDays(focusedDate, -7));
        break;
      case "ArrowDown":
        e.preventDefault();
        commitFocusedDate(addDays(focusedDate, 7));
        break;
      case "Home": {
        e.preventDefault();
        const offset = (focusedDate.getDay() - weekStartsOn + 7) % 7;
        commitFocusedDate(addDays(focusedDate, -offset));
        break;
      }
      case "End": {
        e.preventDefault();
        const offset = (focusedDate.getDay() - weekStartsOn + 7) % 7;
        commitFocusedDate(addDays(focusedDate, 6 - offset));
        break;
      }
      case "PageUp": {
        e.preventDefault();
        const next = addMonthsPreserveDay(focusedDate, e.shiftKey ? -12 : -1);
        followFocusRef.current = true;
        setFocusedDate(next);
        goToMonth(next, "prev");
        break;
      }
      case "PageDown": {
        e.preventDefault();
        const next = addMonthsPreserveDay(focusedDate, e.shiftKey ? 12 : 1);
        followFocusRef.current = true;
        setFocusedDate(next);
        goToMonth(next, "next");
        break;
      }
      case "Enter":
      case " ":
        e.preventDefault();
        select(focusedDate);
        break;
      default:
        break;
    }
  }

  const grid = useMemo(() => buildMonthGrid(viewMonth, weekStartsOn), [viewMonth, weekStartsOn]);
  const weeks = useMemo(() => {
    const out: Date[][] = [];
    for (let i = 0; i < grid.length; i += 7) out.push(grid.slice(i, i + 7));
    return out;
  }, [grid]);

  const weekdayLabels = useMemo(() => {
    const fmt = new Intl.DateTimeFormat(undefined, { weekday: "short" });
    return grid.slice(0, 7).map((d) => fmt.format(d));
  }, [grid]);

  const monthTitle = useMemo(
    () => new Intl.DateTimeFormat(undefined, { month: "long", year: "numeric" }).format(viewMonth),
    [viewMonth],
  );

  const monthKey = `${viewMonth.getFullYear()}-${viewMonth.getMonth()}`;

  return (
    <div className={cn("ml-datepicker", className)} {...rest}>
      <button
        type="button"
        ref={triggerRef}
        className="ml-select-trigger ml-datepicker-trigger"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? contentId : undefined}
        aria-label={ariaLabel}
        aria-disabled={disabled || undefined}
        disabled={disabled}
        data-placeholder={value ? undefined : "true"}
        onClick={() => !disabled && setOpen(!open)}
      >
        <span className="ml-select-value">
          {value ? formatDate(value) : <span className="ml-select-placeholder">{placeholder}</span>}
        </span>
        <CalendarIcon />
      </button>
      {name ? <input type="hidden" name={name} value={value ? toIsoDate(value) : ""} /> : null}

      {isBrowser && mounted
        ? createPortal(
            <div
              ref={setFloatingRef}
              id={contentId}
              role="dialog"
              aria-label={ariaLabel ? `${ariaLabel} calendar` : "Choose date"}
              tabIndex={-1}
              className="ml-datepicker-panel"
              data-placement={resolved}
              data-open={visible ? "true" : "false"}
              style={{
                ...floatingStyle,
                zIndex: "var(--ml-z-popover, 1200)" as unknown as number,
              }}
            >
              <div className="ml-datepicker-header">
                <button
                  type="button"
                  className="ml-datepicker-nav"
                  aria-label="Previous month"
                  onClick={() => {
                    const next = addMonths(viewMonth, -1);
                    goToMonth(next, "prev");
                    setFocusedDate((prev) => addMonthsPreserveDay(prev, -1));
                  }}
                >
                  <ChevronIcon dir="left" />
                </button>
                <div id={titleId} className="ml-datepicker-title" aria-live="polite">
                  {monthTitle}
                </div>
                <button
                  type="button"
                  className="ml-datepicker-nav"
                  aria-label="Next month"
                  onClick={() => {
                    const next = addMonths(viewMonth, 1);
                    goToMonth(next, "next");
                    setFocusedDate((prev) => addMonthsPreserveDay(prev, 1));
                  }}
                >
                  <ChevronIcon dir="right" />
                </button>
              </div>

              <div
                key={monthKey}
                role="grid"
                aria-labelledby={titleId}
                className="ml-datepicker-grid"
                data-direction={direction ?? undefined}
                onKeyDown={onGridKeyDown}
              >
                <div role="row" className="ml-datepicker-row ml-datepicker-weekdays">
                  {weekdayLabels.map((label, i) => (
                    <div key={i} role="columnheader" className="ml-datepicker-weekday" aria-label={label}>
                      {label}
                    </div>
                  ))}
                </div>
                {weeks.map((week, wi) => (
                  <div key={wi} role="row" className="ml-datepicker-row">
                    {week.map((d) => {
                      const outside = !isSameMonth(d, viewMonth);
                      const selected = value != null && isSameDay(d, value);
                      const isToday = isSameDay(d, today);
                      const focusable = isSameDay(d, focusedDate);
                      const dDisabled = isDisabled(d);
                      return (
                        <button
                          key={dateKey(d)}
                          ref={(el) => {
                            if (el) dayRefs.current.set(dateKey(d), el);
                            else dayRefs.current.delete(dateKey(d));
                          }}
                          type="button"
                          role="gridcell"
                          className="ml-datepicker-day"
                          aria-label={longDateLabel(d)}
                          aria-selected={selected}
                          aria-current={isToday ? "date" : undefined}
                          aria-disabled={dDisabled || undefined}
                          data-outside={outside || undefined}
                          data-selected={selected || undefined}
                          data-today={isToday || undefined}
                          tabIndex={focusable ? 0 : -1}
                          onClick={() => select(d)}
                          onFocus={() => setFocusedDate(d)}
                        >
                          {d.getDate()}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
