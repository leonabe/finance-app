import type { Metadata } from "next";
import { Source_Serif_4, IBM_Plex_Mono } from "next/font/google";
import { AppHeader } from "@/components/layout/AppHeader";
import "./globals.css";

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  display: "swap",
});

const ibmMono = IBM_Plex_Mono({
  variable: "--font-ibm-mono",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mastering Financial Calculations — Companion",
  description:
    "Learning and practice companion for financial arithmetic, money markets, FRAs, futures, swaps, and options (Steiner Ch 1–4, 8–9).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sourceSerif.variable} ${ibmMono.variable} min-h-screen antialiased`}>
        <AppHeader />
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
        <footer className="mx-auto max-w-6xl border-t border-ink-200 px-4 py-6 text-xs text-ink-500 sm:px-6">
          Educational companion focused on Steiner chapters 1, 2, 3, 4, 8, and 9. Not affiliated
          with the publisher. Formulas for learning use only.
        </footer>
      </body>
    </html>
  );
}
