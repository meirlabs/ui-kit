import { Label } from "../../src/components/Label";

export function LabelDemo() {
  return (
    <>
      <div className="demo-section">
        <div className="demo-label">Eyebrow micro-labels</div>
        <div className="demo-row">
          <Label>Status</Label>
          <Label>Category</Label>
          <Label>Last Updated</Label>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-label">Sizes</div>
        <div className="demo-row" style={{ alignItems: "center" }}>
          <Label size="sm">Small</Label>
          <Label size="md">Medium</Label>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-label">Tone</div>
        <div className="demo-row">
          <Label tone="default">Default</Label>
          <Label tone="muted">Muted</Label>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-label">As a section eyebrow above content</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <Label tone="muted">Billing</Label>
          <div style={{ fontSize: "14px", color: "var(--ml-text)" }}>
            Manage your plan and payment method.
          </div>
        </div>
      </div>
    </>
  );
}
