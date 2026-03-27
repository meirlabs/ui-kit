import { Badge } from "../../src/components/Badge";

export function BadgeDemo() {
  return (
    <>
      <div className="demo-section">
        <div className="demo-label">Tones</div>
        <div className="demo-row">
          <Badge tone="good">Active</Badge>
          <Badge tone="warn">Pending</Badge>
          <Badge tone="danger">Error</Badge>
          <Badge tone="neutral">Info</Badge>
        </div>
      </div>
      <div className="demo-section">
        <div className="demo-label">Counts</div>
        <div className="demo-row">
          <Badge tone="good">3</Badge>
          <Badge tone="warn">12</Badge>
          <Badge tone="danger">!</Badge>
          <Badge tone="neutral">99+</Badge>
        </div>
      </div>
    </>
  );
}
