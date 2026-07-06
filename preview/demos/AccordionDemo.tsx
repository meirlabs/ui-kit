import { useState } from "react";
import { Accordion } from "../../src/components/Accordion";

export function AccordionDemo() {
  const [value, setValue] = useState<string>("shipping");

  return (
    <>
      <div className="demo-section">
        <div className="demo-label">Single (uncontrolled) — one open at a time</div>
        <Accordion type="single" defaultValue="a">
          <Accordion.Item value="a" title="What is included in the free plan?">
            The free plan includes up to 3 projects, community support, and
            1&nbsp;GB of storage. Upgrade anytime for more.
          </Accordion.Item>
          <Accordion.Item value="b" title="Can I change plans later?">
            Yes — plans are prorated and you can switch up or down at any time
            from the billing settings.
          </Accordion.Item>
          <Accordion.Item value="c" title="Do you offer refunds?" disabled>
            (Disabled example.)
          </Accordion.Item>
        </Accordion>
      </div>

      <div className="demo-section">
        <div className="demo-label">Multiple — independent panels</div>
        <Accordion type="multiple" defaultValue={["one"]}>
          <Accordion.Item value="one" title="Overview">
            High-level summary of the resource and its current state.
          </Accordion.Item>
          <Accordion.Item value="two" title="Configuration">
            Editable settings that control runtime behavior.
          </Accordion.Item>
          <Accordion.Item value="three" title="Activity">
            A timeline of recent events and changes.
          </Accordion.Item>
        </Accordion>
      </div>

      <div className="demo-section">
        <div className="demo-label">Controlled</div>
        <div
          style={{
            marginBottom: "var(--ml-space-md)",
            fontSize: 12,
            color: "var(--ml-text-muted)",
          }}
        >
          Open: {value || "none"}
        </div>
        <Accordion type="single" value={value} onValueChange={setValue}>
          <Accordion.Item value="shipping" title="Shipping">
            Ships within 2 business days.
          </Accordion.Item>
          <Accordion.Item value="returns" title="Returns">
            30-day returns on unopened items.
          </Accordion.Item>
        </Accordion>
      </div>
    </>
  );
}
