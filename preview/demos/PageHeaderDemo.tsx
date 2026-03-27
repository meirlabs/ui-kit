import { PageHeader } from "../../src/components/PageHeader";

export function PageHeaderDemo() {
  return (
    <>
      <div className="demo-section">
        <div className="demo-label">With subtitle</div>
        <PageHeader title="Dashboard" subtitle="Overview of your trading agents and portfolio performance." />
      </div>
      <div className="demo-section">
        <div className="demo-label">Title only</div>
        <PageHeader title="Settings" />
      </div>
    </>
  );
}
