import { TopBar } from "../../src/components/TopBar";

export function TopBarDemo() {
  return (
    <>
      <div className="demo-section">
        <div className="demo-label">Top bar</div>
        <TopBar style={{ borderRadius: "var(--ml-radius-lg)", border: "1px solid var(--ml-border)" }}>
          <span style={{ fontWeight: 600, fontSize: "var(--ml-text-sm)" }}>App Name</span>
          <span style={{ flex: 1 }} />
          <span style={{ fontSize: "var(--ml-text-xs)", color: "var(--ml-text-muted)" }}>user@example.com</span>
        </TopBar>
      </div>
    </>
  );
}
