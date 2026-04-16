"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useChatDrawer } from "./ChatDrawerContext";

const links = [
  { href: "/feed", label: "Feed" },
  { href: "/saved", label: "Saved" },
  { href: "/topics", label: "Topics" },
];

export default function Header() {
  const pathname = usePathname();
  const { toggle } = useChatDrawer();

  return (
    <header className="sticky top-0 z-30 border-b border-stone-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        <Link href="/feed" className="text-sm font-semibold tracking-tight text-stone-900">
          Research Feed
        </Link>
        <nav className="flex items-center gap-1">
          {links.map((l) => {
            const active = pathname === l.href || pathname.startsWith(l.href + "/");
            return (
              <Link
                key={l.href}
                href={l.href}
                className={
                  "rounded-md px-3 py-1.5 text-sm transition " +
                  (active
                    ? "bg-stone-900 text-white"
                    : "text-stone-600 hover:bg-stone-100 hover:text-stone-900")
                }
              >
                {l.label}
              </Link>
            );
          })}
          <button
            onClick={toggle}
            className="ml-2 rounded-md border border-stone-300 bg-white px-3 py-1.5 text-sm text-stone-700 hover:bg-stone-50"
            aria-label="Toggle chat"
          >
            Ask
          </button>
        </nav>
      </div>
    </header>
  );
}
