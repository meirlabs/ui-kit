import { Sidebar, SidebarItem } from "../../src/components/Sidebar";

export function SidebarDemo() {
  return (
    <>
      <div className="demo-section">
        <div className="demo-label">Sidebar with items</div>
        <div style={{ width: 220, background: "var(--ml-bg-surface)", border: "1px solid var(--ml-border)", borderRadius: "var(--ml-radius-lg)", padding: "var(--ml-space-sm)" }}>
          <Sidebar>
            <SidebarItem active>Dashboard</SidebarItem>
            <SidebarItem>Agents</SidebarItem>
            <SidebarItem>Settings</SidebarItem>
            <SidebarItem>History</SidebarItem>
          </Sidebar>
        </div>
      </div>
    </>
  );
}
