import { NextResponse } from "next/server";
import { SYNTHESIS_MODEL, getAnthropic, textFromMessage } from "@/lib/anthropic";

export const runtime = "nodejs";

interface SavedItem {
  headline: string;
  summary: string;
  topic: string;
  daysAgo: number;
}

interface RequestBody {
  items: SavedItem[];
}

function prompt(items: SavedItem[]): string {
  const rendered = items
    .map(
      (i, idx) =>
        `${idx + 1}. "${i.headline}" [${i.topic}] (${i.daysAgo}d ago)
   ${i.summary}`,
    )
    .join("\n\n");

  return `You notice patterns across research items that the user has saved. Your job is to surface ONE cross-topic pattern they probably haven't articulated yet.

Saved items (last 14 days):
${rendered}

Output a single short paragraph (2-4 sentences) that:
1. Names the pattern directly (e.g., "You've saved 3 items about X and 2 about Y.").
2. States the non-obvious connection or underlying theme.
3. Ends with what the pattern implies or suggests the user is thinking about.

Rules:
- Be specific. Reference items by headline fragment in quotes.
- Prefer patterns that span 2+ topics. If everything is one topic, find a sub-pattern.
- Avoid filler like "interesting that..." or "it's worth noting."
- Output ONLY the paragraph. No heading, no markdown, no quotes around the output.`;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RequestBody;
    if (!body.items?.length) {
      return NextResponse.json({ text: "" });
    }
    const anthropic = getAnthropic();
    const msg = await anthropic.messages.create({
      model: SYNTHESIS_MODEL,
      max_tokens: 400,
      messages: [{ role: "user", content: prompt(body.items) }],
    });
    return NextResponse.json({ text: textFromMessage(msg).trim() });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("signal error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
