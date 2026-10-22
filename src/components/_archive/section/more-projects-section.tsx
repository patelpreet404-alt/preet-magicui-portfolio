"use client";

import { ADDITIONAL_PROJECTS, type PortfolioProject } from "@/data/resume";
import { ArrowUpRight, RotateCcw } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { SaveProjectButton } from "@/components/_archive/saved-projects";
import { useProjectDetails } from "@/components/_archive/project-details";

export default function MoreProjectsSection({ projects = ADDITIONAL_PROJECTS }: { projects?: readonly PortfolioProject[] }) {
  const [category, setCategory] = useState("All");
  const { openProject } = useProjectDetails();
  if (projects.length === 0) return null;

  const categories = Array.from(new Set(projects.map((project) => project.category)));
  const showFilters = projects.length >= 4 && categories.length > 1;
  const visibleProjects = category === "All" ? projects : projects.filter((project) => project.category === category);
  const filterClass = "inline-flex min-h-11 items-center rounded-full border px-4 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

  return (
    <section id="more-projects" aria-labelledby="more-projects-title" className="more-projects-section space-y-6">
      <header>
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">More to explore</p>
        <h2 id="more-projects-title" className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">More projects</h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">Other things I’ve built and explored.</p>
      </header>
      {showFilters && (
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter more projects by engineering category">
          {["All", ...categories].map((value) => (
            <button key={value} type="button" aria-pressed={category === value} onClick={() => setCategory(value)} className={`${filterClass} ${category === value ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card/60 text-foreground hover:bg-muted"}`}>{value}</button>
          ))}
          {category !== "All" && <button type="button" onClick={() => setCategory("All")} className={`${filterClass} gap-2 border-border text-muted-foreground hover:text-foreground`}><RotateCcw className="size-3.5" aria-hidden />Reset filters</button>}
        </div>
      )}
      <p className="sr-only" role="status">{visibleProjects.length} {visibleProjects.length === 1 ? "project" : "projects"} shown</p>
      {visibleProjects.length > 0 ? (
        <div className={projects.length === 1 ? "grid max-w-xl gap-4" : "grid auto-cols-[minmax(280px,82%)] grid-flow-col gap-4 overflow-x-auto pb-2 snap-x snap-proximity sm:auto-cols-[minmax(300px,46%)] lg:grid-flow-row lg:grid-cols-3 lg:overflow-visible lg:pb-0"}>
          {visibleProjects.map((project) => (
            <article key={project.slug} className="flex min-w-0 snap-start flex-col overflow-hidden rounded-xl border border-border bg-card/70">
              {project.image && <div className="aspect-video overflow-hidden border-b border-border bg-muted"><Image width={640} height={360} src={project.image} alt={`${project.title} preview`} className="h-full w-full object-cover object-top" loading="lazy" /></div>}
              <div className="flex flex-1 flex-col gap-3 p-5">
                <p className="text-xs text-muted-foreground">{project.category}</p>
                <h3 className="text-lg font-semibold leading-snug">{project.title}</h3>
                <span className="w-fit rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">{project.status}</span>
                <p className="text-sm leading-relaxed text-muted-foreground">{project.description}</p>
                <div className="mt-auto flex flex-wrap items-center gap-2 pt-2"><button type="button" onClick={(event) => openProject(project.slug, event.currentTarget)} className="inline-flex min-h-11 items-center rounded-md border border-border px-3 text-sm font-medium hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">View details</button>{project.links.map((link) => <a key={link.href} href={link.href} target={link.href.startsWith("http") ? "_blank" : undefined} rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined} aria-label={`${link.type === "Source" ? "Repository" : link.type} for ${project.title}`} className="inline-flex min-h-11 items-center gap-2 rounded-md border border-border px-3 text-sm font-medium hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">{link.type === "Source" ? "Repository" : link.type}<ArrowUpRight className="size-3.5" aria-hidden /></a>)}<SaveProjectButton id={project.slug} title={project.title} /></div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card/60 p-6 text-center">
          <p className="text-sm text-muted-foreground">No projects match this category.</p>
          <button type="button" onClick={() => setCategory("All")} className={`${filterClass} mt-4 border-border hover:bg-muted`}>Show all projects</button>
        </div>
      )}
    </section>
  );
}
