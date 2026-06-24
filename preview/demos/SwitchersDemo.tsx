import { useState } from "react";

const variants = [
  "Pill",
  "Segmented",
  "Underline",
  "Slider",
  "Chip",
  "Minimal",
  "Dot",
  "Icon Bar",
  "Stacked",
  "Floating",
];

/* ─── Shared ─── */
const wrap: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  marginBottom: 32,
};

const label: React.CSSProperties = {
  fontSize: "0.62rem",
  fontWeight: 700,
  color: "var(--ml-text-faint)",
  textTransform: "uppercase" as const,
  letterSpacing: "0.06em",
  width: 80,
  flexShrink: 0,
};

/* ─── 1. Pill ─── */
function Pill({ value, onChange, options }: SwitcherProps) {
  return (
    <div style={{ display: "inline-flex", padding: 3, background: "var(--ml-bg-elevated)", borderRadius: 99 }}>
      {options.map((o) => (
        <button key={o.value} onClick={() => onChange(o.value)} style={{
          padding: "5px 16px", borderRadius: 99, border: "none", fontFamily: "inherit",
          fontSize: "0.75rem", fontWeight: 600, cursor: "pointer",
          background: value === o.value ? "var(--ml-color-primary-muted)" : "none",
          color: value === o.value ? "var(--ml-color-primary)" : "var(--ml-text-muted)",
          transition: "all 0.15s",
        }}>{o.label}</button>
      ))}
    </div>
  );
}

/* ─── 2. Segmented (iOS style) ─── */
function Segmented({ value, onChange, options }: SwitcherProps) {
  return (
    <div style={{ display: "inline-flex", padding: 2, background: "var(--ml-bg-elevated)", borderRadius: 8, border: "1px solid var(--ml-border)" }}>
      {options.map((o) => (
        <button key={o.value} onClick={() => onChange(o.value)} style={{
          padding: "6px 20px", borderRadius: 6, border: "none", fontFamily: "inherit",
          fontSize: "0.75rem", fontWeight: 600, cursor: "pointer",
          background: value === o.value ? "var(--ml-bg-surface)" : "none",
          color: value === o.value ? "var(--ml-text)" : "var(--ml-text-muted)",
          boxShadow: value === o.value ? "0 1px 3px rgba(0,0,0,0.15)" : "none",
          transition: "all 0.15s",
        }}>{o.label}</button>
      ))}
    </div>
  );
}

/* ─── 3. Underline ─── */
function Underline({ value, onChange, options }: SwitcherProps) {
  return (
    <div style={{ display: "inline-flex", gap: 0, borderBottom: "1px solid var(--ml-border)" }}>
      {options.map((o) => (
        <button key={o.value} onClick={() => onChange(o.value)} style={{
          padding: "8px 16px", border: "none", fontFamily: "inherit",
          fontSize: "0.78rem", fontWeight: 500, cursor: "pointer", background: "none",
          color: value === o.value ? "var(--ml-text)" : "var(--ml-text-muted)",
          borderBottom: value === o.value ? "2px solid var(--ml-color-primary)" : "2px solid transparent",
          marginBottom: -1,
          transition: "all 0.15s",
        }}>{o.label}</button>
      ))}
    </div>
  );
}

/* ─── 4. Slider (toggle switch) ─── */
function Slider({ value, onChange, options }: SwitcherProps) {
  const isRight = value === options[1]?.value;
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      <span style={{ fontSize: "0.78rem", fontWeight: 500, color: !isRight ? "var(--ml-text)" : "var(--ml-text-muted)", transition: "color 0.15s" }}>{options[0]?.label}</span>
      <button onClick={() => onChange(isRight ? options[0].value : options[1].value)} style={{
        width: 44, height: 24, borderRadius: 12, border: "none", cursor: "pointer", position: "relative",
        background: isRight ? "var(--ml-color-primary)" : "var(--ml-bg-elevated)",
        transition: "background 0.2s",
      }}>
        <span style={{
          position: "absolute", top: 3, width: 18, height: 18, borderRadius: "50%",
          background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
          left: isRight ? 23 : 3,
          transition: "left 0.2s",
        }} />
      </button>
      <span style={{ fontSize: "0.78rem", fontWeight: 500, color: isRight ? "var(--ml-text)" : "var(--ml-text-muted)", transition: "color 0.15s" }}>{options[1]?.label}</span>
    </div>
  );
}

/* ─── 5. Chip ─── */
function Chip({ value, onChange, options }: SwitcherProps) {
  return (
    <div style={{ display: "inline-flex", gap: 6, flexWrap: "wrap" }}>
      {options.map((o) => (
        <button key={o.value} onClick={() => onChange(o.value)} style={{
          padding: "5px 14px", borderRadius: 99, fontFamily: "inherit",
          fontSize: "0.72rem", fontWeight: 600, cursor: "pointer",
          border: value === o.value ? "1px solid var(--ml-color-primary)" : "1px solid var(--ml-border)",
          background: value === o.value ? "var(--ml-color-primary-muted)" : "none",
          color: value === o.value ? "var(--ml-color-primary)" : "var(--ml-text-muted)",
          transition: "all 0.15s",
        }}>{o.label}</button>
      ))}
    </div>
  );
}

/* ─── 6. Minimal (text only) ─── */
function Minimal({ value, onChange, options }: SwitcherProps) {
  return (
    <div style={{ display: "inline-flex", gap: 4 }}>
      {options.map((o, i) => (
        <span key={o.value} style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
          {i > 0 && <span style={{ color: "var(--ml-text-faint)", fontSize: "0.72rem" }}>/</span>}
          <button onClick={() => onChange(o.value)} style={{
            padding: "2px 4px", border: "none", fontFamily: "inherit", background: "none",
            fontSize: "0.82rem", fontWeight: value === o.value ? 700 : 400, cursor: "pointer",
            color: value === o.value ? "var(--ml-text)" : "var(--ml-text-faint)",
            textDecoration: value === o.value ? "none" : "none",
            transition: "all 0.15s",
          }}>{o.label}</button>
        </span>
      ))}
    </div>
  );
}

/* ─── 7. Dot indicator ─── */
function Dot({ value, onChange, options }: SwitcherProps) {
  return (
    <div style={{ display: "inline-flex", gap: 2 }}>
      {options.map((o) => (
        <button key={o.value} onClick={() => onChange(o.value)} style={{
          display: "flex", alignItems: "center", gap: 6, padding: "6px 14px",
          borderRadius: 6, border: "none", fontFamily: "inherit",
          fontSize: "0.78rem", fontWeight: 500, cursor: "pointer",
          background: value === o.value ? "var(--ml-color-primary-muted)" : "none",
          color: value === o.value ? "var(--ml-color-primary)" : "var(--ml-text-muted)",
          transition: "all 0.15s",
        }}>
          <span style={{
            width: 7, height: 7, borderRadius: "50%", flexShrink: 0,
            background: value === o.value ? "var(--ml-color-primary)" : "var(--ml-border)",
            transition: "background 0.15s",
          }} />
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* ─── 8. Icon Bar ─── */
function IconBar({ value, onChange, options }: SwitcherProps) {
  const icons = ["☀️", "🌙", "🗂️", "📂", "📊"];
  return (
    <div style={{ display: "inline-flex", gap: 2, padding: 3, background: "var(--ml-bg-surface)", borderRadius: 8, border: "1px solid var(--ml-border)" }}>
      {options.map((o, i) => (
        <button key={o.value} onClick={() => onChange(o.value)} title={o.label} style={{
          width: 36, height: 32, display: "flex", alignItems: "center", justifyContent: "center",
          borderRadius: 6, border: "none", cursor: "pointer",
          fontSize: "0.9rem",
          background: value === o.value ? "var(--ml-color-primary-muted)" : "none",
          transition: "background 0.15s",
        }}>{icons[i % icons.length]}</button>
      ))}
    </div>
  );
}

/* ─── 9. Stacked (vertical) ─── */
function Stacked({ value, onChange, options }: SwitcherProps) {
  return (
    <div style={{ display: "inline-flex", flexDirection: "column", gap: 2, width: 200, border: "1px solid var(--ml-border)", borderRadius: 8, overflow: "hidden" }}>
      {options.map((o) => (
        <button key={o.value} onClick={() => onChange(o.value)} style={{
          padding: "8px 14px", border: "none", fontFamily: "inherit", textAlign: "left",
          fontSize: "0.78rem", fontWeight: 500, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: value === o.value ? "var(--ml-color-primary-muted)" : "var(--ml-bg-surface)",
          color: value === o.value ? "var(--ml-color-primary)" : "var(--ml-text-muted)",
          transition: "all 0.15s",
        }}>
          {o.label}
          {value === o.value && <span style={{ fontSize: "0.72rem" }}>✓</span>}
        </button>
      ))}
    </div>
  );
}

/* ─── 10. Floating (raised buttons) ─── */
function Floating({ value, onChange, options }: SwitcherProps) {
  return (
    <div style={{ display: "inline-flex", gap: 8 }}>
      {options.map((o) => (
        <button key={o.value} onClick={() => onChange(o.value)} style={{
          padding: "8px 20px", borderRadius: 10, fontFamily: "inherit",
          fontSize: "0.75rem", fontWeight: 600, cursor: "pointer",
          border: "none",
          background: value === o.value ? "var(--ml-color-primary)" : "var(--ml-bg-surface)",
          color: value === o.value ? "#fff" : "var(--ml-text-muted)",
          boxShadow: value === o.value
            ? "0 2px 8px rgba(88, 166, 255, 0.3)"
            : "0 1px 3px rgba(0,0,0,0.15), 0 0 0 1px var(--ml-border)",
          transform: value === o.value ? "translateY(-1px)" : "none",
          transition: "all 0.2s",
        }}>{o.label}</button>
      ))}
    </div>
  );
}

/* ─── Types ─── */
interface Option { label: string; value: string }
interface SwitcherProps {
  value: string;
  onChange: (v: string) => void;
  options: Option[];
}

/* ─── Demo rows ─── */
const switchers = [Pill, Segmented, Underline, Slider, Chip, Minimal, Dot, IconBar, Stacked, Floating];

const twoOptions: Option[] = [
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
];

const threeOptions: Option[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Archived", value: "archived" },
];

export function SwitchersDemo() {
  const [idx, setIdx] = useState(0);
  const [val2, setVal2] = useState("dark");
  const [val3, setVal3] = useState("all");
  const SwitcherComponent = switchers[idx];

  return (
    <>
      {/* variant picker */}
      <div className="demo-section">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 24 }}>
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

      {/* 2 options */}
      <div style={wrap}>
        <span style={label}>2 options</span>
        <SwitcherComponent value={val2} onChange={setVal2} options={twoOptions} />
      </div>

      {/* 3 options */}
      <div style={wrap}>
        <span style={label}>3 options</span>
        <SwitcherComponent value={val3} onChange={setVal3} options={threeOptions} />
      </div>

      {/* Practical examples */}
      <div className="demo-section" style={{ marginTop: 16 }}>
        <div className="demo-label">Practical examples</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: "0.78rem", color: "var(--ml-text-muted)", width: 100 }}>Theme</span>
            <SwitcherComponent
              value={val2}
              onChange={setVal2}
              options={[{ label: "☀️", value: "light" }, { label: "🌙", value: "dark" }]}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: "0.78rem", color: "var(--ml-text-muted)", width: 100 }}>View</span>
            <SwitcherComponent
              value={val3}
              onChange={setVal3}
              options={[{ label: "Grid", value: "grid" }, { label: "List", value: "list" }, { label: "Table", value: "table" }]}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: "0.78rem", color: "var(--ml-text-muted)", width: 100 }}>Status</span>
            <SwitcherComponent
              value={val3}
              onChange={setVal3}
              options={[{ label: "All", value: "all" }, { label: "Active", value: "active" }, { label: "Archived", value: "archived" }]}
            />
          </div>
        </div>
      </div>
    </>
  );
}
