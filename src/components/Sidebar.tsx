import {
  type ComponentPropsWithoutRef,
  type ReactNode,
  forwardRef,
} from "react";
import { cn } from "../utils/cn";

export interface SidebarProps extends ComponentPropsWithoutRef<"nav"> {
  /** Collapse to a 64px icon-only rail (labels clip to zero width). */
  collapsed?: boolean;
}

const SidebarRoot = forwardRef<HTMLElement, SidebarProps>(function Sidebar(
  { collapsed, className, children, ...rest },
  ref,
) {
  return (
    <nav
      ref={ref}
      className={cn("ml-sidebar", className)}
      data-collapsed={collapsed ? "true" : undefined}
      {...rest}
    >
      {children}
    </nav>
  );
});

export interface SidebarSectionProps extends ComponentPropsWithoutRef<"div"> {
  /** Uppercase micro-label rendered above the group. */
  label?: ReactNode;
}

/**
 * `Sidebar.Section` — a grouped set of nav items with an optional quiet
 * uppercase micro-label (12px, `--ml-text-muted`). The label hides itself when
 * the parent sidebar is collapsed.
 */
const SidebarSection = forwardRef<HTMLDivElement, SidebarSectionProps>(
  function SidebarSection({ label, className, children, ...rest }, ref) {
    return (
      <div ref={ref} className={cn("ml-sidebar-section", className)} {...rest}>
        {label != null && (
          <div className="ml-sidebar-section-label">{label}</div>
        )}
        {children}
      </div>
    );
  },
);

export interface SidebarItemProps extends ComponentPropsWithoutRef<"button"> {
  /** Marks the item as the current page (sets `aria-current="page"`). */
  active?: boolean;
  /** Leading icon node, rendered in a fixed 20px box. */
  icon?: ReactNode;
}

/**
 * `SidebarItem` — a single nav row (14px/400, 8px×12px padding, 8px radius).
 *
 * Active state is monochrome: a surface shift + full-strength text (never the
 * accent color). When active it also sets `aria-current="page"` so assistive
 * tech, not only styling, conveys the current location.
 */
export const SidebarItem = forwardRef<HTMLButtonElement, SidebarItemProps>(
  function SidebarItem(
    { active, icon, type, className, children, ...rest },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type ?? "button"}
        className={cn("ml-sidebar-item", active && "active", className)}
        aria-current={active ? "page" : undefined}
        {...rest}
      >
        {icon != null && <span className="ml-sidebar-item-icon">{icon}</span>}
        <span className="ml-sidebar-item-label">{children}</span>
      </button>
    );
  },
);

/**
 * `Sidebar` — 240px navigation rail (`--ml-bg-surface`, 1px right border),
 * collapsible to a 64px icon rail via `collapsed`.
 *
 * ```tsx
 * <Sidebar collapsed={collapsed}>
 *   <Sidebar.Section label="Workspace">
 *     <SidebarItem icon={<HomeIcon />} active>Home</SidebarItem>
 *     <SidebarItem icon={<InboxIcon />}>Inbox</SidebarItem>
 *   </Sidebar.Section>
 * </Sidebar>
 * ```
 */
export const Sidebar = Object.assign(SidebarRoot, {
  Section: SidebarSection,
  Item: SidebarItem,
});
