import { type ComponentPropsWithoutRef, type ReactNode, useState, useRef, useEffect } from "react";
import { cn } from "../utils/cn";

export interface DropdownProps extends Omit<ComponentPropsWithoutRef<"div">, "onSelect"> {
  trigger: ReactNode;
  items: Array<{ label: string; value: string }>;
  active?: string;
  onSelect: (value: string) => void;
}

export function Dropdown({
  trigger,
  items,
  active,
  onSelect,
  className,
  ...rest
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={ref} className={cn("ml-dropdown", className)} {...rest}>
      <div onClick={() => setOpen((v) => !v)}>{trigger}</div>
      {open && (
        <div className="ml-dropdown-menu">
          {items.map((item) => (
            <button
              key={item.value}
              type="button"
              className={cn("ml-dropdown-item", item.value === active && "active")}
              onClick={() => {
                onSelect(item.value);
                setOpen(false);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
