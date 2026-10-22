import type { Metadata } from "next";

// Temporary: a proof page for the Phase 1 design system. Deleted in Phase 5.
export const metadata: Metadata = {
  title: "Styleguide",
  robots: { index: false, follow: false },
};

const swatches = [
  { token: "paper", className: "bg-paper", note: "page background" },
  { token: "ink", className: "bg-ink", note: "primary text" },
  { token: "graphite", className: "bg-graphite", note: "secondary text" },
  { token: "rule", className: "bg-rule", note: "hairlines" },
  { token: "highlight", className: "bg-highlight", note: "cited claims only" },
  { token: "link", className: "bg-link", note: "links, focus, active" },
] as const;

const scale = [
  { name: "Display", className: "type-display", sample: "Shows its work." },
  { name: "h2", className: "type-h2", sample: "Selected work" },
  { name: "h3", className: "type-h3", sample: "ResearchPaper AI" },
  { name: "Lead", className: "type-lead", sample: "I'm a final-year Computer Science student at Delhi Technological University." },
  { name: "Body", className: "type-body measure-body", sample: "A compiler for a small C-like language, from tokens to optimized three-address code. Body text sits at 1.0625rem on a 66ch measure." },
  { name: "Prose", className: "type-prose measure-prose", sample: "Case-study prose is set in Newsreader at 1.1875rem with a 68ch measure, so long paragraphs stay comfortable to read." },
  { name: "Meta", className: "type-meta", sample: "Remote (New Jersey, USA) — Jun–Aug 2026" },
] as const;

const motion = [
  ["--dur-fast", "120ms", "t-fast"],
  ["--dur-base", "220ms", "t-base"],
  ["--dur-slow", "360ms", "t-slow"],
  ["--dur-hero", "700ms", "—"],
] as const;

export default function StyleguidePage() {
  return (
    <div className="container-site py-16">
      <h1 className="type-h2">Design system</h1>
      <p className="type-body measure-body mt-4 text-graphite">
        Tokens, type scale, grid and motion for the redesign. Temporary page, not linked from the site and removed in Phase 5.
      </p>

      <section aria-labelledby="sg-color" className="mt-16">
        <h2 id="sg-color" className="type-h3">Color</h2>
        <ul className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
          {swatches.map((swatch) => (
            <li key={swatch.token}>
              <div className={`${swatch.className} h-20 rounded-media border border-rule`} />
              <p className="type-meta mt-2 text-ink">--{swatch.token}</p>
              <p className="type-meta text-graphite">{swatch.note}</p>
            </li>
          ))}
        </ul>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-media border border-rule p-6">
            <p className="type-body text-ink">Ink on paper, the primary pair.</p>
            <p className="type-body mt-2 text-graphite">Graphite on paper, for secondary text.</p>
            <p className="type-body mt-2">
              A <a href="#sg-color" className="text-link underline underline-offset-4">link in --link</a> on paper.
            </p>
          </div>
          <div className="rounded-media border border-rule p-6">
            <p className="type-body text-ink">
              The highlight is reserved for{" "}
              <span className="bg-[linear-gradient(transparent_55%,var(--highlight)_55%)]">cited claims</span>
              <sup className="ml-0.5 text-link">[1]</sup>.
            </p>
            <p className="type-meta mt-4 text-graphite">Never used for emphasis in headlines.</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="sg-type" className="mt-16">
        <h2 id="sg-type" className="type-h3">Type</h2>
        <dl className="mt-6 divide-y divide-rule border-y border-rule">
          {scale.map((row) => (
            <div key={row.name} className="grid gap-2 py-6 md:grid-cols-[8rem_1fr]">
              <dt className="type-meta text-graphite">{row.name}</dt>
              <dd className={row.className}>{row.sample}</dd>
            </div>
          ))}
          <div className="grid gap-2 py-6 md:grid-cols-[8rem_1fr]">
            <dt className="type-meta text-graphite">Code</dt>
            <dd className="font-mono text-sm">app/services/chat_service.py</dd>
          </div>
        </dl>
      </section>

      <section aria-labelledby="sg-grid" className="mt-16">
        <h2 id="sg-grid" className="type-h3">Grid</h2>
        <p className="type-body measure-body mt-4 text-graphite">12 columns, 24px gutters, 1320px maximum. Text sections use the left 8; the right 4 hold citation notes at 1100px and wider.</p>
        <div className="grid-site mt-6 gap-y-2">
          {Array.from({ length: 12 }, (_, index) => (
            <div key={index} className="type-meta rounded-control bg-muted py-3 text-center text-graphite">
              {index + 1}
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="sg-controls" className="mt-16">
        <h2 id="sg-controls" className="type-h3">Controls and shape</h2>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <button type="button" className="type-meta t-base min-h-11 rounded-control bg-ink px-5 text-paper transition-opacity hover:opacity-85">
            Primary action
          </button>
          <button type="button" className="type-meta t-base min-h-11 rounded-control border border-rule px-5 text-ink transition-colors hover:border-ink">
            Secondary
          </button>
          <a href="#sg-controls" className="type-meta inline-flex min-h-11 items-center text-link underline underline-offset-4">
            Text link
          </a>
          <div className="h-16 w-28 rounded-media border border-rule bg-muted" aria-label="14px media frame" role="img" />
        </div>
        <p className="type-meta mt-4 text-graphite">Press Tab to see the 2px focus ring in --link with a 3px offset. Radius: 6px for controls, 14px for media frames. No shadows, no gradients.</p>
      </section>

      <section aria-labelledby="sg-motion" className="mt-16">
        <h2 id="sg-motion" className="type-h3">Motion</h2>
        <table className="type-meta mt-6 w-full max-w-xl text-left">
          <thead className="text-graphite">
            <tr className="border-b border-rule">
              <th scope="col" className="py-2 font-medium">Token</th>
              <th scope="col" className="py-2 font-medium">Value</th>
              <th scope="col" className="py-2 font-medium">Utility</th>
            </tr>
          </thead>
          <tbody>
            {motion.map(([token, value, utility]) => (
              <tr key={token} className="border-b border-rule">
                <td className="py-2 font-mono">{token}</td>
                <td className="py-2">{value}</td>
                <td className="py-2 font-mono">{utility}</td>
              </tr>
            ))}
            <tr className="border-b border-rule">
              <td className="py-2 font-mono">--ease-out</td>
              <td className="py-2" colSpan={2}>cubic-bezier(0.16, 1, 0.3, 1)</td>
            </tr>
            <tr className="border-b border-rule">
              <td className="py-2 font-mono">--ease-in-out</td>
              <td className="py-2" colSpan={2}>cubic-bezier(0.65, 0, 0.35, 1)</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}
