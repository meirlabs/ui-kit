import { useState } from "react";
import { createRoot } from "react-dom/client";
import "../src/styles/index.css";
import "./preview.css";

// Primitives
import { ButtonDemo } from "./demos/ButtonDemo";
import { BadgeDemo } from "./demos/BadgeDemo";
import { AvatarDemo } from "./demos/AvatarDemo";
import { LabelDemo } from "./demos/LabelDemo";
import { DividerDemo } from "./demos/DividerDemo";
import { TagDemo } from "./demos/TagDemo";
import { StatusPillDemo } from "./demos/StatusPillDemo";
import { ChipRowDemo } from "./demos/ChipRowDemo";
import { MetricValueDemo } from "./demos/MetricValueDemo";

// Layout
import { ShellDemo } from "./demos/ShellDemo";
import { SidebarDemo } from "./demos/SidebarDemo";
import { TopBarDemo } from "./demos/TopBarDemo";
import { PageHeaderDemo } from "./demos/PageHeaderDemo";
import { CardDemo } from "./demos/CardDemo";
import { GridDemo } from "./demos/GridDemo";
import { SectionDemo } from "./demos/SectionDemo";
import { DetailListDemo } from "./demos/DetailListDemo";
import { DangerZoneDemo } from "./demos/DangerZoneDemo";

// Navigation
import { TabsDemo } from "./demos/TabsDemo";
import { ToggleDemo } from "./demos/ToggleDemo";
import { PaginationDemo } from "./demos/PaginationDemo";
import { SwitchersDemo } from "./demos/SwitchersDemo";
import { BreadcrumbsDemo } from "./demos/BreadcrumbsDemo";

// Data Display
import { DataTableDemo } from "./demos/DataTableDemo";
import { StatCardDemo } from "./demos/StatCardDemo";
import { EmptyStateDemo } from "./demos/EmptyStateDemo";

// Feedback
import { BannerDemo } from "./demos/BannerDemo";

// Overlays
import { ModalDemo } from "./demos/ModalDemo";
import { DropdownDemo } from "./demos/DropdownDemo";

// Forms
import { FieldDemo } from "./demos/FieldDemo";
import { WizardDemo } from "./demos/WizardDemo";

interface ComponentEntry {
  name: string;
  component: React.ComponentType;
}

interface Category {
  name: string;
  items: ComponentEntry[];
}

const categories: Category[] = [
  {
    name: "Primitives",
    items: [
      { name: "Button", component: ButtonDemo },
      { name: "Badge", component: BadgeDemo },
      { name: "Avatar", component: AvatarDemo },
      { name: "Label", component: LabelDemo },
      { name: "Divider", component: DividerDemo },
      { name: "Tag", component: TagDemo },
      { name: "Status Pill", component: StatusPillDemo },
      { name: "Chip Row", component: ChipRowDemo },
      { name: "Metric", component: MetricValueDemo },
    ],
  },
  {
    name: "Layout",
    items: [
      { name: "Shell", component: ShellDemo },
      { name: "Sidebar", component: SidebarDemo },
      { name: "Top Bar", component: TopBarDemo },
      { name: "Page Header", component: PageHeaderDemo },
      { name: "Card", component: CardDemo },
      { name: "Grid", component: GridDemo },
      { name: "Section", component: SectionDemo },
      { name: "Detail List", component: DetailListDemo },
      { name: "Danger Zone", component: DangerZoneDemo },
    ],
  },
  {
    name: "Navigation",
    items: [
      { name: "Tabs", component: TabsDemo },
      { name: "Toggle", component: ToggleDemo },
      { name: "Pagination", component: PaginationDemo },
      { name: "Switchers", component: SwitchersDemo },
      { name: "Breadcrumbs", component: BreadcrumbsDemo },
    ],
  },
  {
    name: "Data Display",
    items: [
      { name: "Data Table", component: DataTableDemo },
      { name: "Stat Card", component: StatCardDemo },
      { name: "Empty State", component: EmptyStateDemo },
    ],
  },
  {
    name: "Feedback",
    items: [
      { name: "Banner", component: BannerDemo },
    ],
  },
  {
    name: "Overlays",
    items: [
      { name: "Modal", component: ModalDemo },
      { name: "Dropdown", component: DropdownDemo },
    ],
  },
  {
    name: "Forms",
    items: [
      { name: "Field", component: FieldDemo },
      { name: "Wizard", component: WizardDemo },
    ],
  },
];

/*
 * Navigation: ONE state — "page" — represents what you're looking at.
 * Three levels: root (all categories), category (items in one), component (demo).
 *
 * Layout mode (explorer/breadcrumb) is a DISPLAY PREFERENCE — not navigation.
 * Back/forward traverse page history. Layout mode never changes from nav.
 *
 * Explorer mode: always shows a component demo. If page is root/category,
 *   we auto-resolve to a component for display.
 * Breadcrumb mode: shows the actual page level (grid or demo).
 */

type Page =
  | { level: "root" }
  | { level: "category"; category: string }
  | { level: "component"; catIdx: number; itemIdx: number };

// Flatten for search
const allItems = categories.flatMap((cat, ci) =>
  cat.items.map((item, ii) => ({ category: cat.name, name: item.name, catIdx: ci, itemIdx: ii }))
);

function App() {
  const [page, setPage] = useState<Page>({ level: "component", catIdx: 0, itemIdx: 0 });
  const [layout, setLayout] = useState<"explorer" | "breadcrumb">("explorer");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [past, setPast] = useState<Page[]>([]);
  const [future, setFuture] = useState<Page[]>([]);
  const [search, setSearch] = useState("");
  const [openCats, setOpenCats] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(categories.map((c) => [c.name, true]))
  );

  // Navigate to a new page
  function go(next: Page) {
    setPast((h) => [...h, page]);
    setFuture([]);
    setPage(next);
    setSearch("");
  }

  function goBack() {
    if (past.length === 0) return;
    setFuture((f) => [page, ...f]);
    setPage(past[past.length - 1]);
    setPast((h) => h.slice(0, -1));
  }

  function goForward() {
    if (future.length === 0) return;
    setPast((h) => [...h, page]);
    setPage(future[0]);
    setFuture((f) => f.slice(1));
  }

  // In explorer mode, resolve any page to a component for display
  function resolveComponent(p: Page): { catIdx: number; itemIdx: number } {
    if (p.level === "component") return { catIdx: p.catIdx, itemIdx: p.itemIdx };
    if (p.level === "category") {
      const ci = categories.findIndex((c) => c.name === p.category);
      return { catIdx: ci >= 0 ? ci : 0, itemIdx: 0 };
    }
    return { catIdx: 0, itemIdx: 0 };
  }

  // Current component (always resolved for sidebar highlighting + explorer display)
  const resolved = resolveComponent(page);
  const currentCat = categories[resolved.catIdx];
  const current = currentCat.items[resolved.itemIdx];
  const ActiveDemo = current.component;

  // Breadcrumb display info
  const crumbCategory = page.level === "component"
    ? categories[page.catIdx].name
    : page.level === "category"
    ? page.category
    : null;

  const crumbComponent = page.level === "component" ? current.name : null;

  function toggleCat(name: string) {
    setOpenCats((prev) => ({ ...prev, [name]: !prev[name] }));
  }

  const searchResults = search
    ? allItems.filter((it) => it.name.toLowerCase().includes(search.toLowerCase()))
    : [];

  return (
    <div className="preview-shell" data-meirlabs-theme={theme}>

      {/* ─── SIDEBAR (always visible) ─── */}
      <nav className="preview-sidebar">
        <div className="preview-sidebar-toolbar">
          <img src="./meirlabs-logo.png" alt="meirlabs" className="preview-logo" />
          <span className="preview-title">@meir-labs/ui-kit</span>
        </div>
        <input
          className="preview-search"
          placeholder="Search components..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search ? (
          <div className="preview-nav-scroll">
            <div className="preview-category-label">Results</div>
            <ul className="preview-nav">
              {searchResults.length === 0 && (
                <li className="preview-search-empty">No results</li>
              )}
              {searchResults.map((it) => (
                <li key={it.name}>
                  <button
                    className={`preview-nav-item ${resolved.catIdx === it.catIdx && resolved.itemIdx === it.itemIdx ? "active" : ""}`}
                    onClick={() => { go({ level: "component", catIdx: it.catIdx, itemIdx: it.itemIdx }); setSearch(""); }}
                  >
                    <span>{it.name}</span>
                    <span className="preview-nav-hint">{it.category}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="preview-nav-scroll">
            {categories.map((cat, ci) => (
              <div key={cat.name} className="preview-category">
                <button className="preview-category-label preview-category-toggle" onClick={() => toggleCat(cat.name)}>
                  <span className="preview-tree-arrow">{openCats[cat.name] ? "▾" : "▸"}</span>
                  {cat.name}
                </button>
                {openCats[cat.name] && (
                  <ul className="preview-nav">
                    {cat.items.map((item, ii) => (
                      <li key={item.name}>
                        <button
                          className={`preview-nav-item ${ci === resolved.catIdx && ii === resolved.itemIdx ? "active" : ""}`}
                          onClick={() => go({ level: "component", catIdx: ci, itemIdx: ii })}
                        >
                          {item.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </nav>

      {/* ─── MAIN AREA ─── */}
      <div className="preview-content">
        {/* ─── HEADER ─── */}
        <header className="preview-header">
          <button className="preview-toolbar-btn preview-nav-btn" onClick={goBack} disabled={past.length === 0} title="Back">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4L6 9L11 14" /></svg>
          </button>
          <button className="preview-toolbar-btn preview-nav-btn" onClick={goForward} disabled={future.length === 0} title="Forward">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 4L12 9L7 14" /></svg>
          </button>
          <div className="preview-breadcrumb-path">
            {/* Components (root) */}
            <button
              className={`preview-breadcrumb-segment ${page.level === "root" ? "preview-breadcrumb-current" : ""}`}
              onClick={() => go({ level: "root" })}
            >Components</button>

            {/* Category */}
            {crumbCategory && (
              <>
                <span className="preview-breadcrumb-sep">/</span>
                <button
                  className={`preview-breadcrumb-segment ${page.level === "category" ? "preview-breadcrumb-current" : ""}`}
                  onClick={() => go({ level: "category", category: crumbCategory })}
                >{crumbCategory}</button>
              </>
            )}

            {/* Component */}
            {crumbComponent && (
              <>
                <span className="preview-breadcrumb-sep">/</span>
                <span className="preview-breadcrumb-segment preview-breadcrumb-current">{crumbComponent}</span>
              </>
            )}
          </div>
          <div style={{ flex: 1 }} />
          <div className="preview-segmented">
            <button className={`preview-seg-btn ${layout === "explorer" ? "active" : ""}`} onClick={() => setLayout("explorer")} title="Explorer">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="4" x2="13" y2="4" />
                <line x1="5" y1="8" x2="13" y2="8" />
                <line x1="5" y1="12" x2="13" y2="12" />
                <polyline points="3 7 3 9 3 8 5 8" />
                <polyline points="3 11 3 13 3 12 5 12" />
              </svg>
            </button>
            <button className={`preview-seg-btn ${layout === "breadcrumb" ? "active" : ""}`} onClick={() => setLayout("breadcrumb")} title="Breadcrumb">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 5V3.5a1 1 0 0 1 1-1h3.59a1 1 0 0 1 .7.29L8.72 4.2a1 1 0 0 0 .7.29H13a1 1 0 0 1 1 1V12.5a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z" />
              </svg>
            </button>
          </div>
          <div className="preview-segmented">
            <button className={`preview-seg-btn ${theme === "light" ? "active" : ""}`} onClick={() => setTheme("light")} title="Light">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="8" cy="8" r="3" />
                <line x1="8" y1="1.5" x2="8" y2="3" />
                <line x1="8" y1="13" x2="8" y2="14.5" />
                <line x1="1.5" y1="8" x2="3" y2="8" />
                <line x1="13" y1="8" x2="14.5" y2="8" />
                <line x1="3.4" y1="3.4" x2="4.5" y2="4.5" />
                <line x1="11.5" y1="11.5" x2="12.6" y2="12.6" />
                <line x1="3.4" y1="12.6" x2="4.5" y2="11.5" />
                <line x1="11.5" y1="4.5" x2="12.6" y2="3.4" />
              </svg>
            </button>
            <button className={`preview-seg-btn ${theme === "dark" ? "active" : ""}`} onClick={() => setTheme("dark")} title="Dark">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13.5 9.5a5.5 5.5 0 1 1-7-7 4.5 4.5 0 0 0 7 7z" />
              </svg>
            </button>
          </div>
        </header>

        {/* ─── CONTENT ─── */}
        {layout === "explorer" ? (
          /* Explorer: always show the component demo */
          <main className="preview-main">
            <ActiveDemo />
          </main>
        ) : page.level === "root" ? (
          /* Breadcrumb: root → show category folders */
          <main className="preview-breadcrumb-grid-area">
            <div className="preview-breadcrumb-grid">
              {categories.map((cat) => (
                <button key={cat.name} className="preview-breadcrumb-card" onClick={() => go({ level: "category", category: cat.name })}>
                  <div className="preview-breadcrumb-card-icon">📁</div>
                  <div className="preview-breadcrumb-card-name">{cat.name}</div>
                  <div className="preview-breadcrumb-card-count">{cat.items.length} items</div>
                </button>
              ))}
            </div>
          </main>
        ) : page.level === "category" ? (
          /* Breadcrumb: category → show component cards */
          <main className="preview-breadcrumb-grid-area">
            <div className="preview-breadcrumb-grid">
              {categories.find((c) => c.name === page.category)?.items.map((item, ii) => {
                const ci = categories.findIndex((c) => c.name === page.category);
                return (
                  <button key={item.name} className="preview-breadcrumb-card" onClick={() => go({ level: "component", catIdx: ci, itemIdx: ii })}>
                    <div className="preview-breadcrumb-card-icon">📄</div>
                    <div className="preview-breadcrumb-card-name">{item.name}</div>
                  </button>
                );
              })}
            </div>
          </main>
        ) : (
          /* Breadcrumb: component → show the demo */
          <main className="preview-main">
            <ActiveDemo />
          </main>
        )}
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
