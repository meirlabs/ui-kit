import { ScrollFade } from "../../src/components/ScrollFade";

const rows = Array.from({ length: 30 }, (_, i) => `Row ${i + 1}`);
const cols = Array.from({ length: 20 }, (_, i) => `Column ${i + 1}`);

export function ScrollFadeDemo() {
  return (
    <>
      <div className="demo-section">
        <div className="demo-label">Vertical fade — axis="y" (default)</div>
        <ScrollFade
          axis="y"
          style={{
            maxHeight: 220,
            border: "1px solid var(--ml-border)",
            borderRadius: "var(--ml-radius-md)",
            padding: "var(--ml-space-md)",
          }}
        >
          {rows.map((row) => (
            <div
              key={row}
              style={{ padding: "8px 4px", borderBottom: "1px solid var(--ml-border-subtle)" }}
            >
              {row}
            </div>
          ))}
        </ScrollFade>
      </div>

      <div className="demo-section">
        <div className="demo-label">Horizontal fade — axis="x"</div>
        <ScrollFade
          axis="x"
          style={{
            display: "flex",
            gap: "var(--ml-space-md)",
            border: "1px solid var(--ml-border)",
            borderRadius: "var(--ml-radius-md)",
            padding: "var(--ml-space-md)",
          }}
        >
          {cols.map((col) => (
            <div
              key={col}
              style={{
                flex: "0 0 auto",
                padding: "16px 20px",
                background: "var(--ml-bg-surface)",
                borderRadius: "var(--ml-radius-sm)",
                whiteSpace: "nowrap",
              }}
            >
              {col}
            </div>
          ))}
        </ScrollFade>
      </div>

      <div className="demo-section">
        <div className="demo-label">Both axes — axis="both", size=32</div>
        <ScrollFade
          axis="both"
          size={32}
          style={{
            maxHeight: 200,
            maxWidth: 420,
            border: "1px solid var(--ml-border)",
            borderRadius: "var(--ml-radius-md)",
            padding: "var(--ml-space-md)",
          }}
        >
          <div
            style={{
              width: 700,
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              gap: "var(--ml-space-sm)",
            }}
          >
            {Array.from({ length: 60 }, (_, i) => (
              <div
                key={i}
                style={{
                  padding: "12px",
                  background: "var(--ml-bg-surface)",
                  borderRadius: "var(--ml-radius-sm)",
                  textAlign: "center",
                }}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </ScrollFade>
      </div>
    </>
  );
}
