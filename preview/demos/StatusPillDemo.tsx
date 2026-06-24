import { StatusPill } from "../../src/components/StatusPill";

export function StatusPillDemo() {
  return (
    <>
      <div className="demo-section">
        <div className="demo-label">Tones</div>
        <div className="demo-row">
          <StatusPill tone="good">Active</StatusPill>
          <StatusPill tone="warn">Pending</StatusPill>
          <StatusPill tone="neutral">Draft</StatusPill>
        </div>
      </div>
      <div className="demo-section">
        <div className="demo-label">In context</div>
        <div className="demo-row">
          <StatusPill tone="good">Online</StatusPill>
          <StatusPill tone="warn">Degraded</StatusPill>
          <StatusPill tone="neutral">Maintenance</StatusPill>
        </div>
      </div>
    </>
  );
}
