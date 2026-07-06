import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { EditableDocument, parseDocFields } from "./EditableDocument";

describe("parseDocFields", () => {
  it("extracts fields in order with their labels", () => {
    const fields = parseDocFields(
      "Hi {{name|Your name}}, welcome to {{company|Company}}.",
    );
    expect(fields).toEqual([
      { name: "name", label: "Your name" },
      { name: "company", label: "Company" },
    ]);
  });

  it("de-duplicates repeated field names, keeping the first occurrence", () => {
    const fields = parseDocFields("{{a|First}} … {{a|Second}} … {{b}}");
    expect(fields).toEqual([
      { name: "a", label: "First" },
      { name: "b", label: "" },
    ]);
  });
});

describe("EditableDocument", () => {
  const source = "Dear {{name|Full name}}, your role is {{role|Role}}.";

  it("renders a textbox blank per field with an accessible label", () => {
    render(
      <EditableDocument source={source} values={{}} onChange={() => {}} />,
    );
    const boxes = screen.getAllByRole("textbox");
    expect(boxes).toHaveLength(2);
    expect(screen.getByRole("textbox", { name: "Full name" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Role" })).toBeInTheDocument();
  });

  it("reflects empty vs filled state on each blank", () => {
    render(
      <EditableDocument
        source={source}
        values={{ name: "Ada" }}
        onChange={() => {}}
      />,
    );
    const name = screen.getByRole("textbox", { name: "Full name" });
    const role = screen.getByRole("textbox", { name: "Role" });
    expect(name).toHaveClass("is-filled");
    expect(role).toHaveClass("is-empty");
  });

  it("calls onChange as a blank is edited", () => {
    const onChange = vi.fn();
    render(
      <EditableDocument source={source} values={{}} onChange={onChange} />,
    );
    const name = screen.getByRole("textbox", { name: "Full name" });
    name.textContent = "Grace";
    fireEvent.input(name);
    expect(onChange).toHaveBeenCalledWith("name", "Grace");
  });

  it("keeps focus interactions from throwing", () => {
    render(
      <EditableDocument source={source} values={{}} onChange={() => {}} />,
    );
    const name = screen.getByRole("textbox", { name: "Full name" });
    expect(() => {
      fireEvent.focus(name);
      fireEvent.blur(name);
    }).not.toThrow();
  });
});
