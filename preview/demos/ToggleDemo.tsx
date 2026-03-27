import { useState } from "react";
import { Toggle } from "../../src/components/Toggle";

const options = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Archived", value: "archived" },
];

export function ToggleDemo() {
  const [active, setActive] = useState("all");

  return (
    <>
      <div className="demo-section">
        <div className="demo-label">Segmented control</div>
        <Toggle options={options} active={active} onChange={setActive} />
        <p style={{ fontSize: "var(--ml-text-sm)", color: "var(--ml-text-muted)", marginTop: 8 }}>
          Active: <strong>{active}</strong>
        </p>
      </div>
    </>
  );
}
