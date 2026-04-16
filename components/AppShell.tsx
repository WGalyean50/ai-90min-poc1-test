"use client";

import { ReactNode, useEffect } from "react";
import Header from "./Header";
import ChatDrawer from "./ChatDrawer";
import { ChatDrawerProvider } from "./ChatDrawerContext";
import { seedDefaultTopicIfEmpty, setLastVisit } from "@/lib/storage";

export default function AppShell({ children }: { children: ReactNode }) {
  useEffect(() => {
    seedDefaultTopicIfEmpty();
    setLastVisit(Date.now());
  }, []);

  return (
    <ChatDrawerProvider>
      <Header />
      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
      <ChatDrawer />
    </ChatDrawerProvider>
  );
}
