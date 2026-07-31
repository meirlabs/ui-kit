import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { cn } from "../utils/cn";
import { Button } from "./Button";
import { Input } from "./Input";

/* ────────────────────────────────────────────────────────────────────────────
   FilterBar — the "top-right search + Filters button" toolbar that sits above
   a table. Left slot for extra controls (e.g. a segmented Toggle), a right
   cluster (search, then "Filters"/"Filters (N)", then any extra actions), and
   an optional active-filter chip row underneath. The search field can render
   always-visible (default) or `collapsible` — an icon trigger that expands on
   click and collapses back on blur only while empty, so a live query never
   vanishes under the reader.
   ──────────────────────────────────────────────────────────────────────────── */

export interface FilterBarProps
  extends Omit<ComponentPropsWithoutRef<"div">, "children" | "onChange"> {
  /** Current search text (controlled). */
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  /** Accessible label for the search field / its collapsed trigger. Default "Search". */
  searchLabel?: string;
  /** Icon shown in the search field and the collapsed trigger. Default a magnifier. */
  searchIcon?: ReactNode;
  /**
   * Collapse the search into an icon-only trigger until clicked. Collapses
   * back on blur only when the query is empty. Default false (always visible).
   */
  collapsible?: boolean;
  /** Fixed width of the expanded search field, in px. Default 260. */
  searchWidth?: number;
  /** Renders the "Filters" / "Filters (N)" button. Omit to hide it entirely. */
  onFiltersClick?: () => void;
  /** Count shown in the Filters button label once greater than 0. */
  filterCount?: number;
  /** Label for the Filters button. Default "Filters". */
  filtersLabel?: string;
  /** Icon for the Filters button. Default a funnel. */
  filtersIcon?: ReactNode;
  /** Extra left-side controls, e.g. a segmented `Toggle`. */
  children?: ReactNode;
  /** Extra right-side controls, rendered after the Filters button. */
  actions?: ReactNode;
  /** Active-filter chip row, rendered on its own line below the toolbar. */
  activeFilters?: ReactNode;
  className?: string;
}

const DefaultSearchIcon = (
  <svg viewBox="0 0 16 16" fill="none" width="16" height="16" aria-hidden="true">
    <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.4" />
    <path
      d="M13.5 13.5 10.5 10.5"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  </svg>
);

const DefaultFiltersIcon = (
  <svg viewBox="0 0 16 16" fill="none" width="14" height="14" aria-hidden="true">
    <path
      d="M2 3h12l-4.5 5.5v4l-3 1.5v-5.5L2 3Z"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  </svg>
);

export const FilterBar = forwardRef<HTMLDivElement, FilterBarProps>(function FilterBar(
  {
    searchValue,
    onSearchChange,
    searchPlaceholder = "Search",
    searchLabel = "Search",
    searchIcon = DefaultSearchIcon,
    collapsible = false,
    searchWidth = 260,
    onFiltersClick,
    filterCount = 0,
    filtersLabel = "Filters",
    filtersIcon = DefaultFiltersIcon,
    children,
    actions,
    activeFilters,
    className,
    ...rest
  },
  ref,
) {
  const [open, setOpen] = useState(!collapsible || searchValue.length > 0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // A query typed while open must never vanish even if a caller-driven
  // re-render happens with `collapsible` toggled or on programmatic set.
  useEffect(() => {
    if (searchValue.length > 0) setOpen(true);
  }, [searchValue]);

  const openSearch = useCallback(() => {
    setOpen(true);
    requestAnimationFrame(() => inputRef.current?.focus());
  }, []);

  const handleBlur = useCallback(() => {
    if (collapsible && searchValue.trim().length === 0) setOpen(false);
  }, [collapsible, searchValue]);

  const showCollapsedTrigger = collapsible && !open;

  return (
    <div ref={ref} className={cn("ml-filterbar-wrap", className)} {...rest}>
      <div className="ml-filterbar">
        {children != null && <div className="ml-filterbar-left">{children}</div>}
        <div className="ml-filterbar-right">
          {showCollapsedTrigger ? (
            <Button
              type="button"
              variant="icon"
              size="sm"
              aria-label={searchLabel}
              onClick={openSearch}
            >
              {searchIcon}
            </Button>
          ) : (
            <Input
              ref={inputRef}
              size="sm"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              onBlur={handleBlur}
              placeholder={searchPlaceholder}
              aria-label={searchLabel}
              leftIcon={searchIcon}
              style={{ width: searchWidth }}
              className="ml-filterbar-search"
            />
          )}
          {onFiltersClick != null && (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              leftIcon={filtersIcon}
              onClick={onFiltersClick}
            >
              {filterCount > 0 ? `${filtersLabel} (${filterCount})` : filtersLabel}
            </Button>
          )}
          {actions}
        </div>
      </div>
      {activeFilters != null && <div className="ml-filterbar-chips">{activeFilters}</div>}
    </div>
  );
});
