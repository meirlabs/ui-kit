import { useState } from "react";
import { Grid } from "../../src/components/Grid";
import { InvoicePortal } from "../../src/components/InvoicePortal";
import { InvoiceSummaryPanel } from "../../src/components/InvoiceSummaryPanel";
import { InvoiceTable, type InvoiceRow } from "../../src/components/InvoiceTable";
import { PageHeader } from "../../src/components/PageHeader";
import { StatCard } from "../../src/components/StatCard";

const invoices: InvoiceRow[] = [
  {
    id: "1042",
    number: "INV-1042",
    project: "Website Redesign",
    issuedDate: "2026-08-01",
    dueDate: "2026-08-15",
    amount: 4200,
    status: "paid",
  },
  {
    id: "1043",
    number: "INV-1043",
    project: "Website Redesign",
    issuedDate: "2026-08-10",
    dueDate: "2026-08-24",
    amount: 2800,
    status: "pending",
  },
  {
    id: "1044",
    number: "INV-1044",
    project: "Mobile App — Sprint 3",
    issuedDate: "2026-07-20",
    dueDate: "2026-08-03",
    amount: 6100,
    status: "overdue",
  },
  {
    id: "1045",
    number: "INV-1045",
    project: "Mobile App — Sprint 4",
    issuedDate: "2026-08-28",
    dueDate: "2026-09-11",
    amount: 3600,
    status: "draft",
  },
];

const lineItemsByInvoice: Record<string, { label: string; amount: number }[]> = {
  "1043": [
    { label: "Design system audit", amount: 1800 },
    { label: "Component handoff", amount: 1000 },
  ],
  "1044": [
    { label: "Sprint 3 development", amount: 5200 },
    { label: "QA & bug triage", amount: 900 },
  ],
};

const outstanding = invoices
  .filter((i) => i.status === "pending" || i.status === "overdue")
  .reduce((sum, i) => sum + i.amount, 0);
const overdueCount = invoices.filter((i) => i.status === "overdue").length;
const paidThisMonth = invoices
  .filter((i) => i.status === "paid")
  .reduce((sum, i) => sum + i.amount, 0);

const currency = (n: number) =>
  new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(
    n,
  );

export function InvoicePortalDemo() {
  const [downloaded, setDownloaded] = useState<string | null>(null);
  const [paidId, setPaidId] = useState<string | null>(null);

  const liveInvoices = invoices.map((invoice) =>
    invoice.id === paidId ? { ...invoice, status: "paid" as const } : invoice,
  );

  return (
    <>
      <div className="demo-section">
        <div className="demo-label">
          Client portal pattern — invoice list + summary, composed by `InvoicePortal`
        </div>
        <PageHeader
          title="Acme Co."
          subtitle="Client portal — invoices"
          actions={<span className="ml-detail-value">{downloaded ? `Downloaded ${downloaded}` : " "}</span>}
        />
        <Grid columns={3} gap="lg" style={{ marginBottom: 24 }}>
          <StatCard value={currency(outstanding)} label="Outstanding" />
          <StatCard value={String(overdueCount)} label="Overdue Invoices" />
          <StatCard value={currency(paidThisMonth)} label="Paid This Month" />
        </Grid>
        <InvoicePortal
          invoices={liveInvoices}
          getLineItems={(invoice) => lineItemsByInvoice[invoice.id] ?? []}
          onDownloadInvoice={(invoice) => setDownloaded(invoice.number)}
          onMarkInvoicePaid={(invoice) => setPaidId(invoice.id)}
        />
      </div>

      <div className="demo-section">
        <div className="demo-label">InvoiceTable on its own (sortable, keyboard-activatable rows)</div>
        <InvoiceTable invoices={invoices} onSelectInvoice={() => {}} />
      </div>

      <div className="demo-section">
        <div className="demo-label">InvoiceSummaryPanel on its own, with line items</div>
        <div style={{ maxWidth: 420 }}>
          <InvoiceSummaryPanel
            invoice={invoices[2]}
            lineItems={lineItemsByInvoice["1044"]}
            onDownload={() => {}}
            onMarkAsPaid={() => {}}
          />
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-label">Empty state (no invoices yet)</div>
        <InvoicePortal invoices={[]} />
      </div>
    </>
  );
}
