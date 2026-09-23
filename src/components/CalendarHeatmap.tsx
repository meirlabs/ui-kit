import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { Tooltip } from "./Tooltip";
import { cn } from "../utils/cn";

export interface CalendarHeatmapDay {
  /** Consecutive ISO calendar dates, oldest first. */
  date: string;
  /** null is missing data, distinct from measured zero. */
  level: 0 | 1 | 2 | 3 | 4 | null;
  /** Full date and value, used for both the accessible name and tooltip. */
  label: string;
}

export interface CalendarHeatmapProps {
  days: CalendarHeatmapDay[];
  "aria-label": string;
  selectedDate?: string;
  onSelect?: (date: string) => void;
  tone?: "neutral" | "success";
  className?: string;
}

/** A calendar of daily readings. Arrow keys follow its week columns, with one tab stop. */
export function CalendarHeatmap({ days, selectedDate, onSelect, tone = "neutral", className, "aria-label": label }: CalendarHeatmapProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const buttons = useRef(new Map<string, HTMLButtonElement>());
  const [localDate, setLocalDate] = useState<string>();
  const first = days[0]?.date;
  const last = days.at(-1)?.date;
  const offset = first ? new Date(`${first}T00:00:00Z`).getUTCDay() : 0;
  const weeks = Math.ceil((offset + days.length) / 7);
  const active = days.find((day) => day.date === (selectedDate ?? localDate))?.date ?? last;
  function select(date: string) { setLocalDate(date); onSelect?.(date); }
  const months: { label: string; column: number }[] = [];
  for (let i = 0; i < days.length; i++) {
    const day = days[i]!;
    if (i !== 0 && day.date.slice(8) !== "01") continue;
    const column = Math.floor((offset + i) / 7) + 1;
    if (weeks - column < 2) continue;
    if (months.at(-1) && column - months.at(-1)!.column < 3) months.pop();
    months.push({ label: new Date(`${day.date}T00:00:00Z`).toLocaleDateString("en-US", { month: "short", timeZone: "UTC" }), column });
  }
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, [first, last]);
  useEffect(() => {
    const scroller = scrollRef.current;
    const button = active ? buttons.current.get(active) : undefined;
    if (!scroller || !button) return;
    const cell = button.getBoundingClientRect();
    const box = scroller.getBoundingClientRect();
    if (cell.left < box.left) scroller.scrollLeft -= box.left - cell.left + 3;
    if (cell.right > box.right) scroller.scrollLeft += cell.right - box.right + 3;
  }, [active]);

  function navigate(e: KeyboardEvent, index: number) {
    const delta: Record<string, number> = { ArrowLeft: -7, ArrowRight: 7, ArrowUp: -1, ArrowDown: 1 };
    const next = e.key === "Home" ? 0 : e.key === "End" ? days.length - 1
      : delta[e.key] === undefined ? null : Math.min(days.length - 1, Math.max(0, index + delta[e.key]!));
    if (next === null) return;
    e.preventDefault();
    buttons.current.get(days[next]!.date)?.focus();
  }

  return (
    <div className={cn("ml-calendar-heatmap", className)} data-tone={tone} role="group" aria-label={label}>
      <div className="ml-calendar-heatmap-weekdays" aria-hidden="true">
        <span style={{ gridRow: 3 }}>Mon</span><span style={{ gridRow: 5 }}>Wed</span><span style={{ gridRow: 7 }}>Fri</span>
      </div>
      <div className="ml-calendar-heatmap-scroll" ref={scrollRef}>
        <div className="ml-calendar-heatmap-calendar" style={{ "--ml-heatmap-weeks": weeks || 1 } as CSSProperties}>
          <div className="ml-calendar-heatmap-months" aria-hidden="true">
            {months.map((month, i) => <span key={i} style={{ gridColumn: `${month.column} / span 3` }}>{month.label}</span>)}
          </div>
          <div className="ml-calendar-heatmap-days">
            {days.map((day, index) => (
              <Tooltip key={day.date} content={day.label} delay={100}>
                <button
                  ref={(el) => { if (el) buttons.current.set(day.date, el); else buttons.current.delete(day.date); }}
                  type="button"
                  className="ml-calendar-heatmap-day"
                  data-date={day.date}
                  data-level={day.level ?? "missing"}
                  aria-label={day.label}
                  aria-pressed={active === day.date}
                  tabIndex={active === day.date ? 0 : -1}
                  style={{ gridColumn: Math.floor((offset + index) / 7) + 1, gridRow: (offset + index) % 7 + 1 }}
                  onClick={() => select(day.date)}
                  onFocus={(e) => {
                    select(day.date);
                    // Scroll only this strip; focusing a day must not move the whole page.
                    const scroller = scrollRef.current;
                    if (!scroller) return;
                    const cell = e.currentTarget.getBoundingClientRect();
                    const box = scroller.getBoundingClientRect();
                    if (cell.left < box.left) scroller.scrollLeft -= box.left - cell.left + 3;
                    if (cell.right > box.right) scroller.scrollLeft += cell.right - box.right + 3;
                  }}
                  onKeyDown={(e) => navigate(e, index)}
                />
              </Tooltip>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
