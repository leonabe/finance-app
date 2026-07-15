import Link from "next/link";
import { CHAPTERS } from "@/lib/chapters";
import { RechartsReadyMarker } from "@/components/charts/RechartsReadyMarker";

export default function HomePage() {
  return (
    <div>
      <RechartsReadyMarker />
      <header className="mb-10 border-b border-ink-200 pb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-ink-500">
          Digital companion
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
          Mastering Financial Calculations
        </h1>
        <p className="mt-3 max-w-2xl text-ink-700">
          Structured explanations, formula references, interactive calculators, and practice
          exercises — aligned with Robert Steiner&apos;s textbook coverage for the chapters below.
          Clean, precise, no fluff.
        </p>
      </header>

      <section aria-labelledby="chapters-heading">
        <h2 id="chapters-heading" className="mb-4 text-lg font-semibold text-ink-900">
          Chapters
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {CHAPTERS.map((ch) => (
            <Link
              key={ch.slug}
              href={`/chapters/${ch.slug}`}
              className="block border border-ink-200 bg-paper p-4 transition hover:border-ink-400 hover:bg-white"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-mono text-xs text-ink-500">Chapter {ch.number}</div>
                  <div className="text-lg font-semibold text-ink-900">{ch.title}</div>
                </div>
                <span className="badge">
                  {ch.status === "ready" ? "Ready" : "Outline"}
                </span>
              </div>
              <ul className="mt-2 list-disc pl-5 text-sm text-ink-600">
                {ch.topics.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-12 border-t border-ink-200 pt-6">
        <h2 className="mb-2 text-lg font-semibold text-ink-900">How to use this app</h2>
        <ol className="list-decimal space-y-1 pl-5 text-ink-700">
          <li>Open a chapter from the navigation or the cards above.</li>
          <li>Read the exposition and formula blocks.</li>
          <li>Work the interactive calculators with textbook-style inputs.</li>
          <li>Complete the practice exercises and check your answers.</li>
        </ol>
        <p className="mt-4 text-sm text-ink-600">
          Optional:{" "}
          <Link href="/auth/signup" className="underline">
            create an account
          </Link>{" "}
          to keep a session (Supabase). Learning content is available without signing in.
        </p>
      </section>

      <section
        aria-labelledby="graphs-heading"
        className="mt-12 border-t border-ink-200 pt-6"
        id="graphs-preview"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 id="graphs-heading" className="text-lg font-semibold text-ink-900">
            Graphs &amp; Visualizations
          </h2>
          <span className="badge">Coming soon</span>
        </div>
        <p className="mt-2 max-w-2xl text-sm text-ink-700">
          Chart-based views of curves, cashflows, and rate paths will appear here later. Chapter
          content stays text-and-calculator first until then.
        </p>
        <p className="mt-3 text-sm">
          <Link
            href="/graphs"
            className="font-medium text-ink-800 underline underline-offset-2 hover:text-ink-900"
          >
            Open Graphs &amp; Visualizations →
          </Link>
        </p>
      </section>
    </div>
  );
}
