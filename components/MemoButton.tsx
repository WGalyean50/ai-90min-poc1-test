"use client";

import { useState } from "react";
import { markdownToHtml } from "@/lib/markdown";
import type { FeedItem, Topic } from "@/lib/types";

interface Props {
  items: FeedItem[];
  topics: Topic[];
}

export default function MemoButton({ items, topics }: Props) {
  const [open, setOpen] = useState(false);
  const [markdown, setMarkdown] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const topicName = (id: string) => topics.find((t) => t.id === id)?.name;

  async function generate() {
    setOpen(true);
    setLoading(true);
    setError(null);
    setMarkdown("");
    try {
      const res = await fetch("/api/memo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            headline: i.headline,
            summary: i.summary,
            source: i.source,
            topic: topicName(i.topicId),
          })),
        }),
      });
      if (!res.ok) {
        const { error: msg } = await res.json().catch(() => ({ error: "Request failed" }));
        throw new Error(msg || `HTTP ${res.status}`);
      }
      const { markdown: md } = (await res.json()) as { markdown: string };
      setMarkdown(md);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  }

  function download() {
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `memo-${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <button
        onClick={generate}
        disabled={items.length === 0 || loading}
        className="rounded-md bg-stone-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-50 hover:bg-stone-800"
      >
        {loading ? "Writing…" : "Create Memo"}
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-stone-900/40 p-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="mt-12 w-full max-w-2xl rounded-xl border border-stone-200 bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-stone-200 px-6 py-3">
              <h3 className="text-sm font-semibold">Memo</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={copy}
                  disabled={!markdown}
                  className="rounded px-3 py-1 text-xs text-stone-600 hover:bg-stone-100 disabled:opacity-40"
                >
                  {copied ? "Copied ✓" : "Copy Markdown"}
                </button>
                <button
                  onClick={download}
                  disabled={!markdown}
                  className="rounded px-3 py-1 text-xs text-stone-600 hover:bg-stone-100 disabled:opacity-40"
                >
                  Download .md
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="rounded p-1 text-stone-500 hover:bg-stone-100"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="max-h-[70vh] overflow-y-auto px-8 py-6">
              {loading && (
                <div className="flex items-center gap-2 text-sm text-stone-500">
                  <Spinner /> Synthesizing memo from {items.length} saved items…
                </div>
              )}
              {error && (
                <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}
              {markdown && (
                <article
                  className="prose-memo"
                  dangerouslySetInnerHTML={{ __html: markdownToHtml(markdown) }}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Spinner() {
  return (
    <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-stone-300 border-t-stone-900" />
  );
}
