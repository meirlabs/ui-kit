import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { DatePicker } from "./DatePicker";

// Fixed "today" so grid/keyboard-navigation assertions are deterministic.
const TODAY = new Date(2026, 8, 9); // September 9, 2026 (Wednesday)

const label = (d: Date) =>
  d.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });

function renderDatePicker(props: Partial<React.ComponentProps<typeof DatePicker>> = {}) {
  const onValueChange = vi.fn();
  render(
    <DatePicker aria-label="Appointment date" onValueChange={onValueChange} {...props} />,
  );
  return { onValueChange, trigger: screen.getByRole("button", { name: "Appointment date" }) };
}

describe("DatePicker", () => {
  it("exposes dialog-button semantics on the trigger and shows the placeholder", () => {
    const { trigger } = renderDatePicker();
    expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveTextContent("Select date…");
  });

  it("opens on click and shows a grid dialog with the value focusable and selected", () => {
    const { trigger } = renderDatePicker({ defaultValue: TODAY });
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("grid")).toBeInTheDocument();

    const selected = screen.getByRole("gridcell", { name: label(TODAY) });
    expect(selected).toHaveAttribute("aria-selected", "true");
    expect(selected).toHaveAttribute("tabindex", "0");
  });

  it("selects a day on click, updates the trigger, and closes", async () => {
    const target = new Date(2026, 8, 15);
    const { trigger, onValueChange } = renderDatePicker({ defaultValue: TODAY });
    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole("gridcell", { name: label(target) }));

    expect(onValueChange).toHaveBeenCalledTimes(1);
    const picked: Date = onValueChange.mock.calls[0][0];
    expect(picked.getDate()).toBe(15);
    expect(picked.getMonth()).toBe(8);

    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(trigger).toHaveTextContent("Sep 15, 2026");
  });

  it("moves roving focus with arrow keys and selects with Enter", () => {
    const { trigger, onValueChange } = renderDatePicker({ defaultValue: TODAY });
    fireEvent.click(trigger);

    const grid = screen.getByRole("grid");
    fireEvent.keyDown(grid, { key: "ArrowRight" });
    expect(document.activeElement).toHaveAccessibleName(label(new Date(2026, 8, 10)));

    fireEvent.keyDown(grid, { key: "ArrowDown" });
    expect(document.activeElement).toHaveAccessibleName(label(new Date(2026, 8, 17)));

    fireEvent.keyDown(document.activeElement!, { key: "Enter" });
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange.mock.calls[0][0].getDate()).toBe(17);
  });

  it("Home/End move to the start/end of the focused week", () => {
    const { trigger } = renderDatePicker({ defaultValue: TODAY });
    fireEvent.click(trigger);
    const grid = screen.getByRole("grid");

    fireEvent.keyDown(grid, { key: "Home" });
    expect(document.activeElement).toHaveAccessibleName(label(new Date(2026, 8, 6)));

    fireEvent.keyDown(document.activeElement!, { key: "End" });
    expect(document.activeElement).toHaveAccessibleName(label(new Date(2026, 8, 12)));
  });

  it("navigates months with the header buttons and updates the title", () => {
    const { trigger } = renderDatePicker({ defaultValue: TODAY });
    fireEvent.click(trigger);
    expect(screen.getByText("September 2026")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Next month" }));
    expect(screen.getByText("October 2026")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Previous month" }));
    fireEvent.click(screen.getByRole("button", { name: "Previous month" }));
    expect(screen.getByText("August 2026")).toBeInTheDocument();
  });

  it("closes on Escape and returns focus to the trigger", async () => {
    const { trigger } = renderDatePicker({ defaultValue: TODAY });
    fireEvent.click(trigger);
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.keyDown(screen.getByRole("grid"), { key: "Escape" });
    expect(document.activeElement).toBe(trigger);
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("does not select a disabled day", () => {
    const minDate = new Date(2026, 8, 10);
    const disabledDate = new Date(2026, 8, 5);
    const { trigger, onValueChange } = renderDatePicker({ defaultValue: TODAY, minDate });
    fireEvent.click(trigger);

    const disabledDay = screen.getByRole("gridcell", { name: label(disabledDate) });
    expect(disabledDay).toHaveAttribute("aria-disabled", "true");
    fireEvent.click(disabledDay);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("emits a hidden input with an ISO date when name is set", () => {
    const { container } = render(
      <DatePicker aria-label="Appointment date" name="appointment" defaultValue={TODAY} />,
    );
    const hidden = container.querySelector('input[name="appointment"]');
    expect(hidden).toHaveValue("2026-09-09");
  });
});
