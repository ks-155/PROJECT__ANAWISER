"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bot,
  ChevronDown,
  Eraser,
  KeyRound,
  LoaderCircle,
  Minus,
  Send,
  X,
} from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };

type Props = {
  productName?: string;
  category?: string;
  prices?: Record<string, { price: number | null; status: string }>;
  localPrices?: Array<{ store?: string; price?: number | null }>;
};

const WELCOME: Msg = {
  role: "assistant",
  content:
    "Hi — I’m Anawiser AI. Ask how to use the tracker, compare scraped prices, or what to do if a scrape looks broken.",
};

const SUGGESTIONS = [
  "How do I use Anawiser?",
  "Which store is cheapest?",
  "Should I buy now?",
];

export function AiAssistantPanel({ productName, category, prices, localPrices }: Props) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/anawiser/ai")
      .then((r) => r.json())
      .then((d) => setConfigured(Boolean(d.configured)))
      .catch(() => setConfigured(false));
  }, []);

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

  const clearChat = () => {
    setMessages([WELCOME]);
    setError(null);
  };

  const closePanel = () => setOpen(false);

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
          context: {
            productName,
            category,
            prices,
            localPrices: localPrices?.map((lp) => ({
              store: lp.store,
              price: lp.price ?? null,
            })),
          },
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "AI request failed");
      }
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      setConfigured(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "AI request failed";
      setError(msg);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I couldn’t reach Gemini. Add GEMINI_API_KEY to frontend/.env.local, restart the dev server, then try again.",
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
          ref={panelRef}
          role="dialog"
          aria-label="Anawiser AI assistant"
          className="animate-in pointer-events-auto flex h-[min(560px,72vh)] w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-[0_20px_50px_rgba(15,23,42,0.22)] backdrop-blur-2xl"
        >
          <header className="flex items-start justify-between gap-2 border-b border-violet-700/40 bg-gradient-to-r from-violet-700 to-indigo-700 px-4 py-3">
            <div className="min-w-0 pt-0.5">
              <h2 className="truncate font-display text-[16px] font-bold tracking-tight text-white">
                Anawiser
              </h2>
              <p className="mt-0.5 text-[12px] font-medium text-violet-50">Anawiser&apos;s AI assistant</p>
            </div>
            <div className="flex shrink-0 items-center gap-0.5">
              <button
                type="button"
                onClick={clearChat}
                className="rounded-md px-2 py-1.5 text-[12px] text-violet-100 transition hover:bg-white/15 hover:text-white"
                title="Clear chat"
              >
                <span className="inline-flex items-center gap-1.5">
                  <Eraser className="h-3.5 w-3.5" />
                  Clear chat
                </span>
              </button>
              <button
                type="button"
                onClick={closePanel}
                className="rounded-md p-1.5 text-violet-200 transition hover:bg-white/15 hover:text-white"
                aria-label="Minimize"
                title="Minimize"
              >
                <Minus className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={closePanel}
                className="rounded-md p-1.5 text-violet-200 transition hover:bg-white/15 hover:text-white"
                aria-label="Close"
                title="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </header>

          {configured === false ? (
            <div className="mx-3 mt-3 flex items-start gap-2 rounded-xl border border-amber-400/40 bg-amber-50 px-3 py-2.5 text-xs text-amber-900">
              <KeyRound className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <p>
                Add <code className="text-[10px]">GEMINI_API_KEY</code> in{" "}
                <code className="text-[10px]">frontend/.env.local</code> then restart.
              </p>
            </div>
          ) : null}

          <div className="flex-1 space-y-3 overflow-y-auto px-3 py-3">
            {messages.map((m, i) => (
              <div
                key={`${m.role}-${i}`}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-[14px] font-medium leading-relaxed ${
                    m.role === "user"
                      ? "rounded-br-md bg-gradient-to-br from-violet-700 to-indigo-700 text-white"
                      : "rounded-bl-md border border-slate-200 bg-slate-50 text-ink"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {busy ? (
              <div className="space-y-2.5 rounded-2xl rounded-bl-md border border-slate-200 bg-slate-50 px-3.5 py-3">
                <p className="text-[13px] font-medium leading-snug text-slate-700">
                  Preparing your answer — generating a thoughtful response takes a moment.
                </p>
                <div className="space-y-2">
                  <div className="h-2 w-full animate-pulse rounded bg-violet-200/60" />
                  <div className="h-2 w-[80%] animate-pulse rounded bg-cyan-200/50" />
                  <div className="h-2 w-[55%] animate-pulse rounded bg-indigo-200/40" />
                </div>
              </div>
            ) : null}
            <div ref={bottomRef} />
          </div>

          {error ? <p className="px-3 pb-1 text-[11px] text-rose-600">{error}</p> : null}

          {!busy && messages.length < 4 ? (
            <div className="flex flex-wrap gap-1.5 px-3 pb-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => void send(s)}
                  className="rounded-full border border-violet-300 bg-violet-50 px-2.5 py-1 text-[11px] font-semibold text-violet-800 transition hover:bg-violet-100"
                >
                  {s}
                </button>
              ))}
            </div>
          ) : null}

          <form
            className="border-t border-slate-200 p-3"
            onSubmit={(e) => {
              e.preventDefault();
              void send(input);
            }}
          >
            <div className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-300/50">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Anawiser for assistance"
                className="min-w-0 flex-1 bg-transparent text-sm font-medium text-ink outline-none placeholder:text-slate-500"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#7c3aed] text-white transition hover:bg-[#8b5cf6] disabled:opacity-40"
                aria-label="Send"
              >
                {busy ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          </form>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#6d28d9] text-white shadow-lg shadow-violet-950/40 transition hover:scale-105 hover:bg-[#7c3aed] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
        aria-label={open ? "Close Anawiser AI" : "Open Anawiser AI"}
      >
        {open ? <ChevronDown className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
      </button>
    </div>
  );
}
