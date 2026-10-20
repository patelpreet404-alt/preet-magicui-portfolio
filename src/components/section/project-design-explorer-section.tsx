"use client";

import { useMemo, useRef, useState } from "react";
import { ArrowDownRight, ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Database, Layers3, Minus, Plus, RotateCcw, Workflow } from "lucide-react";
import { DATA } from "@/data/resume";
import { PROJECT_DESIGNS } from "@/data/project-design-explorer";
import { PROJECT_SCHEMAS } from "@/data/project-schemas";
import ProjectSchemaDiagram from "./project-schema-diagram";

const VIEWS = [
  { id: "overview", label: "System overview", icon: Layers3 },
  { id: "services", label: "Service breakdown", icon: Workflow },
  { id: "database", label: "DB schema", icon: Database },
] as const;

type ViewId = (typeof VIEWS)[number]["id"];

export default function ProjectDesignExplorerSection() {
  const [projectId, setProjectId] = useState(PROJECT_DESIGNS[0].id);
  const [view, setView] = useState<ViewId>("overview");
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(90);
  const projectRowRef = useRef<HTMLDivElement>(null);
  const project = PROJECT_DESIGNS.find((item) => item.id === projectId) ?? PROJECT_DESIGNS[0];
  const projectInfo = useMemo(() => DATA.projects.find((item) => item.title === project.title), [project.title]);
  const selectedNode = project.overview.find((node) => node.id === selectedNodeId);
  const schema = project.database.schemaKey ? PROJECT_SCHEMAS[project.database.schemaKey] : undefined;
  const schemaCount = schema?.tables.length ?? 0;

  const selectProject = (id: string) => {
    setProjectId(id);
    setSelectedNodeId(null);
    setZoom(90);
    const row = projectRowRef.current;
    const button = Array.from(row?.querySelectorAll<HTMLButtonElement>("[data-project-id]") ?? []).find((item) => item.dataset.projectId === id);
    if (row && button) row.scrollTo({ left: row.scrollLeft + button.getBoundingClientRect().left - row.getBoundingClientRect().left - 12, behavior: "smooth" });
  };

  const moveProject = (delta: number) => {
    const current = PROJECT_DESIGNS.findIndex((item) => item.id === projectId);
    const next = Math.max(0, Math.min(PROJECT_DESIGNS.length - 1, current + delta));
    selectProject(PROJECT_DESIGNS[next].id);
    projectRowRef.current?.querySelectorAll<HTMLButtonElement>("[data-project-id]")[next]?.focus({ preventScroll: true });
  };

  const adjustZoom = (delta: number) => setZoom((current) => Math.min(100, Math.max(80, current + delta)));

  const handleTabKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = VIEWS.findIndex((item) => item.id === view);
    const nextIndex = event.key === "ArrowRight"
      ? (currentIndex + 1) % VIEWS.length
      : event.key === "ArrowLeft"
        ? (currentIndex - 1 + VIEWS.length) % VIEWS.length
        : -1;
    if (nextIndex < 0) return;
    event.preventDefault();
    const nextView = VIEWS[nextIndex].id;
    setView(nextView);
    document.getElementById(`design-tab-${nextView}`)?.focus();
  };

  return (
    <section id="design-explorer" className="design-explorer" aria-labelledby="design-explorer-title">
      <div className="design-explorer__intro">
        <div>
          <p className="design-explorer__eyebrow">A closer look</p>
          <h2 id="design-explorer-title">Project design explorer.</h2>
          <p>Explore how each project is put together, from the main workflow to the data model.</p>
        </div>
        <span className="design-explorer__count" aria-label={`${PROJECT_DESIGNS.length} projects available`}>
          {String(PROJECT_DESIGNS.length).padStart(2, "0")} <span>projects</span>
        </span>
      </div>

      <div className="design-explorer__shell">
        <div ref={projectRowRef} className="design-explorer__project-row" aria-label="Choose a project" onKeyDown={(event) => {
          if (event.key === "ArrowRight") { event.preventDefault(); moveProject(1); }
          if (event.key === "ArrowLeft") { event.preventDefault(); moveProject(-1); }
        }}>
          {PROJECT_DESIGNS.map((item, index) => {
            const itemInfo = DATA.projects.find((entry) => entry.title === item.title);
            const active = item.id === projectId;
            return (
              <button
                key={item.id}
                type="button"
                className="design-explorer__project"
                data-project-id={item.id}
                data-active={active}
                aria-pressed={active}
                onClick={() => selectProject(item.id)}
              >
                <span className="design-explorer__project-index">0{index + 1}</span>
                <span className="design-explorer__project-title">{item.title}</span>
                <span className="design-explorer__project-status">{itemInfo?.dates}</span>
              </button>
            );
          })}
        </div>

        <div className="design-explorer__project-cue">
          <span>Swipe to browse projects · {PROJECT_DESIGNS.findIndex((item) => item.id === projectId) + 1} / {PROJECT_DESIGNS.length}</span>
          <div><button type="button" aria-label="Previous design project" disabled={projectId === PROJECT_DESIGNS[0].id} onClick={() => moveProject(-1)}><ChevronLeft aria-hidden="true" /></button><button type="button" aria-label="Next design project" disabled={projectId === PROJECT_DESIGNS[PROJECT_DESIGNS.length - 1].id} onClick={() => moveProject(1)}><ChevronRight aria-hidden="true" /></button></div>
        </div>

        <div className="design-explorer__toolbar">
          <div className="design-explorer__view-tabs" role="tablist" aria-label={`${project.title} design views`} onKeyDown={handleTabKeyDown}>
            {VIEWS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                role="tab"
                id={`design-tab-${id}`}
                aria-selected={view === id}
                aria-controls="design-explorer-panel"
                tabIndex={view === id ? 0 : -1}
                className="design-explorer__tab"
                data-active={view === id}
                onClick={() => setView(id)}
              >
                <Icon aria-hidden="true" />
                {label}
              </button>
            ))}
          </div>
          {view === "database" && schemaCount > 0 && (
            <div className="design-explorer__zoom" aria-label="Schema diagram size">
              <button type="button" aria-label="Zoom out" onClick={() => adjustZoom(-10)} disabled={zoom <= 80}><Minus /></button>
              <span aria-live="polite">{zoom}%</span>
              <button type="button" aria-label="Zoom in" onClick={() => adjustZoom(10)} disabled={zoom >= 100}><Plus /></button>
              <button type="button" aria-label="Reset diagram size" onClick={() => setZoom(90)}><RotateCcw /></button>
            </div>
          )}
        </div>

        <div
          className="design-explorer__panel"
          id="design-explorer-panel"
          role="tabpanel"
          aria-labelledby={`design-tab-${view}`}
          key={`${project.id}-${view}`}
        >
          <div className="design-explorer__panel-heading">
            <div>
              <p className="design-explorer__eyebrow">{project.title}</p>
              <h3>{view === "overview" ? "System overview" : view === "services" ? "Service breakdown" : schema?.modelKind === "source-data" ? "Sample data structure" : "Database schema"}</h3>
              {view === "database" && schema ? <details className="design-explorer__source-note"><summary>About this data model</summary><p>{project.database.note}</p></details> : <p>{view === "database" ? project.database.note : project.summary}</p>}
              {project.statusNote && <p className="design-explorer__status-note">Build status · {project.statusNote}</p>}
            </div>
            {view === "database" && !schema && (
              <div className="design-explorer__schema-count">
                {project.database.label}
              </div>
            )}
          </div>

          {view === "overview" && (
            <>
              <div className="design-explorer__flow" aria-label={`${project.title} system workflow`}>
                {project.overview.map((node, index) => (
                  <div className="design-explorer__flow-step" key={node.id}>
                    <button
                      type="button"
                      className="design-explorer__node"
                      data-active={selectedNodeId === node.id}
                      aria-pressed={selectedNodeId === node.id}
                      onClick={() => setSelectedNodeId((current) => current === node.id ? null : node.id)}
                    >
                      <span className="design-explorer__node-kind">{node.kind}</span>
                      <span className="design-explorer__node-label">{node.label}</span>
                      <span className="design-explorer__node-hint">Select to inspect</span>
                    </button>
                    {index < project.overview.length - 1 && <ArrowRight className="design-explorer__flow-arrow" aria-hidden="true" />}
                  </div>
                ))}
              </div>
              <div className="design-explorer__node-detail" aria-live="polite">
                {selectedNode ? <><span>{selectedNode.kind}</span><p><strong>{selectedNode.label}.</strong> {selectedNode.detail}</p></> : <p><ArrowDownRight aria-hidden="true" /> Select a stage to see what happens there.</p>}
              </div>
            </>
          )}

          {view === "services" && (
            <div className="design-explorer__services">
              {project.services.map((service, index) => (
                <article className="design-explorer__service" key={service.name}>
                  <span>0{index + 1}</span>
                  <div><h4>{service.name}</h4><p>{service.role}</p></div>
                  <ArrowDownRight aria-hidden="true" />
                </article>
              ))}
            </div>
          )}

          {view === "database" && schema && <ProjectSchemaDiagram schema={schema} zoom={zoom} associations={project.database.associations} />}

          {view === "database" && schemaCount === 0 && (
            <div className="design-explorer__empty-schema">
              <Database aria-hidden="true" />
              <h4>{project.database.label}</h4>
              <p>{project.database.note}</p>
            </div>
          )}

          {projectInfo && (
            <div className="design-explorer__footer">
              <span><i aria-hidden="true" /> {projectInfo.dates}</span>
              <span>{projectInfo.technologies.slice(0, 4).join(" · ")}</span>
              <div className="design-explorer__actions" aria-label={`${project.title} links`}>
                {projectInfo.links.map((link) => (
                  <a key={`${link.type}-${link.href}`} href={link.href} target="_blank" rel="noreferrer">
                    {link.type}<ArrowUpRight aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
