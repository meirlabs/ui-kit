import { DotsLoader } from "../../src/components/DotsLoader";
import { BarsLoader } from "../../src/components/BarsLoader";
import { PulseRingLoader } from "../../src/components/PulseRingLoader";

function Row({ children }: { children: React.ReactNode }) {
  return (
    <div className="demo-row" style={{ alignItems: "center", gap: 24 }}>
      {children}
    </div>
  );
}

export function LoadersDemo() {
  return (
    <>
      <div className="demo-section">
        <div className="demo-label">DotsLoader — sizes (16 / 20 / 24)</div>
        <Row>
          <DotsLoader size="sm" />
          <DotsLoader size="md" />
          <DotsLoader size="lg" />
        </Row>
      </div>

      <div className="demo-section">
        <div className="demo-label">BarsLoader — sizes (14 / 18 / 24)</div>
        <Row>
          <BarsLoader size="sm" />
          <BarsLoader size="md" />
          <BarsLoader size="lg" />
        </Row>
      </div>

      <div className="demo-section">
        <div className="demo-label">PulseRingLoader — sizes (16 / 20 / 26)</div>
        <Row>
          <PulseRingLoader size="sm" />
          <PulseRingLoader size="md" />
          <PulseRingLoader size="lg" />
        </Row>
      </div>

      <div className="demo-section">
        <div className="demo-label">Inherits color from context</div>
        <Row>
          <span style={{ color: "var(--ml-text)" }}>
            <DotsLoader />
          </span>
          <span style={{ color: "var(--ml-color-success)" }}>
            <BarsLoader label="Uploading" />
          </span>
          <span style={{ color: "var(--ml-color-danger)" }}>
            <PulseRingLoader label="Reconnecting" />
          </span>
        </Row>
      </div>

      <div className="demo-section">
        <div className="demo-label">In context</div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            padding: 24,
            border: "1px solid var(--ml-border)",
            borderRadius: "var(--ml-radius-lg)",
            background: "var(--ml-bg-card)",
            color: "var(--ml-text-muted)",
            fontSize: 14,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <DotsLoader label="Assistant is typing" />
            <span>Assistant is typing…</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <BarsLoader label="Uploading file" />
            <span>Uploading report.pdf…</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <PulseRingLoader label="Connecting" />
            <span>Connecting to workspace…</span>
          </div>
        </div>
      </div>
    </>
  );
}
