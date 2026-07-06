import { Tooltip } from "../../src/components/Tooltip";

const iconBtnStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 40,
  height: 40,
  borderRadius: "var(--ml-radius-md)",
  border: "1px solid var(--ml-border)",
  background: "var(--ml-bg-card)",
  color: "var(--ml-text-muted)",
  cursor: "pointer",
};

function IconButton({ label }: { label: string }) {
  return (
    <button type="button" style={iconBtnStyle} aria-label={label}>
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9 8v4M9 5.5h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </button>
  );
}

export function TooltipDemo() {
  return (
    <>
      <div className="demo-section">
        <div className="demo-label">On an icon button (hover or Tab to focus)</div>
        <Tooltip content="Duplicate this record">
          <IconButton label="Duplicate" />
        </Tooltip>
      </div>

      <div className="demo-section">
        <div className="demo-label">Placements</div>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          {(["top", "bottom", "left", "right"] as const).map((p) => (
            <Tooltip key={p} content={`Placed ${p}`} placement={p}>
              <button className="ml-btn ml-btn-secondary" type="button">
                {p}
              </button>
            </Tooltip>
          ))}
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-label">Near a viewport edge (flips to stay visible)</div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Tooltip content="I flip so I never clip off-screen" placement="right">
            <button className="ml-btn ml-btn-secondary" type="button">
              Edge trigger
            </button>
          </Tooltip>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-label">Custom open delay</div>
        <Tooltip content="Shown instantly" delay={0}>
          <button className="ml-btn ml-btn-ghost" type="button">
            No delay
          </button>
        </Tooltip>
      </div>
    </>
  );
}
