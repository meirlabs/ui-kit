import { Section } from "../../src/components/Section";
import { Card } from "../../src/components/Card";

export function SectionDemo() {
  return (
    <>
      <div className="demo-section">
        <div className="demo-label">Sections — quiet 15px header, 32px gap</div>
        <Section title="General">
          <Card>
            <p style={{ fontSize: 14, color: "var(--ml-text-muted)", margin: 0 }}>
              General configuration options for the workspace.
            </p>
          </Card>
        </Section>
        <Section title="Notifications">
          <Card>
            <p style={{ fontSize: 14, color: "var(--ml-text-muted)", margin: 0 }}>
              Configure how and when you receive alerts.
            </p>
          </Card>
        </Section>
        <Section title="Advanced">
          <Card>
            <p style={{ fontSize: 14, color: "var(--ml-text-muted)", margin: 0 }}>
              Fine-tune parameters for experienced users.
            </p>
          </Card>
        </Section>
      </div>
    </>
  );
}
