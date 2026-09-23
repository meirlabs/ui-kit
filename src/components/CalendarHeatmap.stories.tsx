import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { CalendarHeatmap, type CalendarHeatmapDay } from "./CalendarHeatmap";

const days: CalendarHeatmapDay[] = Array.from({ length: 180 }, (_, index) => {
  const date = new Date(Date.UTC(2026, 2, 11 + index)).toISOString().slice(0, 10);
  const level = index < 25 ? null : (index * 7 % 5) as 0 | 1 | 2 | 3 | 4;
  return { date, level, label: `${date}: ${level === null ? "No data" : `Level ${level}`}` };
});
const meta: Meta<typeof CalendarHeatmap> = { title: "Data/CalendarHeatmap", component: CalendarHeatmap, args: { days, "aria-label": "Daily activity", tone: "success" } };
export default meta;
type Story = StoryObj<typeof CalendarHeatmap>;
export const Default: Story = { render: (args) => {
  const [date, setDate] = useState(days.at(-1)!.date);
  return <div style={{ maxWidth: 560 }}><CalendarHeatmap {...args} selectedDate={date} onSelect={setDate} /><p>{date}</p></div>;
} };
export const Neutral: Story = { args: { tone: "neutral" } };
