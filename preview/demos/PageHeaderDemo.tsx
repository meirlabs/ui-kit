import { PageHeader } from "../../src/components/PageHeader";
import { Button } from "../../src/components/Button";

export function PageHeaderDemo() {
  return (
    <>
      <div className="demo-section">
        <div className="demo-label">Title, subtitle, actions</div>
        <PageHeader
          title="Billing"
          subtitle="Manage your plan, payment method, and invoices."
          actions={
            <>
              <Button variant="secondary">Export</Button>
              <Button>Upgrade</Button>
            </>
          }
        />
      </div>

      <div className="demo-section">
        <div className="demo-label">Breadcrumb + back button</div>
        <PageHeader
          breadcrumb={
            <span style={{ fontSize: 12, color: "var(--ml-text-muted)" }}>
              Settings / Team / Members
            </span>
          }
          backHref="#settings"
          backLabel="Team"
          title="Members"
          subtitle="12 people have access to this workspace."
        />
      </div>

      <div className="demo-section">
        <div className="demo-label">Title only</div>
        <PageHeader title="Settings" />
      </div>
    </>
  );
}
