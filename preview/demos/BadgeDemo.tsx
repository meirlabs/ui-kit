import { Badge } from "../../src/components/Badge";

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M2.5 6.5l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function BadgeDemo() {
  return (
    <>
      <div className="demo-section">
        <div className="demo-label">Tones (neutral is gray, not blue)</div>
        <div className="demo-row">
          <Badge tone="neutral">Draft</Badge>
          <Badge tone="success">Active</Badge>
          <Badge tone="warning">Pending</Badge>
          <Badge tone="danger">Error</Badge>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-label">With status dot</div>
        <div className="demo-row">
          <Badge tone="neutral" dot>Offline</Badge>
          <Badge tone="success" dot>Online</Badge>
          <Badge tone="warning" dot>Degraded</Badge>
          <Badge tone="danger" dot>Down</Badge>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-label">With icon</div>
        <div className="demo-row">
          <Badge tone="success" icon={<CheckIcon />}>Verified</Badge>
          <Badge tone="neutral" icon={<CheckIcon />}>Synced</Badge>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-label">Sizes</div>
        <div className="demo-row" style={{ alignItems: "center" }}>
          <Badge tone="success" size="sm">sm</Badge>
          <Badge tone="success" size="md">md</Badge>
          <Badge tone="neutral" size="sm" dot>3</Badge>
          <Badge tone="neutral" size="md">99+</Badge>
        </div>
      </div>
    </>
  );
}
