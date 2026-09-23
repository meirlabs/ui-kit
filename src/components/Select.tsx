import {
  type ComponentPropsWithoutRef,
  type ReactNode,
  Children,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "../utils/cn";
import {
  type AnchoredPlacement,
  useAnchoredPosition,
} from "../hooks/useAnchoredPosition";

const isBrowser = typeof document !== "undefined";

interface OptionData {
  value: string;
  textValue: string;
  disabled: boolean;
  node: ReactNode;
}

interface SelectContextValue {
  open: boolean;
  setOpen: (open: boolean, opts?: { focusTrigger?: boolean }) => void;
  value: string | undefined;
  select: (value: string) => void;
  activeValue: string | null;
  setActiveValue: (value: string | null) => void;
  options: OptionData[];
  getOptionId: (value: string) => string;
  listId: string;
  disabled: boolean;
  placeholder?: string;
  placement: AnchoredPlacement;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

const SelectContext = createContext<SelectContextValue | null>(null);

function useSelect(component: string): SelectContextValue {
  const ctx = useContext(SelectContext);
  if (!ctx) throw new Error(`${component} must be used within <Select>`);
  return ctx;
}

/** Walk the tree collecting `Select.Item`s in document order (even when closed). */
function collectOptions(children: ReactNode, out: OptionData[]): void {
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    if (child.type === SelectItem) {
      const props = child.props as SelectItemProps;
      const node = props.children;
      const textValue =
        props.textValue ?? (typeof node === "string" ? node : String(props.value));
      out.push({
        value: props.value,
        textValue,
        disabled: !!props.disabled,
        node,
      });
      return;
    }
    const nested = (child.props as { children?: ReactNode })?.children;
    if (nested) collectOptions(nested, out);
  });
}

export interface SelectProps {
  children: ReactNode;
  /** Controlled selected value. */
  value?: string;
  /** Called when the selection changes. */
  onValueChange?: (value: string) => void;
  /** Initial value (uncontrolled). */
  defaultValue?: string;
  /** Placeholder shown when nothing is selected. */
  placeholder?: string;
  /** Disable the whole control. */
  disabled?: boolean;
  /** Emits a hidden input so the value posts with a native form. */
  name?: string;
  /** Preferred listbox placement. Defaults to `"bottom-start"`. */
  placement?: AnchoredPlacement;
}

/**
 * Select — a themed replacement for the native `<select>` following the APG
 * listbox pattern. Focus stays on the trigger (`role="combobox"`) and the active
 * option is tracked via `aria-activedescendant`. Compose with `Select.Trigger`,
 * `Select.Content`, `Select.Item`, `Select.Group`, and `Select.Separator`.
 */
export function Select({
  children,
  value: controlledValue,
  onValueChange,
  defaultValue,
  placeholder,
  disabled = false,
  name,
  placement = "bottom-start",
}: SelectProps) {
  const [uncontrolled, setUncontrolled] = useState<string | undefined>(defaultValue);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolled;

  const [open, setOpenState] = useState(false);
  const [activeValue, setActiveValue] = useState<string | null>(null);

  const listId = useId();
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const options = useMemo(() => {
    const out: OptionData[] = [];
    collectOptions(children, out);
    return out;
  }, [children]);

  const getOptionId = useCallback(
    (v: string) => {
      const idx = options.findIndex((o) => o.value === v);
      return `${listId}-opt-${idx}`;
    },
    [options, listId],
  );

  const setOpen = useCallback((next: boolean, opts?: { focusTrigger?: boolean }) => {
    setOpenState(next);
    if (!next && opts?.focusTrigger !== false) {
      triggerRef.current?.focus({ preventScroll: true });
    }
  }, []);

  const select = useCallback(
    (v: string) => {
      if (!isControlled) setUncontrolled(v);
      onValueChange?.(v);
      setActiveValue(v);
    },
    [isControlled, onValueChange],
  );

  const ctx = useMemo<SelectContextValue>(
    () => ({
      open,
      setOpen,
      value,
      select,
      activeValue,
      setActiveValue,
      options,
      getOptionId,
      listId,
      disabled,
      placeholder,
      placement,
      triggerRef,
    }),
    [
      open,
      setOpen,
      value,
      select,
      activeValue,
      options,
      getOptionId,
      listId,
      disabled,
      placeholder,
      placement,
    ],
  );

  return (
    <SelectContext.Provider value={ctx}>
      {children}
      {name ? <input type="hidden" name={name} value={value ?? ""} /> : null}
    </SelectContext.Provider>
  );
}

const ChevronIcon = () => (
  <svg
    className="ml-select-chevron"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M4 6l4 4 4-4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M13 4.5L6.5 11.5L3 8"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export interface SelectTriggerProps
  extends Omit<ComponentPropsWithoutRef<"button">, "value"> {
  /** Accessible name for the control. */
  "aria-label"?: string;
}

function SelectTrigger({ className, children, ...rest }: SelectTriggerProps) {
  const {
    open,
    setOpen,
    value,
    select,
    activeValue,
    setActiveValue,
    options,
    getOptionId,
    listId,
    disabled,
    placeholder,
    triggerRef,
  } = useSelect("Select.Trigger");
  const typeahead = useRef<{ buffer: string; timer: ReturnType<typeof setTimeout> | null }>({
    buffer: "",
    timer: null,
  });

  const enabled = useMemo(() => options.filter((o) => !o.disabled), [options]);
  const selected = options.find((o) => o.value === value);

  const openWith = useCallback(
    (initial: string | null) => {
      const start = initial ?? value ?? (enabled.length > 0 ? enabled[0].value : null);
      setActiveValue(start);
      setOpen(true);
    },
    [enabled, setActiveValue, setOpen, value],
  );

  const moveActive = useCallback(
    (dir: 1 | -1 | "first" | "last") => {
      if (enabled.length === 0) return;
      if (dir === "first") return setActiveValue(enabled[0].value);
      if (dir === "last") return setActiveValue(enabled[enabled.length - 1].value);
      const idx = enabled.findIndex((o) => o.value === activeValue);
      let next = idx + dir;
      if (next < 0) next = 0;
      if (next > enabled.length - 1) next = enabled.length - 1;
      setActiveValue(enabled[next].value);
    },
    [enabled, activeValue, setActiveValue],
  );

  const runTypeahead = useCallback(
    (char: string) => {
      const ta = typeahead.current;
      if (ta.timer) clearTimeout(ta.timer);
      ta.buffer += char.toLowerCase();
      ta.timer = setTimeout(() => {
        ta.buffer = "";
      }, 500);

      const pool = enabled;
      if (pool.length === 0) return;
      const anchorVal = open ? activeValue : value;
      const startIdx = Math.max(
        0,
        pool.findIndex((o) => o.value === anchorVal),
      );
      for (let i = 1; i <= pool.length; i++) {
        const opt = pool[(startIdx + i) % pool.length];
        if (opt.textValue.toLowerCase().startsWith(ta.buffer)) {
          if (open) setActiveValue(opt.value);
          else select(opt.value);
          return;
        }
      }
      const self = pool[startIdx];
      if (self && self.textValue.toLowerCase().startsWith(ta.buffer)) {
        if (open) setActiveValue(self.value);
        else select(self.value);
      }
    },
    [enabled, open, activeValue, value, setActiveValue, select],
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (disabled) return;
      const key = e.key;

      if (!open) {
        if (key === "Enter" || key === " " || key === "ArrowDown" || key === "ArrowUp") {
          e.preventDefault();
          openWith(key === "ArrowUp" ? enabled[enabled.length - 1]?.value ?? null : null);
          return;
        }
        if (key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
          e.preventDefault();
          runTypeahead(key);
        }
        return;
      }

      switch (key) {
        case "ArrowDown":
          e.preventDefault();
          moveActive(1);
          break;
        case "ArrowUp":
          e.preventDefault();
          moveActive(-1);
          break;
        case "Home":
          e.preventDefault();
          moveActive("first");
          break;
        case "End":
          e.preventDefault();
          moveActive("last");
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          if (activeValue != null) {
            select(activeValue);
            setOpen(false);
          }
          break;
        case "Escape":
          e.preventDefault();
          setOpen(false);
          break;
        case "Tab":
          setOpen(false, { focusTrigger: false });
          break;
        default:
          if (key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
            e.preventDefault();
            runTypeahead(key);
          }
      }
    },
    [disabled, open, enabled, openWith, moveActive, activeValue, select, setOpen, runTypeahead],
  );

  return (
    <button
      type="button"
      ref={(node) => {
        triggerRef.current = node;
      }}
      className={cn("ml-select-trigger", className)}
      role="combobox"
      aria-haspopup="listbox"
      aria-expanded={open}
      aria-controls={open ? listId : undefined}
      aria-activedescendant={open && activeValue ? getOptionId(activeValue) : undefined}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      data-placeholder={selected ? undefined : "true"}
      onClick={() => {
        if (disabled) return;
        if (open) setOpen(false, { focusTrigger: false });
        else openWith(null);
      }}
      onKeyDown={onKeyDown}
      {...rest}
    >
      <span className="ml-select-value">
        {children ??
          selected?.node ?? (
            <span className="ml-select-placeholder">{placeholder ?? "Select…"}</span>
          )}
      </span>
      <ChevronIcon />
    </button>
  );
}

export interface SelectContentProps extends ComponentPropsWithoutRef<"div"> {}

function SelectContent({ className, children, style, ...rest }: SelectContentProps) {
  const { open, setOpen, activeValue, listId, placement, triggerRef } =
    useSelect("Select.Content");
  const floatingRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);

  const { floatingStyle, placement: resolved } = useAnchoredPosition(
    triggerRef,
    floatingRef,
    { open: mounted, placement, offset: 6, matchWidth: true },
  );

  useEffect(() => {
    if (open) {
      setMounted(true);
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf);
    }
    setVisible(false);
    const t = setTimeout(() => setMounted(false), 160);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!mounted || !open || !activeValue) return;
    const el = listRef.current?.querySelector<HTMLElement>('[data-active="true"]');
    if (el && typeof el.scrollIntoView === "function") el.scrollIntoView({ block: "nearest" });
  }, [activeValue, mounted, open]);

  useEffect(() => {
    if (!mounted || !open) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (floatingRef.current?.contains(target)) return;
      if (triggerRef.current?.contains(target)) return;
      setOpen(false, { focusTrigger: false });
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    return () => document.removeEventListener("pointerdown", onPointerDown, true);
  }, [mounted, open, setOpen, triggerRef]);

  if (!isBrowser || !mounted) return null;

  return createPortal(
    <div
      ref={floatingRef}
      className={cn("ml-select-popover", className)}
      data-placement={resolved}
      data-open={visible ? "true" : "false"}
      style={{
        ...floatingStyle,
        ...style,
        // Portaled to <body>: must clear a Drawer/Modal scrim (z 1400/1500) it may be opened from.
        zIndex: "var(--ml-z-anchored, 1550)" as unknown as number,
      }}
      onMouseDown={(e) => e.preventDefault()}
      {...rest}
    >
      <div ref={listRef} id={listId} role="listbox" className="ml-select-list" tabIndex={-1}>
        {children}
      </div>
    </div>,
    document.body,
  );
}

export interface SelectItemProps
  extends Omit<ComponentPropsWithoutRef<"div">, "onSelect"> {
  value: string;
  disabled?: boolean;
  /** Text used for typeahead when the label isn't a plain string. */
  textValue?: string;
  /** Optional leading icon. */
  icon?: ReactNode;
  children: ReactNode;
}

function SelectItem({
  value,
  disabled = false,
  textValue: _textValue,
  icon,
  className,
  children,
  ...rest
}: SelectItemProps) {
  const { value: selectedValue, select, setOpen, activeValue, setActiveValue, getOptionId } =
    useSelect("Select.Item");
  const isSelected = selectedValue === value;
  const isActive = activeValue === value;

  return (
    <div
      id={getOptionId(value)}
      role="option"
      aria-selected={isSelected}
      aria-disabled={disabled || undefined}
      data-active={isActive ? "true" : undefined}
      data-disabled={disabled ? "true" : undefined}
      className={cn("ml-select-item", className)}
      onClick={() => {
        if (disabled) return;
        select(value);
        setOpen(false);
      }}
      onMouseEnter={() => {
        if (!disabled) setActiveValue(value);
      }}
      {...rest}
    >
      <span className="ml-select-item-check" aria-hidden="true">
        {isSelected ? <CheckIcon /> : null}
      </span>
      {icon ? <span className="ml-select-item-icon">{icon}</span> : null}
      <span className="ml-select-item-label">{children}</span>
    </div>
  );
}

export interface SelectGroupProps extends ComponentPropsWithoutRef<"div"> {
  label?: string;
}

function SelectGroup({ label, className, children, ...rest }: SelectGroupProps) {
  const labelId = useId();
  return (
    <div
      role="group"
      aria-labelledby={label ? labelId : undefined}
      className={cn("ml-select-group", className)}
      {...rest}
    >
      {label ? (
        <div id={labelId} className="ml-select-group-label">
          {label}
        </div>
      ) : null}
      {children}
    </div>
  );
}

function SelectSeparator({ className, ...rest }: ComponentPropsWithoutRef<"div">) {
  return <div role="separator" className={cn("ml-select-separator", className)} {...rest} />;
}

Select.Trigger = SelectTrigger;
Select.Content = SelectContent;
Select.Item = SelectItem;
Select.Group = SelectGroup;
Select.Separator = SelectSeparator;
