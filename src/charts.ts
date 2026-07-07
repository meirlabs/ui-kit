// Subpath entry: @meir-labs/ui-kit/charts
// Requires the optional peer dependency liveline.
export { LiveChart, type LiveChartProps } from "./components/LiveChart";

// Re-export liveline's cross-fade helper and public types so consumers can
// stay on the @meir-labs/ui-kit/charts import path.
export { LivelineTransition } from "liveline";
export type {
  LivelineTransitionProps,
  LivelinePoint,
  LivelineSeries,
  CandlePoint,
  ThemeMode,
  Momentum,
  WindowOption,
  WindowStyle,
  BadgeVariant,
  ReferenceLine,
  HoverPoint,
  OrderbookData,
  DegenOptions,
  Padding,
} from "liveline";
