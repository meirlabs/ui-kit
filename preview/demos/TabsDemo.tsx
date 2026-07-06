import { useState } from "react";
import { Tabs } from "../../src/components/Tabs";

const tabs = [
  { value: "overview", label: "Overview" },
  { value: "analytics", label: "Analytics" },
  { value: "reports", label: "Reports", disabled: true },
  { value: "settings", label: "Settings" },
];

function Dot() {
  return (
    <svg width="8" height="8" viewBox="0 0 8 8" aria-hidden="true">
      <circle cx="4" cy="4" r="4" fill="currentColor" />
    </svg>
  );
}

const iconTabs = [
  { value: "inbox", label: "Inbox", icon: <Dot /> },
  { value: "sent", label: "Sent", icon: <Dot /> },
  { value: "drafts", label: "Drafts", icon: <Dot /> },
];

const manyTabs = Array.from({ length: 14 }, (_, i) => ({
  value: `t${i}`,
  label: `Section ${i + 1}`,
}));

const panelStyle: React.CSSProperties = {
  fontSize: "var(--ml-text-sm)",
  color: "var(--ml-text-muted)",
  padding: "4px 0",
};

export function TabsDemo() {
  const [basic, setBasic] = useState("overview");
  const [icon, setIcon] = useState("inbox");
  const [many, setMany] = useState("t0");

  return (
    <>
      <div className="demo-section">
        <div className="demo-label">APG tablist + panels (Reports is disabled)</div>
        <Tabs aria-label="Project sections" tabs={tabs} value={basic} onChange={setBasic}>
          <Tabs.Panel value="overview" style={panelStyle}>
            Overview panel — arrow keys move focus and selection, skipping the
            disabled tab.
          </Tabs.Panel>
          <Tabs.Panel value="analytics" style={panelStyle}>
            Analytics panel content.
          </Tabs.Panel>
          <Tabs.Panel value="settings" style={panelStyle}>
            Settings panel content.
          </Tabs.Panel>
        </Tabs>
      </div>

      <div className="demo-section">
        <div className="demo-label">With icon slot</div>
        <Tabs aria-label="Mailboxes" tabs={iconTabs} value={icon} onChange={setIcon} />
        <p style={panelStyle}>
          Active: <strong>{icon}</strong>
        </p>
      </div>

      <div className="demo-section">
        <div className="demo-label">Overflow — horizontal scroll mask, hidden scrollbar</div>
        <div style={{ maxWidth: 420 }}>
          <Tabs aria-label="Many sections" tabs={manyTabs} value={many} onChange={setMany} />
        </div>
      </div>
    </>
  );
}
