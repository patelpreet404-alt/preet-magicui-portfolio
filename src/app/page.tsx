/* eslint-disable @next/next/no-img-element */
import BlurFade from "@/components/magicui/blur-fade";
import BlurFadeText from "@/components/magicui/blur-fade-text";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DATA } from "@/data/resume";
import Link from "next/link";
import Markdown from "react-markdown";
import ContactSection from "@/components/section/contact-section";
import HackathonsSection from "@/components/section/hackathons-section";
import ProjectsSection from "@/components/section/projects-section";
import ProjectPreviewsSection from "@/components/section/project-previews-section";
import WorkSection from "@/components/section/work-section";
import TerminalPortfolioEmbed from "@/components/section/terminal-portfolio-embed";
import { ArrowUpRight } from "lucide-react";

const BLUR_FADE_DELAY = 0.04;

export default function Page() {
  return (
    <main className="min-h-dvh flex flex-col gap-14 relative">
      <section id="hero">
        <div className="mx-auto w-full max-w-2xl space-y-8">
          <div className="gap-2 gap-y-6 flex flex-col md:flex-row justify-between">
            <div className="gap-2 flex flex-col order-2 md:order-1">
              <BlurFadeText
                delay={BLUR_FADE_DELAY}
                className="text-3xl font-semibold tracking-tighter sm:text-4xl lg:text-5xl"
                yOffset={8}
                text={`Hi, I'm ${DATA.name.split(" ")[0]}`}
              />
              <BlurFadeText
                className="text-muted-foreground max-w-[600px] md:text-lg lg:text-xl"
                delay={BLUR_FADE_DELAY}
                text={DATA.description}
              />
            </div>
            <BlurFade delay={BLUR_FADE_DELAY} className="order-1 md:order-2">
              <Avatar className="size-24 md:size-32 border rounded-full shadow-lg ring-4 ring-muted">
                <AvatarImage alt={DATA.name} src={DATA.avatarUrl} />
                <AvatarFallback className="bg-muted text-2xl font-semibold tracking-tight">{DATA.initials}</AvatarFallback>
              </Avatar>
            </BlurFade>
          </div>
        </div>
      </section>
      <section id="about">
        <div className="flex min-h-0 flex-col gap-y-4">
          <BlurFade delay={BLUR_FADE_DELAY * 3}>
            <h2 className="text-xl font-bold">About</h2>
          </BlurFade>
          <BlurFade delay={BLUR_FADE_DELAY * 4}>
            <div className="prose max-w-full text-pretty font-sans leading-relaxed text-muted-foreground dark:prose-invert">
              <Markdown>{DATA.summary}</Markdown>
            </div>
          </BlurFade>
        </div>
      </section>
      <section id="focus">
        <div className="flex min-h-0 flex-col gap-y-5">
          <div>
            <h2 className="text-xl font-bold">What I build</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              I like projects that connect solid engineering with a clear use for the person on the other side.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3 md:divide-x md:divide-border">
            {DATA.focusAreas.map((area, index) => (
              <BlurFade key={area.title} delay={BLUR_FADE_DELAY * (5 + index * 0.5)}>
                <article className="h-full border-t border-border pt-4 md:border-t-0 md:px-5 md:pt-0 first:md:pl-0 last:md:pr-0">
                  <h3 className="font-semibold">{area.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{area.detail}</p>
                  <p className="mt-3 text-xs font-medium text-foreground/75">{area.proof}</p>
                </article>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>
      <section id="work">
        <div className="flex min-h-0 flex-col gap-y-6">
          <BlurFade delay={BLUR_FADE_DELAY * 7}>
            <h2 className="text-xl font-bold">Experience</h2>
          </BlurFade>
          <BlurFade delay={BLUR_FADE_DELAY * 8}>
            <WorkSection />
          </BlurFade>
        </div>
      </section>
      <section id="education">
        <div className="flex min-h-0 flex-col gap-y-6">
          <div>
            <h2 className="text-xl font-bold">Education</h2>
            <p className="mt-2 text-sm text-muted-foreground">Computer Science and Engineering, Delhi Technological University · 2023–2027</p>
          </div>
          <div className="flex flex-col gap-8">
            {DATA.education.map((education, index) => (
              <BlurFade
                key={education.school}
                delay={BLUR_FADE_DELAY * 9 + index * 0.05}
              >
                <Link
                  href={education.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-x-3 justify-between group rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <div className="flex items-center gap-x-3 flex-1 min-w-0">
                    {education.logoUrl ? (
                      <img
                        src={education.logoUrl}
                        alt={education.school}
                        className="size-8 md:size-10 p-1 border rounded-full shadow ring-2 ring-border overflow-hidden object-contain flex-none"
                      />
                    ) : (
                      <div className="size-8 md:size-10 border rounded-full shadow ring-2 ring-border bg-muted flex-none grid place-items-center text-[10px] font-semibold text-foreground" aria-hidden="true">
                        {education.school.split(" ").map((word) => word[0]).slice(0, 3).join("")}
                      </div>
                    )}
                    <div className="flex-1 min-w-0 flex flex-col gap-1">
                      <div className="font-semibold leading-none flex items-center gap-2">
                        {education.school}
                        <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" aria-hidden />
                      </div>
                      <div className="font-sans text-sm text-muted-foreground">
                        {education.degree}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs tabular-nums text-muted-foreground text-right flex-none">
                    <span>{education.start} - {education.end}</span>
                  </div>
                </Link>
              </BlurFade>
            ))}
          </div>
          <p className="border-t border-border pt-4 text-sm leading-relaxed text-muted-foreground">
            Academic interests: {DATA.educationFocus.join(" · ")}.
          </p>
        </div>
      </section>
      <section id="skills">
        <div className="flex min-h-0 flex-col gap-y-5">
          <div>
            <h2 className="text-xl font-bold">Technical toolkit</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">The languages, frameworks, and tools I’ve used across these projects.</p>
          </div>
          <div className="divide-y divide-border border-y border-border">
            {DATA.skillGroups.map((group) => (
              <div key={group.title} className="grid gap-3 py-4 sm:grid-cols-[190px_minmax(0,1fr)] sm:gap-6">
                <h3 className="text-sm font-semibold">{group.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <span key={skill} className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground">{skill}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <BlurFade delay={BLUR_FADE_DELAY * 11}>
        <ProjectsSection />
      </BlurFade>
      <BlurFade delay={BLUR_FADE_DELAY * 12}>
        <ProjectPreviewsSection />
      </BlurFade>
      <section id="research-learning">
        <div className="flex min-h-0 flex-col gap-y-5">
          <div>
            <h2 className="text-xl font-bold">Research & learning</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">Topics I’m exploring alongside coursework and project work.</p>
          </div>
          <div className="grid gap-8 border-y border-border py-5 md:grid-cols-[1.4fr_1fr] md:gap-12">
            <article>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Ongoing research</p>
              <h3 className="mt-2 font-semibold">{DATA.research.title}</h3>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">{DATA.research.detail}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {DATA.research.tools.map((tool) => <span key={tool} className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">{tool}</span>)}
              </div>
            </article>
            <article>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Certifications</p>
              <ul className="mt-2 divide-y divide-border">
                {DATA.certifications.map((item) => (
                  <li key={item.provider} className="py-3 first:pt-0 last:pb-0">
                    <p className="font-semibold">{item.provider}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{item.focus}</p>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>
      <BlurFade delay={BLUR_FADE_DELAY * 13}>
        <HackathonsSection />
      </BlurFade>
      <section id="other-portfolio" aria-labelledby="other-portfolio-heading">
        <TerminalPortfolioEmbed />
      </section>
      <section id="contact">
        <BlurFade delay={BLUR_FADE_DELAY * 16}>
          <ContactSection />
        </BlurFade>
      </section>
    </main>
  );
}
