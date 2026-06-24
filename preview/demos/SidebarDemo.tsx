import { useState } from "react";

/* ─── shared mock data ─── */
const folders = [
  { name: "Documents", icon: "📁", children: ["Resume.pdf", "Cover Letter.docx", "Notes.md"] },
  { name: "Projects", icon: "📂", children: ["ui-kit", "trading-agents", "portfolio-site"] },
  { name: "Downloads", icon: "📥", children: ["installer.dmg", "report.xlsx", "photo.jpg"] },
  { name: "Pictures", icon: "🖼", children: ["vacation/", "screenshots/", "profile.png"] },
  { name: "Music", icon: "🎵", children: ["playlist.m3u", "track01.mp3"] },
];

const variants = [
  "Classic Explorer",
  "Finder",
  "VS Code",
  "Notion",
  "Linear",
  "Arc Browser",
  "Spotlight",
  "Compact Dock",
  "Breadcrumb",
  "Two Panel",
];

/* ─── Shared styles ─── */
const box: React.CSSProperties = {
  background: "var(--ml-bg-surface)",
  border: "1px solid var(--ml-border)",
  borderRadius: 12,
  overflow: "hidden",
  height: 420,
  display: "flex",
};

const sidebarBase: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  borderRight: "1px solid var(--ml-border)",
  background: "var(--ml-bg-surface)",
  transition: "width 0.2s",
  overflow: "hidden",
  flexShrink: 0,
};

const toolbar: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 4,
  padding: "8px 10px",
  borderBottom: "1px solid var(--ml-border)",
  fontSize: "0.72rem",
};

const navBtn: React.CSSProperties = {
  background: "none",
  border: "none",
  color: "var(--ml-text-muted)",
  cursor: "pointer",
  padding: "4px 6px",
  borderRadius: 4,
  fontSize: "0.82rem",
  lineHeight: 1,
  transition: "background 0.15s, color 0.15s",
  fontFamily: "inherit",
};

const searchBox: React.CSSProperties = {
  margin: "8px 10px",
  padding: "6px 10px",
  borderRadius: 6,
  border: "1px solid var(--ml-border)",
  background: "var(--ml-bg)",
  color: "var(--ml-text)",
  fontSize: "0.75rem",
  outline: "none",
  width: "calc(100% - 20px)",
  fontFamily: "inherit",
};

const itemRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "6px 12px",
  fontSize: "0.78rem",
  color: "var(--ml-text-muted)",
  cursor: "pointer",
  transition: "background 0.15s, color 0.15s",
  border: "none",
  background: "none",
  width: "100%",
  textAlign: "left",
  fontFamily: "inherit",
};

const activeItem: React.CSSProperties = {
  ...itemRow,
  background: "var(--ml-color-primary-muted)",
  color: "var(--ml-color-primary)",
  borderRadius: 6,
};

const sectionLabel: React.CSSProperties = {
  fontSize: "0.6rem",
  fontWeight: 700,
  color: "var(--ml-text-faint)",
  textTransform: "uppercase" as const,
  letterSpacing: "0.06em",
  padding: "12px 12px 4px",
};

const mainArea: React.CSSProperties = {
  flex: 1,
  padding: 20,
  fontSize: "0.78rem",
  color: "var(--ml-text-muted)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const pathBar: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 4,
  padding: "6px 12px",
  fontSize: "0.68rem",
  color: "var(--ml-text-faint)",
  borderBottom: "1px solid var(--ml-border)",
};

const pathSegment: React.CSSProperties = {
  padding: "2px 6px",
  borderRadius: 4,
  cursor: "pointer",
};

const chevron = "›";

function NavButtons({ onBack, onFwd }: { onBack?: () => void; onFwd?: () => void }) {
  return (
    <>
      <button style={navBtn} onClick={onBack} title="Back">◂</button>
      <button style={navBtn} onClick={onFwd} title="Forward">▸</button>
    </>
  );
}

function SearchInput({ placeholder = "Search..." }: { placeholder?: string }) {
  return <input style={searchBox} placeholder={placeholder} />;
}

function CollapseBtn({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  return (
    <button style={{ ...navBtn, marginLeft: "auto" }} onClick={onToggle} title={collapsed ? "Expand" : "Collapse"}>
      {collapsed ? "▸▸" : "◂◂"}
    </button>
  );
}

/* ─── 1. Classic Explorer ─── */
function ClassicExplorer() {
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState<Record<string, boolean>>({ Documents: true });
  const [selected, setSelected] = useState("Resume.pdf");
  const w = collapsed ? 48 : 220;

  return (
    <div style={box}>
      <div style={{ ...sidebarBase, width: w }}>
        <div style={toolbar}>
          {!collapsed && <NavButtons />}
          <CollapseBtn collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
        </div>
        {!collapsed && <SearchInput />}
        <div style={{ flex: 1, overflow: "auto", padding: "4px 6px" }}>
          {!collapsed && folders.map((f) => (
            <div key={f.name}>
              <button style={itemRow} onClick={() => setOpen({ ...open, [f.name]: !open[f.name] })}>
                <span style={{ fontSize: "0.65rem", width: 14, textAlign: "center" }}>{open[f.name] ? "▾" : "▸"}</span>
                <span>{f.icon}</span>
                <span>{f.name}</span>
              </button>
              {open[f.name] && f.children.map((c) => (
                <button key={c} style={selected === c ? { ...activeItem, paddingLeft: 36 } : { ...itemRow, paddingLeft: 36 }} onClick={() => setSelected(c)}>
                  {c}
                </button>
              ))}
            </div>
          ))}
          {collapsed && folders.map((f) => (
            <button key={f.name} style={{ ...navBtn, display: "block", margin: "4px auto", fontSize: "1rem" }} title={f.name}>{f.icon}</button>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={pathBar}>
          <span style={pathSegment}>Home</span>{chevron}
          <span style={pathSegment}>Documents</span>{chevron}
          <span style={{ ...pathSegment, color: "var(--ml-text)" }}>{selected}</span>
        </div>
        <div style={mainArea}>{selected}</div>
      </div>
    </div>
  );
}

/* ─── 2. Finder ─── */
function Finder() {
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState("Documents");
  const w = collapsed ? 48 : 200;

  return (
    <div style={box}>
      <div style={{ ...sidebarBase, width: w, background: "var(--ml-bg)" }}>
        <div style={{ ...toolbar, background: "none", borderBottom: "none", padding: "10px 10px 4px" }}>
          <div style={{ display: "flex", gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#f85149" }} />
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#d29922" }} />
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#3fb950" }} />
          </div>
          <CollapseBtn collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
        </div>
        {!collapsed && (
          <>
            <SearchInput placeholder="Search" />
            <div style={sectionLabel}>Favorites</div>
            {folders.slice(0, 3).map((f) => (
              <button key={f.name} style={active === f.name ? activeItem : itemRow} onClick={() => setActive(f.name)}>
                <span>{f.icon}</span><span>{f.name}</span>
              </button>
            ))}
            <div style={sectionLabel}>Locations</div>
            {folders.slice(3).map((f) => (
              <button key={f.name} style={active === f.name ? activeItem : itemRow} onClick={() => setActive(f.name)}>
                <span>{f.icon}</span><span>{f.name}</span>
              </button>
            ))}
          </>
        )}
        {collapsed && folders.map((f) => (
          <button key={f.name} style={{ ...navBtn, display: "block", margin: "4px auto", fontSize: "1rem" }} title={f.name}>{f.icon}</button>
        ))}
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ ...toolbar, justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 4 }}><NavButtons /></div>
          <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--ml-text)" }}>{active}</span>
          <div style={{ display: "flex", gap: 4 }}>
            <button style={navBtn} title="Grid view">⊞</button>
            <button style={navBtn} title="List view">☰</button>
          </div>
        </div>
        <div style={mainArea}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center" }}>
            {(folders.find((f) => f.name === active)?.children ?? []).map((c) => (
              <div key={c} style={{ textAlign: "center", width: 72 }}>
                <div style={{ fontSize: "2rem", marginBottom: 4 }}>{c.endsWith("/") ? "📁" : "📄"}</div>
                <div style={{ fontSize: "0.65rem", color: "var(--ml-text-muted)", wordBreak: "break-all" }}>{c}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── 3. VS Code ─── */
function VSCode() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeIcon, setActiveIcon] = useState(0);
  const icons = ["📁", "🔍", "⎇", "🐛", "⚙"];
  const w = collapsed ? 44 : 240;

  return (
    <div style={box}>
      <div style={{ display: "flex", flexShrink: 0, width: w }}>
        <div style={{ width: 44, background: "var(--ml-bg)", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "8px 0", borderRight: "1px solid var(--ml-border)" }}>
          {icons.map((ic, i) => (
            <button key={i} style={{ ...navBtn, fontSize: "1rem", padding: 8, borderLeft: i === activeIcon ? "2px solid var(--ml-color-primary)" : "2px solid transparent" }} onClick={() => { setActiveIcon(i); setCollapsed(false); }}>{ic}</button>
          ))}
          <div style={{ flex: 1 }} />
          <button style={{ ...navBtn, fontSize: "0.9rem", padding: 8 }} onClick={() => setCollapsed(!collapsed)}>{collapsed ? "▸" : "◂"}</button>
        </div>
        {!collapsed && (
          <div style={{ flex: 1, background: "var(--ml-bg-surface)", borderRight: "1px solid var(--ml-border)", display: "flex", flexDirection: "column" }}>
            <div style={{ ...sectionLabel, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>Explorer</span>
              <button style={{ ...navBtn, fontSize: "0.7rem" }}>⋯</button>
            </div>
            <SearchInput placeholder="Search files..." />
            <div style={{ flex: 1, overflow: "auto", padding: "0 4px" }}>
              {folders.map((f) => (
                <div key={f.name}>
                  <button style={{ ...itemRow, fontWeight: 600, fontSize: "0.72rem" }}>
                    <span style={{ fontSize: "0.6rem" }}>▾</span> {f.name}
                  </button>
                  {f.children.map((c) => (
                    <button key={c} style={{ ...itemRow, paddingLeft: 28, fontSize: "0.72rem" }}>{c}</button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div style={mainArea}>Editor area</div>
    </div>
  );
}

/* ─── 4. Notion ─── */
function Notion() {
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState("Documents");
  const w = collapsed ? 0 : 220;

  return (
    <div style={box}>
      {!collapsed && (
        <div style={{ ...sidebarBase, width: w }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 12px 8px" }}>
            <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--ml-text)" }}>Workspace</span>
            <button style={navBtn} onClick={() => setCollapsed(true)}>◂◂</button>
          </div>
          <SearchInput placeholder="Search & commands..." />
          <div style={{ flex: 1, overflow: "auto", padding: "4px 6px" }}>
            {folders.map((f) => (
              <button key={f.name} style={active === f.name ? activeItem : itemRow} onClick={() => setActive(f.name)}>
                <span>{f.icon}</span>
                <span style={{ flex: 1 }}>{f.name}</span>
                <span style={{ fontSize: "0.6rem", color: "var(--ml-text-faint)" }}>⋯</span>
              </button>
            ))}
          </div>
          <div style={{ padding: "8px 12px", borderTop: "1px solid var(--ml-border)" }}>
            <button style={{ ...itemRow, padding: "6px 0" }}>
              <span>➕</span><span style={{ color: "var(--ml-text-faint)" }}>New page</span>
            </button>
          </div>
        </div>
      )}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ ...toolbar, gap: 8 }}>
          {collapsed && <button style={navBtn} onClick={() => setCollapsed(false)}>☰</button>}
          <NavButtons />
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: "0.75rem", color: "var(--ml-text-muted)" }}>⌘K</span>
        </div>
        <div style={mainArea}>{active}</div>
      </div>
    </div>
  );
}

/* ─── 5. Linear ─── */
function Linear() {
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState("Documents");
  const w = collapsed ? 48 : 200;

  return (
    <div style={box}>
      <div style={{ ...sidebarBase, width: w }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 12px 8px" }}>
          {!collapsed && <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--ml-text)", flex: 1 }}>Files</span>}
          <CollapseBtn collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
        </div>
        {!collapsed && <SearchInput placeholder="Filter..." />}
        <div style={{ flex: 1, overflow: "auto", padding: collapsed ? "4px" : "4px 6px" }}>
          {!collapsed ? folders.map((f) => (
            <button key={f.name} style={active === f.name ? activeItem : itemRow} onClick={() => setActive(f.name)}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: active === f.name ? "var(--ml-color-primary)" : "var(--ml-text-faint)", flexShrink: 0 }} />
              <span>{f.name}</span>
              <span style={{ marginLeft: "auto", fontSize: "0.6rem", color: "var(--ml-text-faint)", background: "var(--ml-bg-elevated)", padding: "1px 6px", borderRadius: 99 }}>{f.children.length}</span>
            </button>
          )) : folders.map((f) => (
            <button key={f.name} style={{ ...navBtn, display: "block", margin: "2px auto", fontSize: "0.85rem" }} title={f.name}>{f.icon}</button>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={toolbar}>
          <NavButtons />
          <span style={{ flex: 1, fontSize: "0.78rem", fontWeight: 600, color: "var(--ml-text)" }}>{active}</span>
          <button style={navBtn}>⊞</button>
        </div>
        <div style={mainArea}>
          <div style={{ width: "100%", padding: "0 8px" }}>
            {(folders.find((f) => f.name === active)?.children ?? []).map((c) => (
              <div key={c} style={{ padding: "8px 12px", borderBottom: "1px solid var(--ml-border)", fontSize: "0.78rem", color: "var(--ml-text-muted)" }}>{c}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── 6. Arc Browser ─── */
function ArcBrowser() {
  const [active, setActive] = useState("Documents");
  const pinned = ["Documents", "Projects"];

  return (
    <div style={box}>
      <div style={{ ...sidebarBase, width: 220, background: "var(--ml-bg)" }}>
        <div style={{ padding: "10px 10px 6px" }}>
          <div style={{ display: "flex", gap: 4, background: "var(--ml-bg-elevated)", borderRadius: 8, padding: "6px 10px", alignItems: "center" }}>
            <span style={{ fontSize: "0.72rem", color: "var(--ml-text-faint)" }}>🔍</span>
            <input style={{ border: "none", background: "none", color: "var(--ml-text)", fontSize: "0.75rem", outline: "none", flex: 1, fontFamily: "inherit" }} placeholder="Search or type URL..." />
          </div>
        </div>
        <div style={sectionLabel}>Pinned</div>
        <div style={{ display: "flex", gap: 6, padding: "0 12px 8px" }}>
          {pinned.map((p) => (
            <button key={p} style={{ padding: "4px 12px", borderRadius: 99, border: "none", background: active === p ? "var(--ml-color-primary-muted)" : "var(--ml-bg-elevated)", color: active === p ? "var(--ml-color-primary)" : "var(--ml-text-muted)", fontSize: "0.68rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }} onClick={() => setActive(p)}>{p}</button>
          ))}
        </div>
        <div style={sectionLabel}>All</div>
        <div style={{ flex: 1, overflow: "auto", padding: "0 6px" }}>
          {folders.map((f) => (
            <button key={f.name} style={active === f.name ? activeItem : itemRow} onClick={() => setActive(f.name)}>
              <span>{f.icon}</span><span>{f.name}</span>
            </button>
          ))}
        </div>
        <div style={{ padding: "8px 12px", borderTop: "1px solid var(--ml-border)", display: "flex", gap: 4, justifyContent: "center" }}>
          <NavButtons />
          <button style={navBtn}>➕</button>
        </div>
      </div>
      <div style={mainArea}>{active}</div>
    </div>
  );
}

/* ─── 7. Spotlight ─── */
function Spotlight() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState("Documents");
  const all = folders.flatMap((f) => [f.name, ...f.children]);
  const filtered = query ? all.filter((x) => x.toLowerCase().includes(query.toLowerCase())) : [];

  return (
    <div style={box}>
      <div style={{ ...sidebarBase, width: 260 }}>
        <div style={{ padding: "16px 12px 8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--ml-bg)", border: "1px solid var(--ml-border)", borderRadius: 10, padding: "10px 14px" }}>
            <span style={{ color: "var(--ml-text-faint)", fontSize: "0.9rem" }}>🔍</span>
            <input style={{ border: "none", background: "none", color: "var(--ml-text)", fontSize: "0.85rem", outline: "none", flex: 1, fontFamily: "inherit" }} placeholder="Search everything..." value={query} onChange={(e) => setQuery(e.target.value)} />
            {query && <button style={{ ...navBtn, fontSize: "0.7rem" }} onClick={() => setQuery("")}>✕</button>}
          </div>
        </div>
        {query ? (
          <div style={{ flex: 1, overflow: "auto", padding: "4px 6px" }}>
            <div style={sectionLabel}>Results</div>
            {filtered.length === 0 && <div style={{ padding: 12, fontSize: "0.75rem", color: "var(--ml-text-faint)", textAlign: "center" }}>No results</div>}
            {filtered.map((r) => (
              <button key={r} style={itemRow} onClick={() => { setActive(r); setQuery(""); }}>
                <span style={{ fontSize: "0.7rem" }}>📄</span><span>{r}</span>
              </button>
            ))}
          </div>
        ) : (
          <div style={{ flex: 1, overflow: "auto", padding: "4px 6px" }}>
            <div style={sectionLabel}>Recent</div>
            {folders.slice(0, 3).map((f) => (
              <button key={f.name} style={active === f.name ? activeItem : itemRow} onClick={() => setActive(f.name)}>
                <span>{f.icon}</span><span>{f.name}</span>
                <span style={{ marginLeft: "auto", fontSize: "0.6rem", color: "var(--ml-text-faint)" }}>2h ago</span>
              </button>
            ))}
            <div style={sectionLabel}>All folders</div>
            {folders.map((f) => (
              <button key={f.name} style={active === f.name ? activeItem : itemRow} onClick={() => setActive(f.name)}>
                <span>{f.icon}</span><span>{f.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={toolbar}><NavButtons /><span style={{ flex: 1 }} /><span style={{ fontSize: "0.68rem", color: "var(--ml-text-faint)" }}>⌘P</span></div>
        <div style={mainArea}>{active}</div>
      </div>
    </div>
  );
}

/* ─── 8. Compact Dock ─── */
function CompactDock() {
  const [expanded, setExpanded] = useState(false);
  const [active, setActive] = useState("Documents");

  return (
    <div style={box}>
      <div style={{ ...sidebarBase, width: expanded ? 200 : 52, background: "var(--ml-bg)" }} onMouseEnter={() => setExpanded(true)} onMouseLeave={() => setExpanded(false)}>
        <div style={{ padding: "8px 0", flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          {folders.map((f) => (
            <button key={f.name} style={{ ...navBtn, display: "flex", alignItems: "center", gap: 10, padding: "8px 14px", width: "100%", background: active === f.name ? "var(--ml-color-primary-muted)" : "none", color: active === f.name ? "var(--ml-color-primary)" : "var(--ml-text-muted)", borderRadius: 0, fontSize: "1rem", whiteSpace: "nowrap" as const }} onClick={() => setActive(f.name)}>
              <span>{f.icon}</span>
              {expanded && <span style={{ fontSize: "0.78rem" }}>{f.name}</span>}
            </button>
          ))}
        </div>
        <div style={{ padding: "8px 14px", borderTop: "1px solid var(--ml-border)" }}>
          <button style={{ ...navBtn, fontSize: "1rem" }}>🔍</button>
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={toolbar}><NavButtons /><span style={{ flex: 1, fontSize: "0.78rem", fontWeight: 600, color: "var(--ml-text)" }}>{active}</span></div>
        <div style={mainArea}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "0.72rem", color: "var(--ml-text-faint)", marginBottom: 8 }}>Hover sidebar to expand</div>
            {(folders.find((f) => f.name === active)?.children ?? []).map((c) => (
              <div key={c} style={{ padding: "6px 0", fontSize: "0.78rem" }}>{c}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── 9. Breadcrumb ─── */
function BreadcrumbNav() {
  const [path, setPath] = useState<string[]>(["Home"]);
  const [active, setActive] = useState("");

  const current = path[path.length - 1];
  const folder = folders.find((f) => f.name === current);
  const items = current === "Home" ? folders.map((f) => f.name) : folder?.children ?? [];

  function navigate(item: string) {
    if (folders.some((f) => f.name === item)) {
      setPath([...path, item]);
      setActive("");
    } else {
      setActive(item);
    }
  }

  function goBack() {
    if (path.length > 1) {
      setPath(path.slice(0, -1));
      setActive("");
    }
  }

  return (
    <div style={{ ...box, flexDirection: "column" }}>
      <div style={{ ...toolbar, gap: 8 }}>
        <NavButtons onBack={goBack} />
        <div style={{ display: "flex", gap: 2, flex: 1, alignItems: "center" }}>
          {path.map((p, i) => (
            <span key={i} style={{ display: "flex", alignItems: "center", gap: 2 }}>
              {i > 0 && <span style={{ color: "var(--ml-text-faint)" }}>{chevron}</span>}
              <button style={{ ...pathSegment, border: "none", background: "none", color: i === path.length - 1 ? "var(--ml-text)" : "var(--ml-text-faint)", cursor: "pointer", fontFamily: "inherit", fontSize: "0.75rem" }} onClick={() => { setPath(path.slice(0, i + 1)); setActive(""); }}>{p}</button>
            </span>
          ))}
        </div>
        <input style={{ ...searchBox, margin: 0, width: 160 }} placeholder="Search..." />
      </div>
      <div style={{ flex: 1, padding: 16, display: "flex", flexWrap: "wrap", gap: 12, alignContent: "flex-start" }}>
        {items.map((item) => {
          const isFolder = folders.some((f) => f.name === item) || item.endsWith("/");
          return (
            <button key={item} onClick={() => navigate(item)} style={{ width: 100, padding: 12, textAlign: "center", border: active === item ? "1px solid var(--ml-color-primary)" : "1px solid var(--ml-border)", borderRadius: 10, background: active === item ? "var(--ml-color-primary-muted)" : "var(--ml-bg-surface)", cursor: "pointer", color: "var(--ml-text)", fontFamily: "inherit" }}>
              <div style={{ fontSize: "1.8rem", marginBottom: 4 }}>{isFolder ? "📁" : "📄"}</div>
              <div style={{ fontSize: "0.65rem", wordBreak: "break-all" }}>{item}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── 10. Two Panel ─── */
function TwoPanel() {
  const [active, setActive] = useState("Documents");
  const [selected, setSelected] = useState("");
  const folder = folders.find((f) => f.name === active);

  return (
    <div style={box}>
      <div style={{ ...sidebarBase, width: 160 }}>
        <div style={toolbar}><NavButtons /></div>
        <SearchInput />
        <div style={{ flex: 1, overflow: "auto", padding: "4px 6px" }}>
          {folders.map((f) => (
            <button key={f.name} style={active === f.name ? activeItem : itemRow} onClick={() => { setActive(f.name); setSelected(""); }}>
              <span>{f.icon}</span><span>{f.name}</span>
            </button>
          ))}
        </div>
      </div>
      <div style={{ width: 180, borderRight: "1px solid var(--ml-border)", display: "flex", flexDirection: "column", background: "var(--ml-bg)" }}>
        <div style={sectionLabel}>{active}</div>
        <div style={{ flex: 1, overflow: "auto", padding: "0 6px" }}>
          {folder?.children.map((c) => (
            <button key={c} style={selected === c ? activeItem : itemRow} onClick={() => setSelected(c)}>
              <span style={{ fontSize: "0.7rem" }}>{c.endsWith("/") ? "📁" : "📄"}</span><span>{c}</span>
            </button>
          ))}
        </div>
      </div>
      <div style={mainArea}>
        {selected || <span style={{ color: "var(--ml-text-faint)" }}>Select a file</span>}
      </div>
    </div>
  );
}

/* ─── Main demo with variant picker ─── */
const demos = [ClassicExplorer, Finder, VSCode, Notion, Linear, ArcBrowser, Spotlight, CompactDock, BreadcrumbNav, TwoPanel];

export function SidebarDemo() {
  const [idx, setIdx] = useState(0);
  const Demo = demos[idx];

  return (
    <>
      <div className="demo-section">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
          {variants.map((v, i) => (
            <button
              key={v}
              onClick={() => setIdx(i)}
              style={{
                padding: "6px 14px",
                borderRadius: 99,
                border: "none",
                background: i === idx ? "var(--ml-color-primary-muted)" : "var(--ml-bg-elevated)",
                color: i === idx ? "var(--ml-color-primary)" : "var(--ml-text-muted)",
                fontSize: "0.75rem",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "background 0.15s, color 0.15s",
              }}
            >
              {v}
            </button>
          ))}
        </div>
      </div>
      <hr className="demo-divider" />
      <Demo />
    </>
  );
}
