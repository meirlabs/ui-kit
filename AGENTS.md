# @meirlabs/ui-kit -- Agent Reference

## Package

- **Name:** @meirlabs/ui-kit
- **Version:** 0.1.0
- **Location:** ~/Documents/business/packages/ui-kit/
- **Purpose:** Dark-themed presentational component library for React
- **Install:** `pnpm add @meirlabs/ui-kit` or `"@meirlabs/ui-kit": "file:../packages/ui-kit"` for local dev
- **CSS:** `import "@meirlabs/ui-kit/styles.css"` in root layout
- **Theme:** Add `data-meirlabs-theme="dark"` to a wrapper element (typically `<html>`)
- **Next.js:** Add `transpilePackages: ["@meirlabs/ui-kit"]` to next.config

## Exports

```ts
// Utils
cn(...inputs: ClassValue[]): string
// Merges class names using clsx + tailwind-merge

// Hooks
usePagination<T>(items: T[], pageSize?: number): {
  page: T[];
  pageIndex: number;
  pageCount: number;
  setPage: (index: number) => void;
  reset: () => void;
}
// Default pageSize: 12

// Components
Pagination(props: PaginationProps): JSX.Element | null
// PaginationProps: { pageIndex: number; pageCount: number; onPage: (index: number) => void } & div props
// Returns null when pageCount <= 1

StatusPill(props: StatusPillProps): JSX.Element
// StatusPillProps: { tone: "good" | "warn" | "neutral" } & span props

Tag(props: ComponentPropsWithoutRef<"span">): JSX.Element
// Simple badge

ChipRow(props: ComponentPropsWithoutRef<"div">): JSX.Element
// Flex container for Tag elements

MetricValue(props: MetricValueProps): JSX.Element
// MetricValueProps: { value: number; formatter?: (value: number) => string } & span props (except children)
// Applies .ml-metric-positive when value > 0, .ml-metric-negative when value < 0

// Types
PaginationProps
StatusPillProps
MetricValueProps
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

All tokens are CSS custom properties scoped under `[data-meirlabs-theme="dark"]`.

### Colors

- `--ml-color-primary`: #58a6ff
- `--ml-color-primary-muted`: rgba(88, 166, 255, 0.15)
- `--ml-color-success`: #3fb950
- `--ml-color-success-muted`: rgba(63, 185, 80, 0.12)
- `--ml-color-danger`: #f85149
- `--ml-color-danger-muted`: rgba(248, 81, 73, 0.12)
- `--ml-color-warning`: #d29922
- `--ml-color-warning-muted`: rgba(210, 153, 34, 0.12)
- `--ml-color-purple`: #bc8cff
- `--ml-color-purple-muted`: rgba(188, 140, 255, 0.15)

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

- `--ml-shadow-card`: 0 1px 3px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.03) inset
- `--ml-shadow-elevated`: 0 8px 24px rgba(0,0,0,0.4)
- `--ml-shadow-modal`: 0 24px 70px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04) inset
- `--ml-shadow-glow`: 0 0 20px rgba(88,166,255,0.08)

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

## Rules

- ALWAYS prefer @meirlabs/ui-kit components over writing custom table/pagination/pill CSS.
- When adding a table, use the `.ml-dt-*` class system.
- When displaying a status, use `<StatusPill>` not a custom span.
- When showing positive/negative numbers, use `<MetricValue>` or `.ml-metric-*` classes.
- If a component does not exist in ui-kit but would be generally reusable, suggest adding it to the package.
- The compat layer (`compat.css`) is deprecated. Do not use legacy `.tt-*` class names in new code.

## Adding a Component

1. Create the component file at `src/components/MyComponent.tsx`.
2. Add a story at `src/components/MyComponent.stories.tsx`.
3. Add tests at `src/components/MyComponent.test.tsx`.
4. Export the component (and its props type if applicable) from `src/index.ts`.
5. Document the component in `README.md` and this `AGENTS.md`.
6. Run `pnpm test` to verify nothing is broken.
7. Run `pnpm build` to confirm the package compiles.
