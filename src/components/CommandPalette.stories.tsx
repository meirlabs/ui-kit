import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { CommandPalette, type CommandItem } from "./CommandPalette";
import { Kbd } from "./Kbd";

const meta: Meta<typeof CommandPalette> = {
  title: "Components/CommandPalette",
  component: CommandPalette,
};
export default meta;

function Glyph({ d }: { d: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d={d} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Launcher({
  items,
  dir,
  placeholder,
}: {
  items: (setRan: (label: string) => void) => CommandItem[];
  dir?: "rtl" | "ltr";
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [ran, setRan] = useState("—");
  return (
    <div dir={dir} style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <button type="button" className="ml-btn ml-btn-secondary" onClick={() => setOpen(true)}>
          Open command palette
        </button>
        <span
          style={{
            fontSize: 14,
            color: "var(--ml-text-muted)",
            display: "inline-flex",
            gap: 6,
            alignItems: "center",
          }}
        >
          or press <Kbd keys={["mod", "K"]} />
        </span>
      </div>
      <p style={{ fontSize: 14, color: "var(--ml-text-muted)" }}>
        Last command: <strong>{ran}</strong>
      </p>
      <CommandPalette open={open} onOpenChange={setOpen} items={items(setRan)} placeholder={placeholder} />
    </div>
  );
}

const englishItems = (setRan: (label: string) => void): CommandItem[] => [
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

const hebrewItems = (setRan: (label: string) => void): CommandItem[] => [
  {
    id: "he-new-doc",
    label: "מסמך חדש",
    group: "פעולות",
    keywords: ["יצירה", "קובץ"],
    shortcut: ["mod", "N"],
    onSelect: () => setRan("מסמך חדש"),
  },
  {
    id: "he-search",
    label: "חיפוש בכל המערכת",
    group: "פעולות",
    keywords: ["סינון"],
    shortcut: ["mod", "K"],
    onSelect: () => setRan("חיפוש בכל המערכת"),
  },
  {
    id: "he-settings",
    label: "פתיחת הגדרות",
    group: "ניווט",
    keywords: ["העדפות"],
    onSelect: () => setRan("פתיחת הגדרות"),
  },
  {
    id: "he-billing",
    label: "מעבר לחיובים",
    group: "ניווט",
    keywords: ["חשבונית", "תשלום"],
    onSelect: () => setRan("מעבר לחיובים"),
  },
];

export const Default: StoryObj = {
  render: () => <Launcher items={englishItems} />,
};

export const HebrewRTL: StoryObj = {
  name: "Hebrew (RTL)",
  render: () => <Launcher items={hebrewItems} dir="rtl" placeholder="הקלידו פקודה או חיפוש…" />,
};

export const CustomEmptyState: StoryObj = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button type="button" className="ml-btn ml-btn-secondary" onClick={() => setOpen(true)}>
          Open (few items — try a nonsense query)
        </button>
        <CommandPalette
          open={open}
          onOpenChange={setOpen}
          items={[{ id: "only", label: "The only command", onSelect: () => {} }]}
          emptyState={<span>Nothing matches. Try “command”.</span>}
        />
      </>
    );
  },
};
