import { useState } from "react";
import { Toggle } from "../../src/components/Toggle";

const options = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Archived", value: "archived" },
];

const withDisabled = [
  { label: "Day", value: "day" },
  { label: "Week", value: "week" },
  { label: "Month", value: "month", disabled: true },
];

const note: React.CSSProperties = {
  fontSize: "var(--ml-text-sm)",
  color: "var(--ml-text-muted)",
  marginTop: 8,
};

export function ToggleDemo() {
  const [active, setActive] = useState("all");
  const [range, setRange] = useState("day");

  return (
    <>
      <div className="demo-section">
        <div className="demo-label">Radiogroup — pick a value (neutral inverted selection)</div>
        <Toggle
          aria-label="Filter"
          options={options}
          active={active}
          onChange={setActive}
        />
        <p style={note}>
          Active: <strong>{active}</strong> · Arrow keys move selection; Tab
          reaches only the selected pill.
        </p>
      </div>

      <div className="demo-section">
        <div className="demo-label">With a disabled option</div>
        <Toggle
          aria-label="Range"
          options={withDisabled}
          active={range}
          onChange={setRange}
        />
        <p style={note}>
          Active: <strong>{range}</strong>
        </p>
      </div>
    </>
  );
}
