import { type ComponentPropsWithoutRef } from "react";
import { cn } from "../utils/cn";

export function Sidebar({ className, children, ...rest }: ComponentPropsWithoutRef<"nav">) {
  return (
    <nav className={cn("ml-sidebar", className)} {...rest}>
      {children}
    </nav>
  );
}

export interface SidebarItemProps extends ComponentPropsWithoutRef<"button"> {
  active?: boolean;
}

export function SidebarItem({ active, className, children, ...rest }: SidebarItemProps) {
  return (
    <button
      className={cn("ml-sidebar-item", active && "active", className)}
      {...rest}
    >
      {children}
    </button>
  );
}
