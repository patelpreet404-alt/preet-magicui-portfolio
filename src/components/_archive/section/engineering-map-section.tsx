"use client";

import { FEATURED_PROJECTS, PROJECT_DOMAINS, type DomainId } from "@/data/resume";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useProjectDetails } from "@/components/_archive/project-details";

const DOMAINS = PROJECT_DOMAINS;
const PATH_LABELS: Partial<Record<DomainId, string>> = {
  "ai-ml": "Applied AI",
  "backend-cloud": "Backend Systems",
  "systems-research": "Compilers & Research",
};
const PROJECTS_WITH_DATA = FEATURED_PROJECTS.map((project) => ({
  id: project.slug,
  summary: project.summary,
  domainIds: project.domainIds,
  project,
}));

type ProjectId = (typeof FEATURED_PROJECTS)[number]["slug"];
type MapTarget = { kind: "domain"; id: DomainId } | { kind: "project"; id: ProjectId };

function hasDomain(project: (typeof PROJECTS_WITH_DATA)[number], domainId: DomainId) {
  return project.domainIds.some((id: DomainId) => id === domainId);
}

const MAP_HEIGHT = 504;

function isSameTarget(first: MapTarget | null, second: MapTarget) {
  return first?.kind === second.kind && first.id === second.id;
}

export default function EngineeringMapSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const pathTriggerRef = useRef<HTMLButtonElement>(null);
  const { openProject } = useProjectDetails();
  const [reduceMotion, setReduceMotion] = useState(true);

  useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(root.dataset.reducedMotion === undefined ? media.matches : root.dataset.reducedMotion === "true");
    update();
    const observer = new MutationObserver(update);
    observer.observe(root, { attributes: true, attributeFilter: ["data-reduced-motion"] });
    media.addEventListener("change", update);
    return () => {
      observer.disconnect();
      media.removeEventListener("change", update);
    };
  }, []);
  const [domainAnchorXs, setDomainAnchorXs] = useState<Record<DomainId, number>>({
    "full-stack": 229,
    "ai-ml": 229,
    frontend: 229,
    "backend-cloud": 229,
    cybersecurity: 229,
    "systems-research": 229,
  });
  const [hoveredTarget, setHoveredTarget] = useState<MapTarget | null>(null);
  const [focusedTarget, setFocusedTarget] = useState<MapTarget | null>(null);
  const [selectedTarget, setSelectedTarget] = useState<MapTarget | null>(null);
  const [pathPickerOpen, setPathPickerOpen] = useState(false);
  const [activePathId, setActivePathId] = useState<DomainId | null>(null);
  const [pathStep, setPathStep] = useState(0);
  const activePath = DOMAINS.find((domain) => domain.id === activePathId) ?? null;
  const activePathLabel = activePathId ? PATH_LABELS[activePathId] ?? activePath?.title : undefined;
  const pathProjects = activePathId ? PROJECTS_WITH_DATA.filter((project) => hasDomain(project, activePathId)) : [];
  const activePathProject = pathProjects[pathStep] ?? null;
  const activeTarget = hoveredTarget ?? focusedTarget ?? (activePathProject ? { kind: "project" as const, id: activePathProject.id } : selectedTarget);
  const hasActiveTarget = activeTarget !== null;
  const selectedProjects = selectedTarget?.kind === "project"
    ? PROJECTS_WITH_DATA.filter((project) => project.id === selectedTarget.id)
    : selectedTarget?.kind === "domain"
      ? PROJECTS_WITH_DATA.filter((project) => hasDomain(project, selectedTarget.id))
      : [];

  const activateOnClick = (target: MapTarget) => {
    setActivePathId(null);
    setPathStep(0);
    setSelectedTarget((current) => (isSameTarget(current, target) ? null : target));
    setFocusedTarget(null);
  };

  const clearFocusWhenLeaving = (event: React.FocusEvent<HTMLElement>) => {
    const nextTarget = event.relatedTarget;
    if (!(nextTarget instanceof Node) || !event.currentTarget.contains(nextTarget)) {
      setFocusedTarget(null);
    }
  };

  const connections = PROJECTS_WITH_DATA.flatMap((project) =>
    project.domainIds.map((domainId) => ({ project, domainId }))
  );

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const diagram = section?.querySelector(".engineering-map__diagram");
    if (!diagram) return;

    const updateAnchorPositions = () => {
      const diagramBounds = diagram.getBoundingClientRect();
      if (!diagramBounds.width) return;

      const nextPositions = Object.fromEntries(
        DOMAINS.map((domain) => {
          const anchor = diagram.querySelector<HTMLElement>(
            `[data-domain-anchor="${domain.id}"]`
          );
          if (!anchor) return [domain.id, 229];

          const bounds = anchor.getBoundingClientRect();
          const x = ((bounds.left + bounds.width / 2 - diagramBounds.left) / diagramBounds.width) * 1000;
          return [domain.id, x];
        })
      ) as Record<DomainId, number>;

      setDomainAnchorXs((current) =>
        DOMAINS.every((domain) => Math.abs(current[domain.id] - nextPositions[domain.id]) < 0.5)
          ? current
          : nextPositions
      );
    };

    updateAnchorPositions();
    const resizeObserver = new ResizeObserver(updateAnchorPositions);
    resizeObserver.observe(diagram);
    window.addEventListener("resize", updateAnchorPositions);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateAnchorPositions);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="engineering-map"
      className="engineering-map"
      aria-labelledby="engineering-map-title"
      data-has-selection={hasActiveTarget}
      onMouseLeave={() => setHoveredTarget(null)}
      onBlurCapture={clearFocusWhenLeaving}
    >
      <header className="engineering-map__intro">
        <p className="engineering-map__eyebrow">Engineering map</p>
        <h2 id="engineering-map-title" className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Where my work intersects.
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Explore how each project maps across the areas I work in.
        </p>
      </header>

      <div className="engineering-map__paths">
        <button ref={pathTriggerRef} type="button" className="engineering-map__path-trigger" aria-expanded={pathPickerOpen} aria-controls="engineering-map-path-options" onClick={() => setPathPickerOpen((value) => !value)}>{activePath ? `Following ${activePathLabel}` : "Follow a path"}</button>
        {pathPickerOpen && <div id="engineering-map-path-options" className="engineering-map__path-options" role="group" aria-label="Choose a guided engineering path">
          {Object.entries(PATH_LABELS).map(([rawId, label]) => {
            const id = rawId as DomainId;
            return <button key={id} type="button" aria-pressed={activePathId === id} onClick={() => { setActivePathId(id); setPathStep(0); setSelectedTarget(null); setHoveredTarget(null); setFocusedTarget(null); setPathPickerOpen(false); requestAnimationFrame(() => pathTriggerRef.current?.focus()); }}>{label}<span>{PROJECTS_WITH_DATA.filter((project) => hasDomain(project, id)).length} projects</span></button>;
          })}
        </div>}
      </div>

      <div className="engineering-map__explorer" data-guided={Boolean(activePath)}>
      <div className="engineering-map__visual">
      <div className="engineering-map__desktop" aria-label="Engineering domains mapped to selected projects">
        <div className="engineering-map__column-headings" aria-hidden="true">
          <h3>Engineering domains</h3>
          <h3>Selected projects</h3>
        </div>
        <div className="engineering-map__diagram">
          <div className="engineering-map__domain-list">
            {DOMAINS.map((domain, index) => {
              const target: MapTarget = { kind: "domain", id: domain.id };
              const connectedProjects = PROJECTS_WITH_DATA.filter((project) =>
                hasDomain(project, domain.id)
              );
              const isActive = activeTarget?.kind === "domain" && activeTarget.id === domain.id;
              const isConnected = activeTarget?.kind === "project" && connectedProjects.some(
                (project) => project.id === activeTarget.id
              );
              const projectNames = connectedProjects.map((project) => project.project.title).join(", ");

              return (
                <button
                  key={domain.id}
                  type="button"
                  className="engineering-map__domain"
                  data-domain-id={domain.id}
                  data-active={isActive}
                  data-connected={isConnected}
                  data-in-path={activePathId === domain.id}
                  aria-label={`${domain.title}. Demonstrated by: ${projectNames}.`}
                  aria-pressed={isSameTarget(selectedTarget, target)}
                  onMouseEnter={() => setHoveredTarget(target)}
                  onFocus={() => setFocusedTarget(target)}
                  onClick={() => activateOnClick(target)}
                >
                  <span className="engineering-map__number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  <span className="engineering-map__domain-name">{domain.title}</span>
                  <span
                    className="engineering-map__anchor"
                    data-domain-anchor={domain.id}
                    aria-hidden="true"
                  />
                </button>
              );
            })}
          </div>

          <svg
            className="engineering-map__connections"
            viewBox={`0 0 1000 ${MAP_HEIGHT}`}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <marker id="engineering-map-arrowhead" markerWidth="5" markerHeight="5" refX="4.3" refY="2.5" orient="auto" markerUnits="userSpaceOnUse">
                <path d="M0 0 L4.5 2.5 L0 5" fill="none" stroke="currentColor" strokeWidth="1" />
              </marker>
              <linearGradient
                id="engineering-map-flow-gradient"
                gradientUnits="objectBoundingBox"
                spreadMethod="repeat"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#7398b4" stopOpacity="0.42" />
                <stop offset="23%" stopColor="#8bb9d9" stopOpacity="0.66" />
                <stop offset="42%" stopColor="#c4e8ff" stopOpacity="0.96" />
                <stop offset="50%" stopColor="#e7f5ff" />
                <stop offset="58%" stopColor="#b2dafa" stopOpacity="0.9" />
                <stop offset="79%" stopColor="#7ba5c5" stopOpacity="0.56" />
                <stop offset="100%" stopColor="#7398b4" stopOpacity="0.42" />
                {!reduceMotion && <animateTransform
                  attributeName="gradientTransform"
                  type="translate"
                  from="-1 0"
                  to="0 0"
                  dur="4.2s"
                  repeatCount="indefinite"
                />}
              </linearGradient>
            </defs>
            {connections.map(({ project, domainId }) => {
              const domainIndex = DOMAINS.findIndex((domain) => domain.id === domainId);
              const projectIndex = PROJECTS_WITH_DATA.findIndex((item) => item.id === project.id);
              const domainY = ((domainIndex + 0.5) / DOMAINS.length) * MAP_HEIGHT;
              const projectY = ((projectIndex + 0.5) / PROJECTS_WITH_DATA.length) * MAP_HEIGHT;
              const isActive = activeTarget?.kind === "project"
                ? activeTarget.id === project.id
                : activeTarget?.kind === "domain"
                  ? activeTarget.id === domainId
                  : false;
              const path = `M ${domainAnchorXs[domainId]} ${domainY} C ${domainAnchorXs[domainId] + 90} ${domainY}, 580 ${projectY}, 706 ${projectY}`;

              return (
                <g key={`${domainId}-${project.id}`}>
                  <path
                    className="engineering-map__connection"
                    data-active={isActive}
                    data-in-path={activePathId === domainId}
                    d={path}
                    markerEnd="url(#engineering-map-arrowhead)"
                  />
                  <path
                    className="engineering-map__flow"
                    data-active={isActive}
                    d={path}
                  />
                </g>
              );
            })}
          </svg>

          <div className="engineering-map__project-list">
            {PROJECTS_WITH_DATA.map((item, index) => {
              const target: MapTarget = { kind: "project", id: item.id };
              const connectedDomains = DOMAINS.filter((domain) => hasDomain(item, domain.id));
              const isActive = activeTarget?.kind === "project" && activeTarget.id === item.id;
              const isConnected = activeTarget?.kind === "domain" && hasDomain(item, activeTarget.id);
              const domainNames = connectedDomains.map((domain) => domain.title).join(", ");

              return (
                <button
                  key={item.id}
                  type="button"
                  className="engineering-map__project"
                  data-active={isActive}
                  data-connected={isConnected}
                  data-in-path={pathProjects.some((project) => project.id === item.id)}
                  aria-label={`${item.project.title}, ${item.summary}. Connected domains: ${domainNames}.`}
                  aria-pressed={isSameTarget(selectedTarget, target)}
                  onMouseEnter={() => setHoveredTarget(target)}
                  onFocus={() => setFocusedTarget(target)}
                  onClick={() => activateOnClick(target)}
                >
                  <span className="engineering-map__anchor" aria-hidden="true" />
                  <span className="engineering-map__project-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  <span className="engineering-map__project-copy">
                    <span className="engineering-map__project-name">{item.project.title}</span>
                    <span className="engineering-map__project-summary">{item.summary}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      <div className="engineering-map__mobile">
        <h3 className="engineering-map__mobile-heading">Selected projects</h3>
        <div className="engineering-map__mobile-projects">
          {PROJECTS_WITH_DATA.map((item, index) => {
            const target: MapTarget = { kind: "project", id: item.id };
            const connectedDomains = DOMAINS.filter((domain) => hasDomain(item, domain.id));
            const isActive = activeTarget?.kind === "project" && activeTarget.id === item.id;
            const isConnected = activeTarget?.kind === "domain" && hasDomain(item, activeTarget.id);

            return (
              <article
                key={item.id}
                className="engineering-map__mobile-project"
                data-active={isActive}
                data-connected={isConnected}
                data-in-path={pathProjects.some((project) => project.id === item.id)}
                data-dimmed={hasActiveTarget && !isActive && !isConnected}
              >
                <button
                  type="button"
                  className="engineering-map__mobile-project-button"
                  aria-label={`${item.project.title}, connected to ${connectedDomains.map((domain) => domain.title).join(", ")}.`}
                  aria-pressed={isSameTarget(selectedTarget, target)}
                  onMouseEnter={() => setHoveredTarget(target)}
                  onFocus={() => setFocusedTarget(target)}
                  onClick={() => activateOnClick(target)}
                >
                  <span className="engineering-map__project-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  <span className="engineering-map__project-copy">
                    <span className="engineering-map__project-name">{item.project.title}</span>
                    <span className="engineering-map__project-summary">{item.summary}</span>
                  </span>
                </button>
                <ul className="engineering-map__mobile-domains">
                  {connectedDomains.map((domain) => {
                    const domainTarget: MapTarget = { kind: "domain", id: domain.id };
                    const isDomainActive = activeTarget?.kind === "domain" && activeTarget.id === domain.id;

                    return (
                      <li key={domain.id}>
                        <button
                          type="button"
                          className="engineering-map__mobile-domain"
                          data-active={isDomainActive}
                          aria-pressed={isSameTarget(selectedTarget, domainTarget)}
                          onMouseEnter={() => setHoveredTarget(domainTarget)}
                          onFocus={() => setFocusedTarget(domainTarget)}
                          onClick={() => activateOnClick(domainTarget)}
                        >
                          <span aria-hidden="true">↳</span>
                          {domain.title}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </article>
            );
          })}
        </div>

      </div>
      </div>
      {activePath && activePathProject ? <div className="engineering-map__selection engineering-map__path-panel" aria-label="Guided engineering path">
        <div className="engineering-map__path-card-heading"><div><p>{activePathLabel} · {pathStep + 1} of {pathProjects.length}</p><h3>{activePathProject.project.title}</h3></div><button type="button" className="engineering-map__clear" onClick={() => { setActivePathId(null); setPathStep(0); }}>Exit path</button></div>
        <p className="engineering-map__path-description">{activePathProject.project.description}</p>
        <p className="engineering-map__path-reason">Why it belongs: {activePathProject.project.domainNotes?.[activePath.id] ?? activePath.pathDescription}</p>
        <p className="engineering-map__path-status">{activePathProject.project.status}</p>
        <div className="engineering-map__path-controls"><button type="button" disabled={pathStep === 0} onClick={() => setPathStep((step) => Math.max(0, step - 1))}>Previous</button><span aria-live="polite">{pathStep + 1} / {pathProjects.length}</span><button type="button" disabled={pathStep === pathProjects.length - 1} onClick={() => setPathStep((step) => Math.min(pathProjects.length - 1, step + 1))}>Next</button><button type="button" className="engineering-map__view" onClick={() => openProject(activePathProject.id)}>View project <span aria-hidden="true">↗</span><span className="sr-only">: {activePathProject.project.title}</span></button></div>
      </div> : selectedTarget && (
        <div className="engineering-map__selection" aria-label="Selected engineering work">
          <div className="engineering-map__selection-heading">
            <h3>{selectedTarget.kind === "domain" ? DOMAINS.find((domain) => domain.id === selectedTarget.id)?.title : selectedProjects[0]?.project.title}</h3>
            <button type="button" className="engineering-map__clear" onClick={() => setSelectedTarget(null)}>Clear selection</button>
          </div>
          <div className="engineering-map__selection-projects">
            {selectedProjects.map((item) => (
              <div key={item.id} className="engineering-map__selection-project">
                <div><p className="engineering-map__project-name">{item.project.title}</p><p className="engineering-map__project-summary">{item.summary}</p></div>
                <button type="button" className="engineering-map__view" onClick={() => openProject(item.id)}>View project <span aria-hidden="true">↗</span><span className="sr-only">: {item.project.title}</span></button>
              </div>
            ))}
          </div>
        </div>
      )}
      </div>
    </section>
  );
}
