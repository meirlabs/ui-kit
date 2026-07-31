# @meir-labs/ui-kit

Themeable presentational component library for React — light and dark out of the box.

Provides design tokens, data-table CSS classes, and a full set of ready-made components — basics, layout, navigation, data display, forms, overlays, and feedback — so every MeirLabs project shares the same visual language, interaction states, and accessibility model without duplicating styles.

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

Grouped by area: basics, layout, navigation, data display, overlays, forms,
then feedback (see `src/index.ts` for the canonical export grouping). Every
component ships full interaction states, a keyboard model where it applies,
and respects `prefers-reduced-motion`.

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

### Button

```tsx
import { Button } from "@meir-labs/ui-kit";

<Button variant="primary" size="md">Save</Button>
<Button variant="secondary" leftIcon={<Icon />}>Filter</Button>
<Button variant="danger" loading>Delete</Button>
<Button variant="icon" aria-label="Close"><Icon /></Button>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `"primary" \| "secondary" \| "ghost" \| "danger" \| "icon"` | `"primary"` | Visual treatment. `primary` is the charcoal surface used for the one primary action |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Row height (32/40/48px); font stays 14px |
| `loading` | `boolean` | `false` | Disables and swaps the label for a spinner while reserving width |
| `leftIcon` / `rightIcon` | `ReactNode` | -- | Icon slots either side of the label |
| `as` / `href` | `"button" \| "a"` / `string` | -- | Set `href` to render an anchor with button styling |

### Badge

```tsx
import { Badge } from "@meir-labs/ui-kit";

<Badge tone="success" dot>Live</Badge>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `tone` | `"neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Status tone |
| `size` | `"sm" \| "md"` | `"md"` | -- |
| `dot` | `boolean` | -- | Leading status dot |
| `icon` | `ReactNode` | -- | Leading 12–14px icon |

### Avatar

```tsx
import { Avatar } from "@meir-labs/ui-kit";

<Avatar src="/me.jpg" fallback="MR" status="online" size="md" />
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `src` / `alt` / `fallback` | `string` | -- | Image, alt text, and initials shown when there's no image or it fails to load |
| `size` | `"xs" \| "sm" \| "md" \| "lg"` | `"md"` | -- |
| `status` | `"online" \| "offline" \| "away" \| "busy"` | -- | Presence dot |
| `interactive` | `boolean` | `false` | Renders a focusable `<button>` wrapper with a focus ring, for avatar-menu triggers |
| `round` | `boolean` | `true` | `false` renders an 8px-radius square instead of a circle |

### Label

```tsx
import { Label } from "@meir-labs/ui-kit";

<Label tone="muted">Optional</Label>
```

Standalone text label (`size` `"sm" | "md"`, `tone` `"muted" | "default"`). Prefer `<Field>` for real form labels — it wires `htmlFor`/`aria-*` for you.

### Divider

```tsx
import { Divider } from "@meir-labs/ui-kit";

<Divider />
<Divider orientation="vertical" />
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `"solid" \| "dashed" \| "decorative" \| "diamond"` | `"solid"` | `decorative`/`diamond` are deprecated (decorative glyphs) — use `solid` |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | -- |

### Banner

```tsx
import { Banner } from "@meir-labs/ui-kit";

<Banner tone="warning" title="Trial ending" onDismiss={() => setShown(false)}>
  Your trial ends in 3 days.
</Banner>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `tone` | `"info" \| "success" \| "warning" \| "danger" \| "error"` | -- | -- |
| `icon` | `ReactNode` | -- | Leading icon slot |
| `title` | `ReactNode` | -- | Bold title line |
| `description` | `ReactNode` | -- | Body text; `children` is used when omitted |
| `onDismiss` | `() => void` | -- | Renders a dismiss icon-button when provided |

### Callout

```tsx
import { Callout } from "@meir-labs/ui-kit";

<Callout tone="info" title="Heads up">
  This action can't be undone.
</Callout>
```

Inline tone-colored note block — same prop shape as `Banner` (`tone`, `title`, `icon`, `onDismiss`), sized for inside a form or panel rather than a full-width page banner.

### Placeholder

```tsx
import { Placeholder } from "@meir-labs/ui-kit";

<Placeholder subject="clients" />
```

Decorative "nothing here yet" illustration (`subject`: `"clients" | "documents" | "search" | "calendar"`). Purely `aria-hidden` and token-driven — pair it with `<EmptyState>` for the actual copy and action.

### EditableDocument

```tsx
import { EditableDocument, parseDocFields } from "@meir-labs/ui-kit";

const source = "Dear {{client|Client name}}, your invoice is {{amount|Amount}}.";
const fields = parseDocFields(source); // [{ name: "client", label: "Client name" }, ...]

<EditableDocument source={source} values={values} onChange={(name, value) => setValues(v => ({ ...v, [name]: value }))} />
```

Fill-in-the-blank document editor. Blanks are written as `{{key|label}}` and render as contentEditable islands (empty/filled/focused states); the surrounding prose isn't editable. `parseDocFields` discovers the fields so you can render a companion form.

### Accordion

```tsx
import { Accordion } from "@meir-labs/ui-kit";

<Accordion type="single" value={open} onValueChange={setOpen}>
  <Accordion.Item value="billing" title="Billing">…</Accordion.Item>
  <Accordion.Item value="security" title="Security">…</Accordion.Item>
</Accordion>
```

| Prop | Type | Description |
| --- | --- | --- |
| `type` | `"single" \| "multiple"` | `single`'s `value`/`defaultValue` is a `string`; `multiple`'s is a `string[]` |
| `value` / `defaultValue` / `onValueChange` | matches `type` | Controlled or uncontrolled open state |

`Accordion.Item` takes `value` (required), `title`, and `disabled`.

### OnboardingWidget

```tsx
import { OnboardingWidget, type OnboardingStep } from "@meir-labs/ui-kit";

const steps: OnboardingStep[] = [
  { id: "profile", title: "Complete your profile", completed: true },
  { id: "workspace", title: "Name your workspace", current: true },
  { id: "invite", title: "Invite a teammate", action: { label: "Invite" } },
];

<OnboardingWidget
  title="Set up your workspace"
  steps={steps}
  onStepAction={(id, index) => go(id)}
  onDismiss={() => hide()}
/>
```

A data-driven onboarding checklist card: a progress summary ("2 of 4 complete" + a bar) over a list of steps. Controlled — `steps` and each step's state come in via props; the widget only renders and emits `onStepAction(id, index)`.

| Prop | Type | Description |
| --- | --- | --- |
| `steps` | `OnboardingStep[]` | `{ id; title; description?; completed?; current?; icon?; action? }` — `current` is ignored once `completed` is true; `icon` is the incomplete-state marker (falls back to the step's ordinal number) |
| `title` / `description` | `ReactNode` | Card heading (default `"Get started"`) and optional subheading |
| `onStepAction` | `(stepId, index) => void` | Fires when a step's `action` CTA is activated |
| `onDismiss` | `() => void` | When set, renders a dismiss button |
| `hideProgress` | `boolean` | Hides the progress summary + bar |
| `progressLabel` | `(done, total) => ReactNode` | Overrides the default `"{done} of {total} complete"` summary |

Each step's completed/current/incomplete state is conveyed to assistive tech via visually-hidden text (not color alone); the current step also gets `aria-current="step"`. Themed via tokens — light + dark both correct.

### Shell, Sidebar, TopBar, PageHeader

```tsx
import { Shell, Sidebar, SidebarItem, TopBar, PageHeader } from "@meir-labs/ui-kit";

<Shell>
  <Sidebar collapsed={collapsed}>
    <SidebarItem icon={<Icon />} active>Dashboard</SidebarItem>
  </Sidebar>
  <main>
    <TopBar left={<Logo />} right={<Avatar />} />
    <PageHeader title="Clients" subtitle="12 active" actions={<Button>New</Button>} />
  </main>
</Shell>
```

App-shell scaffolding. `Sidebar` takes `collapsed` (64px icon-only rail); `SidebarItem` takes `active`/`icon`; `TopBar` has `left`/`center`/`right` slots; `PageHeader` takes `title`, `subtitle`, `breadcrumb`, `actions`, and `backHref` or `onBack`.

### Card

```tsx
import { Card } from "@meir-labs/ui-kit";

<Card interactive as="button" onClick={openDetail}>…</Card>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `as` | `ElementType` | `"div"` | Use `"button"`/`"a"` when the whole card is clickable, for native focus/keyboard support |
| `interactive` | `boolean` | `false` | Hover shifts the border toward `--ml-text-muted` |
| `padding` | `"compact" \| "default"` | `"default"` | 12px vs 24px |

### Grid

```tsx
import { Grid } from "@meir-labs/ui-kit";

<Grid columns="auto" minColWidth={200} gap="lg">
  <Card />
  <Card />
</Grid>
```

`columns` — a fixed number, or `"auto"` (default) for a responsive `auto-fit` fill based on `minColWidth`. `gap`: `"sm" | "md" | "lg"` (default `md`).

### Section

```tsx
import { Section } from "@meir-labs/ui-kit";

<Section title="Notifications">…</Section>
```

A content block with a quiet, non-bold `title`.

### DetailList

```tsx
import { DetailList } from "@meir-labs/ui-kit";

<DetailList
  columns={2}
  items={[
    { label: "Email", value: "meir@example.com", onCopy: (v) => navigator.clipboard.writeText(v) },
    { label: "Plan", value: "Pro", fullWidth: true },
  ]}
/>
```

Label/value definition list. Each item can render a copy affordance via `onCopy`/`copyValue`. `columns`: `1 | 2` (default 2, stacks to 1 under 480px).

### DangerZone

```tsx
import { DangerZone, DangerZoneItem } from "@meir-labs/ui-kit";

<DangerZone title="Danger zone">
  <DangerZoneItem
    title="Delete workspace"
    description="This can't be undone."
    onConfirm={() => openConfirmModal()}
  />
</DangerZone>
```

`DangerZoneItem` never imports `Modal` itself — wire your own confirm flow via `onConfirm`. Also takes `actionLabel` (default "Delete"), `disabled`, `loading`, or a full `action` override to replace the trailing button.

### Tabs

```tsx
import { Tabs, TabsPanel } from "@meir-labs/ui-kit";

<Tabs
  aria-label="Account settings"
  tabs={[{ value: "profile", label: "Profile" }, { value: "billing", label: "Billing" }]}
  value={tab}
  onChange={setTab}
/>
<TabsPanel value="profile">…</TabsPanel>
```

`aria-label` is required. Roving-tabindex + arrow-key keyboard model (`role="tablist"`). Each `TabItem` can carry `icon`/`disabled`.

### Toggle

```tsx
import { Toggle } from "@meir-labs/ui-kit";

<Toggle options={[{ label: "List", value: "list" }, { label: "Grid", value: "grid" }]} active={view} onChange={setView} />
```

Value-picker (`role="radiogroup"`, no thumb). See `SegmentedControl` above for the *view*-switcher variant.

### Breadcrumbs

```tsx
import { Breadcrumbs } from "@meir-labs/ui-kit";

<Breadcrumbs items={[{ label: "Clients", href: "/clients" }, { label: "Acme Corp" }]} maxItems={4} />
```

Collapses the middle of the trail into a `…` menu once `items.length` exceeds `maxItems`; first and last item are always visible. `separator` overrides the default chevron.

### Stepper

```tsx
import { Stepper } from "@meir-labs/ui-kit";

<Stepper
  activeStep={1}
  steps={[{ label: "Details" }, { label: "Payment" }, { label: "Confirm" }]}
/>
```

Status per step (`"complete" | "current" | "upcoming"`) is derived from `activeStep` unless a step sets its own `status`. `orientation`: `"horizontal" | "vertical"`.

### DataTable

```tsx
import { DataTable, type Column } from "@meir-labs/ui-kit";

const columns: Column<Client>[] = [
  { id: "name", header: "Name", accessor: "name", sortable: true },
  { id: "mrr", header: "MRR", accessor: (row) => `$${row.mrr}`, numeric: true, sortable: true },
];

<DataTable
  columns={columns}
  data={clients}
  defaultSort={{ columnId: "mrr", direction: "desc" }}
  selectable="multiple"
  onRowClick={(row) => openClient(row.id)}
  loading={isLoading}
  emptyState={<EmptyState title="No clients yet" />}
  footer={<Pagination pageIndex={pageIndex} pageCount={pageCount} onPage={setPage} />}
/>
```

The React table component (the `.ml-dt-*` CSS classes below still work if you'd rather hand-roll one).

| Prop | Type | Description |
| --- | --- | --- |
| `columns` / `data` | `Column<Row>[]` / `Row[]` | `Column.accessor` is a `keyof Row` or a render function; `sortFn` overrides the default comparator |
| `sortState` / `onSortChange` or `defaultSort` | `SortState \| null` | Controlled vs. uncontrolled sort; `manualSort` skips internal sorting for server-sorted data |
| `selectable` / `selectedIds` / `onSelectionChange` | `"single" \| "multiple"` / `string[]` / callback | Row selection |
| `stickyHeader` / `compact` | `boolean` | Layout & density |
| `loading` / `loadingRowCount` / `error` / `emptyState` | -- | Loading skeleton rows (default 5), error slot, empty slot |
| `onRowClick` | `(row: Row) => void` | -- |
| `footer` | `ReactNode` | Slot below the body — drop a `<Pagination>` or summary here |

### StatCard

```tsx
import { StatCard } from "@meir-labs/ui-kit";

<StatCard label="MRR" value="$12,400" delta={4.2} trend="up" />
```

| Prop | Type | Description |
| --- | --- | --- |
| `value` / `label` | `ReactNode` / `string` | Headline figure (tabular-nums) and its muted label |
| `icon` | `ReactNode` | -- |
| `delta` / `trend` / `deltaFormatter` | `number` / `"up" \| "down" \| "neutral"` / formatter | Period-over-period change; trend defaults to the sign of `delta` |
| `loading` | `boolean` | Reserves value/label height with a skeleton |

### EmptyState

```tsx
import { EmptyState } from "@meir-labs/ui-kit";

<EmptyState
  variant="no-data"
  title="No clients yet"
  description="Add your first client to get started."
  action={<Button>Add client</Button>}
/>
```

`variant`: `"no-data"` (dashed illustrated container), `"no-results"`, or `"error"` (plain centered blocks). `icon` wins over the default illustration; `illustration` wins over both.

### Modal

```tsx
import { Modal, Button } from "@meir-labs/ui-kit";

<Modal
  open={open}
  onClose={() => setOpen(false)}
  title="Delete client"
  description="This can't be undone."
  footer={<Button variant="danger" onClick={confirmDelete}>Delete</Button>}
/>
```

Focus-trapped (`useFocusTrap`) and scroll-locked (`useScrollLock`) internally. `size`: `"sm" | "md" | "lg" | "fullscreen"`. `closeOnOverlayClick`/`closeOnEscape` default to `true`; `initialFocusRef` overrides the default "first focusable child" autofocus.

### Dropdown

```tsx
import { Dropdown } from "@meir-labs/ui-kit";

<Dropdown
  trigger={<Button variant="ghost">Actions</Button>}
  items={[
    { label: "Edit", value: "edit" },
    { separator: true },
    { label: "Delete", value: "delete", destructive: true },
  ]}
  onSelect={(value) => handleAction(value)}
/>
```

`trigger` is cloned to receive button semantics + handlers. Items are `{ label, value, icon?, disabled?, destructive? }` or `{ separator: true }`. `align`: `"start" | "end"` (default `start`).

### Drawer

```tsx
import { Drawer } from "@meir-labs/ui-kit";

<Drawer open={open} onClose={() => setOpen(false)} side="right" size="md" title="Filters">
  …
</Drawer>
```

Same open/close/focus contract as `Modal`, sliding in from an edge. `side`: `"left" | "right" | "top" | "bottom"`. `size`: `"sm" | "md" | "lg"` (~320/420/560px along the panel's axis).

### CommandPalette

```tsx
import { CommandPalette } from "@meir-labs/ui-kit";

<CommandPalette
  open={open}
  onOpenChange={setOpen}
  items={[
    { id: "new-client", label: "New client", shortcut: ["mod", "N"], onSelect: createClient },
    { id: "settings", label: "Settings", group: "Navigate", onSelect: goToSettings },
  ]}
/>
```

Cmd/Ctrl+K fuzzy launcher. `enableShortcut` (default `true`) registers the global toggle. Items sharing a `group` render together; `keywords` extend what the filter matches beyond `label`; `shortcut` renders a trailing `<Kbd>` hint.

### Kbd

```tsx
import { Kbd } from "@meir-labs/ui-kit";

<Kbd keys={["mod", "K"]} />
```

Renders a keyboard-shortcut cap. `keys` map logical names (`mod`, `shift`, `enter`, arrows…) to platform glyphs (⌘ on macOS, Ctrl elsewhere) unless `mapGlyphs={false}`; pass `children` for freeform content instead.

### Tooltip

```tsx
import { Tooltip } from "@meir-labs/ui-kit";

<Tooltip content="Copy to clipboard">
  <Button variant="icon" aria-label="Copy"><Icon /></Button>
</Tooltip>
```

Wraps a single focusable child. `content` should stay short and non-interactive (use `Popover` for interactive panels). `placement` (default `"top"`), `delay` (300ms open), `closeDelay` (60ms close), `disabled`.

### Popover

```tsx
import { Popover } from "@meir-labs/ui-kit";

<Popover>
  <Popover.Trigger asChild><Button variant="ghost">Share</Button></Popover.Trigger>
  <Popover.Content aria-label="Share settings">…</Popover.Content>
</Popover>
```

Compound component (`Popover`, `Popover.Trigger`, `Popover.Content`) for anchored, interactive panels. Supports controlled (`open`/`onOpenChange`) or uncontrolled (`defaultOpen`) state, `placement`, and an external `anchor` ref for triggerless positioning.

### Select

```tsx
import { Select } from "@meir-labs/ui-kit";

<Select value={value} onValueChange={setValue} placeholder="Choose a plan" name="plan">
  <Select.Trigger aria-label="Plan" />
  <Select.Content>
    <Select.Group label="Individual">
      <Select.Item value="free">Free</Select.Item>
      <Select.Item value="pro">Pro</Select.Item>
    </Select.Group>
  </Select.Content>
</Select>
```

Compound listbox (`Select`, `Select.Trigger`, `Select.Content`, `Select.Item`, `Select.Group`). `name` emits a hidden input so the value posts with a native form; `Select.Item` accepts `textValue` for typeahead when its label isn't a plain string.

### Combobox

```tsx
import { Combobox } from "@meir-labs/ui-kit";

<Combobox
  aria-label="Assignee"
  options={people.map((p) => ({ value: p.id, label: p.name }))}
  value={assigneeId}
  onValueChange={setAssigneeId}
/>
```

Filterable input + listbox. `aria-label` is required. `value`/`onValueChange` are `string` (or `string[]` when `multiple`); `onFilter` overrides the default case-insensitive substring match; `allowCustomValue` lets users commit free text not in `options`; `renderChip` customizes multi-select chips.

### Field

```tsx
import { Field, Input } from "@meir-labs/ui-kit";

<Field label="Email" hint="We'll never share it" error={errors.email} required>
  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
</Field>
```

Wraps a single form control and injects `id`/`aria-describedby`/`aria-invalid`/`aria-required` onto it automatically. `error` also renders as `role="alert"` with danger styling.

### Wizard

```tsx
import { Wizard } from "@meir-labs/ui-kit";

<Wizard steps={3} current={step} onStepChange={setStep} stepTitles={["Details", "Payment", "Confirm"]}>
  {step === 0 && <DetailsStep />}
  {step === 1 && <PaymentStep />}
  {step === 2 && <ConfirmStep />}
</Wizard>
```

Multi-step flow shell. When `footer` is omitted and `onStepChange` is set, a Back/Next footer is rendered for you, gated by `onValidateStep` (sync or async — return/resolve `false` to block advancing).

### Input

```tsx
import { Input } from "@meir-labs/ui-kit";

<Input size="md" placeholder="you@example.com" prefix="https://" invalid={!!error} />
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | 32/40/48px |
| `leftIcon` / `rightIcon` | `ReactNode` | -- | Decorative 20px icon slots |
| `prefix` / `suffix` | `ReactNode` | -- | Inline adornments (e.g. `https://`, `.com`) |
| `invalid` | `boolean` | -- | Danger border + focus ring, sets `aria-invalid` |

### Textarea

```tsx
import { Textarea } from "@meir-labs/ui-kit";

<Textarea autoResize minRows={3} maxRows={8} />
```

`autoResize` grows the field to fit its content between `minRows` and `maxRows` (beyond which it scrolls). `invalid` matches `Input`.

### Checkbox

```tsx
import { Checkbox } from "@meir-labs/ui-kit";

<Checkbox label="Email me updates" description="Occasional product news." checked={checked} onChange={(e) => setChecked(e.target.checked)} />
<Checkbox indeterminate label="Select all" />
```

`indeterminate` sets the underlying `input.indeterminate` via ref — it's not a real HTML attribute.

### Radio / RadioGroup

```tsx
import { Radio, RadioGroup } from "@meir-labs/ui-kit";

<RadioGroup value={plan} onChange={setPlan} aria-label="Plan">
  <Radio value="free" label="Free" />
  <Radio value="pro" label="Pro" description="For growing teams" />
</RadioGroup>
```

`RadioGroup` owns `value`/`defaultValue`/`onChange`/`name` (auto-generated if omitted)/`orientation`/`disabled` (disables every radio inside).

### FileUpload

```tsx
import { FileUpload } from "@meir-labs/ui-kit";

<FileUpload
  accept="image/*,.pdf"
  maxSize={5 * 1024 * 1024}
  onFiles={(files) => upload(files)}
  progress={uploadProgress}
/>
```

Drag-and-drop dropzone. Rejects files over `maxSize` bytes. `progress` is a per-file `0–100` map keyed by `file.name`, for showing upload state per item.

### Toaster / ToastProvider / useToast

```tsx
import { ToastProvider, useToast } from "@meir-labs/ui-kit";

// once, near the app root
<ToastProvider placement="bottom-right" maxVisible={3}>
  <App />
</ToastProvider>

// anywhere below it
const { toast } = useToast();
toast({ title: "Saved", tone: "success", duration: 4000 });
toast({ title: "Upload failed", tone: "danger", action: { label: "Retry", onClick: retry } });
```

`ToastProvider` holds the toast queue (FIFO past `maxVisible`), schedules auto-dismiss timers that pause on hover/focus, and renders the portal `Toaster` region — you shouldn't need to render `Toaster` yourself. Pass a stable `id` in `ToastOptions` to update a toast in place.

### Spinner

```tsx
import { Spinner } from "@meir-labs/ui-kit";

<Spinner size="sm" label="Loading" />
```

Inline loading indicator. `label` is visually hidden but announced to screen readers.

### CometLoader

```tsx
import { CometLoader } from "@meir-labs/ui-kit";

<CometLoader size="md" label="Analyzing domain" />
```

Indeterminate loader for AI / agentic work-in-progress: a 4×4 `currentColor` dot grid whose bright head and fading tail orbit a clockwise spiral. Inherits the text color of its parent (defaults to `--ml-text-muted`), so wrap it in an element with the color you want. `size`: `"sm" | "md" | "lg"` (16/20/24px). Reduced-motion freezes the orbit to a static grid with a soft opacity pulse. Use `Spinner` for generic async waits; reach for `CometLoader` when the wait is an AI thinking or generating.

### Skeleton / SkeletonText

```tsx
import { Skeleton, SkeletonText } from "@meir-labs/ui-kit";

<Skeleton variant="circle" width={40} height={40} />
<SkeletonText lines={3} />
```

`variant`: `"text" | "rect" | "circle"`. `SkeletonText` renders multiple `lines` of text-shaped skeletons.

### Progress

```tsx
import { Progress } from "@meir-labs/ui-kit";

<Progress value={64} max={100} showValue label="Upload progress" />
<Progress /> {/* indeterminate */}
```

Omit `value` for an indeterminate bar. `tone`: `"neutral" | "success" | "warning" | "danger"` (defaults to monochrome `--ml-text`). `showValue` renders the numeric percentage beside the track.


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
`[data-meirlabs-theme="light"]` on a wrapper (typically `<html>`). Motion and
the z-index scale are theme-independent. Spacing, radius, and typography are
shared across both themes.

### Monochrome neutralization

`--ml-color-primary`/`--ml-color-purple` (and their `-muted` variants) are
still defined — for `compat.css` and legacy classes — but now **resolve to
neutral text/surface tokens** instead of blue/purple, so nothing renders an
accent color by accident. `--ml-shadow-glow` was neutralized the same way.
Functional status colors (`success`/`warning`/`danger`) are unchanged. Reach
for `--ml-neutral-fill`/`--ml-neutral-text` for neutral pills/badges instead of
the primary/purple tokens, and `.ml-btn-primary` (charcoal) for emphasis.

### Colors

| Token | Dark | Light |
| --- | --- | --- |
| `--ml-color-primary` | `var(--ml-text)` *(neutralized, was `#58a6ff`)* | `var(--ml-text)` *(neutralized, was `#0969da`)* |
| `--ml-color-primary-muted` | `var(--ml-bg-surface)` *(neutralized)* | `var(--ml-bg-surface)` *(neutralized)* |
| `--ml-color-success` | `#3fb950` | `#1a7f37` |
| `--ml-color-success-muted` | `rgba(63, 185, 80, 0.12)` | `rgba(26, 127, 55, 0.1)` |
| `--ml-color-danger` | `#f85149` | `#cf222e` |
| `--ml-color-danger-muted` | `rgba(248, 81, 73, 0.12)` | `rgba(207, 34, 46, 0.1)` |
| `--ml-color-warning` | `#d29922` | `#9a6700` |
| `--ml-color-warning-muted` | `rgba(210, 153, 34, 0.12)` | `rgba(154, 103, 0, 0.1)` |
| `--ml-color-purple` | `var(--ml-text-muted)` *(neutralized, was `#bc8cff`)* | `var(--ml-text-muted)` *(neutralized, was `#8250df`)* |
| `--ml-color-purple-muted` | `var(--ml-bg-surface)` *(neutralized)* | `var(--ml-bg-surface)` *(neutralized)* |
| `--ml-neutral-fill` | `var(--ml-bg-surface)` | `var(--ml-bg-surface)` |
| `--ml-neutral-text` | `var(--ml-text-muted)` | `var(--ml-text-muted)` |
| `--ml-overlay` | `rgba(0, 0, 0, 0.7)` | `rgba(0, 0, 0, 0.5)` |

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

Layered stacks approximating a 1→3→6→12→24→48 elevation doubling (blur=`b`,
offsetY=`b/2`, spread=`-b/2`), plus a preserved inset top-ring highlight (dark)
or hairline perimeter ring (light) that intensifies as the surface lifts.
These are the **only** sanctioned shadow source — never write a raw
`box-shadow` in app CSS.

| Token | Dark | Light |
| --- | --- | --- |
| `--ml-shadow-card` | `0 1px 1px -0.5px rgba(0,0,0,.4), 0 2px 3px -1.5px rgba(0,0,0,.36), 0 3px 6px -3px rgba(0,0,0,.3), inset 0 0 0 1px rgba(255,255,255,.03)` | `0 0 0 1px rgba(31,35,40,.06), 0 1px 1px -0.5px rgba(31,35,40,.08), 0 2px 3px -1.5px rgba(31,35,40,.06), 0 3px 6px -3px rgba(31,35,40,.05)` |
| `--ml-shadow-elevated` | `0 2px 3px -1.5px rgba(0,0,0,.4), 0 3px 6px -3px rgba(0,0,0,.38), 0 6px 12px -6px rgba(0,0,0,.36), 0 12px 24px -12px rgba(0,0,0,.34), inset 0 0 0 1px rgba(255,255,255,.035)` | `0 0 0 1px rgba(31,35,40,.06), 0 2px 3px -1.5px rgba(31,35,40,.06), 0 3px 6px -3px rgba(31,35,40,.06), 0 6px 12px -6px rgba(31,35,40,.08), 0 12px 24px -12px rgba(31,35,40,.1)` |
| `--ml-shadow-modal` | `0 3px 6px -3px rgba(0,0,0,.4), 0 6px 12px -6px rgba(0,0,0,.42), 0 12px 24px -12px rgba(0,0,0,.46), 0 24px 48px -24px rgba(0,0,0,.5), inset 0 0 0 1px rgba(255,255,255,.04)` | `0 0 0 1px rgba(31,35,40,.06), 0 3px 6px -3px rgba(31,35,40,.05), 0 6px 12px -6px rgba(31,35,40,.07), 0 12px 24px -12px rgba(31,35,40,.1), 0 24px 48px -24px rgba(31,35,40,.16)` |
| `--ml-shadow-glow` | `0 0 20px rgba(0,0,0,0.25)` *(neutralized, was blue)* | `0 0 20px rgba(31,35,40,0.06)` *(neutralized)* |

### Z-Index scale (theme-independent)

Every overlay CSS file references these tokens instead of numeric literals, so
stacking always coordinates: `dropdown` (1000) → `sticky` (1100) → `popover`
(1200) → `tooltip` (1300) → `drawer` (1400) → `modal` (1500) → `toast` (1600)
→ `command` (1700).

| Token | Value |
| --- | --- |
| `--ml-z-dropdown` | `1000` |
| `--ml-z-sticky` | `1100` |
| `--ml-z-popover` | `1200` |
| `--ml-z-tooltip` | `1300` |
| `--ml-z-drawer` | `1400` |
| `--ml-z-modal` | `1500` |
| `--ml-z-toast` | `1600` |
| `--ml-z-command` | `1700` |

### Motion (theme-independent)

Calibrated to the design system's motion foundation. Every animated component
in the kit respects `prefers-reduced-motion` automatically.

| Token | Value | Use |
| --- | --- | --- |
| `--ml-duration-press` | `60ms` | `:active` transform feedback |
| `--ml-duration-fast` | `120ms` | Tight color/border shifts |
| `--ml-duration-base` | `150ms` | Interactive default (hover color/border/bg, focus) |
| `--ml-duration-slow` | `200ms` | Expand/collapse (small elements) |
| `--ml-duration-exit` | `450ms` | Overlay/list dissolve |
| `--ml-duration-entrance` | `800ms` | Landing scroll reveal (exempt from the sub-300ms UI rule) |
| `--ml-ease` | `ease` | Plain interactive default |
| `--ml-ease-out` | `cubic-bezier(0.23, 1, 0.32, 1)` | Strong ease-out for deliberate UI |
| `--ml-ease-entrance` | `cubic-bezier(0.25, 0.46, 0.45, 0.94)` | Landing fade-up |
| `--ml-stagger` | `100ms` | Between siblings on entrance |
| `--ml-stagger-tight` | `80ms` | Word-by-word splits |
| `--ml-press-scale` | `0.97` | Press feedback floor (never lower) |

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

Everything exported from `src/index.ts` is the public API and covered by
semver — including each component's props type (`XProps`) and any
tone/variant/size unions, which aren't listed line-by-line below.

| Export | Kind | Description |
| --- | --- | --- |
| `cn` | Utility | Merges class names (clsx + tailwind-merge) |
| `usePagination` | Hook | Paginates an array, returns page slice and controls |
| `useFocusTrap` | Hook | Traps Tab/Shift+Tab focus inside a ref'd container |
| `useScrollLock` | Hook | Ref-counted body scroll lock for overlays |
| `useAnchoredPosition` | Hook | Positions a floating element against an anchor (flip + clamp) |
| `useToast` | Hook | Reads the toast API from a `<ToastProvider>` |
| `Button` | Component | Primary interactive control |
| `Badge` | Component | Small status/count label |
| `Avatar` | Component | Image/initials with presence status |
| `Label` | Component | Standalone text label |
| `Divider` | Component | Horizontal/vertical rule |
| `EditableDocument`, `parseDocFields` | Component, Utility | Fill-in-the-blank document editor |
| `Placeholder` | Component | Decorative empty-state illustration |
| `Banner` | Component | Page/section-level tone message |
| `StatusPill` | Component | Colored status pill |
| `Tag` | Component | Removable badge/chip |
| `ChipRow` | Component | Flex container for `Tag` elements |
| `MetricValue` | Component | Positive/negative colored number |
| `Shell`, `Sidebar`, `SidebarItem`, `TopBar`, `PageHeader` | Component | App-shell scaffolding |
| `Card` | Component | Surface container |
| `Grid` | Component | Responsive grid |
| `Section` | Component | Content block with a quiet title |
| `DetailList` | Component | Label/value definition list |
| `DangerZone`, `DangerZoneItem` | Component | Destructive-actions panel |
| `Accordion` (+ `.Item`) | Component | Expand/collapse groups |
| `Tabs`, `TabsPanel` | Component | Tabbed navigation |
| `Toggle` | Component | Radiogroup value-picker |
| `SegmentedControl` | Component | 2–3 view switcher with a sliding thumb |
| `Pagination`, `getPaginationRange`, `PAGINATION_DOTS` | Component, Utility | Page navigation UI |
| `Breadcrumbs` | Component | Collapsible trail |
| `DataTable`, `Column`, `SortState` | Component, Type | Sortable/selectable data table |
| `StatCard` | Component | KPI tile with delta/trend |
| `EmptyState` | Component | No-data/no-results/error block |
| `Modal` | Component | Focus-trapped dialog |
| `Dropdown` | Component | Menu on a trigger |
| `Drawer` | Component | Slide-in side panel |
| `CommandPalette` | Component | Cmd/Ctrl+K fuzzy launcher |
| `Kbd` | Component | Keyboard-shortcut cap |
| `Tooltip` | Component | Hover/focus label |
| `Popover` (+ `.Trigger`, `.Content`) | Component | Anchored interactive panel |
| `Select` (+ `.Trigger`, `.Content`, `.Item`, `.Group`) | Component | Custom listbox |
| `Combobox` | Component | Filterable input + listbox |
| `Field` | Component | Label/hint/error wiring for a form control |
| `Wizard` | Component | Multi-step flow shell |
| `Input` | Component | Text field |
| `Textarea` | Component | Multi-line field |
| `Checkbox` | Component | Checkbox with indeterminate state |
| `Radio`, `RadioGroup` | Component | Radio group |
| `Stepper` | Component | Numbered step progress |
| `FileUpload` | Component | Drag-and-drop dropzone |
| `Toaster`, `ToastProvider`, `useToast` | Component, Hook | Toast queue + notification region |
| `Callout` | Component | Inline tone-colored note block |
| `Spinner` | Component | Inline loading indicator |
| `CometLoader` | Component | AI/agentic loading indicator (spiral dot grid) |
| `Skeleton`, `SkeletonText` | Component | Loading placeholder |
| `Progress` | Component | Determinate/indeterminate progress bar |

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
