"use client";

import { useEffect, useState } from "react";
import {
  getBriefCache,
  getFeedItems,
  getLastVisit,
  getTopics,
  interactionSet,
  setBriefCache,
} from "@/lib/storage";

const TTL_MS = 6 * 60 * 60 * 1000;

export default function DailyBrief() {
  const [text, setText] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cached = getBriefCache();
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
    try {
      const topics = getTopics();
      if (topics.length === 0) {
        setText("");
        return;
      }
      const items = getFeedItems();
      const saved = interactionSet("saved");
      const read = interactionSet("read");
      const topicById = new Map(topics.map((t) => [t.id, t.name] as const));
      const lastVisit = getLastVisit() || Date.now();
      const hoursSinceLastVisit = Math.max(
        0,
        Math.round((Date.now() - lastVisit) / 3_600_000),
      );

      const payloadItems = items
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 25)
        .map((i) => ({
          headline: i.headline,
          summary: i.summary,
          topic: topicById.get(i.topicId) ?? "unknown",
          saved: saved.has(i.id),
          read: read.has(i.id),
          daysAgo: Math.max(0, Math.round((Date.now() - i.timestamp) / 86_400_000)),
        }));

      const res = await fetch("/api/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topics: topics.map((t) => t.name),
          items: payloadItems,
          hoursSinceLastVisit,
        }),
      });
      if (!res.ok) {
        const { error: msg } = await res.json().catch(() => ({ error: "Request failed" }));
        throw new Error(msg || `HTTP ${res.status}`);
      }
      const { text: t } = (await res.json()) as { text: string };
      setText(t);
      setBriefCache({ text: t, generatedAt: Date.now() });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (!text && !loading && !error) return null;

  return (
    <section className="rounded-lg border border-stone-200 bg-gradient-to-br from-white to-stone-50 p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            Daily Brief
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
        {loading && !text && <span className="text-stone-400">Synthesizing your brief…</span>}
        {error && <span className="text-red-600">{error}</span>}
        {text && <p>{text}</p>}
      </div>
    </section>
  );
}
