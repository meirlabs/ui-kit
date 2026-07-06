import {
  type ComponentPropsWithoutRef,
  type ReactNode,
  useCallback,
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

export interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

type ComboValue<M extends boolean> = M extends true ? string[] : string | undefined;

export interface ComboboxProps
  extends Omit<
    ComponentPropsWithoutRef<"div">,
    "onChange" | "defaultValue" | "value" | "onSelect"
  > {
  options: ComboboxOption[];
  /** Controlled selection (`string` for single, `string[]` for multi). */
  value?: string | string[];
  /** Called when the selection changes. */
  onValueChange?: (value: string | string[]) => void;
  /** Initial selection (uncontrolled). */
  defaultValue?: string | string[];
  /** Controlled text in the input. */
  inputValue?: string;
  /** Called as the user edits the input text. */
  onInputChange?: (value: string) => void;
  /** Custom filter; defaults to case-insensitive substring on `label`. */
  onFilter?: (options: ComboboxOption[], query: string) => ComboboxOption[];
  /** Allow committing free text that isn't in `options`. */
  allowCustomValue?: boolean;
  /** Show a spinner in place of the chevron. */
  loading?: boolean;
  /** Rendered when the filtered list is empty. */
  emptyState?: ReactNode;
  /** Enable multi-select with chips. */
  multiple?: boolean;
  /** Custom chip renderer (multi-select). */
  renderChip?: (option: ComboboxOption, onRemove: () => void) => ReactNode;
  placeholder?: string;
  disabled?: boolean;
  /** Emits hidden input(s) so the value posts with a native form. */
  name?: string;
  placement?: AnchoredPlacement;
  "aria-label": string;
}

const Spinner = () => (
  <svg
    className="ml-combobox-spinner"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
  >
    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" />
    <path d="M14 8a6 6 0 0 0-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const ChevronIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M4 6l4 4 4-4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const RemoveIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

function defaultFilter(options: ComboboxOption[], query: string): ComboboxOption[] {
  if (!query) return options;
  const q = query.toLowerCase();
  return options.filter((o) => o.label.toLowerCase().includes(q));
}

/**
 * Combobox — a Select with a free-text filter (APG combobox with list
 * autocomplete). Supports sync/async option lists, custom values, loading and
 * empty states, and optional multi-select chips.
 */
export function Combobox({
  options,
  value: controlledValue,
  onValueChange,
  defaultValue,
  inputValue: controlledInput,
  onInputChange,
  onFilter,
  allowCustomValue = false,
  loading = false,
  emptyState = "No results",
  multiple = false,
  renderChip,
  placeholder,
  disabled = false,
  name,
  placement = "bottom-start",
  className,
  "aria-label": ariaLabel,
  ...rest
}: ComboboxProps) {
  const listId = useId();
  const inputId = useId();
  const controlRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const floatingRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isValueControlled = controlledValue !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState<string | string[]>(
    defaultValue ?? (multiple ? [] : ""),
  );
  const rawValue = isValueControlled ? controlledValue : uncontrolledValue;
  const selectedValues = useMemo<string[]>(
    () => (Array.isArray(rawValue) ? rawValue : rawValue ? [rawValue] : []),
    [rawValue],
  );

  const isInputControlled = controlledInput !== undefined;
  // Single-select: seed the visible text from the initial selection so a
  // defaultValue / controlled value shows its label instead of an empty field.
  // Multi-select shows chips, so the text stays as the filter query.
  const [uncontrolledInput, setUncontrolledInput] = useState(() => {
    if (multiple) return "";
    const initial = defaultValue ?? controlledValue;
    const v = Array.isArray(initial) ? initial[0] : initial;
    if (!v) return "";
    return options.find((o) => o.value === v)?.label ?? v;
  });
  const inputValue = isInputControlled ? controlledInput : uncontrolledInput;

  const [open, setOpenState] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  const filtered = useMemo(
    () => (onFilter ? onFilter(options, inputValue) : defaultFilter(options, inputValue)),
    [onFilter, options, inputValue],
  );

  const { floatingStyle, placement: resolved } = useAnchoredPosition(
    controlRef,
    floatingRef,
    { open: mounted, placement, offset: 6, matchWidth: true },
  );

  const setOpen = useCallback((next: boolean) => setOpenState(next), []);

  const setInput = useCallback(
    (v: string) => {
      if (!isInputControlled) setUncontrolledInput(v);
      onInputChange?.(v);
    },
    [isInputControlled, onInputChange],
  );

  const commitValue = useCallback(
    (next: string[]) => {
      const out: string | string[] = multiple ? next : (next[0] ?? "");
      if (!isValueControlled) setUncontrolledValue(out);
      onValueChange?.(out);
    },
    [multiple, isValueControlled, onValueChange],
  );

  const optionId = useCallback((index: number) => `${listId}-opt-${index}`, [listId]);

  // Keep the single-select input text in sync when the selected value changes
  // externally (controlled update or programmatic reset). Only fires on an
  // actual value change — typing leaves rawValue untouched, so the filter query
  // is never clobbered. Skipped while the input text is controlled.
  const prevSyncedValue = useRef<string | undefined>(
    multiple ? undefined : (Array.isArray(rawValue) ? rawValue[0] : rawValue) || undefined,
  );
  useEffect(() => {
    if (multiple || isInputControlled) return;
    const single = (Array.isArray(rawValue) ? rawValue[0] : rawValue) || undefined;
    if (single === prevSyncedValue.current) return;
    prevSyncedValue.current = single;
    setUncontrolledInput(
      single ? (options.find((o) => o.value === single)?.label ?? single) : "",
    );
  }, [rawValue, multiple, isInputControlled, options]);

  // Mount/unmount around the transition.
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

  // Reset the highlight whenever the filtered set changes.
  useEffect(() => {
    setActiveIndex(filtered.length > 0 && !allowCustomValue ? 0 : -1);
  }, [filtered, allowCustomValue]);

  // Keep the active option scrolled into view.
  useEffect(() => {
    if (!mounted || !open || activeIndex < 0) return;
    const el = listRef.current?.querySelector<HTMLElement>('[data-active="true"]');
    if (el && typeof el.scrollIntoView === "function") el.scrollIntoView({ block: "nearest" });
  }, [activeIndex, mounted, open]);

  // Click-outside dismiss.
  useEffect(() => {
    if (!mounted || !open) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (controlRef.current?.contains(target)) return;
      if (floatingRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    return () => document.removeEventListener("pointerdown", onPointerDown, true);
  }, [mounted, open, setOpen]);

  useEffect(() => () => {
    if (blurTimer.current) clearTimeout(blurTimer.current);
  }, []);

  const selectOption = useCallback(
    (opt: ComboboxOption) => {
      if (opt.disabled) return;
      if (multiple) {
        const exists = selectedValues.includes(opt.value);
        commitValue(
          exists ? selectedValues.filter((v) => v !== opt.value) : [...selectedValues, opt.value],
        );
        setInput("");
        inputRef.current?.focus();
      } else {
        commitValue([opt.value]);
        setInput(opt.label);
        setOpen(false);
      }
    },
    [multiple, selectedValues, commitValue, setInput, setOpen],
  );

  const commitCustom = useCallback(() => {
    const trimmed = inputValue.trim();
    if (!allowCustomValue || !trimmed) return;
    if (multiple) {
      if (!selectedValues.includes(trimmed)) commitValue([...selectedValues, trimmed]);
      setInput("");
    } else {
      commitValue([trimmed]);
      setOpen(false);
    }
  }, [allowCustomValue, inputValue, multiple, selectedValues, commitValue, setInput, setOpen]);

  const removeChip = useCallback(
    (v: string) => {
      commitValue(selectedValues.filter((x) => x !== v));
      inputRef.current?.focus();
    },
    [selectedValues, commitValue],
  );

  const moveActive = useCallback(
    (dir: 1 | -1) => {
      const enabled = filtered
        .map((o, i) => ({ o, i }))
        .filter(({ o }) => !o.disabled);
      if (enabled.length === 0) return;
      const currentPos = enabled.findIndex(({ i }) => i === activeIndex);
      let nextPos = currentPos + dir;
      if (nextPos < 0) nextPos = enabled.length - 1;
      if (nextPos > enabled.length - 1) nextPos = 0;
      setActiveIndex(enabled[nextPos].i);
    },
    [filtered, activeIndex],
  );

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!open) setOpen(true);
        else moveActive(1);
        break;
      case "ArrowUp":
        e.preventDefault();
        if (!open) setOpen(true);
        else moveActive(-1);
        break;
      case "Enter":
        if (open && activeIndex >= 0 && filtered[activeIndex]) {
          e.preventDefault();
          selectOption(filtered[activeIndex]);
        } else if (allowCustomValue && inputValue.trim()) {
          e.preventDefault();
          commitCustom();
        }
        break;
      case "Escape":
        if (open) {
          e.preventDefault();
          setOpen(false);
        } else if (inputValue) {
          e.preventDefault();
          setInput("");
        }
        break;
      case "Backspace":
        if (multiple && inputValue === "" && selectedValues.length > 0) {
          removeChip(selectedValues[selectedValues.length - 1]);
        }
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  };

  const activeDescendant = open && activeIndex >= 0 ? optionId(activeIndex) : undefined;
  const selectedOptions = selectedValues
    .map((v) => options.find((o) => o.value === v) ?? { value: v, label: v })
    .filter(Boolean) as ComboboxOption[];

  return (
    <div ref={controlRef} className={cn("ml-combobox", className)} {...rest}>
      <div
        className="ml-combobox-control"
        data-disabled={disabled ? "true" : undefined}
        data-open={open ? "true" : undefined}
        onClick={() => {
          if (!disabled) {
            inputRef.current?.focus();
            setOpen(true);
          }
        }}
      >
        {multiple &&
          selectedOptions.map((opt) =>
            renderChip ? (
              <span key={opt.value}>{renderChip(opt, () => removeChip(opt.value))}</span>
            ) : (
              <span key={opt.value} className="ml-combobox-chip">
                <span className="ml-combobox-chip-label">{opt.label}</span>
                <button
                  type="button"
                  className="ml-combobox-chip-remove"
                  aria-label={`Remove ${opt.label}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeChip(opt.value);
                  }}
                >
                  <RemoveIcon />
                </button>
              </span>
            ),
          )}
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          role="combobox"
          className="ml-combobox-input"
          aria-label={ariaLabel}
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          aria-activedescendant={activeDescendant}
          autoComplete="off"
          spellCheck={false}
          disabled={disabled}
          placeholder={selectedOptions.length && multiple ? "" : placeholder}
          value={inputValue}
          onChange={(e) => {
            setInput(e.target.value);
            if (!open) setOpen(true);
          }}
          onFocus={() => {
            if (blurTimer.current) clearTimeout(blurTimer.current);
          }}
          onBlur={() => {
            blurTimer.current = setTimeout(() => setOpen(false), 120);
          }}
          onKeyDown={onKeyDown}
        />
        <span className="ml-combobox-indicator" aria-hidden="true">
          {loading ? <Spinner /> : <ChevronIcon />}
        </span>
      </div>

      {name
        ? selectedValues.map((v, i) => (
            <input key={`${v}-${i}`} type="hidden" name={name} value={v} />
          ))
        : null}

      {isBrowser && mounted
        ? createPortal(
            <div
              ref={floatingRef}
              className="ml-combobox-popover"
              data-placement={resolved}
              data-open={visible ? "true" : "false"}
              style={{
                ...floatingStyle,
                zIndex: "var(--ml-z-dropdown, 1060)" as unknown as number,
              }}
              onMouseDown={(e) => e.preventDefault()}
            >
              <div ref={listRef} id={listId} role="listbox" className="ml-combobox-list">
                {loading ? (
                  <div className="ml-combobox-status" role="status">
                    Loading…
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="ml-combobox-empty" role="status">
                    {emptyState}
                  </div>
                ) : (
                  filtered.map((opt, index) => {
                    const isSelected = selectedValues.includes(opt.value);
                    return (
                      <div
                        key={opt.value}
                        id={optionId(index)}
                        role="option"
                        aria-selected={isSelected}
                        aria-disabled={opt.disabled || undefined}
                        data-active={index === activeIndex ? "true" : undefined}
                        data-disabled={opt.disabled ? "true" : undefined}
                        className="ml-combobox-item"
                        onClick={() => selectOption(opt)}
                        onMouseMove={() => {
                          if (!opt.disabled && activeIndex !== index) setActiveIndex(index);
                        }}
                      >
                        <span className="ml-combobox-item-label">{opt.label}</span>
                        {isSelected ? (
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            aria-hidden="true"
                            className="ml-combobox-item-check"
                          >
                            <path
                              d="M13 4.5L6.5 11.5L3 8"
                              stroke="currentColor"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        ) : null}
                      </div>
                    );
                  })
                )}
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
