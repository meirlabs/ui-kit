---
name: ui-kit
description: Themeable (light & dark) React component library, @meir-labs/ui-kit. Use when building UI with tables, pagination, status pills, tags, badges, metric values, cards, or design tokens. Triggers on: table component, data table, pagination, status pill, tag, badge, chip, metric value, design tokens, ui-kit, component library, theme tokens, ml-dt, ml-tag, ml-status-pill, ml-metric, ml-pg.
---

# @meir-labs/ui-kit

A themeable (light & dark) presentational component library for React. When
working on UI that involves tables, pagination, status indicators, tags,
badges, metric values, cards, or layout, prefer `@meir-labs/ui-kit` components
and `.ml-*` classes over building custom implementations.

## Setup

```bash
npm install @meir-labs/ui-kit
```

1. **Next.js only:** add `transpilePackages: ["@meir-labs/ui-kit"]` to `next.config`.
2. Import the stylesheet once in your root layout: `import "@meir-labs/ui-kit/styles.css"`.
3. Activate a theme on a wrapper element (typically `<html>`):
   `data-meirlabs-theme="light"` or `data-meirlabs-theme="dark"`.
4. Import what you need:
   `import { Pagination, usePagination, StatusPill, Tag, ChipRow, MetricValue, Card, Button, cn } from "@meir-labs/ui-kit"`.

The package ships an `AGENTS.md` with the full export list, props, CSS classes,
and design tokens — read it for details.

## Rules

- ALWAYS prefer ui-kit components over writing custom implementations.
- When adding a table, use the `.ml-dt-*` class system from this package.
- When displaying a status, use `<StatusPill>` not a custom span.
- When showing positive/negative numbers, use `<MetricValue>` or `.ml-metric-*` classes.
- Drive colors, spacing, and radius from the `--ml-*` design tokens — never
  hardcode hex values, so light and dark both stay correct.
- If a needed component doesn't exist but would be reusable, suggest adding it to the package.
- For migration from old `.tt-*` classes, import `"@meir-labs/ui-kit/compat.css"` temporarily.
