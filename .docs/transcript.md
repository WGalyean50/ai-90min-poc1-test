# Project Transcript

Segment 1 — Core Feature Set (Detailed)

Build a personal research feed application. The user can define topics they want to stay informed about. Each topic has:

–
A name (e.g., "LLM Infrastructure")
–
A short description of what they care about within that topic
–
An update frequency preference: Daily, Weekly, or On Demand
For each topic, the app displays a feed of AI-generated summaries. Each feed item includes:

–
A headline
–
A 2-3 sentence summary
–
A source label (can be simulated for the POC)
–
A timestamp
Users can interact with each item: mark as Read, Save for later, or Dismiss. The saved items should be accessible in a separate view.

The app should have a clean, minimal UI. Navigation should support at least: Feed, Saved, and Topics.
Segment 2 — Intelligence Layer (Moderately Detailed)

The feed should feel curated, not random. Items the user has saved or read frequently should inform what surfaces next — the system should learn (or simulate learning) preferences over time.

There should be a way to chat directly with the content in the feed. For example, the user should be able to ask: "What are the main themes across my saved items this week?" or "Summarize what I missed on LLM Infrastructure."

The recency of items matters. Older items should decay in prominence unless the user has explicitly engaged with them.
Segment 3 — Portability (Vague)

Think about what happens when the user wants to take their research somewhere else. Maybe they're writing a memo. Maybe they're preparing for a meeting. Make it easy for them to get their content out.

Consider: what does "export" mean for this kind of product? It's not just a CSV. Think about the use case.
Segment 4 — Ambient & Social (Very Vague)

At some point, this becomes a social object. People share what they're learning. Researchers surface signals to each other. Think about what the right layer of social looks like here — not Twitter, not Slack — something native to how a knowledge worker actually shares context.

Also consider: what does this product do when you're not looking at it?
Segment 5 — The Vision (Abstract)

The best version of this product doesn't feel like a tool. It feels like a mind expanding alongside yours. It knows what you care about before you've said it clearly. It notices the shape of a problem across three unrelated articles. It's less about reading and more about becoming.

What does that version of this product look like? Build toward it in whatever way you can in the time remaining.