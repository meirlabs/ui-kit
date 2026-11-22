import { createRef } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Tooltip } from "./Tooltip";

describe("Tooltip refs", () => {
  it("preserves the trigger ref without deprecated React element access", () => {
    const error = vi.spyOn(console, "error");
    const ref = createRef<HTMLButtonElement>();
    render(<Tooltip content="Daily reading" delay={0}><button ref={ref}>Day</button></Tooltip>);
    expect(ref.current).toBe(screen.getByRole("button", { name: "Day" }));
    fireEvent.focus(ref.current!);
    expect(screen.getByRole("tooltip")).toHaveTextContent("Daily reading");
    expect(error).not.toHaveBeenCalled();
    error.mockRestore();
  });
});

describe("Tooltip timers", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("leaves no timer behind when shown twice and then unmounted", () => {
    vi.useFakeTimers();
    const { unmount } = render(
      <Tooltip content="More">
        <button type="button">Trigger</button>
      </Tooltip>,
    );
    const trigger = screen.getByRole("button", { name: "Trigger" });
    // Pointer and keyboard both ask for the tooltip: two "show" calls.
    fireEvent.mouseEnter(trigger);
    fireEvent.focus(trigger);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });

  it("leaves no timer behind when hidden twice and then unmounted", () => {
    vi.useFakeTimers();
    const { unmount } = render(
      <Tooltip content="More">
        <button type="button">Trigger</button>
      </Tooltip>,
    );
    const trigger = screen.getByRole("button", { name: "Trigger" });
    fireEvent.mouseEnter(trigger);
    fireEvent.mouseLeave(trigger);
    fireEvent.blur(trigger);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
