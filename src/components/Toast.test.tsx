import { act, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Toaster, toast } from "./Toast";

/**
 * Sonner mounts the toaster element lazily — it renders nothing until the
 * first toast fires. Fire one, then grab the region.
 */
async function showToasterWith(message: string): Promise<HTMLElement> {
  act(() => {
    toast(message);
  });
  await screen.findByText(message);
  const el = document.querySelector<HTMLElement>("[data-sonner-toaster]");
  if (!el) throw new Error("toaster not rendered");
  return el;
}

beforeEach(() => {
  // Sonner keeps toast state at module level — clear it between tests.
  act(() => {
    toast.dismiss();
  });
});

describe("Toaster", () => {
  it("exposes sonner's full toast API", () => {
    expect(toast).toBeTypeOf("function");
    expect(toast.success).toBeTypeOf("function");
    expect(toast.error).toBeTypeOf("function");
    expect(toast.warning).toBeTypeOf("function");
    expect(toast.info).toBeTypeOf("function");
    expect(toast.message).toBeTypeOf("function");
    expect(toast.loading).toBeTypeOf("function");
    expect(toast.promise).toBeTypeOf("function");
    expect(toast.custom).toBeTypeOf("function");
    expect(toast.dismiss).toBeTypeOf("function");
  });

  it("renders the kit-themed toaster region at bottom-right by default", async () => {
    render(<Toaster />);
    const toaster = await showToasterWith("region check");
    expect(toaster).toHaveClass("ml-toaster");
    expect(toaster).toHaveAttribute("data-y-position", "bottom");
    expect(toaster).toHaveAttribute("data-x-position", "right");
  });

  it("maps placement to sonner's position", async () => {
    render(<Toaster placement="top-center" />);
    const toaster = await showToasterWith("placement check");
    expect(toaster).toHaveAttribute("data-y-position", "top");
    expect(toaster).toHaveAttribute("data-x-position", "center");
  });

  it("forwards dir for RTL pages", async () => {
    render(<Toaster dir="rtl" />);
    const toaster = await showToasterWith("dir check");
    expect(toaster).toHaveAttribute("dir", "rtl");
  });

  it("shows a toast when toast() fires", async () => {
    render(<Toaster />);
    act(() => {
      toast("Changes saved", { description: "Everything is up to date." });
    });

    expect(await screen.findByText("Changes saved")).toBeInTheDocument();
    expect(
      await screen.findByText("Everything is up to date."),
    ).toBeInTheDocument();
  });

  it("applies the kit classNames to the toast slots", async () => {
    render(<Toaster />);
    act(() => {
      toast.success("Deployed", { description: "Now live." });
    });

    const title = await screen.findByText("Deployed");
    expect(title).toHaveClass("ml-toast-title");
    expect(await screen.findByText("Now live.")).toHaveClass(
      "ml-toast-description",
    );

    const item = title.closest("[data-sonner-toast]");
    expect(item).toHaveClass("ml-toast");
    expect(item).toHaveClass("ml-toast-success");
  });

  it("maps toast.error to the kit's danger tone", async () => {
    render(<Toaster />);
    act(() => {
      toast.error("Delete failed");
    });

    const item = (await screen.findByText("Delete failed")).closest(
      "[data-sonner-toast]",
    );
    expect(item).toHaveClass("ml-toast-danger");
  });

  it("merges consumer classNames with the kit's instead of replacing them", async () => {
    render(
      <Toaster toastOptions={{ classNames: { toast: "custom-toast" } }} />,
    );
    act(() => {
      toast("Merged");
    });

    const item = (await screen.findByText("Merged")).closest(
      "[data-sonner-toast]",
    );
    expect(item).toHaveClass("ml-toast");
    expect(item).toHaveClass("custom-toast");
  });

  it("renders injected icons (icon passthrough)", async () => {
    render(
      <Toaster icons={{ success: <span data-testid="custom-icon" /> }} />,
    );
    act(() => {
      toast.success("With icon");
    });

    expect(await screen.findByTestId("custom-icon")).toBeInTheDocument();
  });

  it("shakes the existing toast instead of stacking a duplicate", async () => {
    render(<Toaster />);
    act(() => {
      toast("Saved");
    });
    await screen.findByText("Saved");

    act(() => {
      toast("Saved");
    });

    const items = document.querySelectorAll(
      '[data-sonner-toast]:not([data-removed="true"])',
    );
    expect(items).toHaveLength(1);
    expect(items[0]).toHaveClass("ml-toast-shake");
  });

  it("brings a buried duplicate back to the front instead of stacking it", async () => {
    render(<Toaster />);
    act(() => {
      toast("First message");
    });
    await screen.findByText("First message");
    act(() => {
      toast("Newer message");
    });
    await screen.findByText("Newer message");

    // "First message" is now behind "Newer message" — re-firing it must move
    // it to the front with a fresh timer, not add a copy.
    act(() => {
      toast("First message");
    });

    await waitFor(() => {
      const front = document.querySelector(
        '[data-sonner-toast][data-front="true"]:not([data-removed="true"])',
      );
      expect(front).toHaveTextContent("First message");
    });
    await waitFor(() => {
      expect(
        document.querySelectorAll(
          '[data-sonner-toast]:not([data-removed="true"])',
        ),
      ).toHaveLength(2);
    });
  });

  it("still stacks genuinely different messages", async () => {
    render(<Toaster />);
    act(() => {
      toast("Saved");
      toast("Saved", { description: "But with news." });
      toast.error("Saved");
    });
    await screen.findByText("But with news.");

    expect(
      document.querySelectorAll(
        '[data-sonner-toast]:not([data-removed="true"])',
      ),
    ).toHaveLength(3);
  });

  it("dedupes again after the duplicate is dismissed", async () => {
    render(<Toaster />);
    let id: string | number = "";
    act(() => {
      id = toast("Round trip");
    });
    await screen.findByText("Round trip");
    act(() => {
      toast.dismiss(id);
    });
    await waitFor(() => {
      expect(
        document.querySelectorAll(
          '[data-sonner-toast]:not([data-removed="true"])',
        ),
      ).toHaveLength(0);
    });

    // Gone from screen → firing the same message shows a fresh toast again.
    act(() => {
      toast("Round trip");
    });
    await waitFor(() => {
      const items = document.querySelectorAll(
        '[data-sonner-toast]:not([data-removed="true"])',
      );
      expect(items).toHaveLength(1);
      expect(items[0]).not.toHaveClass("ml-toast-shake");
    });
  });

  it("fires the action button's handler", async () => {
    const onClick = vi.fn();
    render(<Toaster />);
    act(() => {
      toast("Item deleted", { action: { label: "Undo", onClick } });
    });

    const button = await screen.findByRole("button", { name: "Undo" });
    expect(button).toHaveClass("ml-toast-action");
    act(() => {
      button.click();
    });
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
