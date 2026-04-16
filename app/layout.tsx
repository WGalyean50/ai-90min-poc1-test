import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Research Feed",
  description: "A personal research feed that notices patterns.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
