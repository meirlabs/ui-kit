import { Label } from "../../src/components/Label";

export function LabelDemo() {
  return (
    <>
      <div className="demo-section">
        <div className="demo-label">Labels</div>
        <div className="demo-row">
          <Label>Status</Label>
          <Label>Category</Label>
          <Label>Last Updated</Label>
        </div>
      </div>
    </>
  );
}
