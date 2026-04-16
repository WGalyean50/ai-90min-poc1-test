import { NextResponse } from "next/server";
import { SYNTHESIS_MODEL, getAnthropic, textFromMessage } from "@/lib/anthropic";

export const runtime = "nodejs";

interface BriefItem {
  headline: string;
  summary: string;
  topic: string;
  saved: boolean;
  read: boolean;
  daysAgo: number;
}

interface RequestBody {
  topics: string[];
  items: BriefItem[];
  hoursSinceLastVisit: number;
}

function prompt(b: RequestBody): string {
  const rendered =
    b.items.length === 0
      ? "(no items yet)"
      : b.items
          .slice(0, 30)
          .map((i, idx) => {
            const flags = [i.saved ? "SAVED" : null, i.read ? "READ" : null]
              .filter(Boolean)
              .join(",");
            return `${idx + 1}. "${i.headline}" [${i.topic}] (${i.daysAgo}d ago)${flags ? ` (${flags})` : ""}
   ${i.summary}`;
          })
          .join("\n\n");

  return `Write a single short paragraph (3-5 sentences) welcoming the user back to their research feed.

Topics they follow: ${b.topics.join(", ") || "(none)"}
Hours since their last visit: ${b.hoursSinceLastVisit}

Recent items (includes ones they saved and read):
${rendered}

Voice: warm, direct, specific. Like a sharp colleague catching them up in the hallway.

Guidelines:
- Name the single biggest signal across their topics.
- Mention specific items they saved or should look at, by headline fragments.
- End with one concrete recommendation ("worth your 5 minutes: ...").
- Keep it tight. No preamble like "Welcome back!" or "Here's your brief."
- Output ONLY the paragraph, no markdown, no quotes, no heading.`;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RequestBody;
    const anthropic = getAnthropic();
    const msg = await anthropic.messages.create({
      model: SYNTHESIS_MODEL,
      max_tokens: 400,
      messages: [{ role: "user", content: prompt(body) }],
    });
    return NextResponse.json({ text: textFromMessage(msg).trim() });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("brief error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
