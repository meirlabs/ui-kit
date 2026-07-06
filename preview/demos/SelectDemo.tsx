import { useState } from "react";
import { Select } from "../../src/components/Select";

export function SelectDemo() {
  const [value, setValue] = useState<string>();

  return (
    <>
      <div className="demo-section">
        <div className="demo-label">Grouped, with a disabled option (keyboard + typeahead)</div>
        <div style={{ maxWidth: 280 }}>
          <Select placeholder="Choose a framework" defaultValue="next">
            <Select.Trigger aria-label="Framework" />
            <Select.Content>
              <Select.Group label="React">
                <Select.Item value="next">Next.js</Select.Item>
                <Select.Item value="remix">Remix</Select.Item>
                <Select.Item value="gatsby" disabled>
                  Gatsby (deprecated)
                </Select.Item>
              </Select.Group>
              <Select.Separator />
              <Select.Group label="Vue">
                <Select.Item value="nuxt">Nuxt</Select.Item>
                <Select.Item value="vitepress">VitePress</Select.Item>
              </Select.Group>
            </Select.Content>
          </Select>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-label">With leading icons, inside a labeled field</div>
        <label style={{ display: "flex", flexDirection: "column", gap: 6, maxWidth: 280 }}>
          <span style={{ fontSize: 14, fontWeight: 500, color: "var(--ml-text)" }}>
            Environment
          </span>
          <Select
            placeholder="Select environment"
            value={value}
            onValueChange={setValue}
            name="environment"
          >
            <Select.Trigger aria-label="Environment" />
            <Select.Content>
              <Select.Item value="prod" icon={<Dot color="var(--ml-color-success)" />}>
                Production
              </Select.Item>
              <Select.Item value="staging" icon={<Dot color="var(--ml-color-warning)" />}>
                Staging
              </Select.Item>
              <Select.Item value="dev" icon={<Dot color="var(--ml-text-muted)" />}>
                Development
              </Select.Item>
            </Select.Content>
          </Select>
          <span style={{ fontSize: 13, color: "var(--ml-text-muted)" }}>
            Selected: {value ?? "none"}
          </span>
        </label>
      </div>

      <div className="demo-section">
        <div className="demo-label">Disabled control</div>
        <div style={{ maxWidth: 280 }}>
          <Select placeholder="Unavailable" disabled defaultValue="a">
            <Select.Trigger aria-label="Disabled" />
            <Select.Content>
              <Select.Item value="a">Option A</Select.Item>
              <Select.Item value="b">Option B</Select.Item>
            </Select.Content>
          </Select>
        </div>
      </div>
    </>
  );
}

function Dot({ color }: { color: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        width: 8,
        height: 8,
        borderRadius: 9999,
        background: color,
      }}
    />
  );
}
