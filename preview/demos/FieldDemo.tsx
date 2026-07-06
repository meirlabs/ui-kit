import { useState } from "react";
import { Field } from "../../src/components/Field";
import { Input } from "../../src/components/Input";
import { Textarea } from "../../src/components/Textarea";
import { Checkbox } from "../../src/components/Checkbox";

export function FieldDemo() {
  const [email, setEmail] = useState("not-an-email");
  const emailError =
    email.length > 0 && !email.includes("@")
      ? "Enter a valid email address."
      : undefined;

  return (
    <>
      <div className="demo-section">
        <div className="demo-label">Label linkage + hint (click the label)</div>
        <Field label="Project name" hint="Shown on your public dashboard.">
          <Input placeholder="My Project" />
        </Field>
      </div>

      <div className="demo-section">
        <div className="demo-label">Required + error (aria-invalid, role=alert)</div>
        <Field label="Work email" required error={emailError}>
          <Input
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>
      </div>

      <div className="demo-section">
        <div className="demo-label">Composes with a native Select</div>
        <Field label="Environment" hint="Where changes are deployed.">
          <select>
            <option>Production</option>
            <option>Staging</option>
            <option>Development</option>
          </select>
        </Field>
      </div>

      <div className="demo-section">
        <div className="demo-label">Composes with Textarea</div>
        <Field label="Description">
          <Textarea rows={3} placeholder="Enter a description..." />
        </Field>
      </div>

      <div className="demo-section">
        <div className="demo-label">Composes with Checkbox</div>
        <Field label="Notifications">
          <Checkbox label="Email me about product updates" />
        </Field>
      </div>
    </>
  );
}
