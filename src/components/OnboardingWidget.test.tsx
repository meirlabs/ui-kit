import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { OnboardingWidget, type OnboardingStep } from "./OnboardingWidget";

const STEPS: OnboardingStep[] = [
  { id: "profile", title: "Complete your profile", completed: true },
  { id: "workspace", title: "Name your workspace", completed: true },
  {
    id: "connect",
    title: "Connect a data source",
    description: "Sync live numbers.",
    completed: false,
    action: { label: "Connect" },
  },
  { id: "invite", title: "Invite a teammate", action: { label: "Invite" } },
];

describe("OnboardingWidget", () => {
  it("renders the title and every step", () => {
    render(<OnboardingWidget title="Set up" steps={STEPS} />);
    expect(screen.getByRole("heading", { name: "Set up" })).toBeInTheDocument();
    for (const step of STEPS) {
      expect(
        screen.getByText(step.title as string),
      ).toBeInTheDocument();
    }
    expect(screen.getByText("Sync live numbers.")).toBeInTheDocument();
  });

  it("shows a progress summary and a progressbar reflecting completed steps", () => {
    render(<OnboardingWidget steps={STEPS} />);
    expect(screen.getByText("2 of 4 complete")).toBeInTheDocument();
    const bar = screen.getByRole("progressbar", { name: "Onboarding progress" });
    expect(bar).toHaveAttribute("aria-valuenow", "2");
    expect(bar).toHaveAttribute("aria-valuemax", "4");
  });

  it("supports a custom progress label", () => {
    render(
      <OnboardingWidget
        steps={STEPS}
        progressLabel={(done, total) => `${done}/${total} done`}
      />,
    );
    expect(screen.getByText("2/4 done")).toBeInTheDocument();
  });

  it("marks completed steps with a complete state", () => {
    const { container } = render(<OnboardingWidget steps={STEPS} />);
    const items = container.querySelectorAll(".ml-onboarding-step");
    expect(items).toHaveLength(4);
    expect(items[0]).toHaveAttribute("data-state", "complete");
    expect(items[2]).toHaveAttribute("data-state", "incomplete");
  });

  it("fires onStepAction with the step id and index when a CTA is clicked", () => {
    const onStepAction = vi.fn();
    render(<OnboardingWidget steps={STEPS} onStepAction={onStepAction} />);
    fireEvent.click(screen.getByRole("button", { name: "Connect" }));
    expect(onStepAction).toHaveBeenCalledWith("connect", 2);
  });

  it("hides a step's CTA once complete (unless showWhenComplete)", () => {
    const steps: OnboardingStep[] = [
      { id: "a", title: "Done step", completed: true, action: { label: "Hidden" } },
      {
        id: "b",
        title: "Done but persistent",
        completed: true,
        action: { label: "Still here", showWhenComplete: true },
      },
    ];
    render(<OnboardingWidget steps={steps} />);
    expect(screen.queryByRole("button", { name: "Hidden" })).toBeNull();
    expect(
      screen.getByRole("button", { name: "Still here" }),
    ).toBeInTheDocument();
  });

  it("renders a dismiss button that fires onDismiss", () => {
    const onDismiss = vi.fn();
    render(<OnboardingWidget steps={STEPS} onDismiss={onDismiss} />);
    fireEvent.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("hides the progress indicator when hideProgress is set", () => {
    render(<OnboardingWidget steps={STEPS} hideProgress />);
    expect(screen.queryByRole("progressbar")).toBeNull();
    expect(screen.queryByText("2 of 4 complete")).toBeNull();
  });
});
