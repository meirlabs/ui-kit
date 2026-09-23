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
 * Compose it with the named exports `ShellSidebar` / `ShellMain`, which
 * apply the wired grid classes:
 *
 * ```tsx
 * import { Shell, ShellSidebar, ShellMain } from "@meir-labs/ui-kit";
 *
 * <Shell>
 *   <ShellSidebar>
 *     <Sidebar>…</Sidebar>
 *   </ShellSidebar>
 *   <ShellMain>
 *     <TopBar … />
 *     <PageHeader title="Dashboard" />
 *   </ShellMain>
 * </Shell>
 * ```
 *
 * - `Shell` → `<div class="ml-shell">` (grid `240px 1fr`, `min-height: 100vh`)
 * - `ShellSidebar` → `<aside class="ml-shell-sidebar">` (grid column 1)
 * - `ShellMain` → `<main class="ml-shell-main">` (scrollable, `scrollbar-gutter: stable`)
 *
 * All three forward refs and pass through native props / `className`.
 *
 * ⚠️ Do NOT use the `Shell.Sidebar` / `Shell.Main` dot-notation form in a
 * Next.js App Router file that is a Server Component (no `"use client"`).
 * This package's whole bundle is a client module (it needs `"use client"`
 * at the top so its context/hooks don't crash on the server); when a
 * *Server* Component imports `Shell` and references `Shell.Sidebar` /
 * `Shell.Main` as a JSX element type, React's server renderer resolves
 * `Shell` to a client-reference placeholder for the cross-boundary handoff
 * — that placeholder does not carry runtime-attached statics, so the
 * property access resolves to `undefined` ("Element type is invalid ...
 * got: undefined"), even though `transpilePackages` is configured and the
 * same code works fine under plain Node ESM or from a Client Component.
 * The named exports above don't have this problem because each is its own
 * top-level module export, so React can resolve it as a real client
 * reference on its own. The dot-notation statics are kept for convenience
 * in Client Components and non-RSC bundler contexts, but the named exports
 * are the only form guaranteed to work everywhere, including a Server
 * Component root layout.
 */
export const Shell = Object.assign(ShellRoot, {
  Sidebar: ShellSidebar,
  Main: ShellMain,
});

export { ShellSidebar, ShellMain };
