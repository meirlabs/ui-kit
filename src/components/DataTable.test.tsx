import { render, screen, fireEvent, within } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { DataTable, type Column } from "./DataTable";

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
  { id: "name", header: "Name", accessor: "name", sortable: true },
  { id: "score", header: "Score", accessor: "score", numeric: true, sortable: true },
];

function bodyNames() {
  const table = screen.getByRole("table");
  const rowsEls = within(table).getAllByRole("row").slice(1); // drop header row
  return rowsEls.map((r) => within(r).getAllByRole("cell")[0].textContent);
}

describe("DataTable", () => {
  it("renders th with scope='col' for every column", () => {
    render(<DataTable columns={columns} data={rows} aria-label="People" />);
    const headers = screen.getAllByRole("columnheader");
    expect(headers).toHaveLength(2);
    headers.forEach((th) => expect(th).toHaveAttribute("scope", "col"));
  });

  it("cycles sort asc → desc → none and reflects it in aria-sort", () => {
    render(<DataTable columns={columns} data={rows} aria-label="People" />);
    const nameHeader = screen.getByRole("columnheader", { name: /name/i });
    const trigger = within(nameHeader).getByRole("button");

    // default: no sort
    expect(nameHeader).toHaveAttribute("aria-sort", "none");
    expect(bodyNames()).toEqual(["Charlie", "Alice", "Bob"]);

    // asc
    fireEvent.click(trigger);
    expect(nameHeader).toHaveAttribute("aria-sort", "ascending");
    expect(bodyNames()).toEqual(["Alice", "Bob", "Charlie"]);

    // desc
    fireEvent.click(trigger);
    expect(nameHeader).toHaveAttribute("aria-sort", "descending");
    expect(bodyNames()).toEqual(["Charlie", "Bob", "Alice"]);

    // none (back to source order)
    fireEvent.click(trigger);
    expect(nameHeader).toHaveAttribute("aria-sort", "none");
    expect(bodyNames()).toEqual(["Charlie", "Alice", "Bob"]);
  });

  it("sorts numeric columns numerically", () => {
    render(<DataTable columns={columns} data={rows} aria-label="People" />);
    const scoreHeader = screen.getByRole("columnheader", { name: /score/i });
    fireEvent.click(within(scoreHeader).getByRole("button"));
    expect(bodyNames()).toEqual(["Alice", "Bob", "Charlie"]); // 10, 20, 30
  });

  it("supports controlled sort via sortState/onSortChange", () => {
    const onSortChange = vi.fn();
    render(
      <DataTable
        columns={columns}
        data={rows}
        aria-label="People"
        sortState={{ columnId: "name", direction: "asc" }}
        onSortChange={onSortChange}
      />,
    );
    const nameHeader = screen.getByRole("columnheader", { name: /name/i });
    expect(nameHeader).toHaveAttribute("aria-sort", "ascending");
    expect(bodyNames()).toEqual(["Alice", "Bob", "Charlie"]);

    fireEvent.click(within(nameHeader).getByRole("button"));
    expect(onSortChange).toHaveBeenCalledWith({ columnId: "name", direction: "desc" });
  });

  it("toggles multiple selection and select-all", () => {
    const onSelectionChange = vi.fn();
    render(
      <DataTable
        columns={columns}
        data={rows}
        aria-label="People"
        selectable="multiple"
        onSelectionChange={onSelectionChange}
      />,
    );
    // Toggle a single row on.
    const firstRowBox = screen.getByLabelText("Select row 1");
    fireEvent.click(firstRowBox);
    expect(onSelectionChange).toHaveBeenLastCalledWith(["a"]);
    expect(firstRowBox).toBeChecked();
    expect(firstRowBox.closest("tr")).toHaveAttribute("aria-selected", "true");

    // Select-all selects every row.
    const selectAll = screen.getByLabelText("Select all rows");
    fireEvent.click(selectAll);
    expect(onSelectionChange).toHaveBeenLastCalledWith(["a", "b", "c"]);
  });

  it("keeps only one selected in single mode", () => {
    render(
      <DataTable
        columns={columns}
        data={rows}
        aria-label="People"
        selectable="single"
      />,
    );
    // No select-all in single mode.
    expect(screen.queryByLabelText("Select all rows")).toBeNull();
    fireEvent.click(screen.getByLabelText("Select row 1"));
    fireEvent.click(screen.getByLabelText("Select row 2"));
    expect(screen.getByLabelText("Select row 1")).not.toBeChecked();
    expect(screen.getByLabelText("Select row 2")).toBeChecked();
  });

  it("renders the empty state spanning all columns when data is empty", () => {
    render(
      <DataTable
        columns={columns}
        data={[]}
        aria-label="People"
        emptyState={<span>Nothing here</span>}
      />,
    );
    const cell = screen.getByRole("cell");
    expect(cell).toHaveAttribute("colspan", "2");
    expect(cell).toHaveTextContent("Nothing here");
  });

  it("renders skeleton rows while loading and marks the table busy", () => {
    const { container } = render(
      <DataTable
        columns={columns}
        data={rows}
        aria-label="People"
        loading
        loadingRowCount={3}
      />,
    );
    expect(screen.getByRole("table")).toHaveAttribute("aria-busy", "true");
    expect(container.querySelectorAll(".ml-dt-row--skeleton")).toHaveLength(3);
    // Real data is not rendered while loading.
    expect(screen.queryByText("Charlie")).toBeNull();
  });

  it("renders an error row over all columns", () => {
    render(
      <DataTable
        columns={columns}
        data={rows}
        aria-label="People"
        error="Failed to load"
      />,
    );
    const cell = screen.getByRole("cell");
    expect(cell).toHaveAttribute("colspan", "2");
    expect(cell).toHaveTextContent("Failed to load");
  });

  it("fires onRowClick via mouse and keyboard, and rows are focusable", () => {
    const onRowClick = vi.fn();
    render(
      <DataTable
        columns={columns}
        data={rows}
        aria-label="People"
        onRowClick={onRowClick}
      />,
    );
    const firstRow = screen.getAllByRole("row")[1];
    expect(firstRow).toHaveAttribute("tabindex", "0");
    fireEvent.click(firstRow);
    expect(onRowClick).toHaveBeenCalledWith(rows[0]);

    fireEvent.keyDown(firstRow, { key: "Enter" });
    expect(onRowClick).toHaveBeenCalledTimes(2);
  });

  it("renders the toolbar slot above the table when provided", () => {
    const { container } = render(
      <DataTable
        columns={columns}
        data={rows}
        aria-label="People"
        toolbar={<span>Toolbar content</span>}
      />,
    );
    expect(screen.getByText("Toolbar content")).toBeInTheDocument();
    expect(container.querySelector(".ml-dt-toolbar")).toBeInTheDocument();
  });

  it("omits the toolbar wrapper entirely when no toolbar is given", () => {
    const { container } = render(
      <DataTable columns={columns} data={rows} aria-label="People" />,
    );
    expect(container.querySelector(".ml-dt-toolbar")).toBeNull();
  });

  describe("labels", () => {
    it("keeps every English default when labels is omitted", () => {
      const { unmount } = render(
        <DataTable columns={columns} data={rows} selectable="multiple" aria-label="People" />,
      );
      expect(screen.getByLabelText("Select all rows")).toBeInTheDocument();
      expect(screen.getByLabelText("Select row 1")).toBeInTheDocument();
      expect(screen.getByLabelText("Select row 3")).toBeInTheDocument();
      unmount();

      render(<DataTable columns={columns} data={[]} selectable="single" aria-label="People" />);
      expect(screen.getByText("Select")).toHaveClass("ml-visually-hidden");
      expect(screen.getByText("No data.")).toHaveClass("ml-dt-empty-fallback");
    });

    it("replaces the selection labels, passing the 1-based row number", () => {
      const selectRow = vi.fn((rowNumber: number) => `Sélectionner la ligne ${rowNumber}`);
      render(
        <DataTable
          columns={columns}
          data={rows}
          selectable="multiple"
          aria-label="People"
          labels={{ selectRow, selectAll: "Tout sélectionner" }}
        />,
      );
      expect(screen.getByLabelText("Tout sélectionner")).toBeInTheDocument();
      expect(screen.getByLabelText("Sélectionner la ligne 1")).toBeInTheDocument();
      expect(screen.getByLabelText("Sélectionner la ligne 3")).toBeInTheDocument();
      expect(selectRow.mock.calls.map(([n]) => n)).toEqual([1, 2, 3]);
      expect(screen.queryByLabelText(/Select/)).not.toBeInTheDocument();
    });

    it("replaces the single-select column header and the empty copy", () => {
      render(
        <DataTable
          columns={columns}
          data={[]}
          selectable="single"
          aria-label="People"
          labels={{ selectColumn: "Sélection", empty: "Aucune donnée." }}
        />,
      );
      expect(screen.getByText("Sélection")).toHaveClass("ml-visually-hidden");
      expect(screen.getByText("Aucune donnée.")).toHaveClass("ml-dt-empty-fallback");
      expect(screen.queryByText("No data.")).not.toBeInTheDocument();
    });

    it("falls back to the default for any key left out", () => {
      render(
        <DataTable
          columns={columns}
          data={rows}
          selectable="multiple"
          aria-label="People"
          labels={{ selectAll: "Tout sélectionner" }}
        />,
      );
      expect(screen.getByLabelText("Tout sélectionner")).toBeInTheDocument();
      expect(screen.getByLabelText("Select row 2")).toBeInTheDocument();
    });

    it("lets emptyState win over labels.empty", () => {
      render(
        <DataTable
          columns={columns}
          data={[]}
          aria-label="People"
          emptyState={<span>Custom empty</span>}
          labels={{ empty: "Aucune donnée." }}
        />,
      );
      expect(screen.getByText("Custom empty")).toBeInTheDocument();
      expect(screen.queryByText("Aucune donnée.")).not.toBeInTheDocument();
    });
  });

  describe("column alignment", () => {
    function headerAndFirstCell(align?: Column<Row>["align"], numeric = false) {
      const cols: Column<Row>[] = [
        { id: "name", header: "Name", accessor: "name", align, numeric },
      ];
      render(<DataTable columns={cols} data={rows} aria-label="People" />);
      const table = screen.getByRole("table");
      return {
        th: within(table).getByRole("columnheader", { name: "Name" }),
        td: within(table).getAllByRole("cell")[0],
      };
    }

    it("defaults to the logical start edge, so it mirrors under RTL", () => {
      const { th, td } = headerAndFirstCell();
      expect(th).toHaveClass("ml-dt-align-start");
      expect(td.style.textAlign).toBe("start");
    });

    it("defaults numeric columns to the logical end edge", () => {
      const { th, td } = headerAndFirstCell(undefined, true);
      expect(th).toHaveClass("ml-dt-align-end");
      expect(td.style.textAlign).toBe("end");
    });

    it.each(["start", "end", "left", "right", "center"] as const)(
      "applies align=%s to the header and the cells",
      (align) => {
        const { th, td } = headerAndFirstCell(align);
        expect(th).toHaveClass(`ml-dt-align-${align}`);
        expect(td.style.textAlign).toBe(align);
      },
    );

    it("lets an explicit align win over the numeric default", () => {
      const { th, td } = headerAndFirstCell("left", true);
      expect(th).toHaveClass("ml-dt-align-left");
      expect(td.style.textAlign).toBe("left");
    });

    it("aligns loading skeleton cells the same way", () => {
      const cols: Column<Row>[] = [
        { id: "name", header: "Name", accessor: "name" },
        { id: "score", header: "Score", accessor: "score", numeric: true },
      ];
      const { container } = render(
        <DataTable columns={cols} data={[]} loading loadingRowCount={1} aria-label="People" />,
      );
      const cells = container.querySelectorAll<HTMLTableCellElement>(
        ".ml-dt-row--skeleton td",
      );
      expect(cells[0].style.textAlign).toBe("start");
      expect(cells[1].style.textAlign).toBe("end");
    });
  });
});
