import { useState } from "react";
import { Dropdown, type DropdownMenuItem } from "../../src/components/Dropdown";

/* Icon-agnostic inline glyphs — the library accepts any ReactNode as `icon`. */
function Glyph({ d }: { d: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d={d} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const EditIcon = <Glyph d="M11 2.5L13.5 5L5.5 13H3v-2.5z" />;
const CopyIcon = <Glyph d="M5.5 5.5V3.5h7v7h-2M3.5 5.5h7v7h-7z" />;
const ArchiveIcon = <Glyph d="M2.5 5.5h11M3.5 5.5v7h9v-7M6.5 8.5h3" />;
const TrashIcon = <Glyph d="M3 4.5h10M6.5 4.5V3h3v1.5M4.5 4.5v8h7v-8M6.5 7v3M9.5 7v3" />;
const ShareIcon = <Glyph d="M11 3.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM5 6.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM11 9.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM6.3 7.3l3.4-1.6M6.3 8.7l3.4 1.6" />;

const items: DropdownMenuItem[] = [
  { label: "Edit", value: "edit", icon: EditIcon },
  { label: "Duplicate", value: "duplicate", icon: CopyIcon },
  { separator: true },
  { label: "Archive", value: "archive", icon: ArchiveIcon, disabled: true },
  { label: "Delete", value: "delete", icon: TrashIcon, destructive: true },
];

const submenuItems: DropdownMenuItem[] = [
  { label: "Edit", value: "edit", icon: EditIcon },
  {
    label: "Share",
    value: "share",
    icon: ShareIcon,
    items: [
      { label: "Copy link", value: "copy-link" },
      { label: "Invite by email", value: "invite-email" },
      { separator: true },
      { label: "Share to Slack", value: "share-slack" },
    ],
  },
  { label: "Duplicate", value: "duplicate", icon: CopyIcon },
  { separator: true },
  { label: "Delete", value: "delete", icon: TrashIcon, destructive: true },
];

const sortItems: DropdownMenuItem[] = [
  { label: "Newest first", value: "newest" },
  { label: "Oldest first", value: "oldest" },
  { label: "Name A–Z", value: "az" },
  { label: "Name Z–A", value: "za" },
];

function Caret() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function DropdownDemo() {
  const [last, setLast] = useState<string>("—");
  const [lastSubmenu, setLastSubmenu] = useState<string>("—");
  const [sort, setSort] = useState("newest");

  return (
    <>
      <div className="demo-section">
        <div className="demo-label">Menu — icons, divider, disabled, destructive</div>
        <div className="demo-row">
          <Dropdown
            trigger={
              <button className="ml-btn ml-btn-secondary" type="button">
                Actions <Caret />
              </button>
            }
            items={items}
            onSelect={setLast}
          />
        </div>
        <p style={{ fontSize: 14, color: "var(--ml-text-muted)", marginTop: 8 }}>
          Open with click, <kbd>↓</kbd>, <kbd>Enter</kbd> or <kbd>Space</kbd>; navigate with the
          arrow keys / Home / End / typeahead; <kbd>Esc</kbd> closes and restores focus. Last
          action: <strong>{last}</strong>
        </p>
      </div>

      <div className="demo-section">
        <div className="demo-label">Submenu — triangle safe zone</div>
        <div className="demo-row">
          <Dropdown
            trigger={
              <button className="ml-btn ml-btn-secondary" type="button">
                Actions <Caret />
              </button>
            }
            items={submenuItems}
            onSelect={setLastSubmenu}
          />
        </div>
        <p style={{ fontSize: 14, color: "var(--ml-text-muted)", marginTop: 8 }}>
          Hover <strong>Share</strong> to open its submenu, then move the cursor diagonally down
          toward the submenu panel — passing briefly off the Share row keeps it open instead of
          flickering shut. Moving away (e.g. toward Duplicate) closes it after a short delay.{" "}
          <kbd>→</kbd> / <kbd>Enter</kbd> opens it from the keyboard, <kbd>←</kbd> /{" "}
          <kbd>Esc</kbd> backs out. Last action: <strong>{lastSubmenu}</strong>
        </p>
      </div>

      <div className="demo-section">
        <div className="demo-label">Single-select with checkmark + end alignment</div>
        <div className="demo-row" style={{ justifyContent: "flex-end", maxWidth: 320 }}>
          <Dropdown
            align="end"
            trigger={
              <button className="ml-btn ml-btn-ghost" type="button">
                Sort: {sortItems.find((i) => i.value === sort)?.label} <Caret />
              </button>
            }
            items={sortItems}
            active={sort}
            onSelect={setSort}
          />
        </div>
      </div>
    </>
  );
}
