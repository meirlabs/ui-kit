import { useState } from "react";
import { Tag } from "../../src/components/Tag";
import { ChipRow } from "../../src/components/ChipRow";

export function TagDemo() {
  const [filters, setFilters] = useState([
    "Design",
    "Engineering",
    "Marketing",
    "Operations",
  ]);

  return (
    <>
      <div className="demo-section">
        <div className="demo-label">Tones</div>
        <div className="demo-row">
          <Tag tone="neutral">Neutral</Tag>
          <Tag tone="success">Success</Tag>
          <Tag tone="warning">Warning</Tag>
          <Tag tone="danger">Danger</Tag>
        </div>
      </div>
      <div className="demo-section">
        <div className="demo-label">Sizes</div>
        <div className="demo-row" style={{ alignItems: "center" }}>
          <Tag size="sm">Small</Tag>
          <Tag size="md">Medium</Tag>
        </div>
      </div>
      <div className="demo-section">
        <div className="demo-label">Removable filters</div>
        <ChipRow>
          {filters.map((f) => (
            <Tag
              key={f}
              onRemove={() => setFilters((prev) => prev.filter((x) => x !== f))}
            >
              {f}
            </Tag>
          ))}
        </ChipRow>
        {filters.length === 0 ? (
          <button
            type="button"
            className="ml-btn ml-btn-secondary"
            style={{ marginTop: "12px" }}
            onClick={() =>
              setFilters(["Design", "Engineering", "Marketing", "Operations"])
            }
          >
            Reset
          </button>
        ) : null}
      </div>
    </>
  );
}
