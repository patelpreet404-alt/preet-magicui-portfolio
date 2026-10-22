/** A labelled case-study section: h2 on the left at ≥1024px, content on the right, separated by a rule. */
export function CaseSection({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="grid-site gap-y-6 border-t border-rule pt-10">
      <h2 id={`${id}-title`} className="type-h3 col-span-12 lg:col-span-4">
        {title}
      </h2>
      <div className="col-span-12 lg:col-span-8">{children}</div>
    </section>
  );
}

export function Prose({ children }: { children: React.ReactNode }) {
  return <p className="type-prose measure-prose text-ink">{children}</p>;
}

export function ProseList({ items }: { items: readonly string[] }) {
  return (
    <ul className="space-y-4">
      {items.map((item) => (
        <li key={item} className="type-prose measure-prose flex gap-4 text-ink">
          <span aria-hidden="true" className="mt-[0.8em] h-px w-4 shrink-0 bg-graphite" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
