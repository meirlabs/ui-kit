import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { Command, defaultFilter } from "cmdk";
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

/**
 * CommandPalette — a Cmd/Ctrl+K launcher. The kit owns the shell (portal,
 * backdrop, focus trap, scroll lock, `--ml-z-command` tier, open/close motion);
 * cmdk's bare `<Command>` owns filtering (fuzzy `command-score` ranking over
 * `label` + `keywords`), arrow-key navigation, and selection semantics.
 * Escape closes, focus returns on close.
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
  const inputRef = useRef<HTMLInputElement>(null);

  const { mounted, visible } = usePresence(open, EXIT_MS);
  // Activate the trap only once the portal is mounted — opening from closed
  // takes one render for `mounted` to flip, and the trap needs a live node.
  const containerRef = useFocusTrap<HTMLDivElement>(open && mounted, { initialFocus: inputRef });
  useScrollLock(open);

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

  // Reset the search whenever the palette opens (it may reopen mid-exit,
  // before the previous instance unmounts).
  useEffect(() => {
    if (open) setQuery("");
  }, [open]);

  // Items are keyed into cmdk by `id` (stable + unique), but scoring should
  // run against the human-readable label, so swap it in before delegating to
  // cmdk's default `command-score` filter. `keywords` pass through untouched.
  const labelById = useMemo(() => {
    const map = new Map<string, string>();
    for (const item of items) map.set(item.id, item.label);
    return map;
  }, [items]);

  const filter = useCallback(
    (value: string, search: string, keywords?: string[]) =>
      defaultFilter(labelById.get(value) ?? value, search, keywords),
    [labelById],
  );

  // Preserve group order of first appearance. cmdk handles per-query
  // filtering/hiding, so grouping only depends on `items`.
  const groups = useMemo(() => {
    const order: string[] = [];
    const map = new Map<string, CommandItem[]>();
    for (const item of items) {
      const key = item.group ?? "";
      if (!map.has(key)) {
        map.set(key, []);
        order.push(key);
      }
      map.get(key)!.push(item);
    }
    return order.map((key) => ({ key, items: map.get(key)! }));
  }, [items]);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault();
      onOpenChange(false);
    }
  }

  if (!mounted || typeof document === "undefined") return null;

  const state = visible ? "open" : "closed";

  const renderItem = (item: CommandItem) => (
    <Command.Item
      key={item.id}
      value={item.id}
      keywords={item.keywords}
      className="ml-command-item"
      onSelect={() => {
        item.onSelect();
        onOpenChange(false);
      }}
    >
      {item.icon != null && <span className="ml-command-item-icon">{item.icon}</span>}
      <span className="ml-command-item-label">{item.label}</span>
      {item.shortcut && <Kbd keys={item.shortcut} />}
    </Command.Item>
  );

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
        <Command label="Command palette" loop filter={filter}>
          <div className="ml-command-search">
            <svg
              className="ml-command-search-icon"
              viewBox="0 0 18 18"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M12 12L15.5 15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <Command.Input
              ref={inputRef}
              className="ml-command-input"
              placeholder={placeholder}
              value={query}
              onValueChange={setQuery}
            />
          </div>

          <Command.List className="ml-command-list">
            <Command.Empty className="ml-command-empty">
              {emptyState ?? "No results found."}
            </Command.Empty>
            {groups.map((group) =>
              group.key ? (
                <Command.Group key={group.key} heading={group.key} className="ml-command-group">
                  {group.items.map(renderItem)}
                </Command.Group>
              ) : (
                group.items.map(renderItem)
              ),
            )}
          </Command.List>
        </Command>
      </div>
    </div>,
    document.body,
  );
}
