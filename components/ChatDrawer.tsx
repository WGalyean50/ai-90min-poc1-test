"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useChatDrawer } from "./ChatDrawerContext";
import {
  getFeedItems,
  getTopics,
  interactionSet,
} from "@/lib/storage";
import type { FeedItem, Topic } from "@/lib/types";

type Mode = "topic" | "everything";

interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

const STARTER_CHIPS: { label: string; prompt: string }[] = [
  { label: "Main themes in my saved items", prompt: "What are the main themes across my saved items this week?" },
  { label: "What did I miss", prompt: "Summarize what I missed on this topic." },
  { label: "Why these patterns", prompt: "Why do these saved items cluster together? What's the underlying pattern?" },
];

export default function ChatDrawer() {
  const { open, close, topicId } = useChatDrawer();
  const [mode, setMode] = useState<Mode>("topic");
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reset mode default when topic context changes
    if (!topicId) setMode("everything");
  }, [topicId]);

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [open, turns]);

  const topicName = useMemo<string | undefined>(() => {
    if (!topicId) return undefined;
    return getTopics().find((t) => t.id === topicId)?.name;
  }, [topicId, open]);

  function buildContextItems(): {
    items: ReturnType<typeof mapItem>[];
    topicName?: string;
  } {
    const all = getFeedItems();
    const savedIds = interactionSet("saved");
    const readIds = interactionSet("read");
    const dismissedIds = interactionSet("dismissed");
    const topicNameById = new Map(getTopics().map((t) => [t.id, t.name] as const));

    function mapItem(i: FeedItem) {
      return {
        headline: i.headline,
        summary: i.summary,
        source: i.source,
        topic: topicNameById.get(i.topicId),
        saved: savedIds.has(i.id),
        read: readIds.has(i.id),
        dismissed: dismissedIds.has(i.id),
        daysAgo: Math.max(0, Math.round((Date.now() - i.timestamp) / 86_400_000)),
      };
    }

    if (mode === "topic" && topicId) {
      const filtered = all.filter((i) => i.topicId === topicId);
      return { items: filtered.map(mapItem), topicName };
    }
    // everything mode: include all non-dismissed + all saved
    const filtered = all.filter((i) => savedIds.has(i.id) || !dismissedIds.has(i.id));
    return { items: filtered.map(mapItem) };
  }

  async function send(text: string) {
    const q = text.trim();
    if (!q) return;
    const newTurns: ChatTurn[] = [...turns, { role: "user", content: q }];
    setTurns(newTurns);
    setInput("");
    setLoading(true);
    setError(null);
    try {
      const ctx = buildContextItems();
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          topicName: ctx.topicName,
          items: ctx.items,
          history: turns,
          message: q,
        }),
      });
      if (!res.ok) {
        const { error: msg } = await res.json().catch(() => ({ error: "Request failed" }));
        throw new Error(msg || `HTTP ${res.status}`);
      }
      const { reply } = (await res.json()) as { reply: string };
      setTurns([...newTurns, { role: "assistant", content: reply }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <>
      <div onClick={close} className="fixed inset-0 z-40 bg-stone-900/20" aria-hidden />
      <aside className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-stone-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-stone-200 px-5 py-3">
          <h2 className="text-sm font-semibold">Ask your feed</h2>
          <button
            onClick={close}
            className="rounded p-1 text-stone-500 hover:bg-stone-100"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="flex items-center gap-1 border-b border-stone-200 px-5 py-2 text-xs">
          <button
            disabled={!topicId}
            onClick={() => setMode("topic")}
            className={
              "rounded px-2 py-1 " +
              (mode === "topic" && topicId
                ? "bg-stone-900 text-white"
                : "text-stone-600 hover:bg-stone-100 disabled:opacity-40 disabled:hover:bg-transparent")
            }
          >
            This topic{topicName ? ` · ${topicName}` : ""}
          </button>
          <button
            onClick={() => setMode("everything")}
            className={
              "rounded px-2 py-1 " +
              (mode === "everything"
                ? "bg-stone-900 text-white"
                : "text-stone-600 hover:bg-stone-100")
            }
          >
            Everything
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 text-sm">
          {turns.length === 0 && (
            <div className="space-y-3">
              <p className="text-stone-500">
                Ask a question. Answers use your saved, read, and recent items as context.
              </p>
              <div className="flex flex-wrap gap-2">
                {STARTER_CHIPS.map((c) => (
                  <button
                    key={c.label}
                    onClick={() => send(c.prompt)}
                    className="rounded-full border border-stone-300 bg-white px-3 py-1 text-xs text-stone-700 hover:bg-stone-50"
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            {turns.map((t, i) => (
              <div key={i} className={t.role === "user" ? "text-right" : ""}>
                <div
                  className={
                    "inline-block max-w-[90%] rounded-lg px-3 py-2 text-left " +
                    (t.role === "user"
                      ? "bg-stone-900 text-white"
                      : "bg-stone-100 text-stone-900")
                  }
                >
                  <p className="whitespace-pre-wrap">{t.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div>
                <div className="inline-flex items-center gap-2 rounded-lg bg-stone-100 px-3 py-2 text-stone-500">
                  <Spinner /> Thinking…
                </div>
              </div>
            )}
            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-red-700">
                {error}
              </div>
            )}
          </div>
          <div ref={endRef} />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="border-t border-stone-200 p-3"
        >
          <div className="flex items-end gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              rows={2}
              placeholder="Ask about your feed…"
              className="flex-1 resize-none rounded-md border border-stone-300 px-3 py-2 text-sm outline-none focus:border-stone-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-md bg-stone-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-50 hover:bg-stone-800"
            >
              Send
            </button>
          </div>
        </form>
      </aside>
    </>
  );
}

function Spinner() {
  return (
    <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-stone-300 border-t-stone-900" />
  );
}
