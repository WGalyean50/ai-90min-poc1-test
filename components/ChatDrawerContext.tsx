"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface ChatDrawerState {
  open: boolean;
  toggle: () => void;
  close: () => void;
  topicId: string | null;
  setTopicId: (id: string | null) => void;
}

const Ctx = createContext<ChatDrawerState | null>(null);

export function ChatDrawerProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [topicId, setTopicId] = useState<string | null>(null);
  return (
    <Ctx.Provider
      value={{
        open,
        toggle: () => setOpen((o) => !o),
        close: () => setOpen(false),
        topicId,
        setTopicId,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useChatDrawer() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useChatDrawer must be used inside ChatDrawerProvider");
  return ctx;
}
