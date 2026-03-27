import { Divider } from "../../src/components/Divider";

export function DividerDemo() {
  return (
    <>
      <div className="demo-section">
        <div className="demo-label">Between content</div>
        <div style={{ color: "var(--ml-text-muted)", fontSize: "var(--ml-text-sm)" }}>
          Content above the divider
        </div>
        <Divider />
        <div style={{ color: "var(--ml-text-muted)", fontSize: "var(--ml-text-sm)" }}>
          Content below the divider
        </div>
      </div>
    </>
  );
}
