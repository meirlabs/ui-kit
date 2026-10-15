import { useState } from "react";

const note: React.CSSProperties = {
  marginTop: 8,
  color: "var(--ml-text-faint)",
  fontSize: "0.75rem",
  lineHeight: 1.5,
};

const iconButton: React.CSSProperties = {
  width: 24,
  height: 24,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  border: "1px solid var(--ml-border)",
  borderRadius: "var(--ml-radius-sm)",
  background: "var(--ml-bg-surface)",
  color: "var(--ml-text-muted)",
  cursor: "pointer",
  padding: 0,
};

const log: React.CSSProperties = {
  marginTop: 12,
  fontSize: "0.75rem",
  fontFamily:
    "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
  color: "var(--ml-text-muted)",
  background: "var(--ml-bg-surface)",
  border: "1px solid var(--ml-border)",
  borderRadius: 8,
  padding: "8px 12px",
  minHeight: 20,
};

function DotIcon() {
  return (
    <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor" aria-hidden="true">
      <circle cx="4" cy="4" r="4" />
    </svg>
  );
}

const labels = ["A", "B", "C", "D"];

export function HitAreaDemo() {
  const [debug, setDebug] = useState(false);
  const [clicks, setClicks] = useState<string[]>([]);

  return (
    <>
      <div className="demo-section">
        <div className="demo-label">
          ::before hit-area — 24px visible box, ~44px clickable region, no
          layout shift
        </div>
        <div
          className={debug ? "demo-row demo-hit-area-debug" : "demo-row"}
          style={{ gap: 24 }}
        >
          {labels.map((label) => (
            <button
              key={label}
              type="button"
              className="ml-hit-area"
              style={iconButton}
              aria-label={`Button ${label}`}
              onClick={() =>
                setClicks((c) => [
                  `Button ${label}`,
                  ...c.slice(0, 4),
                ])
              }
            >
              <DotIcon />
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setDebug((d) => !d)}
          style={{
            marginTop: 12,
            border: "1px solid var(--ml-border)",
            borderRadius: 6,
            background: "var(--ml-bg-surface)",
            color: "var(--ml-text)",
            fontSize: "0.72rem",
            fontFamily: "inherit",
            padding: "4px 10px",
            cursor: "pointer",
          }}
        >
          {debug ? "Hide" : "Show"} hit-area boundary
        </button>
        <div style={log}>
          {clicks.length === 0
            ? "Click near a button's edge — even outside its visible 24px box — and the right one should log below."
            : clicks.map((c, i) => (
                <div key={i}>
                  {i === 0 ? "→ " : "  "}
                  {c}
                </div>
              ))}
        </div>
        <p style={note}>
          Each button is a plain 24px box; the ::before hit-area (dashed
          outline when toggled) extends it toward ~44px per side without
          adding padding or moving neighbors — the 24px gap between buttons
          is more than 2× the default 10px inset on every side, so adjacent
          hit-areas don't overlap and clicking near one button never registers
          on another. On coarse (touch) pointers the inset grows to 14px.
        </p>
      </div>
    </>
  );
}
