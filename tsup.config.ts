import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom", "clsx", "tailwind-merge"],
  // The kit is presentational (context/hooks at module scope), so the whole
  // bundle must be a client module — without this, importing any export from
  // a React Server Component crashes with "createContext is not a function".
  banner: { js: '"use client";' },
});
