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
- Tailwind v4 config: `postcss.config.mjs` with `@tailwindcss/postcss` plugin + `@import "tailwindcss";` in globals.css. No `tailwind.config.js` needed.
- next 15.1.6 has CVE-2025-66478 but this is a localhost POC; not upgrading to stay inside the 60-min budget.
- `app/page.tsx` redirects to `/feed` — keeps `/` useful without a duplicate landing.
- AppShell is a client component (owns ChatDrawerProvider + seeder effect). It mounts in the root server layout, so all routes share it and seeding runs exactly once per session.
- Chat drawer has `topicId` in context so `/feed` can push its current topic before opening the drawer, enabling "This Topic" mode without prop drilling.
- **BLOCKER 2026-04-16:** `ANTHROPIC_API_KEY` in `~/.zshrc` and in `0students/bryan-yoon2/.env` both return 401 invalid-x-api-key. Need user to supply a live key before features 3-7 can pass verification. Code is built and builds clean; only API auth fails.
