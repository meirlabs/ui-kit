import { useState } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeAll } from "vitest";
import { defaultFilter } from "cmdk";
import { CommandPalette, type CommandItem } from "./CommandPalette";

// cmdk touches layout APIs jsdom doesn't implement.
beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
});

function makeItems(overrides?: { onSelect?: (id: string) => void }): CommandItem[] {
  const onSelect = overrides?.onSelect ?? (() => {});
  return [
    {
      id: "new-doc",
      label: "New document",
      group: "Actions",
      keywords: ["create", "file"],
      shortcut: ["mod", "N"],
      onSelect: () => onSelect("new-doc"),
    },
    {
      id: "search",
      label: "Search everything",
      group: "Actions",
      keywords: ["find"],
      onSelect: () => onSelect("search"),
    },
    {
      id: "billing",
      label: "Go to billing",
      group: "Navigation",
      keywords: ["invoice", "payment"],
      onSelect: () => onSelect("billing"),
    },
  ];
}

const HEBREW_ITEMS: CommandItem[] = [
  { id: "he-new", label: "מסמך חדש", keywords: ["יצירה"], onSelect: () => {} },
  { id: "he-settings", label: "פתח הגדרות", keywords: ["העדפות"], onSelect: () => {} },
  { id: "he-billing", label: "מעבר לחיובים", keywords: ["חשבונית"], onSelect: () => {} },
];

function Harness({
  items,
  defaultOpen = true,
  onOpenChangeSpy,
  ...rest
}: {
  items: CommandItem[];
  defaultOpen?: boolean;
  onOpenChangeSpy?: (open: boolean) => void;
  placeholder?: string;
  emptyState?: React.ReactNode;
  enableShortcut?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <CommandPalette
      open={open}
      onOpenChange={(next) => {
        onOpenChangeSpy?.(next);
        setOpen(next);
      }}
      items={items}
      {...rest}
    />
  );
}

function getInput() {
  return screen.getByRole("combobox");
}

function visibleLabels(): string[] {
  return screen
    .getAllByRole("option")
    .map((el) => el.querySelector(".ml-command-item-label")?.textContent ?? "");
}

function selectedLabel(): string | undefined {
  return screen
    .queryAllByRole("option")
    .find((el) => el.getAttribute("aria-selected") === "true")
    ?.querySelector(".ml-command-item-label")?.textContent ?? undefined;
}

describe("CommandPalette", () => {
  it("renders nothing while closed and a labelled dialog with a focused input when open", () => {
    const { rerender } = render(
      <CommandPalette open={false} onOpenChange={() => {}} items={makeItems()} />,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    rerender(<CommandPalette open onOpenChange={() => {}} items={makeItems()} />);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAccessibleName("Command palette");
    expect(document.activeElement).toBe(getInput());
  });

  it("renders all items grouped under their headings when the query is empty", () => {
    render(<Harness items={makeItems()} />);
    expect(visibleLabels()).toEqual(["New document", "Search everything", "Go to billing"]);
    expect(screen.getByText("Actions")).toBeInTheDocument();
    expect(screen.getByText("Navigation")).toBeInTheDocument();
  });

  it("filters by label", () => {
    render(<Harness items={makeItems()} />);
    fireEvent.change(getInput(), { target: { value: "billing" } });
    expect(visibleLabels()).toEqual(["Go to billing"]);
    // Its group stays visible; cmdk hides the emptied group via `hidden`.
    expect(screen.getByText("Navigation").closest("[cmdk-group]")).not.toHaveAttribute("hidden");
    expect(screen.getByText("Actions").closest("[cmdk-group]")).toHaveAttribute("hidden");
  });

  it("filters by keywords", () => {
    render(<Harness items={makeItems()} />);
    fireEvent.change(getInput(), { target: { value: "invoice" } });
    expect(visibleLabels()).toEqual(["Go to billing"]);
  });

  it("does not match on internal item ids", () => {
    // Ids are cmdk values but scoring runs on labels — "he-" style ids must not leak.
    render(
      <Harness
        items={[
          { id: "zzz-internal", label: "Alpha", onSelect: () => {} },
          { id: "beta", label: "Bravo", onSelect: () => {} },
        ]}
      />,
    );
    fireEvent.change(getInput(), { target: { value: "zzz" } });
    expect(screen.queryAllByRole("option")).toHaveLength(0);
  });

  it("filters Hebrew labels and keywords", () => {
    render(<Harness items={HEBREW_ITEMS} />);
    const input = getInput();

    fireEvent.change(input, { target: { value: "הגדרות" } });
    expect(visibleLabels()).toEqual(["פתח הגדרות"]);
    expect(selectedLabel()).toBe("פתח הגדרות");

    fireEvent.change(input, { target: { value: "חשבונית" } });
    expect(visibleLabels()).toEqual(["מעבר לחיובים"]);

    // Prefix of a single word still matches.
    fireEvent.change(input, { target: { value: "מסמך" } });
    expect(visibleLabels()).toContain("מסמך חדש");
  });

  it("scores Hebrew queries sanely (fuzzy filter sanity check)", () => {
    // Exact/continuous match beats no match; unrelated string scores 0.
    expect(defaultFilter("פתח הגדרות", "הגדרות", [])).toBeGreaterThan(0);
    expect(defaultFilter("פתח הגדרות", "הגד", [])).toBeGreaterThan(0);
    expect(defaultFilter("מסמך חדש", "הגדרות", [])).toBe(0);
    // A word-boundary match should rank at or above a mid-word fuzzy match.
    expect(defaultFilter("פתח הגדרות", "הגד", [])).toBeGreaterThanOrEqual(
      defaultFilter("מעבר להגדרה", "הגד", []),
    );
  });

  it("shows the empty state when nothing matches", () => {
    render(<Harness items={makeItems()} emptyState="Nothing here" />);
    fireEvent.change(getInput(), { target: { value: "qqqqxx" } });
    expect(screen.queryAllByRole("option")).toHaveLength(0);
    expect(screen.getByText("Nothing here")).toBeInTheDocument();
  });

  it("navigates with arrow keys, looping at the edges", () => {
    render(<Harness items={makeItems()} />);
    const input = getInput();
    expect(selectedLabel()).toBe("New document");

    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(selectedLabel()).toBe("Search everything");

    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(selectedLabel()).toBe("Go to billing");

    // loop: past the end wraps to the first item
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(selectedLabel()).toBe("New document");

    fireEvent.keyDown(input, { key: "ArrowUp" });
    expect(selectedLabel()).toBe("Go to billing");
  });

  it("supports Home and End", () => {
    render(<Harness items={makeItems()} />);
    const input = getInput();
    fireEvent.keyDown(input, { key: "End" });
    expect(selectedLabel()).toBe("Go to billing");
    fireEvent.keyDown(input, { key: "Home" });
    expect(selectedLabel()).toBe("New document");
  });

  it("selects the highlighted item with Enter and closes", () => {
    const onSelect = vi.fn();
    const onOpenChangeSpy = vi.fn();
    render(<Harness items={makeItems({ onSelect })} onOpenChangeSpy={onOpenChangeSpy} />);
    const input = getInput();

    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(onSelect).toHaveBeenCalledExactlyOnceWith("search");
    expect(onOpenChangeSpy).toHaveBeenCalledWith(false);
  });

  it("selects an item on click and closes", () => {
    const onSelect = vi.fn();
    const onOpenChangeSpy = vi.fn();
    render(<Harness items={makeItems({ onSelect })} onOpenChangeSpy={onOpenChangeSpy} />);

    fireEvent.click(screen.getByText("Go to billing"));

    expect(onSelect).toHaveBeenCalledExactlyOnceWith("billing");
    expect(onOpenChangeSpy).toHaveBeenCalledWith(false);
  });

  it("selection follows the filter: Enter picks the best match for the query", () => {
    const onSelect = vi.fn();
    render(<Harness items={makeItems({ onSelect })} />);
    const input = getInput();

    fireEvent.change(input, { target: { value: "invoice" } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(onSelect).toHaveBeenCalledExactlyOnceWith("billing");
  });

  it("closes on Escape and on overlay click, but not on panel click", () => {
    const onOpenChangeSpy = vi.fn();
    const { unmount } = render(
      <Harness items={makeItems()} onOpenChangeSpy={onOpenChangeSpy} />,
    );

    fireEvent.click(screen.getByRole("dialog"));
    expect(onOpenChangeSpy).not.toHaveBeenCalled();

    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    expect(onOpenChangeSpy).toHaveBeenCalledExactlyOnceWith(false);
    unmount();

    const onOpenChangeSpy2 = vi.fn();
    render(<Harness items={makeItems()} onOpenChangeSpy={onOpenChangeSpy2} />);
    fireEvent.click(screen.getByRole("dialog").parentElement as HTMLElement);
    expect(onOpenChangeSpy2).toHaveBeenCalledExactlyOnceWith(false);
  });

  it("toggles with the global Cmd/Ctrl+K shortcut", () => {
    render(<Harness items={makeItems()} defaultOpen={false} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    fireEvent.keyDown(document, { key: "k", metaKey: true });
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "k", ctrlKey: true });
    return waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("does not register the shortcut when enableShortcut is false", () => {
    render(<Harness items={makeItems()} defaultOpen={false} enableShortcut={false} />);
    fireEvent.keyDown(document, { key: "k", metaKey: true });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("resets the query when reopened", async () => {
    render(<Harness items={makeItems()} />);
    fireEvent.change(getInput(), { target: { value: "billing" } });
    expect(visibleLabels()).toEqual(["Go to billing"]);

    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());

    fireEvent.keyDown(document, { key: "k", metaKey: true });
    expect(getInput()).toHaveValue("");
    expect(visibleLabels()).toEqual(["New document", "Search everything", "Go to billing"]);
  });

  it("renders shortcut hints via Kbd", () => {
    render(<Harness items={makeItems()} />);
    const item = screen.getByText("New document").closest("[cmdk-item]") as HTMLElement;
    expect(item.querySelectorAll("kbd")).toHaveLength(2);
  });

  it("locks body scroll while open and restores it on close", async () => {
    render(<Harness items={makeItems()} />);
    expect(document.body.style.overflow).toBe("hidden");
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    await waitFor(() => expect(document.body.style.overflow).toBe(""));
  });
});
