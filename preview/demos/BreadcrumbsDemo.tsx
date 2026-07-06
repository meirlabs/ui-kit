import { useState } from "react";
import { Breadcrumbs } from "../../src/components/Breadcrumbs";

const container: React.CSSProperties = {
  background: "var(--ml-bg-surface)",
  border: "1px solid var(--ml-border)",
  borderRadius: 12,
  padding: "16px 20px",
  display: "flex",
  alignItems: "center",
};

export function BreadcrumbsDemo() {
  const [path, setPath] = useState([
    "Home",
    "Projects",
    "ui-kit",
    "Components",
  ]);

  const items = path.map((label, i) => ({
    label,
    onClick: () => setPath(path.slice(0, i + 1)),
  }));

  const deep = [
    "Home",
    "Workspace",
    "Engineering",
    "Design System",
    "Navigation",
    "Breadcrumbs",
  ].map((label) => ({ label, href: "#" }));

  const long = [
    { label: "Home", href: "#" },
    { label: "A very long folder name that should truncate cleanly", href: "#" },
    { label: "Current page with an equally long label here", href: "#" },
  ];

  return (
    <>
      <div className="demo-section">
        <div className="demo-label">Default — chevron separator, current is non-interactive</div>
        <div style={container}>
          <Breadcrumbs items={items} />
        </div>
        <button
          onClick={() => setPath(["Home", "Projects", "ui-kit", "Components"])}
          style={{
            marginTop: 8,
            border: "none",
            background: "none",
            color: "var(--ml-text-faint)",
            fontSize: "0.68rem",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Reset path
        </button>
      </div>

      <div className="demo-section">
        <div className="demo-label">Collapsed middle (maxItems=4) with a … menu</div>
        <div style={container}>
          <Breadcrumbs items={deep} maxItems={4} />
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-label">Custom separator (slash)</div>
        <div style={container}>
          <Breadcrumbs
            items={items}
            separator={
              <span style={{ color: "var(--ml-text-faint)", fontSize: "0.82rem" }}>/</span>
            }
          />
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-label">Long labels truncate</div>
        <div style={{ ...container, maxWidth: 420 }}>
          <Breadcrumbs items={long} />
        </div>
      </div>
    </>
  );
}
