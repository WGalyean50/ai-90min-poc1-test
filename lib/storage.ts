"use client";

import type { Topic, FeedItem, Interaction, BriefCache } from "./types";

const KEYS = {
  topics: "prf.topics.v1",
  feed: "prf.feed.v1",
  interactions: "prf.interactions.v1",
  lastVisit: "prf.lastVisit.v1",
  brief: "prf.brief.v1",
  signal: "prf.signal.v1",
} as const;

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore quota / serialization errors
  }
}

// ---------- Topics ----------

export function getTopics(): Topic[] {
  return read<Topic[]>(KEYS.topics, []);
}

export function saveTopics(topics: Topic[]): void {
  write(KEYS.topics, topics);
}

export function addTopic(t: Omit<Topic, "id" | "createdAt">): Topic {
  const topic: Topic = {
    ...t,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  };
  const all = getTopics();
  all.push(topic);
  saveTopics(all);
  return topic;
}

export function deleteTopic(id: string): void {
  saveTopics(getTopics().filter((t) => t.id !== id));
  // cascade: drop feed items for that topic
  saveFeedItems(getFeedItems().filter((f) => f.topicId !== id));
}

export function seedDefaultTopicIfEmpty(): void {
  if (typeof window === "undefined") return;
  if (getTopics().length === 0) {
    addTopic({
      name: "LLM Infrastructure",
      description:
        "Inference stacks, serving frameworks, eval orchestration, latency and cost tradeoffs.",
      frequency: "Daily",
    });
  }
}

// ---------- Feed ----------

export function getFeedItems(): FeedItem[] {
  return read<FeedItem[]>(KEYS.feed, []);
}

export function saveFeedItems(items: FeedItem[]): void {
  write(KEYS.feed, items);
}

export function getFeedItemsForTopic(topicId: string): FeedItem[] {
  return getFeedItems().filter((i) => i.topicId === topicId);
}

export function upsertFeedItems(newItems: FeedItem[]): void {
  const existing = getFeedItems();
  const byId = new Map(existing.map((i) => [i.id, i] as const));
  for (const n of newItems) byId.set(n.id, n);
  saveFeedItems(Array.from(byId.values()));
}

// ---------- Interactions ----------

export function getInteractions(): Interaction[] {
  return read<Interaction[]>(KEYS.interactions, []);
}

export function saveInteractions(list: Interaction[]): void {
  write(KEYS.interactions, list);
}

export function recordInteraction(itemId: string, kind: Interaction["kind"]): void {
  const list = getInteractions().filter(
    (i) => !(i.itemId === itemId && i.kind === kind),
  );
  list.push({ itemId, kind, at: Date.now() });
  saveInteractions(list);
}

export function removeInteraction(itemId: string, kind: Interaction["kind"]): void {
  saveInteractions(
    getInteractions().filter((i) => !(i.itemId === itemId && i.kind === kind)),
  );
}

export function interactionSet(kind: Interaction["kind"]): Set<string> {
  return new Set(getInteractions().filter((i) => i.kind === kind).map((i) => i.itemId));
}

// ---------- Last visit ----------

export function getLastVisit(): number {
  return read<number>(KEYS.lastVisit, 0);
}

export function setLastVisit(ts: number): void {
  write(KEYS.lastVisit, ts);
}

// ---------- Brief / Signal cache ----------

export function getBriefCache(): BriefCache | null {
  return read<BriefCache | null>(KEYS.brief, null);
}

export function setBriefCache(c: BriefCache): void {
  write(KEYS.brief, c);
}

export function getSignalCache(): BriefCache | null {
  return read<BriefCache | null>(KEYS.signal, null);
}

export function setSignalCache(c: BriefCache): void {
  write(KEYS.signal, c);
}

export { KEYS };
