import { Section } from "../../src/components/Section";

export function SectionDemo() {
  return (
    <>
      <div className="demo-section">
        <div className="demo-label">Sections with titles</div>
        <Section title="General">
          <p style={{ fontSize: "var(--ml-text-sm)", color: "var(--ml-text-muted)" }}>
            General configuration options for the agent.
          </p>
        </Section>
        <Section title="Notifications">
          <p style={{ fontSize: "var(--ml-text-sm)", color: "var(--ml-text-muted)" }}>
            Configure how and when you receive alerts.
          </p>
        </Section>
        <Section title="Advanced">
          <p style={{ fontSize: "var(--ml-text-sm)", color: "var(--ml-text-muted)" }}>
            Fine-tune parameters for experienced users.
          </p>
        </Section>
      </div>
    </>
  );
}
