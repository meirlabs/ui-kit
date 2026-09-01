import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { InvoiceSummaryPanel } from "./InvoiceSummaryPanel";
import type { InvoiceRow } from "./InvoiceTable";

const invoice: InvoiceRow = {
  id: "1",
  number: "INV-2001",
  project: "Brand Refresh",
  issuedDate: "2026-07-01",
  dueDate: "2026-07-15",
  amount: 3000,
  status: "pending",
};

describe("InvoiceSummaryPanel", () => {
  it("renders the invoice number, project and amount due", () => {
    render(<InvoiceSummaryPanel invoice={invoice} />);
    expect(screen.getByText("INV-2001")).toBeInTheDocument();
    expect(screen.getByText("Brand Refresh")).toBeInTheDocument();
    expect(screen.getByText("$3,000.00")).toBeInTheDocument();
    expect(screen.getByText("Pending")).toBeInTheDocument();
  });

  it("renders line items and their total", () => {
    render(
      <InvoiceSummaryPanel
        invoice={invoice}
        lineItems={[
          { label: "Design", amount: 2000 },
          { label: "Revisions", amount: 1000 },
        ]}
      />,
    );
    expect(screen.getByText("Design")).toBeInTheDocument();
    expect(screen.getByText("Revisions")).toBeInTheDocument();
    expect(screen.getByText("Total")).toBeInTheDocument();
    expect(screen.getAllByText("$3,000.00").length).toBeGreaterThan(1);
  });

  it("only renders Download when onDownload is provided, and calls it with the invoice", () => {
    const onDownload = vi.fn();
    const { rerender } = render(<InvoiceSummaryPanel invoice={invoice} />);
    expect(screen.queryByRole("button", { name: /download/i })).toBeNull();

    rerender(<InvoiceSummaryPanel invoice={invoice} onDownload={onDownload} />);
    fireEvent.click(screen.getByRole("button", { name: /download/i }));
    expect(onDownload).toHaveBeenCalledWith(invoice);
  });

  it("hides Mark as paid for an already-paid invoice", () => {
    const onMarkAsPaid = vi.fn();
    render(
      <InvoiceSummaryPanel
        invoice={{ ...invoice, status: "paid" }}
        onMarkAsPaid={onMarkAsPaid}
      />,
    );
    expect(screen.queryByRole("button", { name: /mark as paid/i })).toBeNull();
  });

  it("calls onMarkAsPaid with the invoice for an unpaid invoice", () => {
    const onMarkAsPaid = vi.fn();
    render(<InvoiceSummaryPanel invoice={invoice} onMarkAsPaid={onMarkAsPaid} />);
    fireEvent.click(screen.getByRole("button", { name: /mark as paid/i }));
    expect(onMarkAsPaid).toHaveBeenCalledWith(invoice);
  });
});
