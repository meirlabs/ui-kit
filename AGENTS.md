# @meir-labs/ui-kit -- Agent Reference

## Package

- **Name:** @meir-labs/ui-kit
- **Version:** 0.3.0
- **Location:** ~/Documents/business/meirlabs/product/ui-kit/
- **Purpose:** Themeable presentational component library for React (light & dark)
- **Install:** `pnpm add @meir-labs/ui-kit` or `"@meir-labs/ui-kit": "file:../meirlabs/ui-kit"` for local dev
- **CSS:** `import "@meir-labs/ui-kit/styles.css"` in root layout
- **Theme:** Add `data-meirlabs-theme="light"` or `="dark"` to a wrapper element (typically `<html>`)
- **Next.js:** Add `transpilePackages: ["@meir-labs/ui-kit"]` to next.config

## Exports

Full list mirrors `src/index.ts`, grouped the same way. Every component also
exports its props type (`XProps`) and any tone/variant/size unions it uses;
those aren't repeated line-by-line below except where the shape isn't obvious
from the name.

```ts
// Utils
cn(...inputs: ClassValue[]): string
// Merges class names using clsx + tailwind-merge

// Hooks
usePagination<T>(items: T[], pageSize?: number): {
  page: T[]; pageIndex: number; pageCount: number; setPage: (index: number) => void; reset: () => void;
}
// Default pageSize: 12

useFocusTrap<T extends HTMLElement>(active: boolean, options?: UseFocusTrapOptions): RefObject<T | null>
// UseFocusTrapOptions: { initialFocus?: RefObject<HTMLElement | null>; returnFocus?: boolean (default true) }
// Traps Tab/Shift+Tab inside the returned ref's element while active; autofocuses on activate, restores focus on deactivate. SSR-safe.

useScrollLock(active: boolean): void
// Ref-counted document.body scroll lock (adds scrollbar-width padding so nothing reflows). Nested overlays share one lock.

useAnchoredPosition(anchorRef, floatingRef, options: UseAnchoredPositionOptions): UseAnchoredPositionResult
// UseAnchoredPositionOptions: { open: boolean; placement?: AnchoredPlacement; offset?: number (6); flip?: boolean; matchWidth?: boolean; padding?: number (8) }
// UseAnchoredPositionResult: { floatingStyle: CSSProperties; placement: AnchoredPlacement; update: () => void }
// AnchoredPlacement: "top" | "bottom" | "left" | "right" | "<side>-start" | "<side>-end"
// Powers Tooltip / Popover / Select / Combobox / Dropdown. Flips to the opposite side and clamps the cross axis to stay on-screen.

// Components — basics
Button(props: ButtonProps): JSX.Element
// variant: "primary" | "secondary" | "ghost" | "danger" | "icon" (default primary — charcoal btn-dark surface)
// size: "sm" | "md" | "lg"; loading?: boolean (reserves width, never collapses); leftIcon?/rightIcon?: ReactNode
// as?: "button" | "a"; href?: string (renders <a role="button">)

Badge(props: BadgeProps): JSX.Element
// tone?: "neutral" | "success" | "warning" | "danger" (default neutral/gray); size?: "sm" | "md"; dot?: boolean; icon?: ReactNode

Avatar(props: AvatarProps): JSX.Element
// src?/alt?/fallback?: string; size?: "xs"|"sm"|"md"|"lg"; status?: "online"|"offline"|"away"|"busy"
// interactive?: boolean (focusable button wrapper); round?: boolean (default true; false = 8px-radius square)

Label(props: LabelProps): JSX.Element
// { size?: "sm" | "md"; tone?: "muted" | "default" } & span props

Divider(props): JSX.Element
// variant?: "solid" | "dashed" | "decorative"(deprecated) | "diamond"(deprecated); orientation?: "horizontal" | "vertical"

EditableDocument(props: EditableDocumentProps): JSX.Element
parseDocFields(source: string): DocFieldDef[]
// EditableDocumentProps: { source: string; values: Record<string,string>; onChange: (name, value) => void; className? }
// Prose with {{key|label}} blanks becomes contentEditable islands (empty/filled/focused states); parseDocFields discovers the fields in order.

Placeholder(props: { subject: PlaceholderSubject } & div props): JSX.Element
// PlaceholderSubject: "clients" | "documents" | "search" | "calendar"
// Decorative (aria-hidden), token-driven, deterministic SVG "nothing here yet" scene. Pair with EmptyState for copy.

Banner(props: BannerProps): JSX.Element
// tone?: "info"|"success"|"warning"|"danger"|"error"; icon?; title?; description? (children used if description omitted); onDismiss?: () => void

StatusPill(props: StatusPillProps): JSX.Element
// tone?: StatusPillTone (default neutral/gray); dot?: boolean; icon?: ReactNode

Tag(props: TagProps): JSX.Element
// tone?: TagTone (default neutral); size?: "sm"|"md"; onRemove?: () => void (renders trailing × button); removeLabel?: string

ChipRow(props: ChipRowProps): JSX.Element
// gap?: "sm" | "md" (default sm) — flex container for Tag elements

MetricValue(props: MetricValueProps): JSX.Element
// value: number; formatter?: (value) => string; delta?: number; deltaDirection?: "up"|"down"|"auto"; deltaFormatter?: (value) => string
// Applies .ml-metric-positive when value > 0, .ml-metric-negative when value < 0
// animated?: boolean — NumberFlow (@number-flow/react) transitions; respects prefers-reduced-motion by default;
// format via Intl.NumberFormatOptions; force dir="ltr" containers on Hebrew pages. Never hand-roll a rAF counter,
// and no decorative mount-time count-ups on static marketing numbers.
MetricGroup(props: MetricGroupProps): JSX.Element
// Syncs the animation timing of several animated MetricValues so a metric row ticks as one.

Accordion(props: AccordionProps) / AccordionItem(props: AccordionItemProps): JSX.Element
// type?: "single" (value/defaultValue: string) | "multiple" (value/defaultValue: string[]); onValueChange
// AccordionItemProps: { value: string; title: ReactNode; disabled?: boolean } & div props

// Layout
Shell / ShellSidebarProps / ShellMainProps — thin div/aside/main wrappers for the app-shell grid (no extra props)
Sidebar(props: SidebarProps) / SidebarItem(props: SidebarItemProps): JSX.Element
// SidebarProps: { collapsed?: boolean } & nav props (64px icon-only rail when true)
// SidebarItemProps: { active?: boolean; icon?: ReactNode } & button props

TopBar(props: TopBarProps): JSX.Element
// { left?: ReactNode; center?: ReactNode; right?: ReactNode } & header props

PageHeader(props: PageHeaderProps): JSX.Element
// { title: ReactNode; subtitle?; breadcrumb?; actions?; backHref?: string; onBack?: () => void; backLabel?: string } & div props

Card(props: CardProps): JSX.Element
// as?: ElementType (use "button"/"a" for clickable cards); interactive?: boolean; padding?: "compact" | "default"

Grid(props: GridProps): JSX.Element
// columns?: number | "auto" (default); minColWidth?: number (default 180); gap?: "sm"|"md"|"lg" (default md)

Section(props: SectionProps): JSX.Element
// { title?: ReactNode } & section props

DetailList(props: DetailListProps): JSX.Element
// items: { label; value; fullWidth?; onCopy?; copyValue? }[]; columns?: 1 | 2 (default 2, stacks under 480px)

DangerZone(props: DangerZoneProps) / DangerZoneItem(props: DangerZoneItemProps): JSX.Element
// DangerZoneItemProps: { title: ReactNode; description?; actionLabel? (default "Delete"); onConfirm?: () => void; disabled?; loading?; action?: ReactNode }
// Doesn't own a confirm modal — wire your own confirm flow via onConfirm.

// Navigation
Tabs(props: TabsProps) / TabsPanel(props: TabsPanelProps): JSX.Element
// TabsProps: { tabs: TabItem[]; value: string; onChange: (value) => void; "aria-label": string } & div props (required aria-label)
// TabItem: { value; label; icon?; disabled? }; roving-tabindex keyboard model

Toggle(props: ToggleProps): JSX.Element
// { options: ToggleOption[]; active: string; onChange: (value) => void } & div props — role="radiogroup"

SegmentedControl(props: SegmentedControlProps): JSX.Element
// { options: SegmentedControlOption[]; value: string; onChange: (value) => void; "aria-label": string } & div props
// View switcher for 2–3 sibling views: bordered track + sliding thumb (transform-only), role="tablist".
// Use Toggle (role="radiogroup") to pick a VALUE; SegmentedControl to switch VIEWS. >3 options → Dropdown / chip rail.

Pagination(props: PaginationProps): JSX.Element | null
getPaginationRange(...) / PAGINATION_DOTS
// { pageIndex; pageCount; onPage; siblingCount?: number (1); showEdges?: boolean; pageSize?: number; pageSizeOptions?: number[]; onPageSizeChange?: (size) => void } & nav props
// Returns null when pageCount <= 1

PaginationFooter(props: PaginationFooterProps): JSX.Element
// { pageIndex; pageCount; onPage; total: number; pageSize: number; onPageSizeChange?: (size) => void; pageSizeOptions?: number[] ([10,25,50,100]); noun?: string ("row"); nounPlural?: string (`${noun}s`) } & div props
// The mailgail table-footer pattern: "Show N ▾ results (X total)" left, "Page x of y" chevrons right — no numbered page buttons. Drop into DataTable's `footer` slot. `onPageSizeChange` omitted → the size <select> renders disabled (space reserved, not hidden).

Breadcrumbs(props: BreadcrumbsProps): JSX.Element
// { items: BreadcrumbItem[]; maxItems?: number; separator?: ReactNode } & nav props
// BreadcrumbItem: { label; href?; onClick? }. Collapses the middle into a "…" menu past maxItems; first/last always visible.

Stepper(props: StepperProps): JSX.Element
// { steps: StepperStep[]; activeStep?: number; orientation?: "horizontal" | "vertical" } & ol props
// StepperStep: { label; description?; status?: "complete"|"current"|"upcoming" }

// Data Display
DataTable<Row>(props: DataTableProps<Row>): JSX.Element
// columns: Column<Row>[] — { id; header; accessor?: ((row) => ReactNode) | keyof Row; sortable?; align?: "left"|"right"|"center"; width?; numeric?; sortFn? }
// data: Row[]; getRowId?; sortState?/onSortChange? (controlled) or defaultSort? (uncontrolled); manualSort?
// selectable?: "single"|"multiple"; selectedIds?/onSelectionChange?/defaultSelectedIds?
// stickyHeader?; compact?; loading?; loadingRowCount? (5); error?; emptyState?; onRowClick?; caption?; "aria-label"?; footer?: ReactNode; toolbar?: ReactNode
// footer: drop a <Pagination>/<PaginationFooter> or summary below the body. toolbar: drop a <FilterBar> or any toolbar above the table (bordered band, matches the header). Both purely additive — omitting either renders exactly as before.

FilterBar(props: FilterBarProps): JSX.Element
// { searchValue: string; onSearchChange: (value) => void; searchPlaceholder?; searchLabel? ("Search"); searchIcon?: ReactNode; collapsible?: boolean (false); searchWidth?: number (260); onFiltersClick?: () => void; filterCount?: number; filtersLabel? ("Filters"); filtersIcon?: ReactNode; children?: ReactNode (left slot, e.g. a Toggle); actions?: ReactNode (right slot after Filters); activeFilters?: ReactNode (chip row below) } & div props
// The "top-right search + Filters button" table toolbar (mailgail pattern). `collapsible` renders an icon trigger that expands to the Input on click and collapses back on blur only when empty. `onFiltersClick` omitted → no Filters button rendered. Drop into DataTable's `toolbar` slot.

StatCard(props: StatCardProps): JSX.Element
// { value: ReactNode; label: string; icon?; delta?: number; trend?: StatCardTrend; deltaFormatter?; loading?: boolean } & div props

EmptyState(props: EmptyStateProps): JSX.Element
// { title: ReactNode; description?; icon?; illustration?; action?; variant?: "no-data"|"no-results"|"error" } & div props

// Overlays
Modal(props: ModalProps): JSX.Element
// { open: boolean; onClose: () => void; title?; description?; footer?; size?: "sm"|"md"|"lg"|"fullscreen"; initialFocusRef?; closeOnOverlayClick?; closeOnEscape? } & div props
// Focus-trapped (useFocusTrap) + scroll-locked (useScrollLock) internally.

Dropdown(props: DropdownProps): JSX.Element
// { trigger: ReactNode; items: DropdownMenuItem[]; active?: string; onSelect: (value) => void; align?: "start"|"end" } & div props
// DropdownItem: { label; value; icon?; disabled?; destructive? } | DropdownSeparator: { separator: true }

Drawer(props: DrawerProps): JSX.Element
// { open: boolean; onClose: () => void; side?: "left"|"right"|"top"|"bottom"; size?: "sm"|"md"|"lg"; title?; footer?; initialFocusRef?; closeOnOverlayClick?; closeOnEscape? } & div props

CommandPalette(props: CommandPaletteProps): JSX.Element
// { open: boolean; onOpenChange: (open) => void; items: CommandItem[]; placeholder?; emptyState?; enableShortcut?: boolean (true); className? }
// CommandItem: { id; label; group?; icon?; keywords?: string[]; shortcut?: string[]; onSelect: () => void }
// enableShortcut registers a global Cmd/Ctrl+K toggle.
// Internals rebuilt on cmdk: bare Command inside the kit's own portal/z-tier, styled via [cmdk-*] attributes
// with logical properties for RTL; fuzzy filter tested with Hebrew labels.

Kbd(props: KbdProps): JSX.Element
// { keys?: string[]; mapGlyphs?: boolean (true — maps mod/shift/enter/arrows to platform glyphs); children?: ReactNode (overrides keys) } & span props

Tooltip(props: TooltipProps): JSX.Element
// { content: ReactNode; children: ReactElement (single focusable child); placement?: AnchoredPlacement (top); delay?: number (300); closeDelay?: number (60); disabled?; className? }

Popover / Popover.Trigger / Popover.Content — compound component
// PopoverProps: { children; open?; onOpenChange?; defaultOpen?; placement?: AnchoredPlacement (bottom-start); anchor?: RefObject<HTMLElement | null> }
// PopoverContentProps: { "aria-label"?: string } & div props

Select / Select.Trigger / Select.Content / Select.Item / Select.Group — compound component
// SelectProps: { children; value?; onValueChange?; defaultValue?; placeholder?; disabled?; name? (hidden input for forms); placement?: AnchoredPlacement (bottom-start) }
// SelectItemProps: { value: string; disabled?; textValue?: string (typeahead when label isn't plain text); icon? } & div props
// SelectGroupProps: { label?: string } & div props

Combobox(props: ComboboxProps): JSX.Element
// options: ComboboxOption[] ({ value; label; disabled? }); value?/onValueChange? (string, or string[] when multiple); defaultValue?
// inputValue?/onInputChange?; onFilter?: (options, query) => options; allowCustomValue?; loading?; emptyState?; multiple?; renderChip?
// placeholder?; disabled?; name?; placement?: AnchoredPlacement; "aria-label": string (required)

// Forms
Field(props: FieldProps): JSX.Element
// { label: ReactNode; children: ReactNode (single control — auto-gets id/aria-describedby/aria-invalid/aria-required); htmlFor?; id?; hint?; error?; required? } & div props

Wizard(props: WizardProps): JSX.Element
// { steps: number; current: number; children: ReactNode; footer?: ReactNode (built-in Back/Next when omitted + onStepChange set); stepTitles?: string[]; onStepChange?: (next) => void; onValidateStep?: (current) => boolean | Promise<boolean>; "aria-label"? } & div props

Input(props: InputProps): JSX.Element
// { size?: "sm"|"md"|"lg"; leftIcon?; rightIcon?; invalid?: boolean; prefix?; suffix?; wrapperClassName? } & input props

Textarea(props: TextareaProps): JSX.Element
// { autoResize?: boolean; minRows?: number; maxRows?: number; invalid?: boolean } & textarea props
// autoResize also forces resize:none (.ml-textarea--autoresize) — a manual drag handle would fight the imperative auto-grow.

Composer(props: ComposerProps): JSX.Element
// { value: string; onChange: (value) => void; onSend: (value) => void; minRows?: number (1); maxRows?: number (6); dir?: "ltr"|"rtl" ("ltr"); disabled?: boolean; loading?: boolean; sendLabel?: string ("Send"); sendIcon?: ReactNode } & textarea props (minus value/onChange/defaultValue/dir/rows)
// The chat-composer pattern: an auto-growing Textarea with an icon-only send Button INSIDE the field (bottom-right in ltr, bottom-left in rtl — dir flips it). Enter sends; Shift+Enter or IME composition inserts a newline. Controlled like the rest of the kit — the caller clears `value` itself after `onSend` fires.

Checkbox(props: CheckboxProps): JSX.Element
// { indeterminate?: boolean; label?: ReactNode; description?: ReactNode } & input[type=checkbox] props

Radio(props: RadioProps) / RadioGroup(props: RadioGroupProps): JSX.Element
// RadioGroupProps: { value?; defaultValue?; onChange?: (value) => void; name?; orientation?: "horizontal"|"vertical"; disabled?; children } & div props
// RadioProps: { value: string; label?; description? } & input[type=radio] props

Stepper — see Navigation above

FileUpload(props: FileUploadProps): JSX.Element
// { accept?: string; multiple?; maxSize?: number (bytes); onFiles: (files: File[]) => void; disabled?; label?; hint?; icon?; progress?: Record<string, number> } & div props

OtpInput(props: OtpInputProps): JSX.Element
// Built on input-otp: token-styled slots, reduced-motion-aware caret, dir="ltr" hardcoded.
// The only sanctioned segmented/OTP input; test with password managers. Never hand-roll segmented inputs.

// Feedback
Toaster(props: ToasterProps): JSX.Element / toast (Sonner wrapper)
// Rebuilt on Sonner: mount Toaster once at the app root and call the kit's toast() / toast.promise().
// Themed to --ml-* tokens, Hugeicons Pro icons via the icons prop at the app layer, dir="auto" for Hebrew,
// reduced-motion verified per motion.md. Never hand-roll toasts.
// Dedupe (motion.md "Don't show the same snack bar twice"): re-firing a message already on screen never
// stacks a copy — front toast shakes (transform-only) + timer resets; buried toast jumps back to the front
// with a fresh timer. Keys on tone + title + description (string titles); pass your own id to opt out.
// ToasterProps: { placement?: ToastPlacement ("bottom-right"); duration?: number (5000); icons?; dir? ("auto") } + Sonner Toaster passthrough
// ToastPlacement: "top"|"bottom" x "left"|"right"|"center". ToastOptions aliases Sonner's ExternalToast.
// The old ToastProvider/useToast hook API is gone; call toast(message, options) directly.

Callout(props: CalloutProps): JSX.Element
// { tone?: "neutral"|"info"|"success"|"warning"|"danger"; title?; icon?; onDismiss? } & div props

Spinner(props: SpinnerProps): JSX.Element
// { size?: "sm"|"md"|"lg"; label?: string (visually-hidden a11y name) } & span props

CometLoader(props: CometLoaderProps): JSX.Element
// { size?: "sm"|"md"|"lg" (16/20/24px); label?: string (visually-hidden a11y name) } & span props
// AI/agentic loading indicator — 4×4 currentColor dot grid, bright head + fading tail orbiting a
// clockwise spiral. Use when the wait is AI thinking/generating; Spinner stays the generic async default.

Skeleton(props: SkeletonProps) / SkeletonText(props: SkeletonTextProps): JSX.Element
// SkeletonProps: { variant?: "text"|"rect"|"circle"; width?; height?; radius? } & span props
// SkeletonTextProps: Omit<SkeletonProps,"variant"> & { lines?: number }

Progress(props: ProgressProps): JSX.Element
// { value?: number; max?: number; size?: "sm"|"md"|"lg"; tone?: "neutral"|"success"|"warning"|"danger"; label?: string; showValue?: boolean } & div props
// Omit value for an indeterminate bar.

// Subpath exports (optional peer deps — install the peer only where the subpath is used)
VirtualDataTable<Row>(props): JSX.Element            // from "@meir-labs/ui-kit/virtual"
// react-virtuoso (MIT npm core only — never the commercial @virtuoso.dev/* packages).
// Use when a list/table exceeds ~200-500 rendered rows or infinite-scrolls; below that use DataTable + Pagination.
// Client-only; set initialItemCount if server HTML matters.

SortableList(props): JSX.Element                     // from "@meir-labs/ui-kit/sortable"
// @dnd-kit/core 6.x + sortable. Keyboard + screen-reader reordering must stay enabled; Hebrew announcement
// strings on HE surfaces; reduced motion disables drag transitions. Re-evaluate @dnd-kit/react at 1.0.

LiveChart(props): JSX.Element                        // from "@meir-labs/ui-kit/charts"
// Liveline (pre-1.0 — pin the version, re-check at 1.0). Real-time streaming time-series ONLY; not the general
// chart library. Wrapper defaults: monochrome token colors, decorative effects (particles/pulse/shake) off,
// prefers-reduced-motion guard implemented in the wrapper (the lib lacks one).
```

## CSS Classes

### Data Table

- `.ml-dt-wrap` -- Table container with border and rounded corners
- `.ml-dt` -- The table element (full width, collapsed borders)
- `.ml-dt-r` -- Right-align column (th or td)
- `.ml-dt-row-link` -- Clickable row (pointer cursor)
- `.ml-dt-chevron` -- Navigation arrow cell (hidden until row hover)
- `.ml-dt-chevron-col` -- Fixed-width chevron column (32px)
- `.ml-dt-avatar` -- Fixed-width avatar column (40px)
- `.ml-dt-primary` -- Bold primary text in multi-line cell
- `.ml-dt-secondary` -- Muted secondary text below primary
- `.ml-dt-time` -- Monospace timestamp
- `.ml-dt-truncate` -- Ellipsis overflow (max 300px)

### Pagination

- `.ml-pg` -- Pagination container (usually used via Pagination component)
- `.ml-pg-arrow` -- Previous/next arrow button
- `.ml-pg-num` -- Page number button (add `.active` for current page)

### Tags and Status

- `.ml-tag` -- Badge element (usually used via Tag component)
- `.ml-status-pill` -- Base status pill class
- `.ml-status-pill-good` -- Green status
- `.ml-status-pill-warn` -- Yellow/amber status
- `.ml-status-pill-neutral` -- Blue status
- `.ml-chip-row` -- Flex container for tags (usually used via ChipRow component)

### Metric Colors

- `.ml-metric-positive` -- Green text (usually used via MetricValue component)
- `.ml-metric-negative` -- Red text

## Design Tokens

All tokens are CSS custom properties. The values below are the **dark** theme
(`[data-meirlabs-theme="dark"]`). The **light** theme (`[data-meirlabs-theme="light"]`)
overrides color/background/text/border/shadow/glass tokens (light values listed
at the end of this section); spacing, radius, and typography are shared. Motion
and the z-index scale are theme-independent (defined once in plain `:root`).

### Monochrome neutralization

`--ml-color-primary`/`--ml-color-purple` (and their `-muted` variants) are still
defined for `compat.css` and legacy classes, but now **resolve to neutral
text/surface tokens** (`--ml-text` / `--ml-bg-surface`) instead of blue/purple —
nothing renders an accent color by accident anymore. `--ml-shadow-glow` was
neutralized the same way (colorless halo, was blue). Functional status colors
(`success`/`warning`/`danger`) are unchanged. For a neutral pill/badge fill, use
`--ml-neutral-fill` / `--ml-neutral-text` directly rather than the primary/purple
tokens.

### Colors

- `--ml-color-primary`: `var(--ml-text)` (neutralized — was #58a6ff)
- `--ml-color-primary-muted`: `var(--ml-bg-surface)` (neutralized — was rgba(88, 166, 255, 0.15))
- `--ml-color-success`: #3fb950
- `--ml-color-success-muted`: rgba(63, 185, 80, 0.12)
- `--ml-color-danger`: #f85149
- `--ml-color-danger-muted`: rgba(248, 81, 73, 0.12)
- `--ml-color-warning`: #d29922
- `--ml-color-warning-muted`: rgba(210, 153, 34, 0.12)
- `--ml-color-purple`: `var(--ml-text-muted)` (neutralized — was #bc8cff)
- `--ml-color-purple-muted`: `var(--ml-bg-surface)` (neutralized — was rgba(188, 140, 255, 0.15))
- `--ml-neutral-fill`: `var(--ml-bg-surface)` — pale fill for neutral badges/pills
- `--ml-neutral-text`: `var(--ml-text-muted)` — text/icon color to pair with `--ml-neutral-fill`
- `--ml-overlay`: rgba(0, 0, 0, 0.7) — modal/drawer/dialog scrim (light theme: rgba(0, 0, 0, 0.5))

### Backgrounds

- `--ml-bg`: #0d1117
- `--ml-bg-surface`: #161b22
- `--ml-bg-card`: #1c2129
- `--ml-bg-elevated`: #21262d

### Text

- `--ml-text`: #e6edf3
- `--ml-text-muted`: #8b949e
- `--ml-text-faint`: #6e7681

### Borders

- `--ml-border`: #30363d
- `--ml-border-subtle`: rgba(48, 54, 61, 0.5)

### Spacing

- `--ml-space-xs`: 4px
- `--ml-space-sm`: 8px
- `--ml-space-md`: 12px
- `--ml-space-lg`: 16px
- `--ml-space-xl`: 24px
- `--ml-space-2xl`: 32px

### Border Radius

- `--ml-radius-sm`: 6px
- `--ml-radius-md`: 8px
- `--ml-radius-lg`: 12px
- `--ml-radius-xl`: 16px
- `--ml-radius-pill`: 999px

### Shadows

Layered stacks approximating a 1→3→6→12→24→48 elevation doubling (blur=b,
offsetY=b/2, spread=-b/2), preserving a dark-mode inset top-ring highlight that
intensifies as the surface lifts. These are the **only** sanctioned shadow
source — never write a raw `box-shadow` in app CSS.

- `--ml-shadow-card`: `0 1px 1px -0.5px rgba(0,0,0,.4), 0 2px 3px -1.5px rgba(0,0,0,.36), 0 3px 6px -3px rgba(0,0,0,.3), inset 0 0 0 1px rgba(255,255,255,.03)`
- `--ml-shadow-elevated`: `0 2px 3px -1.5px rgba(0,0,0,.4), 0 3px 6px -3px rgba(0,0,0,.38), 0 6px 12px -6px rgba(0,0,0,.36), 0 12px 24px -12px rgba(0,0,0,.34), inset 0 0 0 1px rgba(255,255,255,.035)`
- `--ml-shadow-modal`: `0 3px 6px -3px rgba(0,0,0,.4), 0 6px 12px -6px rgba(0,0,0,.42), 0 12px 24px -12px rgba(0,0,0,.46), 0 24px 48px -24px rgba(0,0,0,.5), inset 0 0 0 1px rgba(255,255,255,.04)`
- `--ml-shadow-glow`: `0 0 20px rgba(0,0,0,0.25)` (neutralized — see above)

### Z-Index scale (theme-independent)

Every overlay CSS file must reference these tokens, never a numeric literal, so
stacking always coordinates correctly. Wide gaps leave room for local layering
(e.g. a popover's own arrow) inside each tier.

- `--ml-z-dropdown`: 1000
- `--ml-z-sticky`: 1100
- `--ml-z-popover`: 1200
- `--ml-z-tooltip`: 1300
- `--ml-z-drawer`: 1400
- `--ml-z-modal`: 1500
- `--ml-z-toast`: 1600
- `--ml-z-command`: 1700

### Motion (theme-independent)

Calibrated to `design/foundation/motion.md`; every animated component in the
kit respects `prefers-reduced-motion` automatically.

- `--ml-duration-press`: 60ms — `:active` transform feedback
- `--ml-duration-fast`: 120ms — tight color/border shifts
- `--ml-duration-base`: 150ms — interactive default (hover color/border/bg, focus)
- `--ml-duration-slow`: 200ms — expand/collapse (small elements)
- `--ml-duration-exit`: 450ms — overlay/list dissolve
- `--ml-duration-entrance`: 800ms — landing scroll reveal (exempt from the sub-300ms UI rule)
- `--ml-ease`: `ease` — plain interactive default
- `--ml-ease-out`: `cubic-bezier(0.23, 1, 0.32, 1)` — strong ease-out for deliberate UI
- `--ml-ease-entrance`: `cubic-bezier(0.25, 0.46, 0.45, 0.94)` — landing fade-up
- `--ml-stagger`: 100ms — between siblings on entrance
- `--ml-stagger-tight`: 80ms — word-by-word splits
- `--ml-press-scale`: 0.97 — press feedback floor (never lower)

### Glass

- `--ml-glass-bg`: rgba(22, 27, 34, 0.82)
- `--ml-glass-blur`: blur(40px)
- `--ml-glass-border`: rgba(48, 54, 61, 0.6)

### Typography

- `--ml-font-sans`: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif
- `--ml-font-mono`: "SF Mono", "Fira Code", "Courier New", monospace
- `--ml-text-xs`: 0.68rem
- `--ml-text-sm`: 0.78rem
- `--ml-text-base`: 0.88rem
- `--ml-text-lg`: 1rem
- `--ml-text-xl`: 1.2rem
- `--ml-text-2xl`: 1.5rem
- `--ml-text-3xl`: 2rem

### Light theme overrides (`[data-meirlabs-theme="light"]`)

- Backgrounds: `--ml-bg` #ffffff · `--ml-bg-surface` #f6f8fa · `--ml-bg-card` #ffffff · `--ml-bg-elevated` #ffffff
- Text: `--ml-text` #1f2328 · `--ml-text-muted` #656d76 · `--ml-text-faint` #8b949e
- Borders: `--ml-border` #d0d7de · `--ml-border-subtle` rgba(208,215,222,0.5)
- Colors: `--ml-color-primary` `var(--ml-text)` (neutralized) · `--ml-color-success` #1a7f37 · `--ml-color-danger` #cf222e · `--ml-color-warning` #9a6700 · `--ml-color-purple` `var(--ml-text-muted)` (neutralized); muted success/danger/warning variants at ~0.1 alpha
- `--ml-neutral-fill`/`--ml-neutral-text` mirror dark theme (surface/muted-text); `--ml-overlay` is rgba(0,0,0,0.5)
- Shadows use `rgba(31,35,40,…)` in the same layered stacks as dark; glass is `rgba(255,255,255,0.85)`. Z-index and motion tokens are shared across themes. Spacing, radius, and typography are unchanged.

## Rules

- ALWAYS prefer @meir-labs/ui-kit components over writing custom table/pagination/pill/form/overlay CSS.
- When adding a table, use `<DataTable>` (or the `.ml-dt-*` class system for a hand-rolled one).
- When displaying a status, use `<StatusPill>` not a custom span.
- When showing positive/negative numbers, use `<MetricValue>` or `.ml-metric-*` classes.
- Build form fields with `<Field>` wrapping `<Input>`/`<Textarea>`/`<Select>`/`<Combobox>`/`<Checkbox>`/`<Radio>` — it wires `id`/`aria-describedby`/`aria-invalid`/`aria-required` for you.
- Don't reimplement focus trapping, scroll locking, or anchored positioning for a new overlay — use `useFocusTrap`/`useScrollLock`/`useAnchoredPosition`, or compose `Modal`/`Drawer`/`Popover`/`Select`/`Combobox`, which already do.
- Never hardcode a z-index or a raw `box-shadow` — use the `--ml-z-*` scale and `--ml-shadow-*` tokens so stacking and elevation stay coordinated.
- `--ml-color-primary`/`--ml-color-purple` are neutralized (resolve to text/surface, not blue/purple) — don't rely on them for an accent color; use functional `success`/`warning`/`danger` tones, or `.ml-btn-primary` for emphasis.
- If a component does not exist in ui-kit but would be generally reusable, suggest adding it to the package.
- The library is intentionally small. Check existing components first; **extend** a
  primitive with a variant/size (as `Button` gained `secondary`) rather than
  overriding it with per-call `className`. Don't inline-fork a control across pages —
  promote it here once it's needed twice. Add a new component only when it's
  genuinely distinct from what exists.
- The compat layer (`compat.css`) is deprecated. Do not use legacy `.tt-*` class names in new code.

## Adding a Component

1. Create the component file at `src/components/MyComponent.tsx`.
2. Add a story at `src/components/MyComponent.stories.tsx`.
3. Add tests at `src/components/MyComponent.test.tsx`.
4. Export the component (and its props type if applicable) from `src/index.ts`.
5. Document the component in `README.md` and this `AGENTS.md`.
6. Run `pnpm test` to verify nothing is broken.
7. Run `pnpm build` to confirm the package compiles.
