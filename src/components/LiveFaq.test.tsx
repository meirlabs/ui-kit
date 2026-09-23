import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { LiveFaq, type LiveFaqStrings } from "./LiveFaq";

/**
 * LiveFaq owns a stream and renders whatever a model sent, so the tests that
 * matter are the ones about untrusted text and partial data: SSE frames split
 * across chunks, markdown the model was told not to emit, hrefs that must
 * never become links, and a guard response that is JSON rather than a stream.
 */

const STRINGS: LiveFaqStrings = {
  placeholder: "Ask anything else",
  submitLabel: "Send question",
  stopLabel: "Stop answering",
  loadingLabel: "Writing an answer",
  disclaimer: "Answered by AI.",
};

const ITEMS = [
  { q: "What is it?", a: "A thing." },
  { q: "How much?", a: "Some amount." },
];

/** A Response whose body streams the given chunks verbatim — chunk boundaries
    are the point, so they are never normalised. */
function sseResponse(chunks: string[]): Response {
  const stream = new ReadableStream<Uint8Array>({
    start(c) {
      const enc = new TextEncoder();
      for (const chunk of chunks) c.enqueue(enc.encode(chunk));
      c.close();
    },
  });
  return new Response(stream, { status: 200 });
}

function frame(obj: unknown): string {
  return `data: ${JSON.stringify(obj)}\n\n`;
}

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

function ask(text = "can i do evals?") {
  fireEvent.change(screen.getByLabelText("Ask anything else"), {
    target: { value: text },
  });
  fireEvent.click(screen.getByRole("button", { name: "Send question" }));
}

describe("LiveFaq", () => {
  it("renders the canned rows as native <details>, untouched", () => {
    const { container } = render(<LiveFaq items={ITEMS} strings={STRINGS} />);

    // Indexable, no-JS content: this must stay <details>, not a div with ARIA.
    expect(container.querySelectorAll("details")).toHaveLength(2);
    expect(screen.getByText("What is it?").tagName).toBe("SUMMARY");
  });

  it("streams an answer even when frames are split across chunks", async () => {
    fetchMock.mockResolvedValue(
      // The first frame arrives in two pieces, split mid-JSON.
      sseResponse([
        'data: {"type":"delta","te',
        'xt":"Yes, "}\n\n' + frame({ type: "delta", text: "you can." }),
        frame({ type: "done" }),
      ]),
    );

    render(<LiveFaq items={ITEMS} strings={STRINGS} />);
    ask();

    await waitFor(() =>
      expect(screen.getByText("Yes, you can.")).toBeInTheDocument(),
    );
    expect(screen.getByText("Answered by AI.")).toBeInTheDocument();
  });

  it("shows a loader in the answer's place until the first token", async () => {
    let release!: () => void;
    const gate = new Promise<void>((r) => (release = r));
    fetchMock.mockImplementation(async () => {
      await gate;
      return sseResponse([frame({ type: "delta", text: "Hi" }), frame({ type: "done" })]);
    });

    render(<LiveFaq items={ITEMS} strings={STRINGS} />);
    ask();

    expect(await screen.findByRole("status", { name: "Writing an answer" })).toBeInTheDocument();
    release();
    await waitFor(() => expect(screen.getByText("Hi")).toBeInTheDocument());
  });

  it("renders markdown links the model was told not to send", async () => {
    fetchMock.mockResolvedValue(
      sseResponse([
        frame({ type: "delta", text: "See [the docs](/docs/pricing) for more." }),
        frame({ type: "done" }),
      ]),
    );

    render(<LiveFaq items={ITEMS} strings={STRINGS} />);
    ask();

    const link = await screen.findByRole("link", { name: "the docs" });
    expect(link).toHaveAttribute("href", "/docs/pricing");
    // The raw bracket syntax must never reach the reader.
    expect(screen.queryByText(/\[the docs\]/)).toBeNull();
  });

  it("refuses to turn a javascript: href into a link", async () => {
    fetchMock.mockResolvedValue(
      sseResponse([
        // eslint-disable-next-line no-script-url
        frame({ type: "delta", text: "Click [here](javascript:alert(1)) now." }),
        frame({ type: "done" }),
      ]),
    );

    const { container } = render(<LiveFaq items={ITEMS} strings={STRINGS} />);
    ask();

    await waitFor(() =>
      expect(container.querySelector(".ml-ask-para")).toBeInTheDocument(),
    );
    expect(container.querySelectorAll(".ml-ask-para a")).toHaveLength(0);
  });

  it("shows a guard's message when the response is JSON, not a stream", async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ error: "That's a lot of questions." }), {
        status: 429,
      }),
    );

    render(<LiveFaq items={ITEMS} strings={STRINGS} />);
    ask();

    expect(
      await screen.findByText("That's a lot of questions."),
    ).toBeInTheDocument();
    // A refused question is not an answer, so it carries no AI disclaimer.
    expect(screen.queryByText("Answered by AI.")).toBeNull();
  });

  it("sends the question plus the caller's payload, and reports the ask", async () => {
    fetchMock.mockResolvedValue(sseResponse([frame({ type: "done" })]));
    const onAsk = vi.fn();

    render(
      <LiveFaq
        items={ITEMS}
        strings={STRINGS}
        endpoint="/api/custom"
        payload={{ locale: "he", context: "pricing" }}
        onAsk={onAsk}
      />,
    );
    ask("how much?");

    expect(fetchMock.mock.calls[0][0]).toBe("/api/custom");
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({
      question: "how much?",
      locale: "he",
      context: "pricing",
    });
    expect(onAsk).toHaveBeenCalledWith("how much?");
  });

  it("adopts a host page's FAQ classes so it can't fork their styling", () => {
    const { container } = render(
      <LiveFaq items={ITEMS} strings={STRINGS} classPrefix="pr" />,
    );

    expect(container.querySelector(".pr-faq")).toBeInTheDocument();
    expect(container.querySelectorAll(".pr-faq-item")).toHaveLength(3); // 2 rows + ask
    // The ask row is always ml-ask-*, whatever the page prefix is.
    expect(container.querySelector(".ml-ask-shell")).toHaveClass("pr-faq-item");
  });

  it("keeps the send control laid out but inert with nothing typed", () => {
    render(<LiveFaq items={ITEMS} strings={STRINGS} />);

    // Present (so typing can't shift the row), disabled (so it can't fire).
    const btn = screen.getByRole("button", { name: "Send question" });
    expect(btn).toBeDisabled();
  });
});
