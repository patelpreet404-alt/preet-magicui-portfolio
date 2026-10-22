import { citationNumber, getCitation } from "@/content";
import { CiteMarker } from "./cite-region";

/**
 * A claim backed by evidence: the phrase gets the highlighter underlay and a numbered [n] button
 * that opens its note (see cite-region.tsx). Must sit inside a <CiteRegion>. `page` selects the
 * reading order used for numbering (src/content/citation-order.ts).
 */
export function Cite({ id, page = "home", children }: { id: string; page?: string; children: React.ReactNode }) {
  const citation = getCitation(id);
  const n = citationNumber(page, id);
  return (
    <>
      <span className="cite-mark" data-cite={id}>
        {children}
      </span>
      <CiteMarker n={n} citation={citation} />
    </>
  );
}
