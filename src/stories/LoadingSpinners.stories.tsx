import type { Meta, StoryObj } from "@storybook/react";
import type { ReactNode } from "react";
import { Spinner } from "../components/Spinner";
import { CometLoader } from "../components/CometLoader";
import { DotsLoader } from "../components/DotsLoader";
import { PulseLoader } from "../components/PulseLoader";
import { OrbitLoader } from "../components/OrbitLoader";

const meta: Meta = {
  title: "Patterns/LoadingSpinners",
};
export default meta;

const patterns: Array<{ name: string; hint: string; render: () => ReactNode }> = [
  { name: "Spinner", hint: "generic async default", render: () => <Spinner size="lg" /> },
  { name: "CometLoader", hint: "AI / agentic work", render: () => <CometLoader size="lg" /> },
  { name: "DotsLoader", hint: "compact inline spots", render: () => <DotsLoader size="lg" /> },
  { name: "PulseLoader", hint: "calm still-working signal", render: () => <PulseLoader size="lg" /> },
  { name: "OrbitLoader", hint: "satellite-style indeterminate", render: () => <OrbitLoader size="lg" /> },
];

/**
 * All five loading-indicator patterns side by side, at their largest size, on
 * the shared `--ml-text-muted` color. Use your OS/browser's "reduce motion"
 * setting to see each pattern's static fallback.
 */
export const Gallery: StoryObj = {
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        gap: "2rem",
      }}
    >
      {patterns.map(({ name, hint, render }) => (
        <div
          key={name}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.75rem",
            padding: "1.5rem",
            border: "1px solid var(--ml-border)",
            borderRadius: "var(--ml-radius-lg)",
            background: "var(--ml-bg-card)",
          }}
        >
          {render()}
          <div style={{ textAlign: "center" }}>
            <div style={{ font: "600 0.9rem var(--ml-font-sans)", color: "var(--ml-text)" }}>
              {name}
            </div>
            <div style={{ font: "400 0.78rem var(--ml-font-sans)", color: "var(--ml-text-muted)" }}>
              {hint}
            </div>
          </div>
        </div>
      ))}
    </div>
  ),
};
