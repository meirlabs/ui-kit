import { useState } from "react";
import { Drawer, type DrawerSide } from "../../src/components/Drawer";

const bodyText: React.CSSProperties = {
  fontSize: 14,
  lineHeight: 1.5,
  color: "var(--ml-text-muted)",
  margin: 0,
};

export function DrawerDemo() {
  const [side, setSide] = useState<DrawerSide | null>(null);
  const sides: DrawerSide[] = ["right", "left", "top", "bottom"];

  return (
    <>
      <div className="demo-section">
        <div className="demo-label">Slide-over — one per edge (focus-trapped, scroll-locked)</div>
        <div className="demo-row">
          {sides.map((s) => (
            <button
              key={s}
              type="button"
              className="ml-btn ml-btn-secondary"
              onClick={() => setSide(s)}
            >
              Open {s}
            </button>
          ))}
        </div>
        <Drawer
          open={side !== null}
          onClose={() => setSide(null)}
          side={side ?? "right"}
          title={`${side ?? ""} drawer`}
          footer={
            <>
              <button className="ml-btn ml-btn-ghost" type="button" onClick={() => setSide(null)}>
                Cancel
              </button>
              <button className="ml-btn ml-btn-primary" type="button" onClick={() => setSide(null)}>
                Apply
              </button>
            </>
          }
        >
          <p style={bodyText}>
            The panel translates in from the <strong>{side}</strong> edge over the backdrop, then
            dissolves in place on close. Edit or detail flows can live here without leaving the
            current page.
          </p>
          <p style={{ ...bodyText, marginTop: 12 }}>
            Escape closes it and focus returns to the button that opened it.
          </p>
        </Drawer>
      </div>
    </>
  );
}
