"use client";

import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArrowUpRight } from "lucide-react";
import { useMotionSettings } from "@/components/motion-settings";
import {
  DOMAIN_LABELS,
  STATUS_LABELS,
  moreProjects,
  type ProjectDomain,
} from "@/content";

type Filter = "all" | ProjectDomain;

// Filters are derived from the projects' own domains, in a stable order.
const DOMAIN_ORDER: ProjectDomain[] = ["ai-ml", "full-stack", "systems", "data", "security"];

const rowLink =
  "type-meta group inline-flex min-h-11 items-center gap-1 text-ink underline decoration-rule underline-offset-4 t-fast transition-colors hover:decoration-ink";

const FINE_POINTER = "(hover: hover) and (pointer: fine)";
const subscribeFinePointer = (onChange: () => void) => {
  const media = window.matchMedia(FINE_POINTER);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
};

function Preview({ project, className }: { project: (typeof moreProjects)[number]; className: string }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none z-30 w-[280px] overflow-hidden rounded-media border border-rule bg-muted ${className}`}>
      <div className="relative aspect-[16/10]">
        <Image src={project.media.poster} alt="" fill sizes="280px" className="object-cover object-top" />
      </div>
    </div>
  );
}

export function MoreWork() {
  const [filter, setFilter] = useState<Filter>("all");
  const { reducedMotion } = useMotionSettings();
  const finePointer = useSyncExternalStore(subscribeFinePointer, () => window.matchMedia(FINE_POINTER).matches, () => false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [focused, setFocused] = useState<string | null>(null);
  const followRef = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0, frame: 0 });

  // Hover preview: follows the cursor with a transform only, throttled to one update per frame.
  const place = () => {
    const el = followRef.current;
    if (!el) return;
    const { x, y } = pointer.current;
    el.style.transform = `translate3d(${Math.min(x + 24, window.innerWidth - 304)}px, ${Math.min(y + 20, window.innerHeight - 200)}px, 0)`;
  };
  const follow = (event: React.PointerEvent) => {
    const state = pointer.current;
    state.x = event.clientX;
    state.y = event.clientY;
    if (state.frame) return;
    state.frame = window.requestAnimationFrame(() => {
      state.frame = 0;
      place();
    });
  };
  const hoverPreview = finePointer && !reducedMotion;
  const hoveredProject = hoverPreview ? moreProjects.find((project) => project.slug === hovered) : undefined;
  // When the preview first mounts, put it under the cursor straight away.
  useLayoutEffect(() => {
    if (hoveredProject) place();
  }, [hoveredProject]);
  const focusedProject = moreProjects.find((project) => project.slug === focused);
  const present = DOMAIN_ORDER.filter((domain) => moreProjects.some((project) => project.domains.includes(domain)));
  const visible = filter === "all" ? moreProjects : moreProjects.filter((project) => project.domains.includes(filter));

  const filters: { id: Filter; label: string }[] = [{ id: "all", label: "All" }, ...present.map((id) => ({ id, label: DOMAIN_LABELS[id] }))];

  return (
    <section id="more-work" aria-labelledby="more-work-title" className="container-site pt-[var(--section-gap)]">
      <h2 id="more-work-title" className="type-h2">
        More work
      </h2>
      <p className="type-lead mt-4 max-w-[34em] text-graphite">Smaller projects, prototypes and research.</p>

      <div role="group" aria-label="Filter projects by area" className="mt-8 flex flex-wrap gap-2">
        {filters.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            aria-pressed={filter === id}
            onClick={() => setFilter(id)}
            className="type-meta press t-fast inline-flex min-h-11 items-center rounded-control border border-rule px-4 text-ink transition-colors hover:border-ink aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-paper"
          >
            {label}
          </button>
        ))}
      </div>
      <p role="status" className="sr-only">
        {visible.length} {visible.length === 1 ? "project" : "projects"} shown
      </p>

      <ul className="mt-8 border-t border-rule">
        {visible.map((project) => {
          const external = project.links.filter((link) => link.kind === "demo" || link.kind === "source");
          return (
            <li
              key={project.slug}
              data-more-work={project.slug}
              className="grid-site items-baseline gap-y-2 border-b border-rule py-5"
              onPointerEnter={(event) => {
                setHovered(project.slug);
                follow(event);
              }}
              onPointerMove={follow}
              onPointerLeave={() => setHovered(null)}
              onFocus={(event) => setFocused(event.target.matches(":focus-visible") ? project.slug : null)}
              onBlur={() => setFocused(null)}
            >
              <div className="col-span-12 lg:col-span-3">
                <Link href={`/work/${project.slug}`} transitionTypes={["nav-forward"]} className="type-body font-semibold text-ink underline decoration-transparent underline-offset-4 t-fast transition-colors hover:decoration-rule">
                  {project.name}
                </Link>
                {project.subtitle && <p className="type-meta text-graphite">{project.subtitle}</p>}
              </div>
              <p className="type-body col-span-12 text-ink lg:col-span-3">{project.oneLiner}</p>
              <p className="type-meta col-span-6 text-graphite lg:col-span-2">{STATUS_LABELS[project.status]}</p>
              <p className="type-meta col-span-6 text-graphite lg:col-span-2">
                <span className="sr-only">Stack: </span>
                {project.stack.slice(0, 3).join(", ")}
              </p>
              <ul className="col-span-12 flex flex-wrap gap-x-5 lg:col-span-2 lg:justify-end">
                {external.map((link) => (
                  <li key={link.kind}>
                    <a href={link.href} target="_blank" rel="noopener noreferrer" className={rowLink}>
                      {link.kind === "demo" ? "Demo" : "Source"}
                      <ArrowUpRight className="size-3.5" aria-hidden="true" />
                      <span className="sr-only"> for {project.name} (opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>

      {hoveredProject && (
        <div ref={followRef} className="fixed left-0 top-0 z-30 will-change-transform">
          <Preview project={hoveredProject} className="t-fast transition-opacity" />
        </div>
      )}
      {focusedProject && <Preview project={focusedProject} className="fixed bottom-6 right-6" />}
    </section>
  );
}
