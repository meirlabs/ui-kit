import { act, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ToastProvider, useToast, type ToastOptions } from "../hooks/useToast";

/** A tiny harness that exposes the toast API through buttons. */
function Harness({ options }: { options: ToastOptions }) {
  const { toast, dismissAll } = useToast();
  return (
    <div>
      <button onClick={() => toast(options)}>enqueue</button>
      <button onClick={() => dismissAll()}>dismiss all</button>
    </div>
  );
}

function renderWithProvider(
  options: ToastOptions,
  providerProps?: Partial<Parameters<typeof ToastProvider>[0]>,
) {
  return render(
    <ToastProvider {...providerProps}>
      <Harness options={options} />
    </ToastProvider>,
  );
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
});

describe("Toast", () => {
  it("enqueues a toast on demand", () => {
    renderWithProvider({ title: "Saved", description: "Your changes are saved." });
    expect(screen.queryByText("Saved")).not.toBeInTheDocument();

    act(() => {
      screen.getByText("enqueue").click();
    });

    expect(screen.getByText("Saved")).toBeInTheDocument();
    expect(screen.getByText("Your changes are saved.")).toBeInTheDocument();
  });

  it("exposes a live region and the right role per tone", () => {
    renderWithProvider({ title: "Delete failed", tone: "danger" });
    act(() => {
      screen.getByText("enqueue").click();
    });

    const region = screen.getByRole("region", { name: "Notifications" });
    expect(region).toBeInTheDocument();

    const alert = screen.getByRole("alert");
    expect(alert).toHaveAttribute("aria-live", "assertive");
    expect(within(alert).getByText("Delete failed")).toBeInTheDocument();
  });

  it("announces neutral toasts politely via role=status", () => {
    renderWithProvider({ title: "Copied", tone: "neutral" });
    act(() => {
      screen.getByText("enqueue").click();
    });
    const status = screen.getByRole("status");
    expect(status).toHaveAttribute("aria-live", "polite");
  });

  it("auto-dismisses after the duration elapses", () => {
    renderWithProvider({ title: "Ephemeral", duration: 1000 });
    act(() => {
      screen.getByText("enqueue").click();
    });
    expect(screen.getByText("Ephemeral")).toBeInTheDocument();

    // Run past the duration + the exit animation window.
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(screen.queryByText("Ephemeral")).not.toBeInTheDocument();
  });

  it("does not auto-dismiss when duration is 0", () => {
    renderWithProvider({ title: "Sticky", duration: 0 });
    act(() => {
      screen.getByText("enqueue").click();
    });
    act(() => {
      vi.advanceTimersByTime(10000);
    });
    expect(screen.getByText("Sticky")).toBeInTheDocument();
  });

  it("dismisses on the close button", () => {
    renderWithProvider({ title: "Closable", duration: 0 });
    act(() => {
      screen.getByText("enqueue").click();
    });

    act(() => {
      screen.getByRole("button", { name: "Dismiss notification" }).click();
    });
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(screen.queryByText("Closable")).not.toBeInTheDocument();
  });

  it("fires the action and dismisses the toast", () => {
    const onClick = vi.fn();
    renderWithProvider({
      title: "Deleted",
      duration: 0,
      action: { label: "Undo", onClick },
    });
    act(() => {
      screen.getByText("enqueue").click();
    });

    act(() => {
      screen.getByRole("button", { name: "Undo" }).click();
    });
    expect(onClick).toHaveBeenCalledTimes(1);

    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(screen.queryByText("Deleted")).not.toBeInTheDocument();
  });

  it("caps visible toasts at maxVisible and queues the rest", () => {
    function MultiHarness() {
      const { toast } = useToast();
      return (
        <button
          onClick={() => {
            toast({ title: "One", duration: 0 });
            toast({ title: "Two", duration: 0 });
            toast({ title: "Three", duration: 0 });
          }}
        >
          burst
        </button>
      );
    }
    render(
      <ToastProvider maxVisible={2}>
        <MultiHarness />
      </ToastProvider>,
    );

    act(() => {
      screen.getByText("burst").click();
    });

    expect(screen.getByText("One")).toBeInTheDocument();
    expect(screen.getByText("Two")).toBeInTheDocument();
    expect(screen.queryByText("Three")).not.toBeInTheDocument();

    // Dismiss one → the queued toast is promoted.
    act(() => {
      screen.getAllByRole("button", { name: "Dismiss notification" })[0].click();
    });
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(screen.getByText("Three")).toBeInTheDocument();
  });

  it("throws when useToast is used outside a provider", () => {
    function Orphan() {
      useToast();
      return null;
    }
    // Silence the expected React error boundary log.
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Orphan />)).toThrow(/within a <ToastProvider>/);
    spy.mockRestore();
  });
});
