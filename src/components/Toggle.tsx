import { type ComponentPropsWithoutRef } from "react";
import { cn } from "../utils/cn";

export interface ToggleProps extends Omit<ComponentPropsWithoutRef<"div">, "onChange"> {
  options: Array<{ label: string; value: string }>;
  active: string;
  onChange: (value: string) => void;
}

export function Toggle({ options, active, onChange, className, ...rest }: ToggleProps) {
  return (
    <div className={cn("ml-toggle", className)} role="radiogroup" {...rest}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={cn(opt.value === active && "active")}
          role="radio"
          aria-checked={opt.value === active}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
