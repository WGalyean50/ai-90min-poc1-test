"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import FeedCard from "@/components/FeedCard";
import {
  getFeedItemsForTopic,
  getTopics,
  interactionSet,
  recordInteraction,
  removeInteraction,
  upsertFeedItems,
} from "@/lib/storage";
import type { FeedItem, Topic } from "@/lib/types";

export default function FeedPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [topicId, setTopicId] = useState<string>("");
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [readSet, setReadSet] = useState<Set<string>>(new Set());
  const [savedSet, setSavedSet] = useState<Set<string>>(new Set());
  const [dismissedSet, setDismissedSet] = useState<Set<string>>(new Set());

  useEffect(() => {
    const t = getTopics();
    setTopics(t);
    if (t.length && !topicId) setTopicId(t[0].id);
    setReadSet(interactionSet("read"));
    setSavedSet(interactionSet("saved"));
    setDismissedSet(interactionSet("dismissed"));
  }, [topicId]);

  const currentTopic = useMemo(
    () => topics.find((t) => t.id === topicId),
    [topics, topicId],
  );

  useEffect(() => {
    if (!topicId) return;
    setItems(getFeedItemsForTopic(topicId));
  }, [topicId]);

  async function refresh() {
    if (!currentTopic) return;
    setLoading(true);
    setError(null);
    try {
      // Pull last 5 saved + dismissed items as signal
      const all = JSON.parse(localStorage.getItem("prf.feed.v1") || "[]") as FeedItem[];
      const mini = (kind: "saved" | "dismissed") => {
        const ids = Array.from(interactionSet(kind));
        return all
          .filter((i) => ids.includes(i.id))
          .slice(-5)
          .map((i) => ({ headline: i.headline, summary: i.summary }));
      };

      const res = await fetch("/api/generate-feed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topicId: currentTopic.id,
          topicName: currentTopic.name,
          topicDescription: currentTopic.description,
          savedItems: mini("saved"),
          dismissedItems: mini("dismissed"),
        }),
      });
      if (!res.ok) {
        const { error: msg } = await res.json().catch(() => ({ error: "Request failed" }));
        throw new Error(msg || `HTTP ${res.status}`);
      }
      const data = (await res.json()) as { items: FeedItem[] };
      upsertFeedItems(data.items);
      setItems(getFeedItemsForTopic(currentTopic.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function toggle(kind: "read" | "saved" | "dismissed", id: string) {
    const map = { read: readSet, saved: savedSet, dismissed: dismissedSet }[kind];
    const setter = { read: setReadSet, saved: setSavedSet, dismissed: setDismissedSet }[kind];
    const next = new Set(map);
    if (next.has(id)) {
      next.delete(id);
      removeInteraction(id, kind);
    } else {
      next.add(id);
      recordInteraction(id, kind);
    }
    setter(next);
  }

  const visible = items
    .filter((i) => !dismissedSet.has(i.id))
    .sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Feed</h1>
          <p className="mt-1 text-sm text-stone-500">
            Curated research for your topics. Save what matters.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={topicId}
            onChange={(e) => setTopicId(e.target.value)}
            className="rounded-md border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-stone-500"
          >
            {topics.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          <button
            onClick={refresh}
            disabled={loading || !currentTopic}
            className="rounded-md bg-stone-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-50 hover:bg-stone-800"
          >
            {loading ? "Generating…" : "Refresh"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-8 space-y-4">
        {loading && items.length === 0 && <FeedSkeleton />}
        {!loading && visible.length === 0 && (
          <EmptyState topicName={currentTopic?.name}>
            {topics.length === 0 ? (
              <>
                No topics yet.{" "}
                <Link href="/topics" className="underline">
                  Create your first topic
                </Link>
                .
              </>
            ) : (
              <>No items yet. Hit Refresh to generate a fresh feed.</>
            )}
          </EmptyState>
        )}
        {visible.map((i) => (
          <FeedCard
            key={i.id}
            item={i}
            topicName={currentTopic?.name}
            isRead={readSet.has(i.id)}
            isSaved={savedSet.has(i.id)}
            onRead={() => toggle("read", i.id)}
            onSave={() => toggle("saved", i.id)}
            onDismiss={() => toggle("dismissed", i.id)}
          />
        ))}
      </div>
    </div>
  );
}

function FeedSkeleton() {
  return (
    <>
      {[0, 1, 2].map((k) => (
        <div key={k} className="rounded-lg border border-stone-200 bg-white p-5">
          <div className="h-4 w-3/4 animate-pulse rounded bg-stone-200" />
          <div className="mt-3 h-3 w-full animate-pulse rounded bg-stone-100" />
          <div className="mt-2 h-3 w-5/6 animate-pulse rounded bg-stone-100" />
          <div className="mt-4 h-3 w-32 animate-pulse rounded bg-stone-100" />
        </div>
      ))}
    </>
  );
}

function EmptyState({ children, topicName }: { children: React.ReactNode; topicName?: string }) {
  return (
    <div className="rounded-lg border border-dashed border-stone-300 bg-white p-10 text-center">
      <p className="text-sm text-stone-600">{children}</p>
      {topicName && (
        <p className="mt-2 text-xs text-stone-400">Topic: {topicName}</p>
      )}
    </div>
  );
}
