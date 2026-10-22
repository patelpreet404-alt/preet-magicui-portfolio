import { experience } from "./experience";
import { featuredProjects } from "./projects";

/**
 * Citation numbers follow reading order per page. Server components under client boundaries do not
 * render in document order, so each page declares its order here instead of counting at render time.
 */
export const citationOrder: Record<string, readonly string[]> = {
  home: [
    "hero-researchpaper",
    "hero-rang",
    "hero-optilang",
    ...featuredProjects.flatMap((project) => (project.proof ? [project.proof] : [])),
    ...experience.map((job) => job.outcome.citationId),
  ],
};

export function citationNumber(page: string, id: string): number {
  const index = citationOrder[page]?.indexOf(id) ?? -1;
  if (index < 0) throw new Error(`Citation "${id}" is not in the reading order of page "${page}" (src/content/citation-order.ts)`);
  return index + 1;
}
