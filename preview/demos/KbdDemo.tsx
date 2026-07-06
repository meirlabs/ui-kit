import { Kbd } from "../../src/components/Kbd";

const label: React.CSSProperties = {
  fontSize: 14,
  color: "var(--ml-text-muted)",
  minWidth: 160,
};

function Row({ children, keys }: { children: React.ReactNode; keys: React.ReactNode }) {
  return (
    <div className="demo-row" style={{ gap: 16 }}>
      <span style={label}>{children}</span>
      {keys}
    </div>
  );
}

export function KbdDemo() {
  return (
    <>
      <div className="demo-section">
        <div className="demo-label">Platform-mapped glyphs (⌘ on macOS, Ctrl elsewhere)</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Row keys={<Kbd keys={["mod", "K"]} />}>Command palette</Row>
          <Row keys={<Kbd keys={["mod", "shift", "P"]} />}>Command menu</Row>
          <Row keys={<Kbd keys={["mod", "enter"]} />}>Submit</Row>
          <Row keys={<Kbd keys={["escape"]} />}>Dismiss</Row>
          <Row keys={<Kbd keys={["up", "down"]} />}>Navigate list</Row>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-label">Single caps &amp; freeform children</div>
        <div className="demo-row" style={{ gap: 8 }}>
          <Kbd keys={["A"]} />
          <Kbd keys={["/"]} />
          <Kbd keys={["shift"]} />
          <Kbd keys={["tab"]} />
          <Kbd>Fn</Kbd>
          <Kbd mapGlyphs={false} keys={["Ctrl"]} />
        </div>
      </div>
    </>
  );
}
