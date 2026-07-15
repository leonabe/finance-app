import type { Metadata } from "next";
import Link from "next/link";
import { GRAPHS_COMING_SOON_MESSAGE } from "@/lib/graphs-copy";

export const metadata: Metadata = {
  title: "Graphs & Visualizations · Financial Calculations",
  description: "Advanced visualizations and charts coming soon.",
};

export default function GraphsPage() {
  return (
    <article>
      <header className="mb-8 border-b border-ink-200 pb-4">
        <p className="font-mono text-sm text-ink-500">Supplement</p>
        <h1 className="text-3xl font-semibold tracking-tight text-ink-900">
          Graphs &amp; Visualizations
        </h1>
        <p className="mt-2 text-ink-600">
          <span className="badge">Coming soon</span>
        </p>
      </header>

      <div className="border border-dashed border-ink-300 bg-ink-50/50 p-6">
        <p className="text-ink-900">{GRAPHS_COMING_SOON_MESSAGE}.</p>
        <p className="mt-3 text-sm text-ink-600">
          Planned additions include yield-curve sketches, cashflow timelines, and rate-path charts
          that sit alongside the chapter calculators — without changing the textbook focus of the
          main sections.
        </p>
      </div>

      <p className="mt-8 text-sm text-ink-600">
        <Link href="/" className="underline">
          ← Back to chapters
        </Link>
      </p>
    </article>
  );
}
