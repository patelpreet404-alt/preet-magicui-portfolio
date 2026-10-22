import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Cite } from "@/components/cite/cite";
import { CiteNotes, CiteRegion } from "@/components/cite/cite-region";
import { LINK_KINDS } from "@/components/link-icons";
import { featuredProjects, getCitation, type ContentLink } from "@/content";
import { WorkMedia } from "./work-media";

const SHOWN: ContentLink["kind"][] = ["demo", "source", "case-study"];

const linkClass =
  "type-meta group inline-flex min-h-11 items-center gap-1 text-ink underline decoration-rule underline-offset-4 t-fast transition-colors hover:decoration-ink";

export function SelectedWork() {
  return (
    <section id="work" aria-labelledby="work-title" className="container-site pt-[var(--section-gap)]">
      <h2 id="work-title" className="type-h2">
        Selected work
      </h2>
      <p className="type-lead mt-4 max-w-[34em] text-graphite">
        Four projects with a live demo, source code and a written case study each.
      </p>

      <ol className="mt-12 border-t border-rule">
        {featuredProjects.map((project) => {
          const links = SHOWN.flatMap((kind) => project.links.filter((link) => link.kind === kind));
          return (
            <li key={project.slug} className="border-b border-rule py-10">
              <CiteRegion mode="inline">
                <article className="grid-site items-start gap-y-6">
                  <div className="order-2 col-span-12 lg:order-1 lg:col-span-4">
                    <h3 className="type-h3">
                      <Link href={`/work/${project.slug}`} transitionTypes={["nav-forward"]} className="hover:underline hover:decoration-rule hover:underline-offset-4">
                        {project.name}
                      </Link>
                    </h3>
                    {project.subtitle && <p className="type-meta mt-1 text-graphite">{project.subtitle}</p>}
                    <p className="type-body mt-4 text-ink">{project.oneLiner}</p>

                    <dl className="type-meta mt-5 grid grid-cols-[4rem_1fr] gap-x-4 gap-y-1">
                      <dt className="text-graphite">Role</dt>
                      <dd>{project.role}</dd>
                      <dt className="text-graphite">Stack</dt>
                      <dd>{project.stack.slice(0, 4).join(", ")}</dd>
                    </dl>

                    {project.proof && (
                      <>
                        <p className="type-body mt-5 text-graphite">
                          <Cite id={project.proof}>{getCitation(project.proof).claim}</Cite>
                        </p>
                        <CiteNotes variant="inline" />
                      </>
                    )}

                    <ul className="mt-4 flex flex-wrap gap-x-5">
                      {links.map((link) => {
                        const kind = LINK_KINDS[link.kind];
                        const label = link.label ?? kind.label;
                        return (
                          <li key={link.kind}>
                            {kind.external ? (
                              <a href={link.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                                {label}
                                <ArrowUpRight className="size-3.5" aria-hidden="true" />
                                <span className="sr-only"> for {project.name} (opens in a new tab)</span>
                              </a>
                            ) : (
                              <Link href={link.href} transitionTypes={["nav-forward"]} className={linkClass}>
                                {label}
                                <ArrowRight className="size-3.5 t-fast transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                                <span className="sr-only">: {project.name}</span>
                              </Link>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  <div className="order-1 col-span-12 lg:order-2 lg:col-span-8">
                    <WorkMedia slug={project.slug} name={project.name} media={project.media} />
                  </div>
                </article>
              </CiteRegion>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
