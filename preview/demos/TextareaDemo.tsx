import { useState } from "react";
import { Textarea } from "../../src/components/Textarea";

export function TextareaDemo() {
  const [value, setValue] = useState(
    "This textarea grows as you type.\nTry adding a few more lines…",
  );

  return (
    <>
      <div className="demo-section">
        <div className="demo-label">Auto-resize (min 2 rows, max 8 rows)</div>
        <Textarea
          autoResize
          minRows={2}
          maxRows={8}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>

      <div className="demo-section">
        <div className="demo-label">Fixed rows (manually resizable)</div>
        <Textarea rows={4} placeholder="Write a description..." />
      </div>

      <div className="demo-section">
        <div className="demo-label">Invalid + disabled</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <Textarea invalid rows={3} defaultValue="Something's off here." />
          <Textarea disabled rows={3} defaultValue="Disabled textarea." />
        </div>
      </div>
    </>
  );
}
