import { useState } from "react";
import { Dropdown } from "../../src/components/Dropdown";

const items = [
  { label: "Edit", value: "edit" },
  { label: "Duplicate", value: "duplicate" },
  { label: "Archive", value: "archive" },
  { label: "Delete", value: "delete" },
];

export function DropdownDemo() {
  const [selected, setSelected] = useState("edit");

  return (
    <>
      <div className="demo-section">
        <div className="demo-label">Dropdown menu</div>
        <Dropdown
          trigger={
            <button className="ml-btn ml-btn-ghost" type="button">
              Actions &#9662;
            </button>
          }
          items={items}
          active={selected}
          onSelect={setSelected}
        />
        <p style={{ fontSize: "var(--ml-text-sm)", color: "var(--ml-text-muted)", marginTop: 8 }}>
          Selected: <strong>{selected}</strong>
        </p>
      </div>
    </>
  );
}
