import { useState } from "react";
import { Sidebar, SidebarItem } from "../../src/components/Sidebar";

function Icon() {
  return (
    <svg viewBox="0 0 20 20" width="18" height="18" fill="none" aria-hidden>
      <rect
        x="3.5"
        y="3.5"
        width="13"
        height="13"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

const items = ["Home", "Projects", "Inbox", "Reports"];

export function SidebarDemo() {
  const [active, setActive] = useState("Home");
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <div className="demo-section">
        <div className="demo-label">Sidebar — sections + monochrome active</div>
        <div style={{ height: 340, display: "flex" }}>
          <Sidebar>
            <Sidebar.Section label="Workspace">
              {items.map((label) => (
                <SidebarItem
                  key={label}
                  icon={<Icon />}
                  active={active === label}
                  onClick={() => setActive(label)}
                >
                  {label}
                </SidebarItem>
              ))}
            </Sidebar.Section>
            <span className="ml-sidebar-spacer" />
            <Sidebar.Section label="Account">
              <SidebarItem icon={<Icon />}>Settings</SidebarItem>
              <SidebarItem icon={<Icon />} disabled>
                Billing (soon)
              </SidebarItem>
            </Sidebar.Section>
          </Sidebar>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-label">Collapsed (64px icon rail)</div>
        <button
          type="button"
          className="ml-btn ml-btn-secondary"
          style={{ marginBottom: "var(--ml-space-md)" }}
          onClick={() => setCollapsed((c) => !c)}
        >
          {collapsed ? "Expand" : "Collapse"}
        </button>
        <div style={{ height: 260, display: "flex" }}>
          <Sidebar collapsed={collapsed}>
            <Sidebar.Section label="Workspace">
              {items.map((label) => (
                <SidebarItem
                  key={label}
                  icon={<Icon />}
                  active={active === label}
                  onClick={() => setActive(label)}
                >
                  {label}
                </SidebarItem>
              ))}
            </Sidebar.Section>
          </Sidebar>
        </div>
      </div>
    </>
  );
}
