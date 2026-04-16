# Execution Plan: Personal Research Feed POC

**Total budget:** 60 minutes
**Hard cutoff:** T+58 — stop adding, start polishing

Each task has a minute budget. If a task overruns by >50%, cut the next stretch task.

---

## Phase 0: Setup (T+0 → T+5, 5 min)

- [ ] Verify `ANTHROPIC_API_KEY` is present in env; if missing, ask user before proceeding
- [ ] Verify Node >= 18 and npm available
- [ ] `npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*"` in the project root
- [ ] `npm install @anthropic-ai/sdk`
- [ ] Create `.env.local` with `ANTHROPIC_API_KEY`
- [ ] Kill default landing page, confirm app boots on `localhost:3000`

**Acceptance:** `npm run dev` serves a blank Next page.

---

## Phase 1: Topics CRUD + Storage (T+5 → T+15, 10 min)

- [ ] `lib/storage.ts` — typed localStorage wrapper for `Topic`, `FeedItem`, `Interaction`
- [ ] Types: `Topic { id, name, description, frequency, createdAt }`, `FeedItem { id, topicId, headline, summary, source, timestamp }`, `Interaction { itemId, kind: 'read'|'saved'|'dismissed', at }`
- [ ] `/topics` page: list, create (inline form), delete
- [ ] Seed one default topic on first load so feed isn't empty ("LLM Infrastructure")
- [ ] Header nav: Feed / Saved / Topics + chat toggle

**Acceptance:** Can create a topic, see it persist on reload.

---

## Phase 2: Feed Generation (T+15 → T+28, 13 min)

- [ ] `app/api/generate-feed/route.ts` — POST `{ topicId, topicName, topicDescription, savedItems, dismissedItems }` → calls Claude Haiku, returns array of 5 items
- [ ] Prompt: generate 5 plausible feed items for the topic, using saved items as positive signal and dismissed as negative. Fake-but-plausible source names (publications, newsletters, blog names).
- [ ] `/feed` page: topic selector dropdown, feed list, Refresh button
- [ ] Feed items render as cards: headline, 2-3 sentence summary, source + timestamp, three action buttons
- [ ] Loading skeleton during generation

**Acceptance:** Select a topic, see 5 LLM-generated items within ~5 seconds.

---

## Phase 3: Actions + Saved View (T+28 → T+38, 10 min)

- [ ] Read / Save / Dismiss buttons per item, write to `Interaction` store
- [ ] Visual states: read = dimmed, saved = bookmark filled, dismissed = removed from feed
- [ ] `/saved` page: list of saved items with topic badge, un-save action

**Acceptance:** Save 2 items, navigate to `/saved`, see them. Reload, still there.

---

## Phase 4: Chat Drawer (T+38 → T+48, 10 min)

- [ ] Right-side drawer component, toggle from header
- [ ] Two modes: **This Topic** (uses current `/feed` topic) / **Everything** (uses all saved + all recent items)
- [ ] Starter chips: "Main themes in my saved items", "What did I miss on [topic]", "Summarize this week"
- [ ] `app/api/chat/route.ts` — POST `{ mode, topicId?, history, message }` → Claude Sonnet 4.6, returns single response
- [ ] No streaming for POC (keeps code simple); show spinner

**Acceptance:** Ask "what did I save about X", get a grounded answer referencing saved items.

---

## Phase 5: Create Memo (T+48 → T+53, 5 min)

- [ ] **Create Memo** button on `/saved`
- [ ] `app/api/memo/route.ts` — POST `{ items }` → Claude Sonnet 4.6 → structured markdown (Title, TL;DR, Themes, Pull Quotes, Next Actions)
- [ ] Modal renders markdown with `react-markdown` or dangerouslySetInnerHTML of a tiny md→html pass
- [ ] Copy Markdown button + Download .md button

**Acceptance:** Click Create Memo on 3+ saved items, see a coherent brief, copy it to clipboard.

---

## Phase 6: Daily Brief + Signal (T+53 → T+58, 5 min)

- [ ] **Daily Brief** card at top of `/feed`: single paragraph from Sonnet, fed all topics + recent interactions
- [ ] **Signal** card below Daily Brief: cross-topic pattern detection from Sonnet, fed all saved items from last 14 days
- [ ] Both have a small Refresh icon
- [ ] Cache in localStorage with 6-hour TTL so they don't regenerate on every nav

**Acceptance:** Both cards render non-trivial text on first load with 2+ topics and 3+ saved items.

---

## Phase 7: Polish + Verify (T+58 → T+60, 2 min)

- [ ] Fix any obvious layout breaks
- [ ] Confirm three-route nav + chat drawer all work end-to-end
- [ ] Walk the success-criteria checklist from PRD
- [ ] Take a screenshot of `/feed` for the handoff

**Acceptance:** All 7 PRD success criteria pass.

---

## Cut list (in priority order, if behind)

1. Signal card (Phase 6 second half)
2. Daily Brief (Phase 6 first half)
3. Global chat mode (keep topic-mode only)
4. Memo download button (keep copy only)
5. Dismissed-item visual feedback (keep silent removal)

## Stretch list (if ahead)

1. Streaming for chat responses
2. Per-topic color accents on feed cards
3. Empty states with copy that gestures at the vision
4. Keyboard shortcuts: `s` save, `d` dismiss, `r` read
