"use client";

// Placeholder shell — real implementation lands in the chat-drawer feature.
import { useChatDrawer } from "./ChatDrawerContext";

export default function ChatDrawer() {
  const { open, close } = useChatDrawer();
  if (!open) return null;
  return (
    <>
      <div
        onClick={close}
        className="fixed inset-0 z-40 bg-stone-900/20"
        aria-hidden
      />
      <aside className="fixed right-0 top-0 z-50 h-full w-full max-w-md border-l border-stone-200 bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Ask</h2>
          <button
            onClick={close}
            className="rounded p-1 text-stone-500 hover:bg-stone-100"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <p className="mt-6 text-sm text-stone-500">
          Chat coming online in the next phase.
        </p>
      </aside>
    </>
  );
}
