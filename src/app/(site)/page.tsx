import type { Metadata } from "next";
import { PageTransition } from "@/components/page-transition";
import { About } from "@/components/home/about";
import { Contact } from "@/components/home/contact";
import { Experience } from "@/components/home/experience";
import { Hero } from "@/components/home/hero";
import { MoreWork } from "@/components/home/more-work";
import { SelectedWork } from "@/components/home/selected-work";
import { profile } from "@/content";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// Structured data for search engines. "<" is escaped so the JSON can never close the script tag.
const personJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.jobTitle,
  url: profile.url,
  alumniOf: { "@type": "CollegeOrUniversity", name: "Delhi Technological University", url: "https://dtu.ac.in/" },
  sameAs: [profile.social.github.href, profile.social.linkedin.href],
}).replace(/</g, "\\u003c");

export default function Page() {
  return (
    <PageTransition>
      <div>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: personJsonLd }} />
      <Hero />
      <SelectedWork />
      <Experience />
      <MoreWork />
      <About />
      <Contact />
      </div>
    </PageTransition>
  );
}
