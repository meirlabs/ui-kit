import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import type { LivelinePoint, LivelineSeries } from "liveline";
import { LiveChart } from "./LiveChart";

const meta: Meta<typeof LiveChart> = {
  title: "Components/LiveChart",
  component: LiveChart,
};
export default meta;

/** Random-walk stream: seeds 60s of history, then pushes a point on an interval. */
function useFakeStream(intervalMs = 120, start = 100) {
  const [data, setData] = useState<LivelinePoint[]>([]);
  const [value, setValue] = useState(start);

  useEffect(() => {
    let v = start;
    const now = Date.now() / 1000;
    const seed: LivelinePoint[] = [];
    for (let i = 60; i > 0; i--) {
      v += (Math.random() - 0.5) * 1.6;
      seed.push({ time: now - i, value: v });
    }
    setData(seed);
    setValue(v);

    const id = setInterval(() => {
      v += (Math.random() - 0.5) * 1.6;
      setValue(v);
      setData((prev) => [
        ...prev.slice(-900),
        { time: Date.now() / 1000, value: v },
      ]);
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs, start]);

  return { data, value };
}

function StreamingChart(props: Partial<React.ComponentProps<typeof LiveChart>>) {
  const { data, value } = useFakeStream();
  return <LiveChart data={data} value={value} {...props} />;
}

/** House default: monochrome accent from --ml-text, no pulse/momentum/degen. */
export const Default: StoryObj = {
  render: () => <StreamingChart />,
};

export const LightTheme: StoryObj = {
  render: () => (
    <div
      data-meirlabs-theme="light"
      style={{ background: "var(--ml-bg)", padding: "1rem" }}
    >
      <StreamingChart />
    </div>
  ),
};

export const DashboardWindows: StoryObj = {
  render: () => (
    <StreamingChart
      height={280}
      showValue
      badge={false}
      formatValue={(v) => `$${v.toFixed(2)}`}
      windows={[
        { label: "15s", secs: 15 },
        { label: "30s", secs: 30 },
        { label: "2m", secs: 120 },
      ]}
      windowStyle="text"
    />
  ),
};

/** Everything the wrapper turns off, explicitly opted back in. */
export const OptInEffects: StoryObj = {
  render: () => <StreamingChart momentum pulse degen valueMomentumColor showValue />,
};

function MultiSeriesChart() {
  const a = useFakeStream(120, 62);
  const b = useFakeStream(120, 38);
  const series: LivelineSeries[] = [
    { id: "yes", data: a.data, value: a.value, color: "var(--ml-text)", label: "Yes" },
    { id: "no", data: b.data, value: b.value, color: "var(--ml-text-faint)", label: "No" },
  ];
  return (
    <LiveChart
      data={[]}
      value={0}
      series={series}
      formatValue={(v) => `${v.toFixed(1)}%`}
    />
  );
}

/** Two neutral tones from the token ramp — still monochrome. */
export const MultiSeries: StoryObj = {
  render: () => <MultiSeriesChart />,
};

export const Loading: StoryObj = {
  render: () => <LiveChart data={[]} value={0} loading />,
};
