import Image from "next/image";
import { Cite } from "@/components/cite/cite";
import { CiteNotes, CiteRegion } from "@/components/cite/cite-region";
import { profile } from "@/content";

const primaryButton =
  "type-meta t-base inline-flex min-h-11 items-center rounded-control bg-ink px-5 text-paper transition-opacity hover:opacity-85";
const secondaryButton =
  "type-meta t-base inline-flex min-h-11 items-center rounded-control border border-rule px-5 text-ink transition-colors hover:border-ink";

export function Hero() {
  return (
    <CiteRegion mode="margin">
      <section aria-labelledby="hero-title" className="container-site pt-10 md:pt-16">
        <div className="grid-site gap-y-10">
          <div className="col-span-12 lg:col-span-8">
            <h1 id="hero-title" className="type-display max-w-[14ch]">
              {profile.headline}
            </h1>

            <p className="type-lead mt-8 max-w-[36em] text-graphite">
              I&apos;m a final-year Computer Science student at Delhi Technological University. I&apos;ve built a research assistant that{" "}
              <Cite id="hero-researchpaper">cites the page behind every answer</Cite>, an{" "}
              <Cite id="hero-rang">attendance platform for 50+ employees at Rang Technologies</Cite>, and{" "}
              <Cite id="hero-optilang">a compiler for a small C-like language in C++17</Cite>.
            </p>
            <CiteNotes variant="inline" className="max-w-[36em]" />

            <p className="type-meta mt-8 flex items-start gap-2 text-graphite">
              <span aria-hidden="true" className="mt-[0.4em] size-2 shrink-0 rounded-full bg-link" />
              <span>{profile.availability.long}</span>
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-3">
              <a href="#work" className={primaryButton}>
                View selected work
              </a>
              <a href={`mailto:${profile.email}`} className={secondaryButton}>
                Email me
              </a>
              <a
                href={profile.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="type-meta inline-flex min-h-11 items-center px-1 text-ink underline decoration-rule underline-offset-4 t-fast transition-colors hover:decoration-ink"
              >
                Résumé (PDF)
                <span className="sr-only"> opens in a new tab</span>
              </a>
            </div>
          </div>

          <div className="hidden w-full max-w-[22rem] justify-self-end lg:col-span-4 lg:block">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-media border border-rule bg-muted">
              <Image
                src={profile.avatar}
                alt={`Portrait of ${profile.name}`}
                fill
                sizes="(min-width: 1320px) 330px, 30vw"
                className="object-cover"
              />
            </div>
            <CiteNotes variant="margin" className="mt-6" />
          </div>
        </div>
      </section>
    </CiteRegion>
  );
}
