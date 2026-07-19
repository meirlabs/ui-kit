import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { DeleteButton } from "./DeleteButton";

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
    expect(loadingBtn).toBeDisabled();
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
});
