import type { ChapterMeta } from "@/lib/chapters";

export function ChapterPlaceholder({ chapter }: { chapter: ChapterMeta }) {
  return (
    <article>
      <header className="mb-8 border-b border-ink-200 pb-4">
        <p className="font-mono text-sm text-ink-500">Chapter {chapter.number}</p>
        <h1 className="text-3xl font-semibold tracking-tight text-ink-900">{chapter.title}</h1>
        <p className="mt-2 text-ink-600">
          Section scaffold for this chapter. Full explanations, calculators, and exercises will
          follow the same textbook layout as Chapter 1.
        </p>
      </header>

      <section>
        <h2 className="mb-2 text-lg font-semibold text-ink-900">Scope (this edition)</h2>
        <ul className="list-disc space-y-1 pl-5 text-ink-700">
          {chapter.topics.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </section>

      <aside className="mt-8 border border-dashed border-ink-300 bg-ink-50/50 p-4 text-sm text-ink-700">
        <strong className="font-semibold text-ink-900">Status:</strong> Placeholder entry point
        only. Navigation and chapter identity are fixed so later content can drop in without
        restructuring the app.
      </aside>
    </article>
  );
}
