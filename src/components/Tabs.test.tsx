import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Tabs } from "./Tabs";

const tabs = [
  { value: "overview", label: "Overview" },
  { value: "analytics", label: "Analytics", disabled: true },
  { value: "settings", label: "Settings" },
];

describe("Tabs", () => {
  it("renders an accessible tablist with one tab per item", () => {
    render(
      <Tabs aria-label="Sections" tabs={tabs} value="overview" onChange={() => {}} />,
    );
    expect(screen.getByRole("tablist", { name: "Sections" })).toBeInTheDocument();
    expect(screen.getAllByRole("tab")).toHaveLength(3);
  });

  it("wires aria-selected, aria-controls, id and roving tabindex", () => {
    render(
      <Tabs aria-label="Sections" tabs={tabs} value="overview" onChange={() => {}} />,
    );
    const selected = screen.getByRole("tab", { name: "Overview" });
    const other = screen.getByRole("tab", { name: "Settings" });
    expect(selected).toHaveAttribute("aria-selected", "true");
    expect(selected).toHaveAttribute("tabindex", "0");
    expect(selected).toHaveAttribute("aria-controls");
    expect(selected).toHaveAttribute("id");
    expect(other).toHaveAttribute("aria-selected", "false");
    expect(other).toHaveAttribute("tabindex", "-1");
  });

  it("associates a panel via aria-labelledby and only renders the active one", () => {
    render(
      <Tabs aria-label="Sections" tabs={tabs} value="overview" onChange={() => {}}>
        <Tabs.Panel value="overview">Overview content</Tabs.Panel>
        <Tabs.Panel value="settings">Settings content</Tabs.Panel>
      </Tabs>,
    );
    const panel = screen.getByRole("tabpanel");
    expect(panel).toHaveTextContent("Overview content");
    expect(screen.queryByText("Settings content")).not.toBeInTheDocument();
    const tab = screen.getByRole("tab", { name: "Overview" });
    expect(panel).toHaveAttribute("aria-labelledby", tab.getAttribute("id"));
    expect(tab).toHaveAttribute("aria-controls", panel.getAttribute("id"));
  });

  it("moves selection with ArrowRight and skips disabled tabs", () => {
    const onChange = vi.fn();
    render(
      <Tabs aria-label="Sections" tabs={tabs} value="overview" onChange={onChange} />,
    );
    const first = screen.getByRole("tab", { name: "Overview" });
    fireEvent.keyDown(first, { key: "ArrowRight" });
    // analytics is disabled → lands on settings
    expect(onChange).toHaveBeenCalledWith("settings");
  });

  it("wraps with ArrowLeft from the first tab", () => {
    const onChange = vi.fn();
    render(
      <Tabs aria-label="Sections" tabs={tabs} value="overview" onChange={onChange} />,
    );
    const first = screen.getByRole("tab", { name: "Overview" });
    fireEvent.keyDown(first, { key: "ArrowLeft" });
    expect(onChange).toHaveBeenCalledWith("settings");
  });

  it("Home/End jump to the first/last enabled tab", () => {
    const onChange = vi.fn();
    render(
      <Tabs aria-label="Sections" tabs={tabs} value="settings" onChange={onChange} />,
    );
    const last = screen.getByRole("tab", { name: "Settings" });
    fireEvent.keyDown(last, { key: "Home" });
    expect(onChange).toHaveBeenLastCalledWith("overview");
    fireEvent.keyDown(last, { key: "End" });
    expect(onChange).toHaveBeenLastCalledWith("settings");
  });

  it("does not select a disabled tab on click", () => {
    const onChange = vi.fn();
    render(
      <Tabs aria-label="Sections" tabs={tabs} value="overview" onChange={onChange} />,
    );
    fireEvent.click(screen.getByRole("tab", { name: "Analytics" }));
    expect(onChange).not.toHaveBeenCalled();
  });
});
