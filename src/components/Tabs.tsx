import { type ComponentPropsWithoutRef } from "react";
import { cn } from "../utils/cn";

export interface TabsProps extends Omit<ComponentPropsWithoutRef<"div">, "onChange"> {
  items: Array<{ label: string; value: string }>;
  active: string;
  onChange: (value: string) => void;
}

export function Tabs({ items, active, onChange, className, ...rest }: TabsProps) {
  return (
    <div className={cn("ml-tabs", className)} role="tablist" {...rest}>
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          className={cn("ml-tabs-btn", item.value === active && "active")}
          role="tab"
          aria-selected={item.value === active}
          onClick={() => onChange(item.value)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
