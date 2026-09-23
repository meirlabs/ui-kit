import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { CalendarHeatmap, type CalendarHeatmapDay } from "./CalendarHeatmap";

const days: CalendarHeatmapDay[] = Array.from({ length: 14 }, (_, i) => ({ date: `2026-09-${String(i + 1).padStart(2, "0")}`, level: i === 0 ? null : i === 1 ? 0 : 3, label: `Day ${i + 1}: ${i === 0 ? "No data" : `${i} activities`}` }));

describe("CalendarHeatmap", () => {
  it("distinguishes missing data and measured zero, placing dates on their weekdays", () => {
    render(<CalendarHeatmap days={days} aria-label="Activity" />);
    expect(screen.getByRole("button", { name: /Day 1:/ })).toHaveAttribute("data-level", "missing");
    expect(screen.getByRole("button", { name: /Day 2:/ })).toHaveAttribute("data-level", "0");
    expect(screen.getByRole("button", { name: /Day 1:/ })).toHaveStyle({ gridRow: "3", gridColumn: "1" });
  });
  it("has one tab stop and follows week columns with arrow keys", () => {
    const select = vi.fn();
    render(<CalendarHeatmap days={days} aria-label="Activity" onSelect={select} />);
    expect(screen.getAllByRole("button").filter((el) => el.tabIndex === 0)).toHaveLength(1);
    const last = screen.getByRole("button", { name: /Day 14:/ });
    fireEvent.keyDown(last, { key: "ArrowLeft" });
    expect(screen.getByRole("button", { name: /Day 7:/ })).toHaveFocus();
    expect(select).toHaveBeenLastCalledWith("2026-09-07");
    fireEvent.keyDown(document.activeElement!, { key: "Home" });
    expect(screen.getByRole("button", { name: /Day 1:/ })).toHaveFocus();
    fireEvent.keyDown(document.activeElement!, { key: "ArrowUp" });
    expect(screen.getByRole("button", { name: /Day 1:/ })).toHaveFocus();
  });
  it("selects a tapped date", () => {
    const select = vi.fn();
    render(<CalendarHeatmap days={days} aria-label="Activity" onSelect={select} selectedDate="2026-09-03" />);
    fireEvent.click(screen.getByRole("button", { name: /Day 4:/ }));
    expect(select).toHaveBeenCalledWith("2026-09-04");
    expect(screen.getByRole("button", { name: /Day 3:/ })).toHaveAttribute("aria-pressed", "true");
  });
});
