import { Card } from "../../src/components/Card";

export function CardDemo() {
  return (
    <>
      <div className="demo-section">
        <div className="demo-label">Default card</div>
        <Card>
          <p style={{ fontSize: "var(--ml-text-sm)", color: "var(--ml-text-muted)" }}>
            This is a card with some content inside. Cards provide a bordered, rounded container for grouping related information.
          </p>
        </Card>
      </div>
      <div className="demo-section">
        <div className="demo-label">Multiple cards</div>
        <div style={{ display: "flex", gap: "var(--ml-space-md)" }}>
          <Card style={{ flex: 1 }}>
            <strong style={{ fontSize: "var(--ml-text-sm)" }}>Revenue</strong>
            <p style={{ fontSize: "var(--ml-text-2xl)", fontWeight: 700, marginTop: "var(--ml-space-xs)" }}>$12,340</p>
          </Card>
          <Card style={{ flex: 1 }}>
            <strong style={{ fontSize: "var(--ml-text-sm)" }}>Trades</strong>
            <p style={{ fontSize: "var(--ml-text-2xl)", fontWeight: 700, marginTop: "var(--ml-space-xs)" }}>87</p>
          </Card>
        </div>
      </div>
    </>
  );
}
