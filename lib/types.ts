export type Frequency = "Daily" | "Weekly" | "On Demand";

export interface Topic {
  id: string;
  name: string;
  description: string;
  frequency: Frequency;
  createdAt: number;
}

export interface FeedItem {
  id: string;
  topicId: string;
  headline: string;
  summary: string;
  source: string;
  timestamp: number;
}

export type InteractionKind = "read" | "saved" | "dismissed";

export interface Interaction {
  itemId: string;
  kind: InteractionKind;
  at: number;
}

export interface BriefCache {
  text: string;
  generatedAt: number;
}
