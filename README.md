# @meir-labs/ui-kit

Themeable presentational component library for React — light and dark out of the box.

Provides design tokens, data-table CSS classes, and a handful of ready-made components so every MeirLabs project shares the same visual language without duplicating styles.

## Install

```bash
pnpm add @meir-labs/ui-kit
# or
npm install @meir-labs/ui-kit
# or
yarn add @meir-labs/ui-kit
```

For local development with a sibling project, use the `file:` protocol in `package.json`:

```json
{
  "dependencies": {
    "@meir-labs/ui-kit": "file:../packages/ui-kit"
  }
}
```

If the consuming project uses **Next.js**, add the package to transpilation in `next.config`:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@meir-labs/ui-kit"],
};
```

## Setup

1. Import the stylesheet **once** in your root layout or entry point:

   ```tsx
   import "@meir-labs/ui-kit/styles.css";
   ```

2. Activate the theme by adding the `data-meirlabs-theme` attribute:

   ```html
   <html data-meirlabs-theme="dark">
   ```

That's it -- design tokens and all component styles are now available globally.

## Components

### Pagination

Renders page numbers with previous/next arrows. Hides itself when there is only one page.

```tsx
import { Pagination, usePagination } from "@meir-labs/ui-kit";

function ItemList({ items }: { items: Item[] }) {
  const { page, pageIndex, pageCount, setPage } = usePagination(items, 12);

  return (
    <>
      <ul>
        {page.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
      <Pagination pageIndex={pageIndex} pageCount={pageCount} onPage={setPage} />
    </>
  );
}
```

| Prop | Type | Description |
| --- | --- | --- |
| `pageIndex` | `number` | Zero-based current page |
| `pageCount` | `number` | Total number of pages |
| `onPage` | `(index: number) => void` | Callback when a page is selected |

### StatusPill

A small colored pill for status indicators.

```tsx
import { StatusPill } from "@meir-labs/ui-kit";

<StatusPill tone="good">Active</StatusPill>
<StatusPill tone="warn">Pending</StatusPill>
<StatusPill tone="neutral">Draft</StatusPill>
```

| Prop | Type | Description |
| --- | --- | --- |
| `tone` | `"good" \| "warn" \| "neutral"` | Color scheme |
| `children` | `ReactNode` | Label text |

### Tag

A simple badge for labels and categories.

```tsx
import { Tag } from "@meir-labs/ui-kit";

<Tag>Crypto</Tag>
<Tag>Polymarket</Tag>
```

### ChipRow

A flex container for multiple `Tag` elements with proper spacing.

```tsx
import { Tag, ChipRow } from "@meir-labs/ui-kit";

<ChipRow>
  <Tag>BTC</Tag>
  <Tag>ETH</Tag>
  <Tag>SOL</Tag>
</ChipRow>
```

### MetricValue

Displays a number with automatic positive/negative coloring.

```tsx
import { MetricValue } from "@meir-labs/ui-kit";

<MetricValue value={12.5} formatter={(v) => `${v > 0 ? "+" : ""}${v.toFixed(1)}%`} />
// renders: <span class="ml-metric-positive">+12.5%</span>

<MetricValue value={-3.2} formatter={(v) => `${v.toFixed(1)}%`} />
// renders: <span class="ml-metric-negative">-3.2%</span>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `number` | -- | The numeric value |
| `formatter` | `(value: number) => string` | `String` | Custom display formatter |

### SegmentedControl

A bordered track with a sliding thumb for switching between **2–3 sibling views**
(sub-tabs within a page). Equal columns, so the thumb is exactly one cell; it
moves by `transform` only and color is the only thing that changes between states,
so the row never shifts. The thumb fill / inverted label use `--ml-text` /
`--ml-bg`, so the "dark-when-selected" treatment flips correctly per theme.

```tsx
import { SegmentedControl } from "@meir-labs/ui-kit";

<SegmentedControl
  aria-label="Wisdom view"
  value={view}
  onChange={setView}
  options={[
    { label: "Terms learned", value: "learned", count: 42 },
    { label: "Diplomas", value: "diplomas", count: 3 },
  ]}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `options` | `{ label, value, count? }[]` | -- | 2–3 views; optional `· N` count, shown only when > 0 |
| `value` | `string` | -- | The active view's value |
| `onChange` | `(value: string) => void` | -- | Fired with the clicked value |
| `aria-label` | `string` | -- | **Required** — names the group for assistive tech |

> **`SegmentedControl` vs `Toggle`:** `SegmentedControl` switches between *views*
> (`role="tablist"`, animated thumb). `Toggle` picks a *value*
> (`role="radiogroup"`, no thumb). For >3 options or long labels, use a `Dropdown`
> or a horizontal chip rail instead.

## CSS Classes

These classes are available globally after importing `styles.css`. Use them directly on HTML elements alongside or instead of the React components.

### Data Table

| Class | Description |
| --- | --- |
| `.ml-dt-wrap` | Table container with border and rounded corners |
| `.ml-dt` | The `<table>` element |
| `.ml-dt-r` | Right-align a column (`th` or `td`) |
| `.ml-dt-row-link` | Clickable row (adds pointer cursor) |
| `.ml-dt-chevron` | Navigation arrow cell (hidden until row hover) |
| `.ml-dt-chevron-col` | Fixed-width column for the chevron (32px) |
| `.ml-dt-avatar` | Fixed-width avatar column (40px) |
| `.ml-dt-primary` | Bold primary text in a multi-line cell |
| `.ml-dt-secondary` | Muted secondary text below primary |
| `.ml-dt-time` | Monospace timestamp |
| `.ml-dt-truncate` | Ellipsis overflow (max 300px) |

### Pagination

| Class | Description |
| --- | --- |
| `.ml-pg` | Pagination container (usually used via `<Pagination>`) |
| `.ml-pg-arrow` | Previous/next arrow button |
| `.ml-pg-num` | Page number button (add `.active` for current page) |

### Tags and Status

| Class | Description |
| --- | --- |
| `.ml-tag` | Badge element (usually used via `<Tag>`) |
| `.ml-status-pill` | Base status pill class |
| `.ml-status-pill-good` | Green status (usually used via `<StatusPill tone="good">`) |
| `.ml-status-pill-warn` | Yellow/amber status |
| `.ml-status-pill-neutral` | Blue status |
| `.ml-chip-row` | Flex container for tags (usually used via `<ChipRow>`) |

### Metric Colors

| Class | Description |
| --- | --- |
| `.ml-metric-positive` | Green text for positive values (usually used via `<MetricValue>`) |
| `.ml-metric-negative` | Red text for negative values |

## Design Tokens

All tokens are CSS custom properties. Color, background, text, border, shadow,
and glass tokens differ per theme — set `[data-meirlabs-theme="dark"]` or
`[data-meirlabs-theme="light"]` on a wrapper (typically `<html>`). Spacing,
radius, and typography are shared across both themes.

### Colors

| Token | Dark | Light |
| --- | --- | --- |
| `--ml-color-primary` | `#58a6ff` | `#0969da` |
| `--ml-color-primary-muted` | `rgba(88, 166, 255, 0.15)` | `rgba(9, 105, 218, 0.1)` |
| `--ml-color-success` | `#3fb950` | `#1a7f37` |
| `--ml-color-success-muted` | `rgba(63, 185, 80, 0.12)` | `rgba(26, 127, 55, 0.1)` |
| `--ml-color-danger` | `#f85149` | `#cf222e` |
| `--ml-color-danger-muted` | `rgba(248, 81, 73, 0.12)` | `rgba(207, 34, 46, 0.1)` |
| `--ml-color-warning` | `#d29922` | `#9a6700` |
| `--ml-color-warning-muted` | `rgba(210, 153, 34, 0.12)` | `rgba(154, 103, 0, 0.1)` |
| `--ml-color-purple` | `#bc8cff` | `#8250df` |
| `--ml-color-purple-muted` | `rgba(188, 140, 255, 0.15)` | `rgba(130, 80, 223, 0.1)` |

### Backgrounds

| Token | Dark | Light |
| --- | --- | --- |
| `--ml-bg` | `#0d1117` | `#ffffff` |
| `--ml-bg-surface` | `#161b22` | `#f6f8fa` |
| `--ml-bg-card` | `#1c2129` | `#ffffff` |
| `--ml-bg-elevated` | `#21262d` | `#ffffff` |

### Text

| Token | Dark | Light |
| --- | --- | --- |
| `--ml-text` | `#e6edf3` | `#1f2328` |
| `--ml-text-muted` | `#8b949e` | `#656d76` |
| `--ml-text-faint` | `#6e7681` | `#8b949e` |

### Borders

| Token | Dark | Light |
| --- | --- | --- |
| `--ml-border` | `#30363d` | `#d0d7de` |
| `--ml-border-subtle` | `rgba(48, 54, 61, 0.5)` | `rgba(208, 215, 222, 0.5)` |

### Spacing

| Token | Value |
| --- | --- |
| `--ml-space-xs` | `4px` |
| `--ml-space-sm` | `8px` |
| `--ml-space-md` | `12px` |
| `--ml-space-lg` | `16px` |
| `--ml-space-xl` | `24px` |
| `--ml-space-2xl` | `32px` |

### Border Radius

| Token | Value |
| --- | --- |
| `--ml-radius-sm` | `6px` |
| `--ml-radius-md` | `8px` |
| `--ml-radius-lg` | `12px` |
| `--ml-radius-xl` | `16px` |
| `--ml-radius-pill` | `999px` |

### Shadows

| Token | Dark | Light |
| --- | --- | --- |
| `--ml-shadow-card` | `0 1px 3px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.03) inset` | `0 1px 3px rgba(31,35,40,0.08), 0 0 0 1px rgba(31,35,40,0.06)` |
| `--ml-shadow-elevated` | `0 8px 24px rgba(0,0,0,0.4)` | `0 8px 24px rgba(31,35,40,0.12)` |
| `--ml-shadow-modal` | `0 24px 70px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04) inset` | `0 24px 70px rgba(31,35,40,0.2), 0 0 0 1px rgba(31,35,40,0.06)` |
| `--ml-shadow-glow` | `0 0 20px rgba(88,166,255,0.08)` | `0 0 20px rgba(9,105,218,0.06)` |

### Glass

| Token | Dark | Light |
| --- | --- | --- |
| `--ml-glass-bg` | `rgba(22, 27, 34, 0.82)` | `rgba(255, 255, 255, 0.85)` |
| `--ml-glass-blur` | `blur(40px)` | `blur(40px)` |
| `--ml-glass-border` | `rgba(48, 54, 61, 0.6)` | `rgba(208, 215, 222, 0.6)` |

### Typography

| Token | Value |
| --- | --- |
| `--ml-font-sans` | `-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif` |
| `--ml-font-mono` | `"SF Mono", "Fira Code", "Courier New", monospace` |
| `--ml-text-xs` | `0.68rem` |
| `--ml-text-sm` | `0.78rem` |
| `--ml-text-base` | `0.88rem` |
| `--ml-text-lg` | `1rem` |
| `--ml-text-xl` | `1.2rem` |
| `--ml-text-2xl` | `1.5rem` |
| `--ml-text-3xl` | `2rem` |

## Public API

Everything exported from `src/index.ts` is the public API and covered by semver:

| Export | Kind | Description |
| --- | --- | --- |
| `cn` | Utility | Merges class names (clsx + tailwind-merge) |
| `usePagination` | Hook | Paginates an array, returns page slice and controls |
| `Pagination` | Component | Renders page navigation UI |
| `PaginationProps` | Type | Props for `Pagination` |
| `StatusPill` | Component | Colored status pill |
| `StatusPillProps` | Type | Props for `StatusPill` |
| `Tag` | Component | Simple badge |
| `ChipRow` | Component | Flex container for `Tag` elements |
| `MetricValue` | Component | Positive/negative colored number |
| `MetricValueProps` | Type | Props for `MetricValue` |

CSS classes (`.ml-*`) and design tokens (`--ml-*`) are also part of the public API.

The compatibility layer (`compat.css`) is **not** covered by semver and will be removed in a future major version.

## Migration from .tt-* Classes

If your project uses the legacy `.tt-*`, `.pg-*`, `.tag`, `.status-pill-*`, or `.metric-*` class names, you can import the compatibility layer to keep them working while you migrate:

```tsx
import "@meir-labs/ui-kit/styles.css";
import "@meir-labs/ui-kit/compat.css"; // temporary — remove after migration
```

### Class Mapping

| Legacy | New |
| --- | --- |
| `.tt-wrap` | `.ml-dt-wrap` |
| `.tt` | `.ml-dt` |
| `.tt-r` | `.ml-dt-r` |
| `.tt-row-link` | `.ml-dt-row-link` |
| `.tt-chevron` | `.ml-dt-chevron` |
| `.tt-chevron-col` | `.ml-dt-chevron-col` |
| `.tt-avatar` | `.ml-dt-avatar` |
| `.tt-primary` | `.ml-dt-primary` |
| `.tt-secondary` | `.ml-dt-secondary` |
| `.tt-time` | `.ml-dt-time` |
| `.tt-truncate` | `.ml-dt-truncate` |
| `.pg` | `.ml-pg` |
| `.pg-arrow` | `.ml-pg-arrow` |
| `.pg-num` | `.ml-pg-num` |
| `.tag` | `.ml-tag` |
| `.status-pill-good` | `.ml-status-pill-good` |
| `.status-pill-warn` | `.ml-status-pill-warn` |
| `.status-pill-neutral` | `.ml-status-pill-neutral` |
| `.chip-row` | `.ml-chip-row` |
| `.metric-positive` | `.ml-metric-positive` |
| `.metric-negative` | `.ml-metric-negative` |

The compat layer also bridges legacy `--token` names (e.g. `--primary`, `--bg`, `--text`) to their `--ml-*` equivalents. Plan to remove `compat.css` once all consumers have migrated.

## Component governance

The library is **intentionally small** — a curated set of primitives, not a
catch-all. Keep it that way:

- **Check what already exists first.** Before building a control, scan the
  components above and `src/components/`. Reach for an existing primitive over a
  hand-rolled `<button className="px-… bg-… rounded-…">`.
- **Extend, don't override.** If a primitive is *almost* right, add a variant or
  size to it (as `Button`'s `secondary` was added) rather than overriding it with
  per-call `className` hacks. One source of truth per control.
- **Don't inline-fork.** When you need a control in more than one place, promote
  it to a primitive here and reuse it — don't copy a styled element across pages.
- **Earn the addition.** A new component should be genuinely distinct from what
  exists (e.g. `SegmentedControl` switches *views* where `Toggle` picks a
  *value*). When two would overlap, extend the existing one or cross-reference
  both so the boundary is clear.

## How to Add a Component

1. Create the component at `src/components/MyComponent.tsx`.
2. Add a story at `src/components/MyComponent.stories.tsx`.
3. Add tests at `src/components/MyComponent.test.tsx`.
4. Export from `src/index.ts`.
5. Document in this `README.md` and `AGENTS.md`.

See [CONTRIBUTING.md](./CONTRIBUTING.md) for full development setup and conventions.

## License

MIT
