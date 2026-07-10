import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { FileUpload } from "./FileUpload";

function file(name: string, size: number, type = "text/plain"): File {
  const f = new File(["x".repeat(size)], name, { type });
  // jsdom's File doesn't always report the intended byte size from content
  // padding alone once encoding is involved, so pin it explicitly.
  Object.defineProperty(f, "size", { value: size });
  return f;
}

function getInput(container: HTMLElement): HTMLInputElement {
  return container.querySelector("input[type='file']") as HTMLInputElement;
}

describe("FileUpload", () => {
  it("renders the dropzone with the default label", () => {
    render(<FileUpload onFiles={vi.fn()} />);
    expect(
      screen.getByRole("button", { name: "Drop files here or click to browse" }),
    ).toBeInTheDocument();
  });

  it("selecting a single file calls onFiles and lists it", () => {
    const onFiles = vi.fn();
    const { container } = render(<FileUpload onFiles={onFiles} />);
    const input = getInput(container);
    const f = file("resume.pdf", 1024);

    fireEvent.change(input, { target: { files: [f] } });

    expect(onFiles).toHaveBeenCalledWith([f]);
    expect(screen.getByText("resume.pdf")).toBeInTheDocument();
  });

  it("keeps only the latest file when multiple is not set", () => {
    const onFiles = vi.fn();
    const { container } = render(<FileUpload onFiles={onFiles} />);
    const input = getInput(container);

    fireEvent.change(input, { target: { files: [file("a.png", 10)] } });
    fireEvent.change(input, { target: { files: [file("b.png", 10)] } });

    expect(onFiles).toHaveBeenLastCalledWith([expect.objectContaining({ name: "b.png" })]);
    expect(screen.queryByText("a.png")).not.toBeInTheDocument();
    expect(screen.getByText("b.png")).toBeInTheDocument();
  });

  it("accumulates files across selections when multiple is set", () => {
    const onFiles = vi.fn();
    const { container } = render(<FileUpload onFiles={onFiles} multiple />);
    const input = getInput(container);

    fireEvent.change(input, { target: { files: [file("a.png", 10)] } });
    fireEvent.change(input, { target: { files: [file("b.png", 10)] } });

    expect(screen.getByText("a.png")).toBeInTheDocument();
    expect(screen.getByText("b.png")).toBeInTheDocument();
    expect(onFiles).toHaveBeenLastCalledWith([
      expect.objectContaining({ name: "a.png" }),
      expect.objectContaining({ name: "b.png" }),
    ]);
  });

  it("rejects files over maxSize and reports them without passing them to onFiles", () => {
    const onFiles = vi.fn();
    const { container } = render(
      <FileUpload onFiles={onFiles} maxSize={100} multiple />,
    );
    const input = getInput(container);
    const small = file("small.png", 50);
    const big = file("big.png", 500);

    fireEvent.change(input, { target: { files: [small, big] } });

    expect(onFiles).toHaveBeenCalledWith([small]);
    expect(screen.getByText('"big.png" exceeds the size limit.')).toBeInTheDocument();
    expect(screen.queryByText("big.png")).not.toBeInTheDocument();
  });

  it("removes a file and reports the updated list", () => {
    const onFiles = vi.fn();
    const { container } = render(<FileUpload onFiles={onFiles} multiple />);
    const input = getInput(container);

    fireEvent.change(input, {
      target: { files: [file("a.png", 10), file("b.png", 10)] },
    });
    onFiles.mockClear();

    fireEvent.click(screen.getByRole("button", { name: "Remove a.png" }));

    expect(screen.queryByText("a.png")).not.toBeInTheDocument();
    expect(screen.getByText("b.png")).toBeInTheDocument();
    expect(onFiles).toHaveBeenCalledWith([expect.objectContaining({ name: "b.png" })]);
  });

  it("tracks drag-over state on the dropzone and clears it on drop", () => {
    render(<FileUpload onFiles={vi.fn()} />);
    const zone = screen.getByRole("button", { name: "Drop files here or click to browse" });

    fireEvent.dragOver(zone);
    expect(zone).toHaveClass("ml-fileupload-zone--dragover");

    fireEvent.dragLeave(zone);
    expect(zone).not.toHaveClass("ml-fileupload-zone--dragover");
  });

  it("commits dropped files via the dataTransfer file list", () => {
    const onFiles = vi.fn();
    render(<FileUpload onFiles={onFiles} />);
    const zone = screen.getByRole("button", { name: "Drop files here or click to browse" });
    const f = file("dropped.png", 10);

    fireEvent.drop(zone, { dataTransfer: { files: [f] } });

    expect(onFiles).toHaveBeenCalledWith([f]);
  });

  it("ignores drag-over and drop while disabled", () => {
    const onFiles = vi.fn();
    render(<FileUpload onFiles={onFiles} disabled />);
    const zone = screen.getByRole("button", { name: "Drop files here or click to browse" });

    fireEvent.dragOver(zone);
    expect(zone).not.toHaveClass("ml-fileupload-zone--dragover");

    fireEvent.drop(zone, { dataTransfer: { files: [file("x.png", 10)] } });
    expect(onFiles).not.toHaveBeenCalled();
  });
});
