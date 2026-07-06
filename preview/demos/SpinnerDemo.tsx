import { Spinner } from "../../src/components/Spinner";

export function SpinnerDemo() {
  return (
    <>
      <div className="demo-section">
        <div className="demo-label">Sizes (16 / 20 / 24)</div>
        <div className="demo-row" style={{ alignItems: "center", gap: 24 }}>
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-label">Inherits color from context</div>
        <div className="demo-row" style={{ alignItems: "center", gap: 24 }}>
          <span style={{ color: "var(--ml-text)" }}>
            <Spinner size="md" />
          </span>
          <span style={{ color: "var(--ml-color-success)" }}>
            <Spinner size="md" label="Saving" />
          </span>
          <span style={{ color: "var(--ml-color-danger)" }}>
            <Spinner size="md" label="Retrying" />
          </span>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-label">In an async region</div>
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
          <Spinner size="md" label="Loading results" />
          <span>Loading results…</span>
        </div>
      </div>
    </>
  );
}
