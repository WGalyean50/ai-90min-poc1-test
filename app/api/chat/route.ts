import { NextResponse } from "next/server";
import { SYNTHESIS_MODEL, getAnthropic, textFromMessage } from "@/lib/anthropic";

export const runtime = "nodejs";

interface ContextItem {
  headline: string;
  summary: string;
  source: string;
  topic?: string;
  saved?: boolean;
  dismissed?: boolean;
  read?: boolean;
  daysAgo?: number;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface RequestBody {
  mode: "topic" | "everything";
  topicName?: string;
  items: ContextItem[];
  history: ChatMessage[];
  message: string;
}

function systemPrompt(b: RequestBody): string {
  const scopeLine =
    b.mode === "topic" && b.topicName
      ? `You are helping the user think about items in their "${b.topicName}" topic.`
      : `You are helping the user think across their full research feed.`;

  const rendered =
    b.items.length === 0
      ? "(no items available yet)"
      : b.items
          .slice(0, 40)
          .map((i, idx) => {
            const flags = [
              i.saved ? "SAVED" : null,
              i.read ? "READ" : null,
              i.dismissed ? "DISMISSED" : null,
            ]
              .filter(Boolean)
              .join(",");
            const topic = i.topic ? ` [${i.topic}]` : "";
            const age =
              typeof i.daysAgo === "number" ? ` (${i.daysAgo}d ago)` : "";
            return `${idx + 1}. ${i.headline}${topic}${age}${flags ? ` (${flags})` : ""}
   ${i.summary}
   — ${i.source}`;
          })
          .join("\n\n");

  return `${scopeLine}

You have access to these items from the user's research feed:

${rendered}

Guidelines:
- Be specific. Cite items by headline in quotes or by numbered index when referring to them.
- Prefer concise, direct answers (3-6 short paragraphs max) over exhaustive summaries.
- If the user asks about themes or patterns, surface the non-obvious connection first, then evidence.
- If you don't have enough information to answer, say so plainly.
- Treat SAVED items as strong positive signal for what the user actually cares about.`;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RequestBody;
    if (!body.message || typeof body.message !== "string") {
      return NextResponse.json({ error: "message is required" }, { status: 400 });
    }

    const anthropic = getAnthropic();

    const messages: ChatMessage[] = [
      ...body.history.slice(-8),
      { role: "user", content: body.message },
    ];

    const msg = await anthropic.messages.create({
      model: SYNTHESIS_MODEL,
      max_tokens: 1024,
      system: systemPrompt(body),
      messages,
    });

    return NextResponse.json({ reply: textFromMessage(msg) });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("chat error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
