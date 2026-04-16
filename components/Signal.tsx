"use client";

import { useEffect, useState } from "react";
import {
  getFeedItems,
  getSignalCache,
  getTopics,
  interactionSet,
  setSignalCache,
} from "@/lib/storage";

const TTL_MS = 6 * 60 * 60 * 1000;
const WINDOW_DAYS = 14;

export default function Signal() {
  const [text, setText] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [empty, setEmpty] = useState(false);

  useEffect(() => {
    const cached = getSignalCache();
    if (cached && Date.now() - cached.generatedAt < TTL_MS && cached.text) {
      setText(cached.text);
      return;
    }
    generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function generate() {
    setLoading(true);
    setError(null);
    setEmpty(false);
    try {
      const items = getFeedItems();
      const saved = interactionSet("saved");
      const topics = getTopics();
      const topicById = new Map(topics.map((t) => [t.id, t.name] as const));
      const cutoff = Date.now() - WINDOW_DAYS * 86_400_000;

      const payload = items
        .filter((i) => saved.has(i.id) && i.timestamp >= cutoff)
        .map((i) => ({
          headline: i.headline,
          summary: i.summary,
          topic: topicById.get(i.topicId) ?? "unknown",
          daysAgo: Math.max(0, Math.round((Date.now() - i.timestamp) / 86_400_000)),
        }));

      if (payload.length < 2) {
        setEmpty(true);
        setText("");
        return;
      }

      const res = await fetch("/api/signal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: payload }),
      });
      if (!res.ok) {
        const { error: msg } = await res.json().catch(() => ({ error: "Request failed" }));
        throw new Error(msg || `HTTP ${res.status}`);
      }
      const { text: t } = (await res.json()) as { text: string };
      setText(t);
      setSignalCache({ text: t, generatedAt: Date.now() });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (empty && !text) {
    return (
      <section className="rounded-lg border border-dashed border-stone-300 bg-white p-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
          Signal
        </h2>
        <p className="mt-2 text-sm text-stone-500">
          Save 2+ items across your topics and a cross-topic pattern will appear here.
        </p>
      </section>
    );
  }

  if (!text && !loading && !error) return null;

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs text-amber-600">◆</span>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            Signal
          </h2>
        </div>
        <button
          onClick={generate}
          disabled={loading}
          className="text-xs text-stone-500 hover:text-stone-900 disabled:opacity-50"
        >
          {loading ? "…" : "↻"}
        </button>
      </div>
      <div className="mt-3 text-sm leading-relaxed text-stone-700">
        {loading && !text && <span className="text-stone-400">Looking for patterns…</span>}
        {error && <span className="text-red-600">{error}</span>}
        {text && <p>{text}</p>}
      </div>
    </section>
  );
}
