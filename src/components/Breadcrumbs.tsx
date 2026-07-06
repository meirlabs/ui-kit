import {
  type ComponentPropsWithoutRef,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "../utils/cn";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface BreadcrumbsProps
  extends Omit<ComponentPropsWithoutRef<"nav">, "onClick"> {
  items: BreadcrumbItem[];
  /**
   * Collapse the middle of the trail into a `…` menu once the number of items
   * exceeds this. The first and the last items are always visible.
   */
  maxItems?: number;
  /** Separator between items — default a 1.5px chevron (not a decorative glyph). */
  separator?: ReactNode;
}

function DefaultSeparator() {
  return (
    <svg
      className="ml-bc-sep"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 3l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface CrumbLinkProps {
  item: BreadcrumbItem;
  current?: boolean;
}

function CrumbLink({ item, current }: CrumbLinkProps) {
  if (current) {
    return (
      <span className="ml-bc-item ml-bc-current" aria-current="page" title={item.label}>
        {item.label}
      </span>
    );
  }
  if (item.href) {
    return (
      <a className="ml-bc-item ml-bc-link" href={item.href} onClick={item.onClick} title={item.label}>
        {item.label}
      </a>
    );
  }
  return (
    <button type="button" className="ml-bc-item ml-bc-link" onClick={item.onClick} title={item.label}>
      {item.label}
    </button>
  );
}

interface CollapseMenuProps {
  items: BreadcrumbItem[];
}

function CollapseMenu({ items }: CollapseMenuProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<Array<HTMLAnchorElement | HTMLButtonElement | null>>([]);

  const close = (returnFocus = true) => {
    setOpen(false);
    setActiveIndex(-1);
    if (returnFocus) btnRef.current?.focus();
  };
  const openAt = (index: number) => {
    setOpen(true);
    setActiveIndex(index);
  };

  useEffect(() => {
    if (!open) return;
    function handlePointer(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    }
    document.addEventListener("mousedown", handlePointer);
    return () => document.removeEventListener("mousedown", handlePointer);
  }, [open]);

  // Move DOM focus to the active menu item (roving focus, APG menu pattern).
  useEffect(() => {
    if (open && activeIndex >= 0) itemRefs.current[activeIndex]?.focus();
  }, [open, activeIndex]);

  function onTriggerKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openAt(0);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      openAt(items.length - 1);
    }
  }

  function onMenuKeyDown(e: React.KeyboardEvent) {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % items.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => (i - 1 + items.length) % items.length);
        break;
      case "Home":
        e.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        e.preventDefault();
        setActiveIndex(items.length - 1);
        break;
      case "Escape":
        e.preventDefault();
        close();
        break;
      case "Tab":
        close(false);
        break;
    }
  }

  return (
    <div className="ml-bc-collapse" ref={ref}>
      <button
        ref={btnRef}
        type="button"
        className="ml-bc-item ml-bc-link ml-bc-ellipsis"
        aria-label="Show collapsed breadcrumbs"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => (open ? close(false) : openAt(0))}
        onKeyDown={onTriggerKeyDown}
      >
        …
      </button>
      {open && (
        <div className="ml-bc-menu" role="menu" onKeyDown={onMenuKeyDown}>
          {items.map((item, i) =>
            item.href ? (
              <a
                key={i}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                role="menuitem"
                tabIndex={i === activeIndex ? 0 : -1}
                className="ml-bc-menu-item"
                href={item.href}
                onClick={() => {
                  item.onClick?.();
                  close();
                }}
              >
                {item.label}
              </a>
            ) : (
              <button
                key={i}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                type="button"
                role="menuitem"
                tabIndex={i === activeIndex ? 0 : -1}
                className="ml-bc-menu-item"
                onClick={() => {
                  item.onClick?.();
                  close();
                }}
              >
                {item.label}
              </button>
            ),
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Breadcrumbs — a `<nav aria-label="Breadcrumb"><ol>` trail. Monochrome and
 * muted, with the current (last) item in `--ml-text`, marked `aria-current="page"`
 * and non-interactive. Long labels truncate with ellipsis; links get a
 * `:focus-visible` ring. When `maxItems` is exceeded the middle collapses into a
 * `…` menu (Escape/click-away close). The default separator is a 1.5px chevron.
 */
export function Breadcrumbs({
  items,
  maxItems,
  separator,
  className,
  ...rest
}: BreadcrumbsProps) {
  const sep = separator ?? <DefaultSeparator />;

  // Build the visible sequence of nodes (items or a single collapse menu).
  type Rendered =
    | { kind: "item"; item: BreadcrumbItem; current: boolean }
    | { kind: "collapse"; items: BreadcrumbItem[] };

  let rendered: Rendered[];
  const shouldCollapse = maxItems != null && maxItems >= 2 && items.length > maxItems;

  if (shouldCollapse) {
    const tail = Math.max(1, maxItems - 2);
    const head = items.slice(0, 1);
    const collapsed = items.slice(1, items.length - tail);
    const end = items.slice(items.length - tail);
    rendered = [
      ...head.map((item) => ({
        kind: "item" as const,
        item,
        current: false,
      })),
      { kind: "collapse" as const, items: collapsed },
      ...end.map((item, i) => ({
        kind: "item" as const,
        item,
        current: i === end.length - 1,
      })),
    ];
  } else {
    rendered = items.map((item, i) => ({
      kind: "item" as const,
      item,
      current: i === items.length - 1,
    }));
  }

  return (
    <nav aria-label="Breadcrumb" className={cn("ml-bc", className)} {...rest}>
      <ol className="ml-bc-list">
        {rendered.map((node, i) => (
          <li key={i} className="ml-bc-li">
            {i > 0 && (
              <span className="ml-bc-sep-wrap" aria-hidden="true">
                {sep}
              </span>
            )}
            {node.kind === "collapse" ? (
              <CollapseMenu items={node.items} />
            ) : (
              <CrumbLink item={node.item} current={node.current} />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
