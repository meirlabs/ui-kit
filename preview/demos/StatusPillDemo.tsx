import { StatusPill } from "../../src/components/StatusPill";

export function StatusPillDemo() {
  return (
    <>
      <div className="demo-section">
        <div className="demo-label">Tones</div>
        <div className="demo-row">
          <StatusPill tone="good">Active</StatusPill>
          <StatusPill tone="warn">Pending</StatusPill>
          <StatusPill tone="danger">Failed</StatusPill>
          <StatusPill tone="neutral">Draft</StatusPill>
        </div>
      </div>
      <div className="demo-section">
        <div className="demo-label">With leading dot</div>
        <div className="demo-row">
          <StatusPill tone="good" dot>
            Online
          </StatusPill>
          <StatusPill tone="warn" dot>
            Degraded
          </StatusPill>
          <StatusPill tone="danger" dot>
            Offline
          </StatusPill>
          <StatusPill tone="neutral" dot>
            Maintenance
          </StatusPill>
        </div>
      </div>
      <div className="demo-section">
        <div className="demo-label">With icon</div>
        <div className="demo-row">
          <StatusPill
            tone="good"
            icon={
              <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M3.5 8.5l3 3 6-7"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            }
          >
            Verified
          </StatusPill>
          <StatusPill
            tone="danger"
            icon={
              <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M4 4l8 8M12 4l-8 8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            }
          >
            Rejected
          </StatusPill>
        </div>
      </div>
    </>
  );
}
