import { type ComponentPropsWithoutRef, forwardRef } from "react";
import { cn } from "../utils/cn";
import { Button } from "./Button";
import { Card } from "./Card";
import { DetailList, type DetailListItem } from "./DetailList";
import { StatusPill } from "./StatusPill";
import {
  type InvoiceRow,
  type InvoiceStatus,
} from "./InvoiceTable";

const STATUS_TONE: Record<InvoiceStatus, "good" | "warn" | "danger" | "neutral"> = {
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

export interface InvoiceLineItem {
  label: string;
  amount: number;
}

export interface InvoiceSummaryPanelProps
  extends Omit<ComponentPropsWithoutRef<"div">, "title"> {
  invoice: InvoiceRow;
  /** Itemized breakdown rendered below the details. Omit for a plain summary. */
  lineItems?: InvoiceLineItem[];
  /** Formats `amount` and line-item amounts. Defaults to USD via `Intl.NumberFormat`. */
  formatAmount?: (amount: number) => string;
  /** Formats an ISO date string for display. Defaults to a locale short date. */
  formatDate?: (isoDate: string) => string;
  /**
   * Called when "Download" is pressed. This is a presentational affordance —
   * wire up the actual file fetch/generation yourself. The button only
   * renders when this is provided.
   */
  onDownload?: (invoice: InvoiceRow) => void;
  /**
   * Called when "Mark as paid" is pressed. Hidden for already-paid invoices
   * and, like `onDownload`, only renders when provided — this component
   * never mutates invoice state itself.
   */
  onMarkAsPaid?: (invoice: InvoiceRow) => void;
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
 * `InvoiceSummaryPanel` — the detail view for a single invoice: status,
 * project, dates, amount due, an optional itemized breakdown, and
 * placeholder Download / Mark-as-paid actions. Pure presentation — every
 * action is an opt-in callback the consumer wires up; nothing here talks to
 * a payment or email backend.
 */
export const InvoiceSummaryPanel = forwardRef<HTMLDivElement, InvoiceSummaryPanelProps>(
  function InvoiceSummaryPanel(
    {
      invoice,
      lineItems,
      formatAmount = defaultFormatAmount,
      formatDate = defaultFormatDate,
      onDownload,
      onMarkAsPaid,
      className,
      ...rest
    },
    ref,
  ) {
    const details: DetailListItem[] = [
      { label: "Issued", value: formatDate(invoice.issuedDate) },
      { label: "Due", value: formatDate(invoice.dueDate) },
    ];

    const lineItemsTotal = lineItems?.reduce((sum, item) => sum + item.amount, 0);
    const showActions = onDownload != null || (onMarkAsPaid != null && invoice.status !== "paid");

    return (
      <Card
        ref={ref}
        role="region"
        className={cn("ml-invoice-summary", className)}
        aria-label={`Invoice ${invoice.number} summary`}
        {...rest}
      >
        <div className="ml-invoice-summary-header">
          <div>
            <h3 className="ml-invoice-summary-title">{invoice.number}</h3>
            <p className="ml-invoice-summary-subtitle">{invoice.project}</p>
          </div>
          <StatusPill tone={STATUS_TONE[invoice.status]} dot>
            {STATUS_LABEL[invoice.status]}
          </StatusPill>
        </div>

        <div className="ml-invoice-summary-amount">
          <span className="ml-invoice-summary-amount-label">Amount due</span>
          <span className="ml-invoice-summary-amount-value ml-tabular">
            {formatAmount(invoice.amount)}
          </span>
        </div>

        <DetailList items={details} columns={2} />

        {lineItems != null && lineItems.length > 0 && (
          <div className="ml-invoice-summary-items">
            <h4 className="ml-invoice-summary-items-title">Line items</h4>
            <ul className="ml-invoice-summary-items-list">
              {lineItems.map((item) => (
                <li key={item.label} className="ml-invoice-summary-item">
                  <span>{item.label}</span>
                  <span className="ml-tabular">{formatAmount(item.amount)}</span>
                </li>
              ))}
            </ul>
            {lineItemsTotal != null && (
              <div className="ml-invoice-summary-item ml-invoice-summary-item--total">
                <span>Total</span>
                <span className="ml-tabular">{formatAmount(lineItemsTotal)}</span>
              </div>
            )}
          </div>
        )}

        {showActions && (
          <div className="ml-invoice-summary-actions">
            {onDownload != null && (
              <Button variant="secondary" onClick={() => onDownload(invoice)}>
                Download
              </Button>
            )}
            {onMarkAsPaid != null && invoice.status !== "paid" && (
              <Button variant="primary" onClick={() => onMarkAsPaid(invoice)}>
                Mark as paid
              </Button>
            )}
          </div>
        )}
      </Card>
    );
  },
);
