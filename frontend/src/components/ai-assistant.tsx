"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, ChevronDown, Eraser, LoaderCircle, Minus, Send, X } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAnawiserChat } from "./chat-context";

type Msg = { role: "user" | "assistant"; content: string };

const WELCOME: Msg = {
  role: "assistant",
  content:
    "Hi — I’m AnawiserAI. Ask what this site can do, how to compare prices, or which live store is cheapest. I only answer questions about Anawiser.",
};

const SUGGESTIONS = [
  "What can your site do?",
  "How do I use Anawiser?",
  "Which store is cheapest?",
];

export function AiAssistantPanel() {
  const { context } = useAnawiserChat();
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const send = async (text: string) => {
    const message = text.trim();
    if (!message || busy) return;

    setError(null);
    setInput("");
    const nextHistory = [...messages, { role: "user" as const, content: message }];
    setMessages(nextHistory);
    setBusy(true);

    try {
      const res = await fetch("/api/anawiser/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          history: nextHistory.slice(0, -1),
          context: { ...context, path: context.path || path },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "AI request failed");
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply || "I had no reply." }]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "AI request failed";
      setError(msg);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I could not answer just now. Try “What can your site do?” or open Compare.",
        },
      ]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[100] flex flex-col items-end gap-3">
      {open ? (
        <div
          role="dialog"
          aria-label="AnawiserAI assistant"
          className="pointer-events-auto flex h-[min(560px,72vh)] w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-white/20 bg-[#0c0c0c]/95 text-white shadow-2xl backdrop-blur-xl"
        >
          <header className="flex items-start justify-between gap-2 border-b border-white/10 bg-white/5 px-4 py-3">
            <div className="min-w-0 pt-0.5">
              <h2 className="truncate text-[16px] font-semibold tracking-tight">AnawiserAI</h2>
              <p className="mt-0.5 text-[12px] text-white/60">Ask about this site</p>
            </div>
            <div className="flex shrink-0 items-center gap-0.5">
              <button
                type="button"
                onClick={() => {
                  setMessages([WELCOME]);
                  setError(null);
                }}
                className="rounded-md px-2 py-1.5 text-[12px] text-white/70 hover:bg-white/10 hover:text-white"
                title="Clear chat"
              >
                <span className="inline-flex items-center gap-1.5">
                  <Eraser className="h-3.5 w-3.5" />
                  Clear
                </span>
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md p-1.5 text-white/70 hover:bg-white/10"
                aria-label="Minimize"
              >
                <Minus className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md p-1.5 text-white/70 hover:bg-white/10"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto px-3 py-3">
            {messages.map((m, i) => (
              <div key={`${m.role}-${i}`} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-[14px] leading-relaxed ${
                    m.role === "user"
                      ? "rounded-br-md bg-[var(--accent)] text-[#1a0b00]"
                      : "rounded-bl-md border border-white/15 bg-white/8 text-white/90"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {busy ? (
              <div className="rounded-2xl rounded-bl-md border border-white/15 bg-white/5 px-3.5 py-3 text-[13px] text-white/60">
                Checking Anawiser’s pages…
              </div>
            ) : null}
            <div ref={bottomRef} />
          </div>

          {error ? <p className="px-3 pb-1 text-[11px] text-rose-300">{error}</p> : null}

          {!busy && messages.length < 4 ? (
            <div className="flex flex-wrap gap-1.5 px-3 pb-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => void send(s)}
                  className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] text-white/80 hover:bg-white/10"
                >
                  {s}
                </button>
              ))}
            </div>
          ) : null}

          <form
            className="border-t border-white/10 p-3"
            onSubmit={(e) => {
              e.preventDefault();
              void send(input);
            }}
          >
            <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-black/40 px-3 py-2 focus-within:border-[var(--accent)]">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Got any questions?"
                className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/40"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-[#1a0b00] disabled:opacity-40"
                aria-label="Send"
              >
                {busy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
              </button>
            </div>
          </form>
        </div>
      ) : null}

      <div className="pointer-events-auto flex flex-col items-end gap-3">
        <Link
          href="/local-admin"
          className="rounded-full border border-white/25 bg-black/55 px-6 py-3 text-lg font-semibold text-white backdrop-blur-md hover:border-[var(--accent)] hover:text-white md:px-7 md:py-3.5 md:text-xl"
        >
          Are you a retailer? Try this
        </Link>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex items-center gap-2 rounded-full bg-[var(--accent)] text-[#1a0b00] shadow-md"
          aria-label={open ? "Close AnawiserAI" : "Got any questions?"}
        >
        {open ? (
          <span className="flex h-14 w-14 items-center justify-center">
            <ChevronDown className="h-7 w-7" />
          </span>
        ) : (
          <span className="flex items-center gap-2 py-2.5 pl-2.5 pr-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1a0b00]/10">
              <Bot className="h-6 w-6" />
            </span>
            <span className="text-base font-semibold md:text-lg">Got any questions?</span>
          </span>
        )}
        </button>
      </div>
    </div>
  );
}
