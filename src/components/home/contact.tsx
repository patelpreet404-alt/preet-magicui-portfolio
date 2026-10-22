import { ArrowUpRight } from "lucide-react";
import { profile } from "@/content";
import { ContactActions } from "./contact-actions";

const linkClass =
  "type-meta inline-flex min-h-11 items-center gap-1 text-ink underline decoration-rule underline-offset-4 t-fast transition-colors hover:decoration-ink";

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="container-site pb-[var(--section-gap)] pt-[var(--section-gap)]">
      <h2 id="contact-title" className="type-display">
        Let&apos;s talk.
      </h2>
      <p className="type-lead mt-6 max-w-[34em] text-graphite">{profile.availability.long}</p>

      <div className="mt-10">
        <ContactActions email={profile.email} />
      </div>

      <ul className="mt-6 flex flex-wrap gap-x-6">
        {[
          { label: "LinkedIn", href: profile.social.linkedin.href },
          { label: "GitHub", href: profile.social.github.href },
          { label: "Résumé (PDF)", href: profile.resume },
        ].map((link) => (
          <li key={link.label}>
            <a href={link.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
              {link.label}
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
