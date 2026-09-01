import { useRef } from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SelectionToolbar, type SelectionToolbarAction } from "./SelectionToolbar";

const CONTAINER_TEXT = "Some selectable paragraph text here.";

function selectNode(node: Node) {
  const range = document.createRange();
  range.selectNodeContents(node);
  const sel = window.getSelection()!;
  sel.removeAllRanges();
  sel.addRange(range);
  act(() => {
    document.dispatchEvent(new Event("selectionchange"));
  });
}

function Harness({
  minLength,
  actions,
}: {
  minLength?: number;
  actions: SelectionToolbarAction[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  return (
    <div>
      <div ref={containerRef} data-testid="container">
        {CONTAINER_TEXT}
      </div>
      <div data-testid="outside">Outside paragraph.</div>
      <SelectionToolbar
        containerRef={containerRef}
        aria-label="Text selection actions"
        minLength={minLength}
        actions={actions}
      />
    </div>
  );
}

// jsdom's Range doesn't implement getBoundingClientRect at all, so it can't
// be spied on — it has to be assigned outright.
beforeEach(() => {
  Range.prototype.getBoundingClientRect = vi.fn(
    () =>
      ({
        top: 100,
        left: 50,
        width: 80,
        height: 20,
        bottom: 120,
        right: 130,
        x: 50,
        y: 100,
        toJSON() {
          return {};
        },
      }) as DOMRect,
  );
});

afterEach(() => {
  // @ts-expect-error removing the jsdom-unimplemented stub added above
  delete Range.prototype.getBoundingClientRect;
  window.getSelection()?.removeAllRanges();
});

describe("SelectionToolbar", () => {
  it("renders nothing while there is no selection", () => {
    render(<Harness actions={[{ id: "explain", label: "Explain", onSelect: vi.fn() }]} />);
    expect(screen.queryByRole("toolbar")).toBeNull();
  });

  it("appears with an accessible name when text inside the container is selected, and hands the selected text to the action", async () => {
    const onSelect = vi.fn();
    render(<Harness actions={[{ id: "explain", label: "Explain", onSelect }]} />);

    selectNode(screen.getByTestId("container").firstChild!);

    const toolbar = await screen.findByRole("toolbar", { name: "Text selection actions" });
    expect(toolbar).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Explain" }));
    expect(onSelect).toHaveBeenCalledWith(CONTAINER_TEXT);

    await waitFor(() => expect(screen.queryByRole("toolbar")).toBeNull());
  });

  it("ignores a selection made outside the watched container", () => {
    render(<Harness actions={[{ id: "explain", label: "Explain", onSelect: vi.fn() }]} />);
    selectNode(screen.getByTestId("outside").firstChild!);
    expect(screen.queryByRole("toolbar")).toBeNull();
  });

  it("stays hidden when the selection is shorter than minLength", () => {
    render(
      <Harness
        minLength={1000}
        actions={[{ id: "explain", label: "Explain", onSelect: vi.fn() }]}
      />,
    );
    selectNode(screen.getByTestId("container").firstChild!);
    expect(screen.queryByRole("toolbar")).toBeNull();
  });

  it("dismisses on Escape", async () => {
    render(<Harness actions={[{ id: "explain", label: "Explain", onSelect: vi.fn() }]} />);
    selectNode(screen.getByTestId("container").firstChild!);
    await screen.findByRole("toolbar");

    fireEvent.keyDown(document, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("toolbar")).toBeNull());
  });

  it("dismisses on an outside pointerdown", async () => {
    render(<Harness actions={[{ id: "explain", label: "Explain", onSelect: vi.fn() }]} />);
    selectNode(screen.getByTestId("container").firstChild!);
    await screen.findByRole("toolbar");

    fireEvent.pointerDown(screen.getByTestId("outside"));
    await waitFor(() => expect(screen.queryByRole("toolbar")).toBeNull());
  });

  it("dismisses on scroll", async () => {
    render(<Harness actions={[{ id: "explain", label: "Explain", onSelect: vi.fn() }]} />);
    selectNode(screen.getByTestId("container").firstChild!);
    await screen.findByRole("toolbar");

    fireEvent.scroll(window);
    await waitFor(() => expect(screen.queryByRole("toolbar")).toBeNull());
  });

  it("disables an action's button when the action is marked disabled", async () => {
    render(
      <Harness
        actions={[
          { id: "explain", label: "Explain", onSelect: vi.fn(), disabled: true },
        ]}
      />,
    );
    selectNode(screen.getByTestId("container").firstChild!);
    const button = await screen.findByRole("button", { name: "Explain" });
    expect(button).toBeDisabled();
  });
});
