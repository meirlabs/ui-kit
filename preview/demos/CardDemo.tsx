import { Card } from "../../src/components/Card";

const labelStyle = {
  fontSize: 12,
  fontWeight: 500,
  letterSpacing: "0.5px",
  textTransform: "uppercase" as const,
  color: "var(--ml-text-muted)",
};

export function CardDemo() {
  return (
    <>
      <div className="demo-section">
        <div className="demo-label">Default card — 12px radius, 24px padding, no shadow</div>
        <Card>
          <p style={{ fontSize: 14, color: "var(--ml-text-muted)", margin: 0 }}>
            Cards provide a bordered, rounded surface for grouping related
            information. Depth comes from the border and surface — never a shadow
            at rest. Do not nest cards inside cards.
          </p>
        </Card>
      </div>

      <div className="demo-section">
        <div className="demo-label">Compact padding (12px)</div>
        <Card padding="compact">
          <p style={{ fontSize: 14, color: "var(--ml-text-muted)", margin: 0 }}>
            Tighter 12px padding for dense contexts.
          </p>
        </Card>
      </div>

      <div className="demo-section">
        <div className="demo-label">Interactive (hover border) — as button</div>
        <div style={{ display: "flex", gap: "var(--ml-space-md)" }}>
          <Card
            as="button"
            interactive
            style={{ flex: 1 }}
            onClick={() => alert("card clicked")}
          >
            <span style={labelStyle}>Revenue</span>
            <p
              style={{
                fontSize: 22,
                fontWeight: 600,
                marginTop: "var(--ml-space-xs)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              $12,340
            </p>
          </Card>
          <Card interactive onClick={() => alert("div card clicked")} style={{ flex: 1 }}>
            <span style={labelStyle}>Trades</span>
            <p
              style={{
                fontSize: 22,
                fontWeight: 600,
                marginTop: "var(--ml-space-xs)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              87
            </p>
          </Card>
        </div>
      </div>
    </>
  );
}
