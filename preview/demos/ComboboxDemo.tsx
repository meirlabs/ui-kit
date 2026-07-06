import { useEffect, useState } from "react";
import { Combobox, type ComboboxOption } from "../../src/components/Combobox";

const ALL: ComboboxOption[] = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
].map((s) => ({ value: s.toLowerCase(), label: s }));

const LANGUAGES: ComboboxOption[] = [
  { value: "ts", label: "TypeScript" },
  { value: "js", label: "JavaScript" },
  { value: "rust", label: "Rust" },
  { value: "go", label: "Go" },
  { value: "python", label: "Python" },
  { value: "swift", label: "Swift" },
];

export function ComboboxDemo() {
  return (
    <>
      <div className="demo-section">
        <div className="demo-label">Async filter with loading + empty states</div>
        <div style={{ maxWidth: 320 }}>
          <AsyncCombobox />
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-label">Multi-select with chips (Backspace removes last)</div>
        <div style={{ maxWidth: 360 }}>
          <MultiCombobox />
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-label">Single select, allows a custom value</div>
        <div style={{ maxWidth: 320 }}>
          <Combobox
            aria-label="Language"
            options={LANGUAGES}
            placeholder="Type a language…"
            allowCustomValue
          />
        </div>
      </div>
    </>
  );
}

function AsyncCombobox() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ComboboxOption[]>(ALL);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      const q = query.toLowerCase();
      setResults(q ? ALL.filter((o) => o.label.toLowerCase().includes(q)) : ALL);
      setLoading(false);
    }, 400);
    return () => clearTimeout(t);
  }, [query]);

  return (
    <Combobox
      aria-label="State"
      options={results}
      inputValue={query}
      onInputChange={setQuery}
      loading={loading}
      // Results are already filtered server-side.
      onFilter={(opts) => opts}
      placeholder="Search states…"
      emptyState={loading ? "Loading…" : "No states found"}
    />
  );
}

function MultiCombobox() {
  const [value, setValue] = useState<string[]>(["ts"]);

  return (
    <Combobox
      aria-label="Languages"
      multiple
      options={LANGUAGES}
      value={value}
      onValueChange={(v) => setValue(v as string[])}
      placeholder="Add languages…"
      emptyState="No matches"
    />
  );
}
