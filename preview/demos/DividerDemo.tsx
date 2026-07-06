import { Divider } from "../../src/components/Divider";

export function DividerDemo() {
  const muted = { color: "var(--ml-text-muted)", fontSize: "var(--ml-text-sm)" };

  return (
    <>
      <div className="demo-section">
        <div className="demo-label">Horizontal</div>
        <div style={muted}>Content above the divider</div>
        <Divider />
        <div style={muted}>Content below the divider</div>
      </div>

      <div className="demo-section">
        <div className="demo-label">Dashed</div>
        <div style={muted}>Above</div>
        <Divider variant="dashed" />
        <div style={muted}>Below</div>
      </div>

      <div className="demo-section">
        <div className="demo-label">Vertical (toolbar separator)</div>
        <div
          className="demo-row"
          style={{ alignItems: "center", height: "24px", ...muted }}
        >
          <span>Edit</span>
          <Divider orientation="vertical" />
          <span>Duplicate</span>
          <Divider orientation="vertical" />
          <span>Delete</span>
        </div>
      </div>
    </>
  );
}
