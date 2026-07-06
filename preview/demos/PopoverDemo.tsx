import { useState } from "react";
import { Popover } from "../../src/components/Popover";

const STATUSES = ["Open", "In progress", "Blocked", "Done"];

export function PopoverDemo() {
  const [selected, setSelected] = useState<string[]>(["Open", "In progress"]);

  const toggle = (s: string) =>
    setSelected((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  return (
    <>
      <div className="demo-section">
        <div className="demo-label">Filter panel (click, focus moves in, Esc closes)</div>
        <Popover placement="bottom-start">
          <Popover.Trigger className="ml-btn ml-btn-secondary">
            Filter{selected.length ? ` · ${selected.length}` : ""}
          </Popover.Trigger>
          <Popover.Content aria-label="Filter by status">
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  color: "var(--ml-text-muted)",
                }}
              >
                Status
              </div>
              {STATUSES.map((s) => (
                <label
                  key={s}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 14,
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(s)}
                    onChange={() => toggle(s)}
                  />
                  {s}
                </label>
              ))}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 8,
                  marginTop: 8,
                }}
              >
                <button
                  className="ml-btn ml-btn-ghost"
                  type="button"
                  onClick={() => setSelected([])}
                >
                  Clear
                </button>
              </div>
            </div>
          </Popover.Content>
        </Popover>
        <p style={{ fontSize: 14, color: "var(--ml-text-muted)", marginTop: 12 }}>
          Active: <strong>{selected.join(", ") || "none"}</strong>
        </p>
      </div>

      <div className="demo-section">
        <div className="demo-label">Controlled open state</div>
        <ControlledPopover />
      </div>
    </>
  );
}

function ControlledPopover() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <Popover open={open} onOpenChange={setOpen} placement="bottom-start">
        <Popover.Trigger className="ml-btn ml-btn-secondary">Account</Popover.Trigger>
        <Popover.Content aria-label="Account">
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <strong style={{ fontSize: 14 }}>Signed in</strong>
            <span style={{ fontSize: 14, color: "var(--ml-text-muted)" }}>
              meir@example.com
            </span>
            <button
              className="ml-btn ml-btn-ghost"
              type="button"
              onClick={() => setOpen(false)}
            >
              Sign out
            </button>
          </div>
        </Popover.Content>
      </Popover>
      <span style={{ fontSize: 14, color: "var(--ml-text-muted)" }}>
        {open ? "open" : "closed"}
      </span>
    </div>
  );
}
