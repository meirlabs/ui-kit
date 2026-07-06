import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Progress } from "./Progress";

describe("Progress", () => {
  it("exposes aria value attributes for a determinate bar", () => {
    render(<Progress value={40} label="Uploading" />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "40");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
  });

  it("honors a custom max", () => {
    render(<Progress value={3} max={5} label="Steps" />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "3");
    expect(bar).toHaveAttribute("aria-valuemax", "5");
  });

  it("clamps the value into range", () => {
    render(<Progress value={140} label="Over" />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100");

    render(<Progress value={-10} label="Under" />);
    const bars = screen.getAllByRole("progressbar");
    expect(bars[bars.length - 1]).toHaveAttribute("aria-valuenow", "0");
  });

  it("omits aria-valuenow when indeterminate", () => {
    render(<Progress label="Working" />);
    const bar = screen.getByRole("progressbar");
    expect(bar).not.toHaveAttribute("aria-valuenow");
    expect(bar).toHaveClass("ml-progress-indeterminate");
  });

  it("renders the percentage when showValue is set", () => {
    render(<Progress value={25} label="Sync" showValue />);
    expect(screen.getByText("25%")).toBeInTheDocument();
  });

  it("does not render a percentage when indeterminate even with showValue", () => {
    render(<Progress label="Sync" showValue />);
    expect(screen.queryByText(/%$/)).not.toBeInTheDocument();
  });

  it("labels the bar accessibly", () => {
    render(<Progress value={50} label="Download" />);
    expect(screen.getByRole("progressbar", { name: "Download" })).toBeInTheDocument();
  });

  it("falls back to a default accessible name without a label", () => {
    render(<Progress value={50} />);
    expect(screen.getByRole("progressbar", { name: "Loading" })).toBeInTheDocument();
  });
});
