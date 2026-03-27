import { type ComponentPropsWithoutRef } from "react";
import { cn } from "../utils/cn";

export interface DetailListProps extends ComponentPropsWithoutRef<"dl"> {
  items: Array<{ label: string; value: React.ReactNode }>;
}

export function DetailList({ items, className, ...rest }: DetailListProps) {
  return (
    <dl className={cn("ml-detail-list", className)} {...rest}>
      {items.map((item) => (
        <div key={item.label}>
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
