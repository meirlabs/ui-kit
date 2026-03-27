import { Field } from "../../src/components/Field";

export function FieldDemo() {
  return (
    <>
      <div className="demo-section">
        <div className="demo-label">Text input</div>
        <Field label="Project Name">
          <input type="text" placeholder="My Project" />
        </Field>
      </div>
      <div className="demo-section">
        <div className="demo-label">Select</div>
        <Field label="Environment">
          <select>
            <option>Production</option>
            <option>Staging</option>
            <option>Development</option>
          </select>
        </Field>
      </div>
      <div className="demo-section">
        <div className="demo-label">Textarea</div>
        <Field label="Description">
          <textarea rows={3} placeholder="Enter a description..." />
        </Field>
      </div>
    </>
  );
}
