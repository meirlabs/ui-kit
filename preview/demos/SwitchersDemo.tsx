import { useState } from "react";
import { Toggle } from "../../src/components/Toggle";
import { SegmentedControl } from "../../src/components/SegmentedControl";

/**
 * SwitchersDemo previously advertised ~10 non-existent switcher variants. The
 * kit ships exactly two real switcher primitives, shown here:
 *
 *   • Toggle           — APG radiogroup, "pick a value"
 *   • SegmentedControl — APG tablist with a sliding thumb, "switch views"
 *
 * See ToggleDemo / TabsDemo for their dedicated pages. (Registration in
 * preview/main.tsx is the integrator's call.)
 */
const note: React.CSSProperties = {
  fontSize: "var(--ml-text-sm)",
  color: "var(--ml-text-muted)",
  marginBottom: 20,
  lineHeight: 1.5,
};

const rowLabel: React.CSSProperties = {
  fontSize: "0.72rem",
  color: "var(--ml-text-faint)",
  width: 140,
  flexShrink: 0,
};

const row: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  marginBottom: 20,
};

export function SwitchersDemo() {
  const [pick, setPick] = useState("active");
  const [view, setView] = useState("week");

  return (
    <>
      <div className="demo-section">
        <p style={note}>
          The kit ships two switcher primitives. Everything else has been
          removed — use these real components instead of the old gallery.
        </p>

        <div style={row}>
          <span style={rowLabel}>Toggle (radiogroup)</span>
          <Toggle
            aria-label="Filter"
            options={[
              { label: "All", value: "all" },
              { label: "Active", value: "active" },
              { label: "Archived", value: "archived" },
            ]}
            active={pick}
            onChange={setPick}
          />
        </div>

        <div style={row}>
          <span style={rowLabel}>SegmentedControl (tablist)</span>
          <SegmentedControl
            aria-label="Time range"
            value={view}
            onChange={setView}
            options={[
              { label: "Week", value: "week" },
              { label: "Month", value: "month" },
              { label: "Year", value: "year" },
            ]}
          />
        </div>
      </div>
    </>
  );
}
