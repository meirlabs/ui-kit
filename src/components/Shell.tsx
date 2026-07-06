import { type ComponentPropsWithoutRef, forwardRef } from "react";
import { cn } from "../utils/cn";

export type ShellProps = ComponentPropsWithoutRef<"div">;
export type ShellSidebarProps = ComponentPropsWithoutRef<"aside">;
export type ShellMainProps = ComponentPropsWithoutRef<"main">;

const ShellRoot = forwardRef<HTMLDivElement, ShellProps>(function Shell(
  { className, children, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cn("ml-shell", className)} {...rest}>
      {children}
    </div>
  );
});

const ShellSidebar = forwardRef<HTMLElement, ShellSidebarProps>(
  function ShellSidebar({ className, children, ...rest }, ref) {
    return (
      <aside ref={ref} className={cn("ml-shell-sidebar", className)} {...rest}>
        {children}
      </aside>
    );
  },
);

const ShellMain = forwardRef<HTMLElement, ShellMainProps>(function ShellMain(
  { className, children, ...rest },
  ref,
) {
  return (
    <main ref={ref} className={cn("ml-shell-main", className)} {...rest}>
      {children}
    </main>
  );
});

/**
 * `Shell` — the top-level app frame.
 *
 * Renders a full-height CSS grid with a fixed `240px` sidebar column and a
 * fluid `1fr` main column. Under `640px` it collapses to a single stacked
 * column (sidebar on top, main below).
 *
 * Compose it with the attached statics, which apply the wired grid classes:
 *
 * ```tsx
 * <Shell>
 *   <Shell.Sidebar>
 *     <Sidebar>…</Sidebar>
 *   </Shell.Sidebar>
 *   <Shell.Main>
 *     <TopBar … />
 *     <PageHeader title="Dashboard" />
 *   </Shell.Main>
 * </Shell>
 * ```
 *
 * - `Shell` → `<div class="ml-shell">` (grid `240px 1fr`, `min-height: 100vh`)
 * - `Shell.Sidebar` → `<aside class="ml-shell-sidebar">` (grid column 1)
 * - `Shell.Main` → `<main class="ml-shell-main">` (scrollable, `scrollbar-gutter: stable`)
 *
 * All three forward refs and pass through native props / `className`.
 */
export const Shell = Object.assign(ShellRoot, {
  Sidebar: ShellSidebar,
  Main: ShellMain,
});
