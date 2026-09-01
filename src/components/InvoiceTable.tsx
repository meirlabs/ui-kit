import { useMemo, type ReactNode } from "react";
import { cn } from "../utils/cn";
import { DataTable, type Column } from "./DataTable";
import { StatusPill, type StatusPillTone } from "./StatusPill";

export type InvoiceStatus = "paid" | "pending" | "overdue" | "draft";

export interface InvoiceRow {
  /** Stable identifier. */
  id: string;
  /** Invoice number as shown to the client, e.g. "INV-1042". */
  number: string;
  /** Project or engagement the invoice bills against. */
  project: string;
  /** ISO date string the invoice was issued. */
  issuedDate: string;
  /** ISO date string the invoice is due. */
  dueDate: string;
  /** Amount in the currency's base unit (e.g. dollars, not cents). */
  amount: number;
  status: InvoiceStatus;
}

const STATUS_TONE: Record<InvoiceStatus, StatusPillTone> = {
  paid: "good",
  pending: "warn",
  overdue: "danger",
  draft: "neutral",
};

const STATUS_LABEL: Record<InvoiceStatus, string> = {
  paid: "Paid",
  pending: "Pending",
  overdue: "Overdue",
  draft: "Draft",
};

export interface InvoiceTableProps {
  invoices: InvoiceRow[];
  /** Formats `amount` for display. Defaults to USD via `Intl.NumberFormat`. */
  formatAmount?: (amount: number) => string;
  /** Formats an ISO date string for display. Defaults to a locale short date. */
  formatDate?: (isoDate: string) => string;
  /** Called when a row is activated (click or Enter/Space when focused). */
  onSelectInvoice?: (invoice: InvoiceRow) => void;
  loading?: boolean;
  /** Rendered (spanning all columns) when `invoices` is empty. */
  emptyState?: ReactNode;
  "aria-label"?: string;
  className?: string;
}

const defaultFormatAmount = (amount: number) =>
  new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(amount);

const defaultFormatDate = (isoDate: string) => {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" }).format(
    date,
  );
};

/**
 * `InvoiceTable` — a list of client invoices built on the `DataTable`
 * primitive. Each row carries an invoice number, project, due date, amount
 * (tabular-nums, right-aligned), and a status pill (paid / pending / overdue /
 * draft). Sorting and row activation are inherited from `DataTable`.
 */
export function InvoiceTable({
  invoices,
  formatAmount = defaultFormatAmount,
  formatDate = defaultFormatDate,
  onSelectInvoice,
  loading = false,
  emptyState,
  "aria-label": ariaLabel = "Invoices",
  className,
}: InvoiceTableProps) {
  const columns = useMemo<Column<InvoiceRow>[]>(
    () => [
      { id: "number", header: "Invoice", accessor: "number", sortable: true },
      { id: "project", header: "Project", accessor: "project", sortable: true },
      {
        id: "dueDate",
        header: "Due",
        accessor: (row) => formatDate(row.dueDate),
        sortFn: (a, b) => a.dueDate.localeCompare(b.dueDate),
        sortable: true,
      },
      {
        id: "amount",
        header: "Amount",
        accessor: (row) => formatAmount(row.amount),
        sortFn: (a, b) => a.amount - b.amount,
        numeric: true,
        sortable: true,
      },
      {
        id: "status",
        header: "Status",
        accessor: (row) => (
          <StatusPill tone={STATUS_TONE[row.status]} dot>
            {STATUS_LABEL[row.status]}
          </StatusPill>
        ),
        sortFn: (a, b) => STATUS_LABEL[a.status].localeCompare(STATUS_LABEL[b.status]),
        sortable: true,
      },
    ],
    [formatAmount, formatDate],
  );

  return (
    <DataTable
      className={cn("ml-invoice-table", className)}
      columns={columns}
      data={invoices}
      getRowId={(row) => row.id}
      loading={loading}
      emptyState={emptyState ?? "No invoices yet."}
      onRowClick={onSelectInvoice}
      aria-label={ariaLabel}
    />
  );
}
