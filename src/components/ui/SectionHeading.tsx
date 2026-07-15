type SectionHeadingProps = {
  id?: string;
  number?: string;
  children: React.ReactNode;
};

export function SectionHeading({ id, number, children }: SectionHeadingProps) {
  return (
    <h2
      id={id}
      className="mt-10 mb-3 border-b border-ink-200 pb-2 text-xl font-semibold tracking-tight text-ink-900"
    >
      {number && (
        <span className="mr-2 font-mono text-sm font-normal text-ink-500">{number}</span>
      )}
      {children}
    </h2>
  );
}
