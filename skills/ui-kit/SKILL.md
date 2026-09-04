---
name: ui-kit
description: Themeable (light & dark) React component library, @meir-labs/ui-kit. Use when building UI with tables, forms, overlays (modal, drawer, dropdown, popover, tooltip, select, combobox, command palette), toasts, pagination, status pills, tags, badges, metric values, or design tokens. Triggers on: table component, data table, pagination, status pill, tag, badge, chip, metric value, design tokens, ui-kit, component library, theme tokens, form field, input, select, combobox, modal, drawer, toast, tooltip, popover, accordion, stepper, breadcrumbs, file upload, command palette, ml-dt, ml-tag, ml-status-pill, ml-metric, ml-pg.
---

# @meir-labs/ui-kit

A themeable (light & dark) React component library. It covers presentational
basics (buttons, badges, tags, cards), layout, navigation, data display, forms,
overlays, and feedback (toasts, skeletons, spinners). When working on UI, prefer
`@meir-labs/ui-kit` components and `.ml-*` classes/tokens over building custom
implementations.

## Setup

```bash
npm install @meir-labs/ui-kit
```

1. **Next.js only:** add `transpilePackages: ["@meir-labs/ui-kit"]` to `next.config`.
2. Import the stylesheet once in your root layout: `import "@meir-labs/ui-kit/styles.css"`.
3. Activate a theme on a wrapper element (typically `<html>`):
   `data-meirlabs-theme="light"` or `data-meirlabs-theme="dark"`.
4. To use toasts, mount `<ToastProvider>` once near the app root, then call
   `useToast().toast({ title })` from anywhere below it.
5. Import what you need, e.g.:
   `import { Button, Input, Field, Modal, DataTable, useToast, cn } from "@meir-labs/ui-kit"`.

The package ships an `AGENTS.md` with the full export list, props, CSS classes,
and design tokens — read it for details.

## Components

### Basics
- **Button** — `variant` primary/secondary/ghost/danger/icon, `size` sm/md/lg, `loading` (reserves width, never collapses), `leftIcon`/`rightIcon`, `as="a"`/`href` for link CTAs.
- **Badge** — small status/count label. `tone` neutral/success/warning/danger, `size` sm/md, `dot`, `icon`.
- **Avatar** — image with `fallback` initials, `size` xs–lg, presence `status` dot, `interactive` (focusable button wrapper), `round` (false = square).
- **Label** — standalone text (`size`, `tone`). Prefer `<Field>` for real form labels.
- **Divider** — `variant` solid/dashed (decorative/diamond are deprecated), `orientation`.
- **Tag** — removable chip. `tone`, `size`, `onRemove` (adds a trailing × button), `removeLabel`.
- **ChipRow** — flex row for `Tag`s. `gap` sm/md.
- **StatusPill** — colored status indicator. `tone`, `dot`, `icon`.
- **MetricValue** — number with automatic positive/negative color; optional `delta`/`deltaDirection`/`deltaFormatter` trend indicator.
- **Banner** — page/section-level tone message. `tone`, `icon`, `title`, `description`, `onDismiss`.
- **Callout** — inline tone-colored note block. `tone`, `title`, `icon`, `onDismiss`.
- **Placeholder** — decorative "nothing here yet" illustration (`subject`: clients/documents/search/calendar). Pair with `EmptyState` for the copy.
- **EditableDocument** — fill-in-the-blank document editor. `source` prose with `{{key|label}}` tokens, controlled `values`/`onChange`; use `parseDocFields(source)` to derive form fields.

### Layout
- **Shell / Sidebar / SidebarItem / TopBar / PageHeader** — app-shell scaffolding. `Sidebar` takes `collapsed` (icon rail); `SidebarItem` takes `active`/`icon`; `TopBar` has `left`/`center`/`right` slots; `PageHeader` takes `title`/`subtitle`/`breadcrumb`/`actions`/`backHref` or `onBack`.
- **Card** — surface container. `as` (`"button"`/`"a"` for clickable cards), `interactive` (hover border), `padding` compact/default.
- **Grid** — responsive grid. `columns` (number or `"auto"`), `minColWidth`, `gap`.
- **Section** — content block with a quiet `title`.
- **DetailList** — label/value definition list. `items[]` (each can set `onCopy`/`copyValue`), `columns` 1|2.
- **DangerZone / DangerZoneItem** — destructive-actions panel. Item takes `title`, `description`, `actionLabel`, `onConfirm`, `loading`, or a full `action` override.
- **Accordion / AccordionItem** — expand/collapse groups. `type` single/multiple, controlled `value`/`onValueChange`; item takes `value`, `title`, `disabled`.

### Navigation
- **Tabs / TabsPanel** — `tabs[]` (value/label/icon/disabled), controlled `value`/`onChange`, required `aria-label`. Roving-tabindex + arrow-key model.
- **Toggle** — value-picker (`role="radiogroup"`). `options[]`, `active`, `onChange`.
- **SegmentedControl** — 2–3 view switcher with a sliding thumb (`role="tablist"`). `options[]`, `value`, `onChange`, required `aria-label`. Use `Toggle` to pick a *value*, `SegmentedControl` to switch *views*.
- **Pagination** — page nav + optional page-size selector. `pageIndex`, `pageCount`, `onPage`, `siblingCount`, `showEdges`, `pageSize`/`pageSizeOptions`/`onPageSizeChange`.
- **Breadcrumbs** — trail that collapses the middle into a `…` menu past `maxItems`. `items[]` (label/href/onClick), `separator`.
- **Stepper** — numbered step progress. `steps[]` (label/description/status), `activeStep`, `orientation`.

### Data Display
- **DataTable** — full React table: `columns[]` (accessor/sortable/align/width/numeric/sortFn), `data`, controlled or uncontrolled sort (`sortState`/`onSortChange` or `defaultSort`), `selectable` single/multiple, `stickyHeader`, `compact`, `loading`/`loadingRowCount`, `error`, `emptyState`, `onRowClick`, `footer` slot. The `.ml-dt-*` CSS classes still work for hand-rolled tables.
- **StatCard** — KPI tile. `value`, `label`, `icon`, `delta`/`trend`/`deltaFormatter`, `loading` skeleton.
- **EmptyState** — no-data/no-results/error block. `title`, `description`, `icon`/`illustration`, `action`, `variant`.

### Overlays
- **Modal** — dialog. `open`/`onClose`, `title`/`description`/`footer`, `size` sm/md/lg/fullscreen, `initialFocusRef`, `closeOnOverlayClick`/`closeOnEscape`. Focus-trapped + scroll-locked.
- **Dropdown** — menu on a trigger. `trigger`, `items[]` (label/value/icon/disabled/destructive, or `{ separator: true }`), `active`, `onSelect`, `align`.
- **Drawer** — slide-in panel. `open`/`onClose`, `side` left/right/top/bottom, `size` sm/md/lg, `title`/`footer`, `initialFocusRef`.
- **CommandPalette** — Cmd/Ctrl+K fuzzy launcher. `open`/`onOpenChange`, `items[]` (id/label/group/icon/keywords/shortcut/onSelect), `placeholder`, `emptyState`, `enableShortcut`.
- **Kbd** — keyboard-shortcut cap. `keys` (e.g. `["mod", "K"]`, auto-mapped to ⌘/Ctrl via `mapGlyphs`), or freeform `children`.
- **Tooltip** — hover/focus label for a single focusable child. `content`, `placement`, `delay`/`closeDelay`, `disabled`.
- **Popover** — anchored interactive panel. Compound `Popover` / `Popover.Trigger` / `Popover.Content`; controlled/uncontrolled `open`, `placement`, external `anchor`.
- **Select** — custom listbox. Compound `Select` / `Select.Trigger` / `Select.Content` / `Select.Item` / `Select.Group`; controlled/uncontrolled `value`, `placeholder`, `name` (posts via hidden input), `placement`.
- **Combobox** — filterable input + listbox. `options[]`, controlled `value`/`onValueChange` (string, or `string[]` with `multiple`), `inputValue`/`onInputChange`, `onFilter`, `allowCustomValue`, `loading`, required `aria-label`.

### Forms
- **Field** — label + hint/error wiring. `label`, single-child `children` (auto-gets `id`/`aria-describedby`/`aria-invalid`/`aria-required`), `hint`, `error`, `required`.
- **Wizard** — multi-step flow shell. `steps`, `current`, built-in Back/Next `footer` (or custom), `stepTitles`, `onStepChange`, `onValidateStep` (async gate).
- **Input** — text field. `size` sm/md/lg, `leftIcon`/`rightIcon`, `prefix`/`suffix` adornments, `invalid`.
- **Textarea** — multi-line field. `autoResize` (+ `minRows`/`maxRows`), `invalid`.
- **Checkbox** — `indeterminate`, `label`, `description`.
- **Radio / RadioGroup** — group owns `value`/`defaultValue`/`onChange`/`name`/`orientation`/`disabled`; `Radio` takes `value`, `label`, `description`.
- **FileUpload** — drag-and-drop dropzone. `accept`, `multiple`, `maxSize`, `onFiles`, `progress` (per-file 0–100 map), `label`/`hint`/`icon`.

### Feedback
- **Toaster / ToastProvider / useToast** — mount `<ToastProvider>` once at the app root; call `useToast().toast({ title, description?, tone?, duration?, action? })` anywhere below it. `placement`, `maxVisible` queue with pause-on-hover.
- **Spinner** — inline loading indicator. `size` sm/md/lg, `label` (visually-hidden a11y name).
- **CometLoader** — AI/agentic loading indicator, a 4×4 dot grid with a bright head orbiting a spiral. Use when the wait is AI thinking/generating.
- **DotsLoader** — compact three-dot bounce loader for inline spots (buttons, table cells, chat bubbles).
- **PulseLoader** — calm "still working" loader, expanding sonar-ping rings around a static core.
- **OrbitLoader** — satellite-style loader, a dot with a fading trail orbiting a static track ring.
- **Skeleton / SkeletonText** — loading placeholder. `variant` text/rect/circle, `width`/`height`/`radius`; `SkeletonText` adds `lines`.
- **Progress** — determinate (`value`/`max`) or indeterminate bar. `size`, `tone`, `label`, `showValue`.

## Hooks

- **usePagination(items, pageSize?)** — slices an array into pages; returns `{ page, pageIndex, pageCount, setPage, reset }`.
- **useFocusTrap(active, { initialFocus?, returnFocus? })** — traps Tab/Shift+Tab inside a ref'd container; already used internally by Modal/Drawer/CommandPalette/Select/Combobox/Popover — reach for it only when building a new overlay.
- **useScrollLock(active)** — ref-counted body-scroll lock for overlays; nested overlays share one lock safely.
- **useAnchoredPosition(anchorRef, floatingRef, { open, placement?, offset?, flip?, matchWidth?, padding? })** — positions a floating element against an anchor with viewport-aware flip/clamp; powers Tooltip/Popover/Select/Combobox/Dropdown.
- **useToast()** — reads `{ toast, dismiss, dismissAll, toasts }` from context; must be called under `<ToastProvider>`.

## Rules

- ALWAYS prefer ui-kit components over writing custom implementations.
- When adding a table, use `<DataTable>` (or the `.ml-dt-*` class system for a hand-rolled one).
- When displaying a status, use `<StatusPill>` not a custom span.
- When showing positive/negative numbers, use `<MetricValue>` or `.ml-metric-*` classes.
- Build any form field with `<Field>` wrapping `<Input>`/`<Textarea>`/`<Select>`/`<Checkbox>`/`<Radio>` — don't hand-wire label/id/aria associations.
- Don't reimplement focus trapping, scroll locking, or anchored positioning for a new overlay — use `useFocusTrap`/`useScrollLock`/`useAnchoredPosition`, or compose the existing `Modal`/`Drawer`/`Popover`.
- Never hardcode a z-index — use the `--ml-z-*` scale (`dropdown` → `sticky` → `popover` → `tooltip` → `drawer` → `modal` → `toast` → `command`).
- Never write a raw `box-shadow` — use `--ml-shadow-card` / `-elevated` / `-modal`.
- The system is monochrome by default: `--ml-color-primary`/`--ml-color-purple` now resolve to neutral text/surface tokens. Don't rely on them for a blue/purple accent — use the functional `success`/`warning`/`danger` tones only, or the charcoal `.ml-btn-primary` for emphasis.
- Motion respects `prefers-reduced-motion` automatically across the library; don't add animation that bypasses it.
- Drive colors, spacing, and radius from the `--ml-*` design tokens — never
  hardcode hex values, so light and dark both stay correct.
- If a needed component doesn't exist but would be reusable, suggest adding it to the package.
- For migration from old `.tt-*` classes, import `"@meir-labs/ui-kit/compat.css"` temporarily.
