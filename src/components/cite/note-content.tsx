import Link from "next/link";
import { ArrowUpRight, X } from "lucide-react";
import type { Citation, CitationEvidence } from "@/content";

const KIND_LABEL: Record<CitationEvidence["kind"], string> = {
  demo: "Demo",
  source: "Source",
  resume: "Résumé",
  "case-study": "Case study",
};

function EvidenceLink({ evidence }: { evidence: CitationEvidence }) {
  const external = evidence.href.startsWith("http") || evidence.href.endsWith(".pdf");
  const inner = (
    <>
      <span className="text-graphite">{KIND_LABEL[evidence.kind]}</span>
      <span className="underline decoration-rule underline-offset-4 group-hover:decoration-link">{evidence.label}</span>
      <ArrowUpRight className="size-3.5 shrink-0 text-graphite" aria-hidden="true" />
      {external && <span className="sr-only">(opens in a new tab)</span>}
    </>
  );
  const className = "group type-meta inline-flex min-h-11 flex-wrap items-center gap-x-2 text-link";
  return external ? (
    <a href={evidence.href} target="_blank" rel="noopener noreferrer" className={className}>
      {inner}
    </a>
  ) : (
    <Link href={evidence.href} className={className}>
      {inner}
    </Link>
  );
}

function Bars({ visual }: { visual: NonNullable<Citation["visual"]> }) {
  const max = Math.max(...visual.bars.map((bar) => bar.value));
  return (
    <figure className="mt-3">
      <figcaption className="type-meta text-graphite">{visual.caption}</figcaption>
      <ul className="mt-2 space-y-2">
        {visual.bars.map((bar, index) => (
          <li key={bar.label} className="type-meta">
            <div className="flex justify-between gap-4 text-ink">
              <span>{bar.label}</span>
              <span className="tabular-nums">{bar.value}</span>
            </div>
            <div className="mt-1 h-2 rounded-control bg-muted" role="presentation">
              <div
                className={index === visual.bars.length - 1 ? "h-full rounded-control bg-ink" : "h-full rounded-control bg-graphite"}
                style={{ width: `${(bar.value / max) * 100}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </figure>
  );
}

export function NoteContent({
  n,
  citation,
  onClose,
}: {
  n: number;
  citation: Citation;
  onClose: () => void;
}) {
  return (
    <>
      <div className="flex items-start justify-between gap-2">
        <p className="type-meta text-ink">
          <span className="tabular-nums text-link">[{n}]</span> {citation.claim}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="-mr-2 -mt-2 inline-flex size-11 shrink-0 items-center justify-center rounded-control text-graphite hover:text-ink"
        >
          <X className="size-4" aria-hidden="true" />
          <span className="sr-only">Close note {n}</span>
        </button>
      </div>
      <p className="mt-1 font-serif text-base leading-relaxed text-graphite">{citation.explanation}</p>
      {citation.visual && <Bars visual={citation.visual} />}
      <ul className="mt-2">
        {citation.evidence.map((evidence) => (
          <li key={evidence.href}>
            <EvidenceLink evidence={evidence} />
          </li>
        ))}
      </ul>
    </>
  );
}
