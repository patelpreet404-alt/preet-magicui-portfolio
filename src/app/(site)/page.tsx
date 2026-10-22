import BlurFade from "@/components/magicui/blur-fade";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DATA } from "@/data/resume";
import Link from "next/link";
import ContactSection from "@/components/section/contact-section";
import HackathonsSection from "@/components/section/hackathons-section";
import ProjectsSection from "@/components/section/projects-section";
import EngineeringMapSection from "@/components/section/engineering-map-section";
import ProjectDesignExplorerSection from "@/components/section/project-design-explorer-section";
import WorkSection from "@/components/section/work-section";
import TerminalPortfolioEmbed from "@/components/section/terminal-portfolio-embed";
import { ArrowDown, ArrowUpRight, FileText } from "lucide-react";
import { InstitutionLogo } from "@/components/institution-logo";
import HeroIdentity from "@/components/hero-identity";
import MoreProjectsSection from "@/components/section/more-projects-section";
import JourneySection from "@/components/section/journey-section";
import OnlinePresenceSection from "@/components/section/online-presence-section";
import TechStackSection from "@/components/section/tech-stack-section";
const BLUR_FADE_DELAY = 0.04;

export default function Page() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-14 px-6 py-12 sm:py-24">
      <section id="hero" aria-labelledby="intro-heading" className="hero-section">
        <div className="mx-auto w-full max-w-3xl">
          <div className="flex flex-col-reverse items-start justify-between gap-7 sm:flex-row sm:items-center sm:gap-10">
            <div className="min-w-0">
              <BlurFade delay={BLUR_FADE_DELAY}>
                <h1 id="intro-heading" className="hero-name text-[clamp(2.9rem,8vw,5.2rem)]">Hi, I&apos;m {DATA.name.split(" ")[0]}.</h1>
              </BlurFade>
              <div className="mt-3"><HeroIdentity /></div>
            </div>
            <BlurFade delay={BLUR_FADE_DELAY} className="shrink-0 self-end sm:self-auto">
              <Avatar className="size-20 border border-white/20 ring-4 ring-white/5 sm:size-28">
                <AvatarImage alt={DATA.name} src={DATA.avatarUrl} />
                <AvatarFallback className="bg-muted text-2xl font-semibold">{DATA.initials}</AvatarFallback>
              </Avatar>
            </BlurFade>
          </div>
          <BlurFade delay={BLUR_FADE_DELAY * 2}>
            <p className="mt-7 max-w-[62ch] text-pretty text-base leading-7 text-foreground/90 sm:mt-8 sm:text-lg sm:leading-8">
              I build practical AI tools, backend systems, and software that helps people get useful work done.
            </p>
          </BlurFade>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="#work" className="portfolio-button portfolio-button--primary">Explore projects <ArrowDown size={16} aria-hidden="true" /></a>
            <a href="#contact" className="portfolio-button portfolio-button--secondary">Get in touch <ArrowUpRight size={16} aria-hidden="true" /></a>
            <a href={DATA.contact.social.Resume.url} target="_blank" rel="noopener noreferrer" className="portfolio-button portfolio-button--text"><FileText size={16} aria-hidden="true" /> Resume</a>
          </div>
          <div className="credibility-row mt-8" aria-label="Education and experience">
            <span>Delhi Technological University</span>
            <span>Rang Technologies internship</span>
            <span>Attendance and analytics platform for 50+ employees</span>
          </div>
          <div id="about" className="mt-9 max-w-[68ch] border-t border-white/10 pt-5">
            <h2 className="sr-only">About Preet</h2>
            <p className="text-sm leading-7 text-muted-foreground sm:text-base">
              I work across the stack, from data flow and backend logic through the interface people use to complete a task.
            </p>
          </div>
        </div>
      </section>
      <section id="focus">
        <div className="flex min-h-0 flex-col gap-y-5">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">What I build</h2>
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
      <section id="experience">
        <div className="flex min-h-0 flex-col gap-y-6">
          <BlurFade delay={BLUR_FADE_DELAY * 7}>
            <h2 className="text-xl font-semibold tracking-tight">Experience</h2>
          </BlurFade>
          <BlurFade delay={BLUR_FADE_DELAY * 8}>
            <WorkSection />
          </BlurFade>
        </div>
      </section>
      <section id="education">
        <div className="flex min-h-0 flex-col gap-y-6">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Education</h2>
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
                    <InstitutionLogo name={education.school} src={education.logoUrl} />
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
      <JourneySection />
      <OnlinePresenceSection />
      <TechStackSection />
      <BlurFade delay={BLUR_FADE_DELAY * 11}>
        <ProjectsSection />
      </BlurFade>
      <MoreProjectsSection />
      <EngineeringMapSection />
      <ProjectDesignExplorerSection />
      <section id="research-learning">
        <div className="flex min-h-0 flex-col gap-y-5">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Research & learning</h2>
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
    </div>
  );
}