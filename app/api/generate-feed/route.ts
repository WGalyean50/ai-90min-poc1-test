import { NextResponse } from "next/server";
import { FEED_MODEL, getAnthropic, textFromMessage } from "@/lib/anthropic";

export const runtime = "nodejs";

interface MiniItem {
  headline: string;
  summary: string;
}

interface RequestBody {
  topicId: string;
  topicName: string;
  topicDescription: string;
  savedItems?: MiniItem[];
  dismissedItems?: MiniItem[];
}

function buildPrompt(b: RequestBody): string {
  const saved = (b.savedItems ?? [])
    .slice(-5)
    .map((i, idx) => `  ${idx + 1}. ${i.headline} — ${i.summary}`)
    .join("\n") || "  (none yet)";
  const dismissed = (b.dismissedItems ?? [])
    .slice(-5)
    .map((i, idx) => `  ${idx + 1}. ${i.headline} — ${i.summary}`)
    .join("\n") || "  (none yet)";

  return `You curate a daily research feed for a knowledge worker.

Topic name: ${b.topicName}
What the user cares about: ${b.topicDescription || "(no description provided)"}

Items the user SAVED previously (positive signal, tilt toward these patterns):
${saved}

Items the user DISMISSED previously (negative signal, avoid these patterns):
${dismissed}

Generate 5 plausible, distinct feed items for today. Each item should:
- Have a specific, concrete headline (not vague).
- Have a 2-3 sentence summary that explains what happened and why it matters.
- Cite a plausible fictional source (a publication, newsletter, research lab blog, etc.).
- Avoid duplication with saved/dismissed themes too closely; offer variety.
- Skew toward the intersection of the user's stated interest and the saved-item patterns.

Return ONLY valid JSON matching this shape (no prose, no markdown fences):

{
  "items": [
    {"headline": "...", "summary": "...", "source": "..."},
    ...
  ]
}`;
}

function parseItems(raw: string): { headline: string; summary: string; source: string }[] {
  const cleaned = raw.trim().replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  const parsed = JSON.parse(cleaned);
  if (!parsed || !Array.isArray(parsed.items)) {
    throw new Error("Response missing items[] array");
  }
  return parsed.items
    .filter(
      (i: unknown): i is { headline: string; summary: string; source: string } =>
        !!i &&
        typeof (i as { headline?: unknown }).headline === "string" &&
        typeof (i as { summary?: unknown }).summary === "string" &&
        typeof (i as { source?: unknown }).source === "string",
    )
    .slice(0, 5);
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RequestBody;
    if (!body.topicId || !body.topicName) {
      return NextResponse.json({ error: "topicId and topicName required" }, { status: 400 });
    }

    const anthropic = getAnthropic();
    const msg = await anthropic.messages.create({
      model: FEED_MODEL,
      max_tokens: 1500,
      temperature: 0.8,
      messages: [{ role: "user", content: buildPrompt(body) }],
    });

    const text = textFromMessage(msg);
    const items = parseItems(text);
    const now = Date.now();
    const out = items.map((i, idx) => ({
      id: `${body.topicId}-${now}-${idx}`,
      topicId: body.topicId,
      headline: i.headline,
      summary: i.summary,
      source: i.source,
      timestamp: now - idx * 60_000,
    }));

    return NextResponse.json({ items: out });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("generate-feed error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
