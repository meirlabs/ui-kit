import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { InvoicePortal } from "./InvoicePortal";
import type { InvoiceRow } from "./InvoiceTable";

const invoices: InvoiceRow[] = [
  {
    id: "1",
    number: "INV-3001",
    project: "Onboarding Flow",
    issuedDate: "2026-06-01",
    dueDate: "2026-06-15",
    amount: 900,
    status: "paid",
  },
  {
    id: "2",
    number: "INV-3002",
    project: "Analytics Dashboard",
    issuedDate: "2026-06-10",
    dueDate: "2026-06-25",
    amount: 2100,
    status: "pending",
  },
];

describe("InvoicePortal", () => {
  it("shows the first invoice's summary by default", () => {
    render(<InvoicePortal invoices={invoices} />);
    expect(screen.getByRole("region", { name: /INV-3001 summary/i })).toBeInTheDocument();
  });

  it("switches the summary panel when a different row is selected", () => {
    render(<InvoicePortal invoices={invoices} />);
    fireEvent.click(screen.getByText("INV-3002"));
    expect(screen.getByRole("region", { name: /INV-3002 summary/i })).toBeInTheDocument();
  });

  it("notifies onSelectInvoice when selection changes", () => {
    const onSelectInvoice = vi.fn();
    render(<InvoicePortal invoices={invoices} onSelectInvoice={onSelectInvoice} />);
    fireEvent.click(screen.getByText("INV-3002"));
    expect(onSelectInvoice).toHaveBeenCalledWith(invoices[1]);
  });

  it("respects a controlled selectedInvoiceId", () => {
    render(<InvoicePortal invoices={invoices} selectedInvoiceId="2" />);
    expect(screen.getByRole("region", { name: /INV-3002 summary/i })).toBeInTheDocument();
  });

  it("renders an empty state when there are no invoices", () => {
    render(<InvoicePortal invoices={[]} />);
    expect(screen.getByText(/no invoices yet/i)).toBeInTheDocument();
  });
});
