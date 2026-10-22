import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Cite } from "@/components/cite/cite";
import { CiteNotes, CiteRegion } from "@/components/cite/cite-region";
import { LINK_KINDS } from "@/components/link-icons";
import { Safari } from "@/components/ui/safari";
import { ArchitectureStepper } from "@/components/work/architecture-stepper";
import { CaseSection, Prose, ProseList } from "@/components/work/case-section";
import { SystemDesign, hasSystemDesign } from "@/components/work/system-design";
import { getProject, profile, projects, type Project } from "@/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  const title = `${project.name}: case study`;
  return {
    title,
    description: project.oneLiner,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: { title, description: project.oneLiner, url: `/work/${project.slug}`, type: "article" },
    twitter: { card: "summary_large_image", title, description: project.oneLiner },
  };
}

const primary =
  "type-meta t-base inline-flex min-h-11 items-center gap-2 rounded-control bg-ink px-5 text-paper transition-opacity hover:opacity-85";
const secondary =
  "type-meta t-base inline-flex min-h-11 items-center gap-2 rounded-control border border-rule px-5 text-ink transition-colors hover:border-ink";
const topLink =
  "type-meta t-fast inline-flex min-h-11 items-center gap-2 text-graphite transition-colors hover:text-ink";

/** Hostname for the browser frame's address bar, shortened so long preview hosts don't collide with its icons. */
function hostOf(href?: string) {
  try {
    const host = href ? new URL(href).host : undefined;
    return host && host.length > 34 ? `${host.slice(0, 31)}…` : host;
  } catch {
    return undefined;
  }
}

/** The old card copy leads with what the project is and then lists demo caveats; those live in "About this demo". */
const firstSentence = (text: string) => text.split(/(?<=\.)\s/)[0];

function HeroMedia({ project }: { project: Project }) {
  const demo = project.links.find((link) => link.kind === "demo");
  const { media } = project;
  const inner = media.video ? (
    <video
      controls
      muted
      loop
      playsInline
      preload="none"
      poster={media.poster}
      aria-label={`${project.name} demo video`}
      className="absolute inset-0 size-full bg-muted object-cover object-top"
    >
      <source src={media.video} type="video/mp4" />
    </video>
  ) : (
    <Image
      src={media.poster}
      alt={media.alt}
      fill
      priority
      sizes="(min-width: 1320px) 1320px, 100vw"
      className="object-cover object-top"
    />
  );

  // Projects with a public page get the browser frame; research with only a preview image gets a plain frame.
  if (demo) {
    return (
      <div data-case-media={project.slug}>
        <Safari url={hostOf(demo.href)}>
          <div className="relative size-full">{inner}</div>
        </Safari>
      </div>
    );
  }
  return (
    <div data-case-media={project.slug} className="relative aspect-[16/10] overflow-hidden rounded-media border border-rule bg-muted">
      {inner}
    </div>
  );
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = projects.findIndex((item) => item.slug === slug);
  const next = projects[(index + 1) % projects.length];
  const { caseStudy } = project;
  const page = `work:${project.slug}`;
  const actionLinks = project.links.filter((link) => link.kind !== "case-study");

  return (
    <article>
      <div className="container-site flex items-center justify-between py-3">
        <Link href="/#work" className={topLink}>
          <ArrowRight className="size-4 rotate-180" aria-hidden="true" />
          All work
        </Link>
        <Link href={`/work/${next.slug}`} className={topLink}>
          Next: {next.name}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>

      <header className="container-site pt-8 md:pt-14">
        <h1 className="type-display">{project.name}</h1>
        {project.subtitle && <p className="type-lead mt-3 text-graphite">{project.subtitle}</p>}
        <p className="type-lead mt-6 max-w-[34em] text-ink">{project.oneLiner}</p>

        <dl className="type-meta mt-10 grid gap-x-8 gap-y-5 border-t border-rule pt-6 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-graphite">Role</dt>
            <dd className="mt-1 font-normal text-ink">{project.role}</dd>
          </div>
          <div>
            <dt className="text-graphite">Timeline</dt>
            <dd className="mt-1 font-normal text-ink">{project.period}</dd>
          </div>
          <div>
            <dt className="text-graphite">Status</dt>
            <dd className="mt-1 font-normal text-ink">{project.statusNote}</dd>
          </div>
          <div>
            <dt className="text-graphite">Stack</dt>
            <dd className="mt-1 font-normal text-ink">{project.stack.join(", ")}</dd>
          </div>
        </dl>

        {actionLinks.length > 0 && (
          <ul className="mt-8 flex flex-wrap gap-3">
            {actionLinks.map((link, i) => {
              const kind = LINK_KINDS[link.kind];
              const label = link.label ?? kind.label;
              const className = i === 0 ? primary : secondary;
              return (
                <li key={link.kind}>
                  {kind.external ? (
                    <a href={link.href} target="_blank" rel="noopener noreferrer" className={className}>
                      {label}
                      <ArrowUpRight className="size-4" aria-hidden="true" />
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  ) : (
                    <Link href={link.href} className={className}>
                      {label}
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </header>

      <div className="container-site mt-12">
        <HeroMedia project={project} />
      </div>

      <div className="container-site mt-[var(--section-gap)] space-y-16">
        <CaseSection id="problem" title="Problem">
          <Prose>{caseStudy.problem}</Prose>
        </CaseSection>

        <CaseSection id="built" title="What I built">
          <div className="space-y-4">
            <Prose>{caseStudy.contribution}</Prose>
            <Prose>{firstSentence(project.summary)}</Prose>
          </div>
        </CaseSection>

        <CaseSection id="how" title="How it works">
          {project.architecture ? (
            <div className="space-y-8">
              <Prose>{project.architecture.summary}</Prose>
              <ArchitectureStepper stages={project.architecture.stages} />
            </div>
          ) : (
            <ol className="divide-y divide-rule border-y border-rule">
              {project.workflow.map((step, i) => (
                <li key={step} className="type-body grid grid-cols-[2rem_1fr] gap-3 py-3 text-ink">
                  <span className="type-meta tabular-nums text-graphite">{i + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          )}
        </CaseSection>

        {hasSystemDesign(project) && (
          <CaseSection id="system" title="System design">
            <SystemDesign project={project} />
          </CaseSection>
        )}

        <CaseSection id="decisions" title="Decisions">
          <ProseList items={caseStudy.decisions} />
        </CaseSection>

        {project.results && project.results.length > 0 && (
          <CaseSection id="results" title="Results">
            <CiteRegion mode="inline">
              <div className="space-y-4">
                {project.results.map((result) => (
                  <div key={result.text}>
                    <p className="type-prose measure-prose text-ink">
                      {result.citationId ? (
                        <Cite id={result.citationId} page={page}>
                          {result.text}
                        </Cite>
                      ) : (
                        result.text
                      )}
                    </p>
                  </div>
                ))}
                <CiteNotes variant="inline" />
              </div>
            </CiteRegion>
          </CaseSection>
        )}

        <CaseSection id="limitations" title="Limitations">
          <ProseList items={caseStudy.limitations} />
        </CaseSection>

        <CaseSection id="learned" title="What I learned">
          <Prose>{caseStudy.lessons}</Prose>
        </CaseSection>

        {project.aboutDemo && (
          <CaseSection id="about-demo" title="About this demo">
            <Prose>{project.aboutDemo}</Prose>
          </CaseSection>
        )}
      </div>

      <section aria-labelledby="next-title" className="container-site mt-[var(--section-gap)] border-t border-rule pt-10">
        <div className="grid-site gap-y-10">
          <div className="col-span-12 lg:col-span-6">
            <h2 id="next-title" className="type-h3">
              Let&apos;s talk.
            </h2>
            <p className="type-body mt-3 text-graphite">{profile.availability.long}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={`mailto:${profile.email}`} className={primary}>
                Email me
              </a>
              <Link href="/#contact" className={secondary}>
                Other ways to reach me
              </Link>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-6">
            <p className="type-meta text-graphite">Next project</p>
            <Link href={`/work/${next.slug}`} className="group mt-2 block">
              <span className="type-h3 inline-flex items-center gap-3">
                {next.name}
                <ArrowRight className="size-6 t-base transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </span>
              <span className="type-body mt-2 block max-w-[30em] text-graphite">{next.oneLiner}</span>
            </Link>
          </div>
        </div>
      </section>

      <div className="h-[var(--section-gap)]" aria-hidden="true" />
    </article>
  );
}
