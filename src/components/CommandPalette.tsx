import {
  type ReactNode,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "../utils/cn";
import { useFocusTrap } from "../hooks/useFocusTrap";
import { useScrollLock } from "../hooks/useScrollLock";
import { Kbd } from "./Kbd";

export interface CommandItem {
  id: string;
  label: string;
  /** Optional group heading — items sharing a `group` render together. */
  group?: string;
  icon?: ReactNode;
  /** Extra terms matched by the filter beyond `label`. */
  keywords?: string[];
  /** Keys for the trailing Kbd hint, e.g. `["mod", "K"]`. */
  shortcut?: string[];
  onSelect: () => void;
}

export interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CommandItem[];
  placeholder?: string;
  emptyState?: ReactNode;
  /** Register a global Cmd/Ctrl+K toggle. Default true. */
  enableShortcut?: boolean;
  className?: string;
}

const EXIT_MS = 200;

function usePresence(open: boolean, duration: number) {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (open) {
      setMounted(true);
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf);
    }
    setVisible(false);
    const t = setTimeout(() => setMounted(false), duration);
    return () => clearTimeout(t);
  }, [open, duration]);
  return { mounted, visible };
}

function matches(item: CommandItem, query: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  if (item.label.toLowerCase().includes(q)) return true;
  return (item.keywords ?? []).some((k) => k.toLowerCase().includes(q));
}

/**
 * CommandPalette — a Cmd/Ctrl+K launcher. Renders a portal dialog with an inner
 * combobox/listbox: a filtered, grouped result list navigated with Arrow keys
 * (highlighted active row), Enter to select, Escape to close. Focus-trapped,
 * scroll-locked, returns focus on close. Highest overlay tier (`--ml-z-command`).
 */
export function CommandPalette({
  open,
  onOpenChange,
  items,
  placeholder = "Type a command or search…",
  emptyState,
  enableShortcut = true,
  className,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<Array<HTMLDivElement | null>>([]);

  const { mounted, visible } = usePresence(open, EXIT_MS);
  const containerRef = useFocusTrap<HTMLDivElement>(open, { initialFocus: inputRef });
  useScrollLock(open);

  const baseId = useId();
  const listboxId = `${baseId}-listbox`;
  const optionId = (i: number) => `${baseId}-opt-${i}`;

  // Global Cmd/Ctrl+K toggle.
  useEffect(() => {
    if (!enableShortcut || typeof document === "undefined") return;
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [enableShortcut, open, onOpenChange]);

  // Reset transient state whenever the palette opens.
  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
    }
  }, [open]);

  const filtered = useMemo(() => items.filter((it) => matches(it, query)), [items, query]);

  // Preserve group order of first appearance.
  const groups = useMemo(() => {
    const order: string[] = [];
    const map = new Map<string, Array<{ item: CommandItem; flatIndex: number }>>();
    filtered.forEach((item, flatIndex) => {
      const key = item.group ?? "";
      if (!map.has(key)) {
        map.set(key, []);
        order.push(key);
      }
      map.get(key)!.push({ item, flatIndex });
    });
    return order.map((key) => ({ key, entries: map.get(key)! }));
  }, [filtered]);

  // Clamp active row and scroll it into view.
  useEffect(() => {
    if (activeIndex > filtered.length - 1) {
      setActiveIndex(filtered.length > 0 ? filtered.length - 1 : 0);
    }
  }, [filtered.length, activeIndex]);

  useEffect(() => {
    optionRefs.current[activeIndex]?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  function select(index: number) {
    const item = filtered[index];
    if (!item) return;
    item.onSelect();
    onOpenChange(false);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => (filtered.length ? (i + 1) % filtered.length : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => (filtered.length ? (i - 1 + filtered.length) % filtered.length : 0));
        break;
      case "Home":
        e.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        e.preventDefault();
        setActiveIndex(Math.max(0, filtered.length - 1));
        break;
      case "Enter":
        e.preventDefault();
        select(activeIndex);
        break;
      case "Escape":
        e.preventDefault();
        onOpenChange(false);
        break;
    }
  }

  if (!mounted || typeof document === "undefined") return null;

  const state = visible ? "open" : "closed";

  return createPortal(
    <div
      className="ml-overlay ml-command-overlay"
      data-state={state}
      onClick={(e) => {
        if (e.target === e.currentTarget) onOpenChange(false);
      }}
    >
      <div
        ref={containerRef}
        className={cn("ml-command", className)}
        data-state={state}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        tabIndex={-1}
        onKeyDown={onKeyDown}
      >
        <div className="ml-command-search">
          <svg
            className="ml-command-search-icon"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M12 12L15.5 15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            className="ml-command-input"
            role="combobox"
            aria-expanded="true"
            aria-controls={listboxId}
            aria-activedescendant={filtered.length ? optionId(activeIndex) : undefined}
            aria-autocomplete="list"
            placeholder={placeholder}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
          />
        </div>

        <div ref={listRef} id={listboxId} role="listbox" className="ml-command-list">
          {filtered.length === 0 ? (
            <div className="ml-command-empty" role="presentation">
              {emptyState ?? "No results found."}
            </div>
          ) : (
            groups.map((group) => (
              <div key={group.key || "_"} className="ml-command-group" role="group">
                {group.key && <div className="ml-command-group-label">{group.key}</div>}
                {group.entries.map(({ item, flatIndex }) => {
                  const isActive = flatIndex === activeIndex;
                  return (
                    <div
                      key={item.id}
                      ref={(el) => {
                        optionRefs.current[flatIndex] = el;
                      }}
                      id={optionId(flatIndex)}
                      role="option"
                      aria-selected={isActive}
                      className={cn("ml-command-item", isActive && "is-active")}
                      onMouseMove={() => setActiveIndex(flatIndex)}
                      onClick={() => select(flatIndex)}
                    >
                      {item.icon != null && <span className="ml-command-item-icon">{item.icon}</span>}
                      <span className="ml-command-item-label">{item.label}</span>
                      {item.shortcut && <Kbd keys={item.shortcut} />}
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
