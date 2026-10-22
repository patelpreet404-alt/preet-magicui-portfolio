import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageTransition } from "@/components/page-transition";
import { CaseSection, Prose } from "@/components/work/case-section";
import { profile, projects, timelineLong } from "@/content";

export const metadata: Metadata = {
  title: "About",
  description: "The longer story: school in Al Jubail, computer science at DTU, projects, an internship at Rang Technologies, and current research.",
  alternates: { canonical: "/about" },
};

const link =
  "type-meta inline-flex min-h-11 items-center gap-1 text-ink underline decoration-rule underline-offset-4 t-fast transition-colors hover:decoration-ink";

const projectSlug = (name: string) => projects.find((project) => project.name === name)?.slug;

export default function AboutPage() {
  return (
    <PageTransition>
    <div className="container-site pb-[var(--section-gap)] pt-10 md:pt-16">
      <header className="grid-site gap-y-8">
        <div className="col-span-12 lg:col-span-8">
          <h1 className="type-display">The longer story</h1>
          <div className="mt-8 space-y-4">
            {profile.bio.map((paragraph) => (
              <Prose key={paragraph}>{paragraph}</Prose>
            ))}
            <p className="type-prose measure-prose text-graphite">
              <span className="font-semibold text-ink">Now: </span>
              {profile.now}
            </p>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-4">
          <div className="relative aspect-[4/5] w-48 overflow-hidden rounded-media border border-rule bg-muted lg:ml-auto lg:w-full lg:max-w-[22rem]">
            <Image src={profile.avatar} alt={`Portrait of ${profile.name}`} fill sizes="(min-width: 1024px) 352px, 192px" className="object-cover" />
          </div>
        </div>
      </header>

      <div className="mt-[var(--section-gap)] space-y-16">
        <CaseSection id="timeline" title="Timeline">
          <ol>
            {timelineLong.map((entry) => (
              <li key={entry.id} className="grid gap-x-8 gap-y-1 border-b border-rule py-6 first:pt-0 sm:grid-cols-[11rem_1fr]">
                <p className="type-meta tabular-nums text-graphite">{entry.when}</p>
                <div>
                  <h3 className="type-body font-semibold text-ink">{entry.title}</h3>
                  {(entry.organization || entry.location) && (
                    <p className="type-meta mt-1 font-normal text-graphite">{[entry.organization, entry.location].filter(Boolean).join(" · ")}</p>
                  )}
                  <p className="type-body measure-body mt-2 text-ink">{entry.description}</p>
                  {entry.highlights && (
                    <ul className="type-meta mt-2 space-y-1 font-normal text-ink">
                      {entry.highlights.map((highlight) => (
                        <li key={highlight}>{highlight}</li>
                      ))}
                    </ul>
                  )}
                  {entry.projects && (
                    <p className="type-meta mt-2 font-normal text-graphite">
                      Projects:{" "}
                      {entry.projects.map((name, i) => {
                        const slug = projectSlug(name);
                        return (
                          <span key={name}>
                            {i > 0 && ", "}
                            {slug ? (
                              <Link href={`/work/${slug}`} className="text-ink underline decoration-rule underline-offset-4 hover:decoration-ink">
                                {name}
                              </Link>
                            ) : (
                              name
                            )}
                          </span>
                        );
                      })}
                    </p>
                  )}
                  {entry.technologies && <p className="type-meta mt-1 font-normal text-graphite">{entry.technologies.join(", ")}</p>}
                  {entry.status && <p className="type-meta mt-1 font-normal text-graphite">{entry.status}</p>}
                </div>
              </li>
            ))}
          </ol>
        </CaseSection>

        <CaseSection id="education" title="Education">
          <ul className="space-y-4">
            {profile.education.map((school) => (
              <li key={school.school}>
                <a href={school.href} target="_blank" rel="noopener noreferrer" className="type-body font-semibold text-ink underline decoration-rule underline-offset-4 hover:decoration-ink">
                  {school.school}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
                <p className="type-meta font-normal text-graphite">
                  {school.degree} · {school.period}
                </p>
              </li>
            ))}
          </ul>
        </CaseSection>

        <CaseSection id="toolbox" title="Toolbox">
          <dl className="max-w-3xl space-y-3">
            {profile.toolbox.map((group) => (
              <div key={group.group} className="grid gap-x-4 sm:grid-cols-[8rem_1fr]">
                <dt className="type-meta text-graphite">{group.group}</dt>
                <dd className="type-body text-ink">{group.items.join(", ")}</dd>
              </div>
            ))}
          </dl>
        </CaseSection>

        <CaseSection id="beyond" title="Beyond code">
          <ul className="type-body measure-body space-y-2 text-ink">
            {profile.beyondCode.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </CaseSection>

        <CaseSection id="elsewhere" title="Elsewhere">
          <ul className="flex flex-wrap gap-x-6">
            {Object.values(profile.social).map((item) => (
              <li key={item.label}>
                <a href={item.href} target="_blank" rel="noopener noreferrer" className={link}>
                  {item.label}
                  <ArrowUpRight className="size-3.5" aria-hidden="true" />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </CaseSection>

        <CaseSection id="contact" title="Let's talk">
          <p className="type-body measure-body text-graphite">{profile.availability.long}</p>
          <p className="mt-4">
            <a href={`mailto:${profile.email}`} className="type-h3 break-all text-ink underline decoration-rule decoration-2 underline-offset-8 hover:decoration-link">
              {profile.email}
            </a>
          </p>
        </CaseSection>
      </div>
    </div>
    </PageTransition>
  );
}
