import { CometLoader } from "../../src/components/CometLoader";

export function CometLoaderDemo() {
  return (
    <>
      <div className="demo-section">
        <div className="demo-label">Sizes (16 / 20 / 24)</div>
        <div className="demo-row" style={{ alignItems: "center", gap: 24 }}>
          <CometLoader size="sm" />
          <CometLoader size="md" />
          <CometLoader size="lg" />
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-label">Inherits color from context</div>
        <div className="demo-row" style={{ alignItems: "center", gap: 24 }}>
          <span style={{ color: "var(--ml-text)" }}>
            <CometLoader size="md" />
          </span>
          <span style={{ color: "var(--ml-text-muted)" }}>
            <CometLoader size="md" label="Analyzing domain" />
          </span>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-label">AI / agentic work-in-progress</div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            height: 120,
            border: "1px solid var(--ml-border)",
            borderRadius: "var(--ml-radius-lg)",
            background: "var(--ml-bg-card)",
            color: "var(--ml-text-muted)",
            fontSize: 14,
          }}
        >
          <CometLoader size="md" label="Analyzing domain" />
          <span>Analyzing domain…</span>
        </div>
      </div>
    </>
  );
}
