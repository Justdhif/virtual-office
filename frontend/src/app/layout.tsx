import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ResearchVerse AI — 3D AI Virtual Research Office",
  description: "Interactive 3D Multi-Agent Academic Research & Writing Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="antialiased bg-slate-950 text-slate-100 overflow-hidden">
        {children}
      </body>
    </html>
  );
}
