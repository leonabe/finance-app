type FormulaBlockProps = {
  title: string;
  formula: string;
  notes?: string[];
};

export function FormulaBlock({ title, formula, notes }: FormulaBlockProps) {
  return (
    <figure className="my-4 border border-ink-200 bg-ink-50/60 p-4">
      <figcaption className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-600">
        {title}
      </figcaption>
      <pre className="overflow-x-auto font-mono text-sm leading-relaxed text-ink-900 whitespace-pre-wrap">
        {formula}
      </pre>
      {notes && notes.length > 0 && (
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-ink-700">
          {notes.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      )}
    </figure>
  );
}
