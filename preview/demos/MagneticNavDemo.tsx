import { useState } from "react";

const container: React.CSSProperties = {
  background: "var(--ml-bg-surface)",
  border: "1px solid var(--ml-border)",
  borderRadius: 12,
  padding: "16px 20px",
  display: "flex",
  alignItems: "center",
};

const note: React.CSSProperties = {
  marginTop: 8,
  color: "var(--ml-text-faint)",
  fontSize: "0.75rem",
  lineHeight: 1.5,
};

const items = ["Overview", "Analytics", "Reports", "Settings"];

export function MagneticNavDemo() {
  const [active, setActive] = useState(0);

  return (
    <>
      <div className="demo-section">
        <div className="demo-label">
          Magnetic highlight — hover or Tab through the links; it rests under
          the active one
        </div>
        <div style={container}>
          <nav className="ml-magnetic-nav" aria-label="Demo section">
            {items.map((label, i) => (
              <a
                key={label}
                href="#"
                className="ml-magnetic-nav-link"
                aria-current={i === active ? "page" : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  setActive(i);
                }}
              >
                {label}
              </a>
            ))}
            <span className="ml-magnetic-nav-highlight" aria-hidden="true" />
          </nav>
        </div>
        <p style={note}>
          Click a link to move "active" (aria-current) — the resting position
          follows. Highlight is CSS anchor positioning (`anchor-name` +
          `anchor()`); no JS measures link positions. On a browser without
          anchor positioning support, the highlight never renders — only the
          plain text-color hover/focus change applies. It also respects
          `prefers-reduced-motion` (via the kit's global transition guard) and
          only reacts to hover on pointers that actually hover — a touch tap
          just navigates, it doesn't stick the slide.
        </p>
      </div>
    </>
  );
}
