import { Shell } from "../../src/components/Shell";

export function ShellDemo() {
  return (
    <>
      <div className="demo-section">
        <div className="demo-label">Shell layout</div>
        <Shell style={{ height: 300, border: "1px solid var(--ml-border)", borderRadius: "var(--ml-radius-lg)", overflow: "hidden" }}>
          <div className="ml-shell-sidebar" style={{ width: 180, background: "var(--ml-bg-surface)", borderRight: "1px solid var(--ml-border)", padding: "var(--ml-space-lg)" }}>
            <span style={{ fontSize: "var(--ml-text-xs)", color: "var(--ml-text-faint)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Sidebar</span>
          </div>
          <div className="ml-shell-main" style={{ padding: "var(--ml-space-lg)" }}>
            <span style={{ fontSize: "var(--ml-text-sm)", color: "var(--ml-text-muted)" }}>Main content area</span>
          </div>
        </Shell>
      </div>
    </>
  );
}
