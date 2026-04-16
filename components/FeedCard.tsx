"use client";

import type { FeedItem } from "@/lib/types";

function relativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const min = Math.round(diff / 60_000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const d = Math.round(hr / 24);
  return `${d}d ago`;
}

interface Props {
  item: FeedItem;
  topicName?: string;
  isRead?: boolean;
  isSaved?: boolean;
  onRead?: () => void;
  onSave?: () => void;
  onDismiss?: () => void;
}

export default function FeedCard({
  item,
  topicName,
  isRead,
  isSaved,
  onRead,
  onSave,
  onDismiss,
}: Props) {
  return (
    <article
      className={
        "rounded-lg border border-stone-200 bg-white p-5 transition " +
        (isRead ? "opacity-60" : "")
      }
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold leading-snug text-stone-900">
            {item.headline}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-stone-600">{item.summary}</p>
          <div className="mt-3 flex items-center gap-2 text-xs text-stone-500">
            <span>{item.source}</span>
            <span>·</span>
            <span>{relativeTime(item.timestamp)}</span>
            {topicName && (
              <>
                <span>·</span>
                <span className="rounded bg-stone-100 px-1.5 py-0.5 text-[11px] text-stone-600">
                  {topicName}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-1">
        {onRead && (
          <button
            onClick={onRead}
            className={
              "rounded px-2.5 py-1 text-xs transition " +
              (isRead
                ? "bg-stone-200 text-stone-700"
                : "text-stone-600 hover:bg-stone-100 hover:text-stone-900")
            }
          >
            {isRead ? "Read" : "Mark read"}
          </button>
        )}
        {onSave && (
          <button
            onClick={onSave}
            className={
              "rounded px-2.5 py-1 text-xs transition " +
              (isSaved
                ? "bg-amber-100 text-amber-900"
                : "text-stone-600 hover:bg-stone-100 hover:text-stone-900")
            }
          >
            {isSaved ? "★ Saved" : "☆ Save"}
          </button>
        )}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="rounded px-2.5 py-1 text-xs text-stone-500 hover:bg-stone-100 hover:text-stone-900"
          >
            Dismiss
          </button>
        )}
      </div>
    </article>
  );
}
