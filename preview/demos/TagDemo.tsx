import { Tag } from "../../src/components/Tag";

export function TagDemo() {
  return (
    <>
      <div className="demo-section">
        <div className="demo-label">Single</div>
        <Tag>Label</Tag>
      </div>
      <div className="demo-section">
        <div className="demo-label">Multiple</div>
        <div className="demo-row">
          <Tag>Design</Tag>
          <Tag>Engineering</Tag>
          <Tag>Marketing</Tag>
          <Tag>Operations</Tag>
        </div>
      </div>
    </>
  );
}
