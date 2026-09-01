import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { InvoiceTable, type InvoiceRow } from "./InvoiceTable";

const invoices: InvoiceRow[] = [
  {
    id: "1",
    number: "INV-1001",
    project: "Website Redesign",
    issuedDate: "2026-08-01",
    dueDate: "2026-08-15",
    amount: 1200,
    status: "paid",
  },
  {
    id: "2",
    number: "INV-1002",
    project: "Mobile App",
    issuedDate: "2026-08-10",
    dueDate: "2026-08-25",
    amount: 4800,
    status: "overdue",
  },
];

describe("InvoiceTable", () => {
  it("renders a row per invoice with number, project and status", () => {
    render(<InvoiceTable invoices={invoices} />);
    expect(screen.getByText("INV-1001")).toBeInTheDocument();
    expect(screen.getByText("Website Redesign")).toBeInTheDocument();
    expect(screen.getByText("Paid")).toBeInTheDocument();
    expect(screen.getByText("Overdue")).toBeInTheDocument();
  });

  it("formats amounts as currency by default", () => {
    render(<InvoiceTable invoices={invoices} />);
    expect(screen.getByText("$1,200.00")).toBeInTheDocument();
  });

  it("calls onSelectInvoice with the invoice when a row is clicked", () => {
    const onSelectInvoice = vi.fn();
    render(<InvoiceTable invoices={invoices} onSelectInvoice={onSelectInvoice} />);
    fireEvent.click(screen.getByText("INV-1002"));
    expect(onSelectInvoice).toHaveBeenCalledWith(invoices[1]);
  });

  it("renders scoped column headers for accessibility", () => {
    render(<InvoiceTable invoices={invoices} />);
    const headers = screen.getAllByRole("columnheader");
    expect(headers.map((h) => h.textContent)).toEqual([
      "Invoice",
      "Project",
      "Due",
      "Amount",
      "Status",
    ]);
    headers.forEach((h) => expect(h).toHaveAttribute("scope", "col"));
  });

  it("renders the empty state when there are no invoices", () => {
    render(<InvoiceTable invoices={[]} />);
    expect(screen.getByText("No invoices yet.")).toBeInTheDocument();
  });

  it("sorts by amount when the Amount header is activated", () => {
    render(<InvoiceTable invoices={invoices} />);
    const amountHeader = screen.getByRole("columnheader", { name: /amount/i });
    fireEvent.click(within(amountHeader).getByRole("button"));
    const table = screen.getByRole("table");
    const rows = within(table).getAllByRole("row").slice(1);
    expect(within(rows[0]).getAllByRole("cell")[0]).toHaveTextContent("INV-1001");
  });
});
