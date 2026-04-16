"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import FeedCard from "@/components/FeedCard";
import MemoButton from "@/components/MemoButton";
import {
  getFeedItems,
  getTopics,
  interactionSet,
  recordInteraction,
  removeInteraction,
} from "@/lib/storage";
import type { FeedItem, Topic } from "@/lib/types";

export default function SavedPage() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [savedSet, setSavedSet] = useState<Set<string>>(new Set());
  const [readSet, setReadSet] = useState<Set<string>>(new Set());

  function refresh() {
    setTopics(getTopics());
    setSavedSet(interactionSet("saved"));
    setReadSet(interactionSet("read"));
    setItems(getFeedItems());
  }

  useEffect(() => {
    refresh();
  }, []);

  const saved = items
    .filter((i) => savedSet.has(i.id))
    .sort((a, b) => b.timestamp - a.timestamp);
  const topicName = (id: string) => topics.find((t) => t.id === id)?.name;

  function toggleSave(id: string) {
    if (savedSet.has(id)) {
      removeInteraction(id, "saved");
    } else {
      recordInteraction(id, "saved");
    }
    refresh();
  }

  function toggleRead(id: string) {
    if (readSet.has(id)) removeInteraction(id, "read");
    else recordInteraction(id, "read");
    refresh();
  }

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Saved</h1>
          <p className="mt-1 text-sm text-stone-500">
            The items you flagged as worth returning to.
          </p>
        </div>
        {saved.length > 0 && <MemoButton items={saved} topics={topics} />}
      </div>

      <div className="mt-8 space-y-4">
        {saved.length === 0 && (
          <div className="rounded-lg border border-dashed border-stone-300 bg-white p-10 text-center">
            <p className="text-sm text-stone-600">
              Nothing saved yet.{" "}
              <Link href="/feed" className="underline">
                Go to the feed
              </Link>{" "}
              and star what matters.
            </p>
          </div>
        )}
        {saved.map((i) => (
          <FeedCard
            key={i.id}
            item={i}
            topicName={topicName(i.topicId)}
            isRead={readSet.has(i.id)}
            isSaved
            onRead={() => toggleRead(i.id)}
            onSave={() => toggleSave(i.id)}
          />
        ))}
      </div>
    </div>
  );
}
