import Image from "next/image";
import { Cite } from "@/components/cite/cite";
import { CiteNotes, CiteRegion } from "@/components/cite/cite-region";
import { experience } from "@/content";

export function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-title" className="container-site pt-[var(--section-gap)]">
      <h2 id="experience-title" className="type-h2">
        Experience
      </h2>

      <div className="mt-12 border-t border-rule">
        {experience.map((job) => (
          <CiteRegion key={job.company} mode="margin">
            <article className="grid-site gap-y-6 border-b border-rule py-10">
              <div className="col-span-12 md:col-span-4 lg:col-span-3">
                <div className="flex items-center gap-3">
                  <Image
                    src={job.logo}
                    alt=""
                    width={40}
                    height={40}
                    className="size-10 rounded-control border border-rule bg-white object-contain p-1"
                  />
                  <h3 className="type-body font-semibold text-ink">{job.company}</h3>
                </div>
                <p className="type-meta mt-3 text-ink">{job.title}</p>
                <p className="type-meta mt-1 text-graphite">{job.location}</p>
                <p className="type-meta mt-1 text-graphite">
                  <time dateTime={job.start}>{job.period}</time>
                </p>
              </div>

              <div className="col-span-12 md:col-span-8 lg:col-span-6">
                <ul className="type-body space-y-3 text-ink">
                  {job.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-3">
                      <span aria-hidden="true" className="mt-[0.7em] h-px w-3 shrink-0 bg-graphite" />
                      <span className="measure-body">{bullet}</span>
                    </li>
                  ))}
                </ul>
                <p className="type-lead mt-8 font-semibold text-ink">
                  <Cite id={job.outcome.citationId}>{job.outcome.text}</Cite>
                </p>
                <CiteNotes variant="inline" />
                <p className="type-meta mt-6 text-graphite">
                  <span className="sr-only">Stack: </span>
                  {job.stack.join(", ")}
                </p>
              </div>

              <div className="hidden min-[1100px]:col-span-3 min-[1100px]:block">
                <CiteNotes variant="margin" />
              </div>
            </article>
          </CiteRegion>
        ))}
      </div>
    </section>
  );
}
