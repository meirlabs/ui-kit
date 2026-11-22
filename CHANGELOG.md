# Changelog

## Unreleased — RTL support

Right-to-left support for the table stack and the overlays around it. Additive:
no prop removed, and left-to-right rendering is unchanged.

- **`DataTable` / `VirtualDataTable`:** `Column.align` gains `"start"` and
  `"end"`, which follow the reading direction. The default is now `start`
  (`end` for `numeric` columns) instead of `left`/`right` — identical in LTR,
  mirrored under `dir="rtl"`. `left`/`right`/`center` keep working, and
  `left`/`right` stay physical in both directions. Header cells now carry
  `ml-dt-align-start`/`-end` by default (was `-left`/`-right`). `table.css`
  moved to logical properties (`text-align: start|end`,
  `padding-inline-*`, `margin-inline-start`).
- **`PaginationFooter`:** new optional `labels` prop
  (`PaginationFooterLabels`, exported) covering every visible and accessible
  string — `show`, `ofTotal(total, noun)`, `rowsPerPage`, `pagination`,
  `previousPage`, `nextPage`, `pageOf(page, pageCount)`. English defaults are
  unchanged. The size picker uses logical padding/insets, and the
  previous/next chevrons (also on `Pagination`) mirror under `[dir="rtl"]`.
- **`Drawer`:** `side` gains `"start"` and `"end"`, resolved against the `dir`
  prop when passed and otherwise the document's direction; the default is now
  `end` (the right edge in LTR, as before). Anchoring, borders and the slide-in
  direction follow the resolved edge. `left`/`right` are now truly physical —
  previously an RTL document painted a `right` drawer on the left with the
  entrance sliding the wrong way. `data-side` is always the physical edge.
- **`Dropdown`:** `align` follows the trigger's reading direction (`start` is
  its right edge under RTL); item text aligns to the start edge. Fix: a menu
  lined up by its far edge (`align="end"`, or `start` under RTL) is measured
  again once its min-width lands, so it no longer sits off the trigger the
  first time it opens.
- **`useAnchoredPosition`:** `-start`/`-end` on `top`/`bottom` placements follow
  the anchor's reading direction (affects `Tooltip`, `Popover`, `Select`,
  `Combobox`). `left`/`right` sides stay physical.
- **`Select`, `Tooltip`, `Field`, `FilterBar`, `Tag`:** physical
  `text-align: left` / `margin-left` / `margin-right` replaced with their
  logical equivalents (trigger and tooltip text, the required asterisk, the
  toolbar's end cluster, the tag remove button).
- **`DataTable`:** new optional `labels` prop (`DataTableLabels`, exported)
  for the built-in strings — `selectRow(rowNumber)`, `selectAll`,
  `selectColumn` and `empty`. English defaults are unchanged.
  `VirtualDataTable` takes the same prop for its one string (`empty`).
- **`Drawer`:** new optional `closeLabel` prop for the close button's
  accessible name (default `"Close"`).
- **`Dropdown`:** fix — the first time a menu opened, keyboard focus stayed on
  the trigger (the menu was still hidden while it was being measured), so
  Escape and the arrow keys did nothing until the second open. Focus now moves
  in once the menu is placed.
- **`Dropdown`:** fix — the menu's width floor is now the larger of its
  default minimum (180px) and the trigger's width. The trigger's width used
  to be written as an inline `min-width`, which overrode the default and left
  a menu under a narrow trigger (an icon or avatar button) only as wide as its
  labels. The width now reaches the stylesheet as
  `--ml-dropdown-trigger-width`. Visible in LTR too: menus under narrow
  triggers get wider.
- **`Textarea`:** fix — an `autoResize` field inside a `Field` still showed
  the browser's drag-resize handle, because `Field`'s rule for a bare
  `<textarea>` out-ranked the `autoResize` modifier. It now has no handle
  inside or outside a `Field`.
- **`TopBar`:** the trailing slot is pushed with `margin-inline-start`, so it
  sits at the end edge under `dir="rtl"` (unchanged in LTR). The `left` /
  `right` prop names stay; they mean start / end.
- **Tests:** new `TopBar.test.tsx`; `Dropdown.test.tsx` and
  `Textarea.test.tsx` gained menu-width and resize-handle coverage.
- **Tests:** new `Drawer.test.tsx` and `useAnchoredPosition.test.ts`;
  `DataTable.test.tsx`, `VirtualDataTable.test.tsx`,
  `PaginationFooter.test.tsx` and `Dropdown.test.tsx` gained alignment,
  `labels`, direction and first-open focus coverage.

## 0.3.0

Lands the "mailgail" owner standards (chat composer + table anatomy) as kit
defaults — additive props/components only, no existing public API broken.

- **New component `Composer`:** the chat-composer pattern — an auto-growing
  `Textarea` with an icon-only send button living INSIDE the field
  (bottom-right in `ltr`, bottom-left in `rtl` via the `dir` prop). Enter
  sends (Shift+Enter or IME composition inserts a newline instead);
  `disabled`/`loading` states; accessible labels throughout; light + dark.
- **New component `FilterBar`:** the "top-right search + Filters button"
  table toolbar — a search `Input` (optionally `collapsible`, mailgail's
  icon-trigger-that-expands pattern), a `Filters`/`Filters (N)` button, extra
  left/right slots, and an active-filter chip row. Drop it into `DataTable`'s
  new `toolbar` slot.
- **New component `PaginationFooter`:** the mailgail table-footer
  convention — `"Show N ▾ results (X total)"` on the left (page-size
  `<select>` + noun/nounPlural copy), `"Page x of y"` chevrons on the right,
  deliberately no numbered page buttons. Drop it into `DataTable`'s `footer`
  slot.
- **`DataTable`:** new optional `toolbar` prop — a slot rendered above the
  table (bordered, matches the header band) for a `FilterBar` or any other
  toolbar content. Purely additive; omitting it renders exactly as before.
- **`Textarea`:** `autoResize` fields now force `resize: none` (new
  `.ml-textarea--autoresize` class) — a manual drag handle previously fought
  the imperative auto-grow and left a resize handle in the corner, which
  contradicted the "never mouse-resizable" rule everywhere `autoResize` was
  already used (e.g. chat composers). Non-`autoResize` textareas are
  unaffected and keep `resize: vertical`.
- **Tests:** `Composer.test.tsx`, `FilterBar.test.tsx`,
  `PaginationFooter.test.tsx`, `Textarea.test.tsx` (new — `Textarea` had no
  test file before); `DataTable.test.tsx` gained toolbar-slot coverage.

## Unreleased

Major upgrade: ~20 new components, 3 new hooks, and a full rewrite of every
existing component's interaction states, keyboard model, and motion.

- **Build:** `dist/index.js` is now banner-marked `"use client"` — the kit uses
  context/hooks at module scope, so React Server Components can render kit
  components but crashed importing the unmarked bundle
  (`createContext is not a function`).

- **New components:** `Input`, `Textarea`, `Checkbox`, `Radio`/`RadioGroup`,
  `Select` (+ `.Trigger`/`.Content`/`.Item`/`.Group`), `Combobox`, `Tooltip`,
  `Popover` (+ `.Trigger`/`.Content`), `Toaster`/`ToastProvider`, `Skeleton`/
  `SkeletonText`, `Spinner`, `Progress`, `Callout`, `DataTable` (React
  component, on top of the existing `.ml-dt-*` classes), `Drawer`,
  `CommandPalette`, `Kbd`, `Accordion`/`Accordion.Item`, `Stepper`,
  `Breadcrumbs`, `FileUpload`.
- **New hooks:** `useAnchoredPosition` (flip/clamp anchored positioning for
  Tooltip/Popover/Select/Combobox/Dropdown), `useFocusTrap` (Tab/Shift+Tab
  trapping for overlays), `useScrollLock` (ref-counted body scroll lock),
  `useToast` (toast queue API, paired with `ToastProvider`).
- **Rewrote every existing component** (`Button`, `Badge`, `Avatar`, `Card`,
  `Modal`, `Dropdown`, `Tabs`, `Toggle`, `SegmentedControl`, `Pagination`,
  `Sidebar`, `Shell`, `TopBar`, `PageHeader`, `Field`, `Wizard`, `DangerZone`,
  `DetailList`, `EmptyState`, `StatCard`, `Banner`, `Divider`, `Grid`,
  `Section`, `ChipRow`, `MetricValue`, `StatusPill`, `Tag`) with full
  interaction states and, where applicable, a11y keyboard models (roving
  tabindex on `Tabs`, arrow-key navigation, focus trapping and scroll locking
  on overlays, `aria-invalid`/`aria-describedby` wiring via `Field`).
- **Design tokens (`tokens.css`):**
  - Add a coordinated z-index scale (`--ml-z-dropdown` through `--ml-z-command`,
    1000–1700) — every overlay stylesheet now references these instead of
    numeric literals.
  - Add theme-independent motion tokens (`--ml-duration-*`, `--ml-ease-*`,
    `--ml-stagger*`, `--ml-press-scale`) calibrated to the design system's
    motion foundation; components consume them instead of ad-hoc durations.
  - Add layered elevation stacks for `--ml-shadow-card`/`-elevated`/`-modal`
    (1→3→6→12→24→48 doubling, with a preserved dark-mode inset top-ring /
    light-mode hairline perimeter) as the single sanctioned shadow source.
  - Add `--ml-neutral-fill`/`--ml-neutral-text` (neutral pill/badge helpers)
    and `--ml-overlay` (modal/drawer/dialog scrim).
  - **Monochrome neutralization:** `--ml-color-primary`/`--ml-color-purple`
    (and `-muted` variants) now resolve to neutral text/surface tokens instead
    of blue/purple, so nothing accents by accident. Kept defined for
    `compat.css` and legacy consumers; functional status colors are
    unchanged. `--ml-shadow-glow` neutralized the same way.
- **Accessibility:** keyboard models across `Tabs`, `Accordion`, `Select`,
  `Combobox`, `Radio`/`RadioGroup`, `CommandPalette`, and menu/listbox
  overlays; focus trapping + return-focus and body scroll locking on
  `Modal`/`Drawer`/`CommandPalette`; `aria-invalid`/`aria-describedby`/
  `aria-required` wiring via `Field`; visually-hidden accessible labels on
  `Spinner`/toasts.
- **Motion:** `prefers-reduced-motion` guards added across every animated
  component (accordion, choice controls, combobox, command palette, data
  display, drawer, file upload, navigation, overlays, popover, progress,
  select, skeleton, spinner, stepper, table, tags, toast, tooltip).

## 0.1.1

- Document light theme token values in README and AGENTS.
- Point repository/homepage/bugs URLs at github.com/meirlabs/ui-kit.

## 0.1.0

- Initial release
- Table system (`.ml-dt-*` CSS classes)
- Pagination hook and component
- StatusPill, Tag, ChipRow, MetricValue components
- Light and dark theme design tokens (`--ml-*` CSS custom properties)
- Compat layer for migration from `.tt-*` class names
