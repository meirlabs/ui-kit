import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/virtual.ts", "src/sortable.ts", "src/charts.ts"],
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  external: [
    "react",
    "react-dom",
    "clsx",
    "tailwind-merge",
    "sonner",
    "cmdk",
    "@number-flow/react",
    "input-otp",
    "react-virtuoso",
    "@dnd-kit/core",
    "@dnd-kit/sortable",
    "@dnd-kit/utilities",
    "liveline",
  ],
  // The kit is presentational (context/hooks at module scope), so the whole
  // bundle must be a client module — without this, importing any export from
  // a React Server Component crashes with "createContext is not a function".
  banner: { js: '"use client";' },
});
