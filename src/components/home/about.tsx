import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { profile, timelineShort } from "@/content";

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="grid-site gap-y-3 border-t border-rule py-8">
      <h3 className="type-body col-span-12 font-semibold text-ink lg:col-span-3">{title}</h3>
      <div className="col-span-12 lg:col-span-9">{children}</div>
    </div>
  );
}

const linkClass =
  "type-meta inline-flex min-h-11 items-center gap-1 text-ink underline decoration-rule underline-offset-4 t-fast transition-colors hover:decoration-ink";

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="container-site pt-[var(--section-gap)]">
      <h2 id="about-title" className="type-h2">
        About
      </h2>

      <div className="mt-12 border-b border-rule">
        <Block title="Bio">
          <div className="relative mb-6 aspect-[4/5] w-40 overflow-hidden rounded-media border border-rule bg-muted lg:hidden">
            <Image src={profile.avatar} alt={`Portrait of ${profile.name}`} fill sizes="160px" className="object-cover" />
          </div>
          <div className="type-body measure-body space-y-4 text-ink">
            {profile.bio.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <p className="type-body measure-body mt-6 text-graphite">
            <span className="font-semibold text-ink">Now: </span>
            {profile.now}
          </p>
        </Block>

        <Block title="Timeline">
          <ol className="max-w-3xl">
            {timelineShort.map((row) => (
              <li key={row.text} className="grid grid-cols-[7.5rem_1fr] gap-x-4 border-b border-rule py-3 first:pt-0 last:border-b-0">
                <span className="type-meta tabular-nums text-graphite">{row.when}</span>
                <span className="type-body text-ink">{row.text}</span>
              </li>
            ))}
          </ol>
          <Link href="/about" transitionTypes={["nav-forward"]} className={`${linkClass} mt-4 group`}>
            The longer story
            <ArrowRight className="size-3.5 t-fast transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        </Block>

        <Block title="Education">
          <ul className="space-y-4">
            {profile.education.map((school) => (
              <li key={school.school} className="type-body">
                <a href={school.href} target="_blank" rel="noopener noreferrer" className="font-semibold text-ink underline decoration-rule underline-offset-4 hover:decoration-ink">
                  {school.school}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
                <p className="type-meta text-graphite">
                  {school.degree} · {school.period}
                </p>
              </li>
            ))}
          </ul>
        </Block>

        <Block title="Toolbox">
          <dl className="max-w-3xl space-y-3">
            {profile.toolbox.map((group) => (
              <div key={group.group} className="grid gap-x-4 sm:grid-cols-[8rem_1fr]">
                <dt className="type-meta text-graphite">{group.group}</dt>
                <dd className="type-body text-ink">{group.items.join(", ")}</dd>
              </div>
            ))}
          </dl>
        </Block>

        <Block title="Beyond code">
          <ul className="type-body measure-body space-y-2 text-ink">
            {profile.beyondCode.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Block>

        <Block title="Elsewhere">
          <ul className="flex flex-wrap gap-x-6">
            {Object.values(profile.social).map((link) => (
              <li key={link.label}>
                <a href={link.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  {link.label}
                  <ArrowUpRight className="size-3.5" aria-hidden="true" />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </Block>
      </div>
    </section>
  );
}
