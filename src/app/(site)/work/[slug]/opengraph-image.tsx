import { getProject, projects } from "@/content";
import { OG_CONTENT_TYPE, OG_SIZE, renderOg } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Case study";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  return renderOg({
    kicker: "Case study",
    title: project?.name ?? "Case study",
    claim: project?.oneLiner ?? "",
  });
}
