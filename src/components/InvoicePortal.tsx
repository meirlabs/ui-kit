import { useMemo, useState, type ReactNode } from "react";
import { cn } from "../utils/cn";
import { EmptyState } from "./EmptyState";
import { InvoiceTable, type InvoiceRow } from "./InvoiceTable";
import { InvoiceSummaryPanel, type InvoiceLineItem } from "./InvoiceSummaryPanel";

export interface InvoicePortalProps {
  invoices: InvoiceRow[];
  /** Resolves the itemized breakdown shown in the summary panel for an invoice. */
  getLineItems?: (invoice: InvoiceRow) => InvoiceLineItem[];
  /** Formats amounts. Defaults to USD via `Intl.NumberFormat`. */
  formatAmount?: (amount: number) => string;
  /** Formats ISO date strings. Defaults to a locale short date. */
  formatDate?: (isoDate: string) => string;

  /** Selected invoice id — controlled. */
  selectedInvoiceId?: string;
  /** Initial selected invoice id — uncontrolled (defaults to the first invoice). */
  defaultSelectedInvoiceId?: string;
  onSelectInvoice?: (invoice: InvoiceRow) => void;

  onDownloadInvoice?: (invoice: InvoiceRow) => void;
  onMarkInvoicePaid?: (invoice: InvoiceRow) => void;

  loading?: boolean;
  /** Rendered in place of both panes when `invoices` is empty. */
  emptyState?: ReactNode;
  className?: string;
}

/**
 * `InvoicePortal` — the client-portal invoice pattern: a list of invoices
 * next to a summary panel for whichever one is selected. Stacks to a single
 * column under 900px so it fits a narrow client-facing layout.
 *
 * Selection is controlled (`selectedInvoiceId` + `onSelectInvoice`) or
 * uncontrolled (`defaultSelectedInvoiceId`, defaulting to the first invoice),
 * mirroring `DataTable`'s sort/selection convention. Data is caller-supplied —
 * this composes existing primitives (`InvoiceTable`, `InvoiceSummaryPanel`,
 * `EmptyState`) and never fetches or persists anything itself.
 */
export function InvoicePortal({
  invoices,
  getLineItems,
  formatAmount,
  formatDate,
  selectedInvoiceId,
  defaultSelectedInvoiceId,
  onSelectInvoice,
  onDownloadInvoice,
  onMarkInvoicePaid,
  loading = false,
  emptyState,
  className,
}: InvoicePortalProps) {
  const [internalSelectedId, setInternalSelectedId] = useState<string | undefined>(
    defaultSelectedInvoiceId ?? invoices[0]?.id,
  );
  const isControlled = selectedInvoiceId !== undefined;
  const activeId = isControlled ? selectedInvoiceId : internalSelectedId;

  const activeInvoice = useMemo(
    () => invoices.find((invoice) => invoice.id === activeId) ?? invoices[0],
    [invoices, activeId],
  );

  function handleSelect(invoice: InvoiceRow) {
    if (!isControlled) setInternalSelectedId(invoice.id);
    onSelectInvoice?.(invoice);
  }

  if (!loading && invoices.length === 0) {
    return (
      <div className={cn("ml-invoice-portal", className)}>
        {emptyState ?? (
          <EmptyState
            variant="no-data"
            title="No invoices yet"
            description="Invoices you send to this client will show up here."
          />
        )}
      </div>
    );
  }

  return (
    <div className={cn("ml-invoice-portal", className)}>
      <div className="ml-invoice-portal-list">
        <InvoiceTable
          invoices={invoices}
          formatAmount={formatAmount}
          formatDate={formatDate}
          loading={loading}
          onSelectInvoice={handleSelect}
        />
      </div>
      {activeInvoice != null && (
        <div className="ml-invoice-portal-summary">
          <InvoiceSummaryPanel
            invoice={activeInvoice}
            lineItems={getLineItems?.(activeInvoice)}
            formatAmount={formatAmount}
            formatDate={formatDate}
            onDownload={onDownloadInvoice}
            onMarkAsPaid={onMarkInvoicePaid}
          />
        </div>
      )}
    </div>
  );
}
