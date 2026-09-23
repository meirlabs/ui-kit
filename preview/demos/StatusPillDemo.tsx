import { useState } from "react";
import { StatusPill } from "../../src/components/StatusPill";

const note: React.CSSProperties = {
  fontSize: "var(--ml-text-sm)",
  color: "var(--ml-text-muted)",
  marginTop: 10,
};

const addBtn: React.CSSProperties = {
  padding: "5px 12px",
  borderRadius: "var(--ml-radius-pill)",
  border: "1px solid var(--ml-border)",
  background: "var(--ml-bg-surface)",
  color: "var(--ml-text)",
  fontFamily: "inherit",
  fontSize: 12,
  fontWeight: 600,
  cursor: "pointer",
};

const entranceTones = [
  { tone: "good", label: "Deployed" },
  { tone: "warn", label: "Building" },
  { tone: "danger", label: "Failed" },
  { tone: "neutral", label: "Queued" },
] as const;

export function StatusPillDemo() {
  const [items, setItems] = useState<number[]>([0, 1]);

  const addPill = () => setItems((prev) => [...prev, prev.length]);
  const reset = () => setItems([]);

  return (
    <>
      <div className="demo-section">
        <div className="demo-label">Tones (tone changes ride a smooth color transition)</div>
        <div className="demo-row">
          <StatusPill tone="good">Active</StatusPill>
          <StatusPill tone="warn">Pending</StatusPill>
          <StatusPill tone="danger">Failed</StatusPill>
          <StatusPill tone="neutral">Draft</StatusPill>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-label">Live status — good-tone dot breathes by default</div>
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
        <p style={note}>
          The soft pulse marks the <strong>live/active</strong> state. Pass{" "}
          <code>pulse={"{false}"}</code> to hold it still, or <code>pulse</code> to force it on any
          tone. Reduced-motion users always see a static dot.
        </p>
      </div>

      <div className="demo-section">
        <div className="demo-label">Pulse control (pulse forced / disabled)</div>
        <div className="demo-row">
          <StatusPill tone="danger" dot pulse>
            Critical
          </StatusPill>
          <StatusPill tone="good" dot pulse={false}>
            Idle (no pulse)
          </StatusPill>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-label">Entrance — each pill fades and settles in on mount</div>
        <div className="demo-row">
          {items.map((n) => {
            const t = entranceTones[n % entranceTones.length];
            return (
              <StatusPill key={n} tone={t.tone} dot>
                {t.label}
              </StatusPill>
            );
          })}
          {items.length === 0 ? (
            <span style={{ fontSize: 12, color: "var(--ml-text-faint)" }}>No pills yet.</span>
          ) : null}
        </div>
        <div className="demo-row" style={{ marginTop: 12 }}>
          <button type="button" style={addBtn} onClick={addPill}>
            Add pill
          </button>
          <button type="button" style={addBtn} onClick={reset}>
            Reset
          </button>
        </div>
        <p style={note}>
          Click <strong>Add pill</strong> to watch the sub-300ms entrance (opacity + a small
          settle). Reset then re-add to replay it.
        </p>
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
