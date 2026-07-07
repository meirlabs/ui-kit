import {
  render,
  screen,
  fireEvent,
  within,
  waitFor,
} from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import type { ReactElement } from "react";
import { VirtuosoMockContext } from "react-virtuoso";
import { VirtualDataTable } from "./VirtualDataTable";
import type { Column } from "./DataTable";

/* react-virtuoso measures elements with ResizeObserver, which jsdom lacks. */
beforeAll(() => {
  if (typeof globalThis.ResizeObserver === "undefined") {
    globalThis.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver;
  }
});

interface Row {
  id: string;
  name: string;
  score: number;
}

const rows: Row[] = [
  { id: "a", name: "Charlie", score: 30 },
  { id: "b", name: "Alice", score: 10 },
  { id: "c", name: "Bob", score: 20 },
];

const columns: Column<Row>[] = [
  { id: "name", header: "Name", accessor: "name", sortable: true, width: 200 },
  {
    id: "score",
    header: "Score",
    accessor: "score",
    numeric: true,
    sortable: true,
    width: 120,
  },
];

/* jsdom can't measure, so drive virtuoso with its mock context: a fixed
   viewport/item height makes it render rows deterministically. */
function renderVirtual(ui: ReactElement) {
  return render(
    <VirtuosoMockContext.Provider
      value={{ viewportHeight: 400, itemHeight: 40 }}
    >
      {ui}
    </VirtuosoMockContext.Provider>,
  );
}

function bodyNames() {
  const table = screen.getByRole("table");
  const rowEls = within(table).getAllByRole("row").slice(1); // drop header row
  return rowEls.map((r) => within(r).getAllByRole("cell")[0].textContent);
}

describe("VirtualDataTable", () => {
  it("renders the sticky header with th scope='col' for every column", () => {
    renderVirtual(
      <VirtualDataTable columns={columns} data={rows} aria-label="People" />,
    );
    const headers = screen.getAllByRole("columnheader");
    expect(headers).toHaveLength(2);
    headers.forEach((th) => expect(th).toHaveAttribute("scope", "col"));
    // Header lives in a real <thead> (virtuoso keeps it sticky).
    expect(headers[0].closest("thead")).not.toBeNull();
  });

  it("renders data rows with .ml-dt markup", () => {
    renderVirtual(
      <VirtualDataTable columns={columns} data={rows} aria-label="People" />,
    );
    expect(screen.getByRole("table")).toHaveClass("ml-dt", "ml-vdt");
    expect(bodyNames()).toEqual(["Charlie", "Alice", "Bob"]);
    expect(screen.getByText("Charlie").closest("tr")).toHaveClass("ml-dt-row");
  });

  it("only mounts rows near the viewport for large datasets", () => {
    const many: Row[] = Array.from({ length: 1000 }, (_, i) => ({
      id: String(i),
      name: `Person ${i}`,
      score: i,
    }));
    renderVirtual(
      <VirtualDataTable columns={columns} data={many} aria-label="People" />,
    );
    expect(screen.getByText("Person 0")).toBeInTheDocument();
    // 400px viewport / 40px rows → far fewer than 1000 rows in the DOM.
    const rendered = within(screen.getByRole("table"))
      .getAllByRole("row")
      .slice(1);
    expect(rendered.length).toBeGreaterThan(0);
    expect(rendered.length).toBeLessThan(100);
  });

  it("cycles sort asc → desc → none and reflects it in aria-sort", () => {
    renderVirtual(
      <VirtualDataTable columns={columns} data={rows} aria-label="People" />,
    );
    const nameHeader = screen.getByRole("columnheader", { name: /name/i });
    const trigger = within(nameHeader).getByRole("button");

    expect(nameHeader).toHaveAttribute("aria-sort", "none");
    expect(bodyNames()).toEqual(["Charlie", "Alice", "Bob"]);

    fireEvent.click(trigger);
    expect(nameHeader).toHaveAttribute("aria-sort", "ascending");
    expect(bodyNames()).toEqual(["Alice", "Bob", "Charlie"]);

    fireEvent.click(trigger);
    expect(nameHeader).toHaveAttribute("aria-sort", "descending");
    expect(bodyNames()).toEqual(["Charlie", "Bob", "Alice"]);

    fireEvent.click(trigger);
    expect(nameHeader).toHaveAttribute("aria-sort", "none");
    expect(bodyNames()).toEqual(["Charlie", "Alice", "Bob"]);
  });

  it("supports controlled sort via sortState/onSortChange", () => {
    const onSortChange = vi.fn();
    renderVirtual(
      <VirtualDataTable
        columns={columns}
        data={rows}
        aria-label="People"
        sortState={{ columnId: "score", direction: "asc" }}
        onSortChange={onSortChange}
      />,
    );
    const scoreHeader = screen.getByRole("columnheader", { name: /score/i });
    expect(scoreHeader).toHaveAttribute("aria-sort", "ascending");
    expect(bodyNames()).toEqual(["Alice", "Bob", "Charlie"]); // 10, 20, 30

    fireEvent.click(within(scoreHeader).getByRole("button"));
    expect(onSortChange).toHaveBeenCalledWith({
      columnId: "score",
      direction: "desc",
    });
  });

  it("renders the empty state spanning all columns when data is empty", () => {
    renderVirtual(
      <VirtualDataTable
        columns={columns}
        data={[]}
        aria-label="People"
        emptyState={<span>Nothing here</span>}
      />,
    );
    const cell = screen.getByRole("cell");
    expect(cell).toHaveAttribute("colspan", "2");
    expect(cell).toHaveClass("ml-dt-state");
    expect(cell).toHaveTextContent("Nothing here");
  });

  it("falls back to the default empty copy", () => {
    renderVirtual(
      <VirtualDataTable columns={columns} data={[]} aria-label="People" />,
    );
    expect(screen.getByText("No data.")).toHaveClass("ml-dt-empty-fallback");
  });

  it("calls onEndReached when the last row renders", async () => {
    const onEndReached = vi.fn();
    renderVirtual(
      <VirtualDataTable
        columns={columns}
        data={rows}
        aria-label="People"
        onEndReached={onEndReached}
      />,
    );
    // 3 rows × 40px fit inside the 400px mock viewport → the end is reached.
    await waitFor(() => expect(onEndReached).toHaveBeenCalledWith(2));
  });

  it("fires onRowClick via mouse and keyboard, and rows are focusable", () => {
    const onRowClick = vi.fn();
    renderVirtual(
      <VirtualDataTable
        columns={columns}
        data={rows}
        aria-label="People"
        onRowClick={onRowClick}
      />,
    );
    const firstRow = screen.getByText("Charlie").closest("tr")!;
    expect(firstRow).toHaveClass("ml-dt-row--clickable");
    expect(firstRow).toHaveAttribute("tabindex", "0");

    fireEvent.click(firstRow);
    expect(onRowClick).toHaveBeenCalledWith(rows[0]);

    fireEvent.keyDown(firstRow, { key: "Enter" });
    expect(onRowClick).toHaveBeenCalledTimes(2);
  });

  it("renders initialItemCount rows without the mock context (SSR path)", () => {
    const many: Row[] = Array.from({ length: 50 }, (_, i) => ({
      id: String(i),
      name: `Person ${i}`,
      score: i,
    }));
    render(
      <VirtualDataTable
        columns={columns}
        data={many}
        aria-label="People"
        initialItemCount={5}
      />,
    );
    expect(screen.getByText("Person 0")).toBeInTheDocument();
    expect(screen.getByText("Person 4")).toBeInTheDocument();
    expect(screen.queryByText("Person 10")).toBeNull();
  });

  it("renders a footer slot below the scroll container", () => {
    renderVirtual(
      <VirtualDataTable
        columns={columns}
        data={rows}
        aria-label="People"
        footer={<span>3 rows</span>}
      />,
    );
    expect(screen.getByText("3 rows").closest(".ml-dt-footer")).not.toBeNull();
  });
});
