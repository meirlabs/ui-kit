# Changelog

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
