import { useMemo, useState } from "react";
import { Checkbox } from "../../src/components/Checkbox";
import { RadioGroup, Radio } from "../../src/components/Radio";

export function CheckboxRadioDemo() {
  const [items, setItems] = useState({ a: true, b: false, c: false });
  const allChecked = items.a && items.b && items.c;
  const someChecked = items.a || items.b || items.c;
  const indeterminate = someChecked && !allChecked;

  const [plan, setPlan] = useState("pro");

  const setAll = (checked: boolean) =>
    setItems({ a: checked, b: checked, c: checked });

  const summary = useMemo(
    () => Object.entries(items).filter(([, v]) => v).map(([k]) => k).join(", "),
    [items],
  );

  return (
    <>
      <div className="demo-section">
        <div className="demo-label">
          Indeterminate parent + children (controlled)
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Checkbox
            label="Select all"
            checked={allChecked}
            indeterminate={indeterminate}
            onChange={(e) => setAll(e.target.checked)}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", paddingLeft: "26px" }}>
            <Checkbox
              label="Analytics"
              description="Usage metrics and dashboards"
              checked={items.a}
              onChange={(e) => setItems((s) => ({ ...s, a: e.target.checked }))}
            />
            <Checkbox
              label="Billing"
              checked={items.b}
              onChange={(e) => setItems((s) => ({ ...s, b: e.target.checked }))}
            />
            <Checkbox
              label="Security"
              checked={items.c}
              onChange={(e) => setItems((s) => ({ ...s, c: e.target.checked }))}
            />
          </div>
          <p style={{ fontSize: "12px", color: "var(--ml-text-muted)" }}>
            Selected: {summary || "(none)"}
          </p>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-label">Disabled checkbox</div>
        <Checkbox label="Unavailable option" defaultChecked disabled />
      </div>

      <div className="demo-section">
        <div className="demo-label">
          RadioGroup — arrow keys move + select (vertical)
        </div>
        <RadioGroup
          value={plan}
          onChange={setPlan}
          aria-label="Plan"
        >
          <Radio value="free" label="Free" description="For personal projects" />
          <Radio value="pro" label="Pro" description="For growing teams" />
          <Radio value="ent" label="Enterprise" description="Custom limits & SSO" />
        </RadioGroup>
        <p style={{ fontSize: "12px", color: "var(--ml-text-muted)", marginTop: "8px" }}>
          Selected: {plan}
        </p>
      </div>

      <div className="demo-section">
        <div className="demo-label">Horizontal orientation</div>
        <RadioGroup defaultValue="m" name="size" orientation="horizontal" aria-label="Size">
          <Radio value="s" label="Small" />
          <Radio value="m" label="Medium" />
          <Radio value="l" label="Large" />
          <Radio value="xl" label="X-Large" disabled />
        </RadioGroup>
      </div>
    </>
  );
}
