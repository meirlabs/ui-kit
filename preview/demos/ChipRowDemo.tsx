import { Tag } from "../../src/components/Tag";
import { ChipRow } from "../../src/components/ChipRow";

export function ChipRowDemo() {
  return (
    <>
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
      <div className="demo-section">
        <div className="demo-label">Few items</div>
        <ChipRow>
          <Tag>Frontend</Tag>
          <Tag>Backend</Tag>
        </ChipRow>
      </div>
    </>
  );
}
