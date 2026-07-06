import { TopBar } from "../../src/components/TopBar";

const frame = {
  borderRadius: "var(--ml-radius-lg)",
  border: "1px solid var(--ml-border)",
};

export function TopBarDemo() {
  return (
    <>
      <div className="demo-section">
        <div className="demo-label">Left / center / right slots</div>
        <TopBar
          style={frame}
          left={<strong style={{ fontSize: 14, fontWeight: 600 }}>Acme</strong>}
          center={
            <input
              className="ml-input"
              placeholder="Search…"
              style={{
                width: "100%",
                maxWidth: 320,
                height: 32,
                padding: "0 12px",
                fontSize: 14,
                color: "var(--ml-text)",
                background: "var(--ml-bg-card)",
                border: "1px solid var(--ml-border)",
                borderRadius: "var(--ml-radius-md)",
              }}
            />
          }
          right={
            <span style={{ fontSize: 12, color: "var(--ml-text-muted)" }}>
              user@example.com
            </span>
          }
        />
      </div>

      <div className="demo-section">
        <div className="demo-label">Passthrough children (fallback)</div>
        <TopBar style={frame}>
          <span style={{ fontWeight: 600, fontSize: 14 }}>App Name</span>
          <span style={{ flex: 1 }} />
          <span style={{ fontSize: 12, color: "var(--ml-text-muted)" }}>v1.0</span>
        </TopBar>
      </div>
    </>
  );
}
