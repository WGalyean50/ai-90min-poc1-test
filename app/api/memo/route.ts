import { NextResponse } from "next/server";
import { SYNTHESIS_MODEL, getAnthropic, textFromMessage } from "@/lib/anthropic";

export const runtime = "nodejs";

interface MemoItem {
  headline: string;
  summary: string;
  source: string;
  topic?: string;
}

interface RequestBody {
  items: MemoItem[];
}

function buildPrompt(items: MemoItem[]): string {
  const rendered = items
    .map(
      (i, idx) =>
        `${idx + 1}. "${i.headline}"${i.topic ? ` [${i.topic}]` : ""}
   ${i.summary}
   — ${i.source}`,
    )
    .join("\n\n");

  return `Write a research memo synthesizing these ${items.length} items the user has saved.

Items:
${rendered}

Produce a markdown memo with this exact structure:

# {A specific, concrete title drawn from the content, not generic}

## TL;DR
- {Bullet 1}
- {Bullet 2}
- {Bullet 3}

## Key themes
{2-4 short paragraphs identifying the non-obvious patterns across items. Reference item numbers in parens, e.g. (1, 3).}

## Pull quotes
> "A specific, useful claim drawn from an item" — {source}
> "Another specific claim" — {source}

## Suggested next actions
- {Action 1}
- {Action 2}
- {Action 3}

Rules:
- Be specific. No hedging platitudes.
- Title should feel like something the user would write in their notes, not a generic summary.
- Themes section should surface the cross-cutting insight, not restate items.
- Output ONLY the markdown, no preamble or wrapping fences.`;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RequestBody;
    if (!body.items?.length) {
      return NextResponse.json({ error: "items required" }, { status: 400 });
    }

    const anthropic = getAnthropic();
    const msg = await anthropic.messages.create({
      model: SYNTHESIS_MODEL,
      max_tokens: 2048,
      messages: [{ role: "user", content: buildPrompt(body.items) }],
    });

    const markdown = textFromMessage(msg).trim();
    return NextResponse.json({ markdown });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("memo error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
