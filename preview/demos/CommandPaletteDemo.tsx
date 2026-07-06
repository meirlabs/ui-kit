import { useState } from "react";
import { CommandPalette, type CommandItem } from "../../src/components/CommandPalette";
import { Kbd } from "../../src/components/Kbd";

function Glyph({ d }: { d: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d={d} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CommandPaletteDemo() {
  const [open, setOpen] = useState(false);
  const [ran, setRan] = useState<string>("—");

  const items: CommandItem[] = [
    {
      id: "new-doc",
      label: "New document",
      group: "Actions",
      keywords: ["create", "file"],
      shortcut: ["mod", "N"],
      icon: <Glyph d="M4 2.5h5L12 5.5v8h-8z M9 2.5v3h3" />,
      onSelect: () => setRan("New document"),
    },
    {
      id: "search",
      label: "Search everything",
      group: "Actions",
      keywords: ["find", "filter"],
      shortcut: ["mod", "K"],
      icon: <Glyph d="M7 12a5 5 0 100-10 5 5 0 000 10zM11 11l3 3" />,
      onSelect: () => setRan("Search everything"),
    },
    {
      id: "settings",
      label: "Open settings",
      group: "Navigation",
      keywords: ["preferences", "config"],
      icon: <Glyph d="M8 10a2 2 0 100-4 2 2 0 000 4zM8 2v2M8 12v2M2 8h2M12 8h2" />,
      onSelect: () => setRan("Open settings"),
    },
    {
      id: "billing",
      label: "Go to billing",
      group: "Navigation",
      keywords: ["invoice", "payment", "plan"],
      onSelect: () => setRan("Go to billing"),
    },
    {
      id: "theme",
      label: "Toggle theme",
      group: "Preferences",
      keywords: ["dark", "light", "appearance"],
      shortcut: ["mod", "shift", "L"],
      onSelect: () => setRan("Toggle theme"),
    },
  ];

  return (
    <>
      <div className="demo-section">
        <div className="demo-label">Cmd/Ctrl+K launcher — grouped, filterable, shortcut hints</div>
        <div className="demo-row" style={{ alignItems: "center" }}>
          <button type="button" className="ml-btn ml-btn-secondary" onClick={() => setOpen(true)}>
            Open command palette
          </button>
          <span style={{ fontSize: 14, color: "var(--ml-text-muted)", display: "inline-flex", gap: 6, alignItems: "center" }}>
            or press <Kbd keys={["mod", "K"]} />
          </span>
        </div>
        <p style={{ fontSize: 14, color: "var(--ml-text-muted)", marginTop: 8 }}>
          Last command: <strong>{ran}</strong>
        </p>
        <CommandPalette open={open} onOpenChange={setOpen} items={items} />
      </div>
    </>
  );
}
