import Anthropic from "@anthropic-ai/sdk";

export const FEED_MODEL = "claude-haiku-4-5-20251001";
export const SYNTHESIS_MODEL = "claude-sonnet-4-6";

let client: Anthropic | null = null;

export function getAnthropic(): Anthropic {
  if (client) return client;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY not set. Add it to .env.local and restart dev server.");
  }
  client = new Anthropic({ apiKey });
  return client;
}

export function textFromMessage(msg: Anthropic.Message): string {
  return msg.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n");
}
