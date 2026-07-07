import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeAll } from "vitest";
import { SortableList, SortableHandle } from "./SortableList";

interface Task {
  id: string;
  title: string;
}

const tasks: Task[] = [
  { id: "a", title: "Alpha" },
  { id: "b", title: "Bravo" },
  { id: "c", title: "Charlie" },
];

beforeAll(() => {
  // jsdom lacks scrollIntoView; dnd-kit's KeyboardSensor calls it on move.
  Element.prototype.scrollIntoView = vi.fn();
});

/**
 * jsdom reports 0x0 rects, so keyboard coordinate-getting can't find the
 * next droppable. Give each row a distinct vertical rect.
 */
function mockRowRects(rows: HTMLElement[]) {
  rows.forEach((row, index) => {
    row.getBoundingClientRect = () =>
      ({
        width: 200,
        height: 40,
        top: index * 50,
        bottom: index * 50 + 40,
        left: 0,
        right: 200,
        x: 0,
        y: index * 50,
        toJSON: () => ({}),
      }) as DOMRect;
  });
}

function renderList(
  props: Partial<React.ComponentProps<typeof SortableList<Task>>> = {},
) {
  const onReorder = vi.fn();
  const utils = render(
    <SortableList
      items={tasks}
      onReorder={onReorder}
      renderItem={(task) => task.title}
      {...props}
    />,
  );
  return { onReorder, ...utils };
}

function getRows(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>("li"));
}

async function keyboardLift(row: HTMLElement) {
  await act(async () => {
    fireEvent.keyDown(row, { code: "Space", key: " " });
    // dnd-kit's KeyboardSensor attaches its keydown listener in a
    // setTimeout; flush a macrotask so subsequent moves are heard.
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
}

describe("SortableList", () => {
  it("renders all items in order inside a list", () => {
    const { container } = renderList();
    const rows = getRows(container);
    expect(rows).toHaveLength(3);
    expect(rows.map((r) => r.textContent)).toEqual([
      "Alpha",
      "Bravo",
      "Charlie",
    ]);
    expect(container.querySelector("ul.ml-sortable")).toBeInTheDocument();
  });

  it("makes whole rows the drag activator by default", () => {
    const { container } = renderList();
    const rows = getRows(container);
    for (const row of rows) {
      expect(row).toHaveAttribute("role", "button");
      expect(row).toHaveAttribute("tabindex", "0");
      expect(row).toHaveAttribute("aria-roledescription", "sortable");
      expect(row).toHaveAttribute("data-draggable");
    }
  });

  it("puts activator props on the handle in handle mode", () => {
    const { container } = renderList({
      handle: true,
      renderItem: (task, { dragHandleProps }) => (
        <>
          <SortableHandle
            {...dragHandleProps}
            aria-label={`Reorder ${task.title}`}
          />
          {task.title}
        </>
      ),
    });
    const rows = getRows(container);
    // rows themselves are not activators
    for (const row of rows) {
      expect(row).not.toHaveAttribute("role");
      expect(row).not.toHaveAttribute("data-draggable");
    }
    const handle = screen.getByRole("button", { name: "Reorder Alpha" });
    expect(handle).toHaveAttribute("aria-roledescription", "sortable");
    expect(handle.className).toContain("ml-sortable-handle");
  });

  it("reorders with the keyboard: space lifts, arrow moves, space drops", async () => {
    const { container, onReorder } = renderList();
    const rows = getRows(container);
    mockRowRects(rows);

    const first = rows[0];
    first.focus();
    await keyboardLift(first);
    await act(async () => {
      fireEvent.keyDown(first, { code: "ArrowDown", key: "ArrowDown" });
    });
    await act(async () => {
      fireEvent.keyDown(first, { code: "Space", key: " " });
    });

    expect(onReorder).toHaveBeenCalledTimes(1);
    const [newItems, detail] = onReorder.mock.calls[0];
    expect(newItems.map((t: Task) => t.id)).toEqual(["b", "a", "c"]);
    expect(detail).toEqual({ fromIndex: 0, toIndex: 1 });
  });

  it("cancels with Escape without calling onReorder", async () => {
    const { container, onReorder } = renderList();
    const rows = getRows(container);
    mockRowRects(rows);

    const first = rows[0];
    first.focus();
    await keyboardLift(first);
    await act(async () => {
      fireEvent.keyDown(first, { code: "ArrowDown", key: "ArrowDown" });
    });
    await act(async () => {
      fireEvent.keyDown(first, { code: "Escape", key: "Escape" });
    });

    expect(onReorder).not.toHaveBeenCalled();
  });

  it("announces lift and drop with the default English strings", async () => {
    const { container } = renderList();
    const rows = getRows(container);
    mockRowRects(rows);

    const first = rows[0];
    first.focus();
    await keyboardLift(first);
    expect(
      await screen.findByText("Picked up item in position 1 of 3."),
    ).toBeInTheDocument();

    await act(async () => {
      fireEvent.keyDown(first, { code: "ArrowDown", key: "ArrowDown" });
    });
    await act(async () => {
      fireEvent.keyDown(first, { code: "Space", key: " " });
    });
    expect(
      await screen.findByText("Item dropped in position 2 of 3."),
    ).toBeInTheDocument();
  });

  it("uses overridden announcements (e.g. Hebrew) and instructions", async () => {
    const { container } = renderList({
      announcements: {
        roleDescription: "ניתן למיון",
        instructions: "לחצו רווח להרמה, חיצים להזזה, רווח לשחרור.",
        onDragStart: ({ position, total }) =>
          `הפריט הורם ממיקום ${position} מתוך ${total}.`,
      },
    });
    const rows = getRows(container);
    mockRowRects(rows);

    expect(rows[0]).toHaveAttribute("aria-roledescription", "ניתן למיון");
    expect(
      screen.getByText("לחצו רווח להרמה, חיצים להזזה, רווח לשחרור."),
    ).toBeInTheDocument();

    rows[0].focus();
    await keyboardLift(rows[0]);
    expect(
      await screen.findByText("הפריט הורם ממיקום 1 מתוך 3."),
    ).toBeInTheDocument();
  });

  it("does not lift when disabled", async () => {
    const { container, onReorder } = renderList({ disabled: true });
    const rows = getRows(container);
    mockRowRects(rows);
    expect(rows[0]).toHaveAttribute("aria-disabled", "true");
    expect(rows[0]).not.toHaveAttribute("data-draggable");

    await keyboardLift(rows[0]);
    await act(async () => {
      fireEvent.keyDown(rows[0], { code: "ArrowDown", key: "ArrowDown" });
    });
    await act(async () => {
      fireEvent.keyDown(rows[0], { code: "Space", key: " " });
    });
    expect(onReorder).not.toHaveBeenCalled();
  });

  it("exposes isDragging and index to renderItem", () => {
    const seen: Array<{ index: number; isDragging: boolean }> = [];
    renderList({
      renderItem: (task, { index, isDragging }) => {
        seen.push({ index, isDragging });
        return task.title;
      },
    });
    expect(seen.map((s) => s.index)).toEqual([0, 1, 2]);
    expect(seen.every((s) => s.isDragging === false)).toBe(true);
  });
});
