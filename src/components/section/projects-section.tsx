import { ProjectCard } from "@/components/project-card";
import { ProjectMarquee } from "@/components/section/project-marquee";
import { FEATURED_PROJECTS } from "@/data/resume";

export default function ProjectsSection() {
  return (
    <section id="projects">
      <div className="flex min-h-0 flex-col gap-y-8">
        <div className="flex flex-col items-center justify-center gap-y-4">
          <div className="flex w-full items-center">
            <div className="h-px flex-1 bg-linear-to-r from-transparent from-5% via-border via-95% to-transparent" />
            <div className="z-10 rounded-xl border bg-primary px-4 py-1">
              <span className="text-sm font-medium text-background">My Projects</span>
            </div>
            <div className="h-px flex-1 bg-linear-to-l from-transparent from-5% via-border via-95% to-transparent" />
          </div>
          <div className="flex flex-col items-center justify-center gap-y-3">
            <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">Check out my latest work</h2>
            <p className="text-balance text-center text-muted-foreground md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed">
              AI tools, developer infrastructure, and systems work that I&apos;ve built or am actively researching.
            </p>
          </div>
        </div>
        <ProjectMarquee>
          <div className="project-marquee__track">
            {[0, 1].map((copy) => (
              <div
                key={copy}
                className="project-marquee__group"
                data-copy={copy}
              >
                {FEATURED_PROJECTS.map((project, id) => (
                  <div className="project-marquee__item" key={project.title + copy}>
                    <ProjectCard
                      id={project.slug}
                      slug={project.slug}
                      status={project.status}
                      href={project.href}
                      title={project.title}
                      subtitle={"subtitle" in project ? project.subtitle : undefined}
                      description={project.description}
                      details={project.details}
                      dates={project.dates}
                      tags={project.technologies}
                      image={project.image}
                      video={project.video}
                      links={project.links}
                      workflow={"workflow" in project ? project.workflow : undefined}
                      variant={id}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </ProjectMarquee>
      </div>
    </section>
  );
}
