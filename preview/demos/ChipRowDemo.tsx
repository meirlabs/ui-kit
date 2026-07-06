import { Tag } from "../../src/components/Tag";
import { ChipRow } from "../../src/components/ChipRow";

const cellStyle: React.CSSProperties = {
  padding: "12px 16px",
  borderBottom: "1px solid var(--ml-border-subtle)",
  verticalAlign: "top",
  fontSize: "14px",
  color: "var(--ml-text)",
};

export function ChipRowDemo() {
  return (
    <>
      <div className="demo-section">
        <div className="demo-label">In-cell alignment (no forced margin)</div>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            border: "1px solid var(--ml-border)",
            borderRadius: "var(--ml-radius-lg)",
          }}
        >
          <tbody>
            <tr>
              <td style={{ ...cellStyle, color: "var(--ml-text-muted)", width: "120px" }}>
                Acme Corp
              </td>
              <td style={cellStyle}>
                <ChipRow>
                  <Tag>Design</Tag>
                  <Tag>Engineering</Tag>
                  <Tag>Marketing</Tag>
                </ChipRow>
              </td>
            </tr>
            <tr>
              <td style={{ ...cellStyle, color: "var(--ml-text-muted)" }}>Globex</td>
              <td style={cellStyle}>
                <ChipRow>
                  <Tag>Sales</Tag>
                  <Tag>Support</Tag>
                </ChipRow>
              </td>
            </tr>
          </tbody>
        </table>
        <p style={{ marginTop: "8px", fontSize: "13px", color: "var(--ml-text-muted)" }}>
          The chips baseline-align with the label cell — no stray top margin.
        </p>
      </div>

      <div className="demo-section">
        <div className="demo-label">Gap: sm (8px, default)</div>
        <ChipRow gap="sm">
          <Tag>React</Tag>
          <Tag>TypeScript</Tag>
          <Tag>CSS</Tag>
          <Tag>Node.js</Tag>
          <Tag>PostgreSQL</Tag>
        </ChipRow>
      </div>

      <div className="demo-section">
        <div className="demo-label">Gap: md (12px)</div>
        <ChipRow gap="md">
          <Tag>React</Tag>
          <Tag>TypeScript</Tag>
          <Tag>CSS</Tag>
          <Tag>Node.js</Tag>
          <Tag>PostgreSQL</Tag>
        </ChipRow>
      </div>

      <div className="demo-section">
        <div className="demo-label">Wrapping layout</div>
        <ChipRow>
          <Tag>React</Tag>
          <Tag>TypeScript</Tag>
          <Tag>CSS</Tag>
          <Tag>Node.js</Tag>
          <Tag>PostgreSQL</Tag>
          <Tag>Redis</Tag>
          <Tag>Docker</Tag>
          <Tag>Kubernetes</Tag>
        </ChipRow>
      </div>
    </>
  );
}
