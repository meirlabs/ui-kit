import { useState } from "react";

const variants = [
  "Classic",
  "Pill",
  "Slash",
  "Arrow",
  "Dots",
  "Underline",
  "Card",
  "Folder Path",
  "Stepped",
  "Minimal",
];

const defaultPath = ["Home", "Projects", "ui-kit", "Components"];

/* ─── Shared ─── */
const container: React.CSSProperties = {
  background: "var(--ml-bg-surface)",
  border: "1px solid var(--ml-border)",
  borderRadius: 10,
  padding: "16px 20px",
  minHeight: 56,
  display: "flex",
  alignItems: "center",
};

function useBreadcrumb(initial: string[]) {
  const [path, setPath] = useState(initial);
  function navigateTo(idx: number) {
    setPath(path.slice(0, idx + 1));
  }
  function reset() {
    setPath(initial);
  }
  return { path, navigateTo, reset };
}

/* ─── 1. Classic (chevron separator) ─── */
function Classic() {
  const { path, navigateTo, reset } = useBreadcrumb(defaultPath);
  return (
    <div>
      <div style={container}>
        <nav style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {path.map((seg, i) => (
            <span key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {i > 0 && <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="var(--ml-text-faint)" strokeWidth="1.5" strokeLinecap="round"><path d="M5 3l4 4-4 4" /></svg>}
              <button onClick={() => navigateTo(i)} style={{
                border: "none", background: "none", fontFamily: "inherit", cursor: "pointer",
                fontSize: "0.82rem", fontWeight: i === path.length - 1 ? 600 : 400,
                color: i === path.length - 1 ? "var(--ml-text)" : "var(--ml-text-muted)",
                padding: "2px 4px", borderRadius: 4, transition: "color 0.15s",
              }}>{seg}</button>
            </span>
          ))}
        </nav>
      </div>
      <button onClick={reset} style={{ marginTop: 8, border: "none", background: "none", color: "var(--ml-text-faint)", fontSize: "0.68rem", cursor: "pointer", fontFamily: "inherit" }}>Reset path</button>
    </div>
  );
}

/* ─── 2. Pill (each segment in a pill) ─── */
function Pill() {
  const { path, navigateTo, reset } = useBreadcrumb(defaultPath);
  return (
    <div>
      <div style={container}>
        <nav style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {path.map((seg, i) => (
            <span key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {i > 0 && <span style={{ color: "var(--ml-text-faint)", fontSize: "0.72rem" }}>›</span>}
              <button onClick={() => navigateTo(i)} style={{
                border: "none", fontFamily: "inherit", cursor: "pointer",
                fontSize: "0.75rem", fontWeight: 600, padding: "4px 12px", borderRadius: 99,
                background: i === path.length - 1 ? "var(--ml-color-primary-muted)" : "var(--ml-bg-elevated)",
                color: i === path.length - 1 ? "var(--ml-color-primary)" : "var(--ml-text-muted)",
                transition: "all 0.15s",
              }}>{seg}</button>
            </span>
          ))}
        </nav>
      </div>
      <button onClick={reset} style={{ marginTop: 8, border: "none", background: "none", color: "var(--ml-text-faint)", fontSize: "0.68rem", cursor: "pointer", fontFamily: "inherit" }}>Reset path</button>
    </div>
  );
}

/* ─── 3. Slash separator ─── */
function Slash() {
  const { path, navigateTo, reset } = useBreadcrumb(defaultPath);
  return (
    <div>
      <div style={{ ...container, fontFamily: "var(--ml-font-mono)" }}>
        <nav style={{ display: "flex", alignItems: "center", gap: 2 }}>
          {path.map((seg, i) => (
            <span key={i} style={{ display: "flex", alignItems: "center", gap: 2 }}>
              {i > 0 && <span style={{ color: "var(--ml-text-faint)", fontSize: "0.82rem" }}>/</span>}
              <button onClick={() => navigateTo(i)} style={{
                border: "none", background: "none", fontFamily: "inherit", cursor: "pointer",
                fontSize: "0.78rem", fontWeight: i === path.length - 1 ? 600 : 400,
                color: i === path.length - 1 ? "var(--ml-text)" : "var(--ml-text-faint)",
                padding: "2px 4px", transition: "color 0.15s",
              }}>{seg}</button>
            </span>
          ))}
        </nav>
      </div>
      <button onClick={reset} style={{ marginTop: 8, border: "none", background: "none", color: "var(--ml-text-faint)", fontSize: "0.68rem", cursor: "pointer", fontFamily: "inherit" }}>Reset path</button>
    </div>
  );
}

/* ─── 4. Arrow (connected arrow shapes) ─── */
function Arrow() {
  const { path, navigateTo, reset } = useBreadcrumb(defaultPath);
  return (
    <div>
      <div style={container}>
        <nav style={{ display: "flex", alignItems: "center", gap: 0 }}>
          {path.map((seg, i) => (
            <button key={i} onClick={() => navigateTo(i)} style={{
              border: "none", fontFamily: "inherit", cursor: "pointer",
              fontSize: "0.75rem", fontWeight: 600, padding: "6px 16px 6px 12px",
              background: i === path.length - 1 ? "var(--ml-color-primary-muted)" : "var(--ml-bg-elevated)",
              color: i === path.length - 1 ? "var(--ml-color-primary)" : "var(--ml-text-muted)",
              clipPath: i < path.length - 1
                ? "polygon(0 0, calc(100% - 8px) 0, 100% 50%, calc(100% - 8px) 100%, 0 100%, 8px 50%)"
                : "polygon(0 0, 100% 0, 100% 100%, 0 100%, 8px 50%)",
              marginLeft: i > 0 ? -4 : 0,
              paddingLeft: i > 0 ? 16 : 12,
              transition: "all 0.15s",
            }}>{seg}</button>
          ))}
        </nav>
      </div>
      <button onClick={reset} style={{ marginTop: 8, border: "none", background: "none", color: "var(--ml-text-faint)", fontSize: "0.68rem", cursor: "pointer", fontFamily: "inherit" }}>Reset path</button>
    </div>
  );
}

/* ─── 5. Dots (dot separator) ─── */
function Dots() {
  const { path, navigateTo, reset } = useBreadcrumb(defaultPath);
  return (
    <div>
      <div style={container}>
        <nav style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {path.map((seg, i) => (
            <span key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {i > 0 && <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--ml-text-faint)" }} />}
              <button onClick={() => navigateTo(i)} style={{
                border: "none", background: "none", fontFamily: "inherit", cursor: "pointer",
                fontSize: "0.82rem", fontWeight: i === path.length - 1 ? 600 : 400,
                color: i === path.length - 1 ? "var(--ml-text)" : "var(--ml-text-muted)",
                padding: 0, transition: "color 0.15s",
              }}>{seg}</button>
            </span>
          ))}
        </nav>
      </div>
      <button onClick={reset} style={{ marginTop: 8, border: "none", background: "none", color: "var(--ml-text-faint)", fontSize: "0.68rem", cursor: "pointer", fontFamily: "inherit" }}>Reset path</button>
    </div>
  );
}

/* ─── 6. Underline (active segment underlined) ─── */
function UnderlineBreadcrumb() {
  const { path, navigateTo, reset } = useBreadcrumb(defaultPath);
  return (
    <div>
      <div style={container}>
        <nav style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {path.map((seg, i) => (
            <span key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {i > 0 && <span style={{ color: "var(--ml-text-faint)", fontSize: "0.72rem" }}>›</span>}
              <button onClick={() => navigateTo(i)} style={{
                border: "none", background: "none", fontFamily: "inherit", cursor: "pointer",
                fontSize: "0.82rem", fontWeight: 500, padding: "4px 2px",
                color: i === path.length - 1 ? "var(--ml-color-primary)" : "var(--ml-text-muted)",
                borderBottom: i === path.length - 1 ? "2px solid var(--ml-color-primary)" : "2px solid transparent",
                transition: "all 0.15s",
              }}>{seg}</button>
            </span>
          ))}
        </nav>
      </div>
      <button onClick={reset} style={{ marginTop: 8, border: "none", background: "none", color: "var(--ml-text-faint)", fontSize: "0.68rem", cursor: "pointer", fontFamily: "inherit" }}>Reset path</button>
    </div>
  );
}

/* ─── 7. Card (each segment as a mini card) ─── */
function CardBreadcrumb() {
  const { path, navigateTo, reset } = useBreadcrumb(defaultPath);
  return (
    <div>
      <div style={container}>
        <nav style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {path.map((seg, i) => (
            <span key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {i > 0 && <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="var(--ml-text-faint)" strokeWidth="1.5" strokeLinecap="round"><path d="M4.5 2.5l3 3.5-3 3.5" /></svg>}
              <button onClick={() => navigateTo(i)} style={{
                fontFamily: "inherit", cursor: "pointer",
                fontSize: "0.75rem", fontWeight: 500, padding: "5px 12px", borderRadius: 8,
                border: i === path.length - 1 ? "1px solid var(--ml-color-primary)" : "1px solid var(--ml-border)",
                background: i === path.length - 1 ? "var(--ml-color-primary-muted)" : "var(--ml-bg)",
                color: i === path.length - 1 ? "var(--ml-color-primary)" : "var(--ml-text-muted)",
                transition: "all 0.15s",
              }}>{seg}</button>
            </span>
          ))}
        </nav>
      </div>
      <button onClick={reset} style={{ marginTop: 8, border: "none", background: "none", color: "var(--ml-text-faint)", fontSize: "0.68rem", cursor: "pointer", fontFamily: "inherit" }}>Reset path</button>
    </div>
  );
}

/* ─── 8. Folder Path (file system style with folder icons) ─── */
function FolderPath() {
  const { path, navigateTo, reset } = useBreadcrumb(defaultPath);
  return (
    <div>
      <div style={{ ...container, fontFamily: "var(--ml-font-mono)", background: "var(--ml-bg)", border: "1px solid var(--ml-border)" }}>
        <nav style={{ display: "flex", alignItems: "center", gap: 2 }}>
          {path.map((seg, i) => (
            <span key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {i > 0 && <span style={{ color: "var(--ml-text-faint)", fontSize: "0.78rem" }}>/</span>}
              <button onClick={() => navigateTo(i)} style={{
                border: "none", background: "none", fontFamily: "inherit", cursor: "pointer",
                fontSize: "0.75rem", padding: "2px 4px", borderRadius: 4,
                display: "flex", alignItems: "center", gap: 4,
                color: i === path.length - 1 ? "var(--ml-text)" : "var(--ml-text-muted)",
                fontWeight: i === path.length - 1 ? 600 : 400,
                transition: "color 0.15s",
              }}>
                <span style={{ fontSize: "0.82rem" }}>{i === path.length - 1 ? "📄" : "📁"}</span>
                {seg}
              </button>
            </span>
          ))}
        </nav>
      </div>
      <button onClick={reset} style={{ marginTop: 8, border: "none", background: "none", color: "var(--ml-text-faint)", fontSize: "0.68rem", cursor: "pointer", fontFamily: "inherit" }}>Reset path</button>
    </div>
  );
}

/* ─── 9. Stepped (numbered steps) ─── */
function Stepped() {
  const { path, navigateTo, reset } = useBreadcrumb(defaultPath);
  return (
    <div>
      <div style={container}>
        <nav style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {path.map((seg, i) => (
            <span key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {i > 0 && <div style={{ width: 24, height: 1, background: "var(--ml-border)" }} />}
              <button onClick={() => navigateTo(i)} style={{
                border: "none", background: "none", fontFamily: "inherit", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 6, padding: 0, transition: "color 0.15s",
                color: i === path.length - 1 ? "var(--ml-text)" : "var(--ml-text-muted)",
              }}>
                <span style={{
                  width: 22, height: 22, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.62rem", fontWeight: 700, flexShrink: 0,
                  background: i <= path.length - 1 ? "var(--ml-color-primary-muted)" : "var(--ml-bg-elevated)",
                  color: i <= path.length - 1 ? "var(--ml-color-primary)" : "var(--ml-text-faint)",
                }}>{i + 1}</span>
                <span style={{ fontSize: "0.78rem", fontWeight: i === path.length - 1 ? 600 : 400 }}>{seg}</span>
              </button>
            </span>
          ))}
        </nav>
      </div>
      <button onClick={reset} style={{ marginTop: 8, border: "none", background: "none", color: "var(--ml-text-faint)", fontSize: "0.68rem", cursor: "pointer", fontFamily: "inherit" }}>Reset path</button>
    </div>
  );
}

/* ─── 10. Minimal (just text, very clean) ─── */
function MinimalBreadcrumb() {
  const { path, navigateTo, reset } = useBreadcrumb(defaultPath);
  return (
    <div>
      <div style={{ ...container, background: "none", border: "none", padding: "8px 0" }}>
        <nav style={{ display: "flex", alignItems: "baseline", gap: 0 }}>
          {path.map((seg, i) => (
            <span key={i} style={{ display: "flex", alignItems: "baseline" }}>
              {i > 0 && <span style={{ color: "var(--ml-text-faint)", fontSize: "0.72rem", margin: "0 6px" }}>/</span>}
              <button onClick={() => navigateTo(i)} style={{
                border: "none", background: "none", fontFamily: "inherit", cursor: "pointer", padding: 0,
                fontSize: i === path.length - 1 ? "1rem" : "0.82rem",
                fontWeight: i === path.length - 1 ? 700 : 400,
                color: i === path.length - 1 ? "var(--ml-text)" : "var(--ml-text-faint)",
                transition: "all 0.15s",
              }}>{seg}</button>
            </span>
          ))}
        </nav>
      </div>
      <button onClick={reset} style={{ marginTop: 8, border: "none", background: "none", color: "var(--ml-text-faint)", fontSize: "0.68rem", cursor: "pointer", fontFamily: "inherit" }}>Reset path</button>
    </div>
  );
}

/* ─── Main demo ─── */
const demos = [Classic, Pill, Slash, Arrow, Dots, UnderlineBreadcrumb, CardBreadcrumb, FolderPath, Stepped, MinimalBreadcrumb];

export function BreadcrumbsDemo() {
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
                padding: "6px 14px", borderRadius: 99, border: "none", fontFamily: "inherit",
                background: i === idx ? "var(--ml-color-primary-muted)" : "var(--ml-bg-elevated)",
                color: i === idx ? "var(--ml-color-primary)" : "var(--ml-text-muted)",
                fontSize: "0.75rem", fontWeight: 600, cursor: "pointer",
                transition: "background 0.15s, color 0.15s",
              }}
            >{v}</button>
          ))}
        </div>
      </div>
      <hr className="demo-divider" />
      <Demo />
    </>
  );
}
