import { Shell } from "../../src/components/Shell";
import { Sidebar, SidebarItem } from "../../src/components/Sidebar";
import { TopBar } from "../../src/components/TopBar";
import { PageHeader } from "../../src/components/PageHeader";

function Dot() {
  return (
    <svg viewBox="0 0 20 20" width="18" height="18" fill="none" aria-hidden>
      <circle cx="10" cy="10" r="6" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function ShellDemo() {
  return (
    <>
      <div className="demo-section">
        <div className="demo-label">App shell — Shell.Sidebar + Shell.Main</div>
        <Shell
          style={{
            minHeight: 0,
            height: 360,
            border: "1px solid var(--ml-border)",
            borderRadius: "var(--ml-radius-lg)",
            overflow: "hidden",
          }}
        >
          <Shell.Sidebar>
            <Sidebar style={{ height: "100%" }}>
              <Sidebar.Section label="Workspace">
                <SidebarItem icon={<Dot />} active>
                  Home
                </SidebarItem>
                <SidebarItem icon={<Dot />}>Projects</SidebarItem>
                <SidebarItem icon={<Dot />}>Inbox</SidebarItem>
              </Sidebar.Section>
              <Sidebar.Section label="Account">
                <SidebarItem icon={<Dot />}>Settings</SidebarItem>
              </Sidebar.Section>
            </Sidebar>
          </Shell.Sidebar>
          <Shell.Main>
            <TopBar
              left={<strong style={{ fontSize: 14, fontWeight: 600 }}>Acme</strong>}
              right={
                <span style={{ fontSize: 12, color: "var(--ml-text-muted)" }}>
                  user@example.com
                </span>
              }
            />
            <div style={{ padding: "var(--ml-space-xl)" }}>
              <PageHeader title="Home" subtitle="Grid 240px / 1fr, full height." />
            </div>
          </Shell.Main>
        </Shell>
      </div>
    </>
  );
}
