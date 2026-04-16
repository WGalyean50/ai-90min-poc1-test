# Learnings

<!--
Record friction points, failed approaches, and solutions here.
Format: brief, actionable insights (not session logs).
Example: "Auth header requires 'Bearer ' prefix with trailing space"
-->

- Project root path contains spaces and parens — always quote paths in shell commands.
- `ANTHROPIC_API_KEY` is exported in `~/.zshrc` but not inherited by non-interactive shells. Source it explicitly or read `.env.local` in Node.
- Models per PRD: `claude-haiku-4-5-20251001` for feed generation, `claude-sonnet-4-6` for chat/memo/brief/signal.
- Next.js 15 App Router is scoped; use server route handlers (`app/api/*/route.ts`) to keep API key off client.
- Use `localStorage` guarded with `typeof window !== 'undefined'` checks to avoid SSR errors.
- Wrap localStorage JSON parse in try/catch and reset to default on corruption (per PRD risk mitigation).
