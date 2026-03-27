import { useState } from "react";
import { Tabs } from "../../src/components/Tabs";

const items = [
  { label: "Overview", value: "overview" },
  { label: "Analytics", value: "analytics" },
  { label: "Settings", value: "settings" },
];

export function TabsDemo() {
  const [active, setActive] = useState("overview");

  return (
    <>
      <div className="demo-section">
        <div className="demo-label">3 tabs</div>
        <Tabs items={items} active={active} onChange={setActive} />
        <p style={{ fontSize: "var(--ml-text-sm)", color: "var(--ml-text-muted)" }}>
          Active: <strong>{active}</strong>
        </p>
      </div>
    </>
  );
}
