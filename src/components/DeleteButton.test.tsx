import { useState } from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { DeleteButton, type DeleteButtonPhase } from "./DeleteButton";

function mockRect(width: number): DOMRect {
  return {
    width,
    height: 0,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  };
}

describe("DeleteButton", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("starts idle with the trash label and arms on first click", () => {
    const onDelete = vi.fn();
    render(<DeleteButton onDelete={onDelete} />);

    const btn = screen.getByRole("button", { name: "Delete" });
    expect(btn).toHaveClass("ml-delete-btn-idle");

    fireEvent.click(btn);
    expect(onDelete).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Confirm delete" })).toHaveClass(
      "ml-delete-btn-confirm",
    );
  });

  it("second click confirms, calls onDelete, and walks loading -> done -> idle", async () => {
    let resolveDelete: () => void;
    const onDelete = vi.fn(
      () => new Promise<void>((resolve) => (resolveDelete = resolve)),
    );
    render(<DeleteButton onDelete={onDelete} doneTimeoutMs={500} />);

    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    fireEvent.click(screen.getByRole("button", { name: "Confirm delete" }));

    expect(onDelete).toHaveBeenCalledTimes(1);
    const loadingBtn = screen.getByRole("button", { name: "Deleting…" });
    expect(loadingBtn).toHaveClass("ml-delete-btn-loading");
    // Not the native `disabled` attribute -- that would evict keyboard focus
    // to <body> with no way back. aria-disabled communicates the same thing
    // to assistive tech while keeping the element focusable.
    expect(loadingBtn).not.toBeDisabled();
    expect(loadingBtn).toHaveAttribute("aria-disabled", "true");
    expect(loadingBtn).toHaveAttribute("aria-busy", "true");

    await act(async () => {
      resolveDelete();
      await Promise.resolve();
    });
    expect(screen.getByRole("button", { name: "Deleted" })).toHaveClass(
      "ml-delete-btn-done",
    );

    await act(async () => {
      vi.advanceTimersByTime(500);
    });
    expect(screen.getByRole("button", { name: "Delete" })).toHaveClass(
      "ml-delete-btn-idle",
    );
  });

  it("reverts to idle if onDelete rejects", async () => {
    const onDelete = vi.fn().mockRejectedValue(new Error("nope"));
    render(<DeleteButton onDelete={onDelete} />);

    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    fireEvent.click(screen.getByRole("button", { name: "Confirm delete" }));

    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });
    expect(screen.getByRole("button", { name: "Delete" })).toHaveClass(
      "ml-delete-btn-idle",
    );
  });

  it("auto-reverts the armed state after confirmTimeoutMs", () => {
    const onDelete = vi.fn();
    render(<DeleteButton onDelete={onDelete} confirmTimeoutMs={1000} />);

    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(screen.getByRole("button", { name: "Confirm delete" })).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
    expect(onDelete).not.toHaveBeenCalled();
  });

  it("Escape cancels the armed state back to idle", () => {
    render(<DeleteButton onDelete={vi.fn()} />);

    const btn = screen.getByRole("button", { name: "Delete" });
    fireEvent.click(btn);
    fireEvent.keyDown(screen.getByRole("button", { name: "Confirm delete" }), {
      key: "Escape",
    });
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
  });

  it("blurring the armed button cancels back to idle", () => {
    render(
      <>
        <DeleteButton onDelete={vi.fn()} />
        <button>elsewhere</button>
      </>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    fireEvent.blur(screen.getByRole("button", { name: "Confirm delete" }));
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
  });

  it("supports custom labels and size", () => {
    render(
      <DeleteButton
        onDelete={vi.fn()}
        label="Remove"
        confirmLabel="Really remove?"
        size="lg"
      />,
    );
    const btn = screen.getByRole("button", { name: "Remove" });
    expect(btn).toHaveClass("ml-btn-size-lg");
    fireEvent.click(btn);
    expect(screen.getByRole("button", { name: "Really remove?" })).toBeInTheDocument();
  });

  it("calls onPhaseChange as the state machine advances", () => {
    const onPhaseChange = vi.fn();
    render(<DeleteButton onDelete={vi.fn()} onPhaseChange={onPhaseChange} />);

    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(onPhaseChange).toHaveBeenCalledWith("confirm");
  });

  it("does not re-fire onPhaseChange when only the callback's identity changes", () => {
    const calls: DeleteButtonPhase[] = [];
    function Wrapper() {
      const [tick, setTick] = useState(0);
      return (
        <>
          <DeleteButton onDelete={vi.fn()} onPhaseChange={(phase) => calls.push(phase)} />
          <button onClick={() => setTick((t) => t + 1)}>rerender {tick}</button>
        </>
      );
    }
    render(<Wrapper />);
    expect(calls).toEqual(["idle"]);

    // Each click re-renders Wrapper, which passes a brand-new inline arrow
    // as onPhaseChange -- the common call-site pattern. The phase itself
    // never changes, so the callback must not fire again.
    fireEvent.click(screen.getByRole("button", { name: /rerender/ }));
    fireEvent.click(screen.getByRole("button", { name: /rerender/ }));

    expect(calls).toEqual(["idle"]);
  });

  it("keeps keyboard focus on the button through a full Enter->Enter delete cycle", async () => {
    let resolveDelete: () => void;
    const onDelete = vi.fn(
      () => new Promise<void>((resolve) => (resolveDelete = resolve)),
    );
    render(<DeleteButton onDelete={onDelete} doneTimeoutMs={500} />);

    const idleBtn = screen.getByRole("button", { name: "Delete" });
    idleBtn.focus();
    expect(document.activeElement).toBe(idleBtn);

    fireEvent.click(idleBtn);
    fireEvent.click(screen.getByRole("button", { name: "Confirm delete" }));

    const loadingBtn = screen.getByRole("button", { name: "Deleting…" });
    expect(document.activeElement).toBe(loadingBtn);

    await act(async () => {
      resolveDelete();
      await Promise.resolve();
    });
    const doneBtn = screen.getByRole("button", { name: "Deleted" });
    expect(document.activeElement).toBe(doneBtn);

    await act(async () => {
      vi.advanceTimersByTime(500);
    });
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Delete" }));
  });

  it("does not pin an inline width on initial mount", () => {
    const rectSpy = vi
      .spyOn(HTMLElement.prototype, "getBoundingClientRect")
      .mockReturnValue(mockRect(80));

    render(<DeleteButton onDelete={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Delete" }).style.width).toBe("");

    rectSpy.mockRestore();
  });

  it("clears the pinned width without relying on transitionend (prefers-reduced-motion safe)", async () => {
    vi.useRealTimers();
    let call = 0;
    const rectSpy = vi
      .spyOn(HTMLElement.prototype, "getBoundingClientRect")
      .mockImplementation(() => {
        call += 1;
        return mockRect(call % 2 === 1 ? 80 : 200);
      });

    render(<DeleteButton onDelete={vi.fn()} />);
    // The mount run is a no-op (didMountRef); this click is the first morph
    // that actually assigns an inline width.
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    await screen.findByRole("button", { name: "Confirm delete" });

    // jsdom never fires a real `transitionend` -- exactly what happens under
    // prefers-reduced-motion, where `width` is dropped from the CSS
    // transition list. The fallback timer must clear the pin regardless.
    await new Promise((resolve) => setTimeout(resolve, 300));

    expect(screen.getByRole("button", { name: "Confirm delete" }).style.width).toBe("");

    rectSpy.mockRestore();
  });

  it("re-measures the width morph when only the label changes at the same phase", async () => {
    vi.useRealTimers();
    let call = 0;
    const rectSpy = vi
      .spyOn(HTMLElement.prototype, "getBoundingClientRect")
      .mockImplementation(() => {
        call += 1;
        return mockRect(call % 2 === 1 ? 80 : 200);
      });

    const { rerender } = render(<DeleteButton onDelete={vi.fn()} label="Delete" />);
    // Simulate a width left over from a still-in-flight morph -- with the
    // old `[phase]`-only deps this would never get re-measured or cleared
    // because the phase stays "idle" across the label change.
    screen.getByRole("button", { name: "Delete" }).style.width = "40px";

    rerender(<DeleteButton onDelete={vi.fn()} label="Delete permanently" />);
    await new Promise((resolve) => setTimeout(resolve, 300));

    expect(screen.getByRole("button", { name: "Delete permanently" }).style.width).toBe("");

    rectSpy.mockRestore();
  });
});
