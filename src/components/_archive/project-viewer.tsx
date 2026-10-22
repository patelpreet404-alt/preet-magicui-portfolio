/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Markdown from "react-markdown";
import { ArrowLeft, ArrowRight, Pause, Play, RotateCcw, ZoomIn } from "lucide-react";
import type { ProjectDetailData } from "./project-details";
import { SaveProjectButton } from "./saved-projects";
import { ProjectDesignExplorer } from "./project-design-explorer";

type View = "product" | "engineering" | "decisions";

export default function ProjectViewer({ project, transitionProject }: { project: ProjectDetailData; transitionProject: string | null }) {
  const [view, setView] = useState<View>("product");
  const [imageOpen, setImageOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [stageIndex, setStageIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const lightboxRef = useRef<HTMLDialogElement>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const screenshots = useMemo(() => project.screenshots?.length
    ? project.screenshots
    : project.image ? [{ src: project.image, alt: `${project.title} interface preview`, caption: `Available project preview for ${project.title}.` }] : [], [project]);
  const activeImage = screenshots[imageIndex];
  const stages = project.architecture?.stages ?? [];
  const activeStage = stages[stageIndex];

  useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(root.dataset.reducedMotion === undefined ? media.matches : root.dataset.reducedMotion === "true");
    update();
    const observer = new MutationObserver(update);
    observer.observe(root, { attributes: true, attributeFilter: ["data-reduced-motion"] });
    media.addEventListener("change", update);
    return () => { observer.disconnect(); media.removeEventListener("change", update); };
  }, []);

  useEffect(() => {
    if (!playing || reducedMotion || stages.length < 2) return;
    const timer = window.setInterval(() => setStageIndex((current) => (current + 1) % stages.length), 1500);
    return () => window.clearInterval(timer);
  }, [playing, reducedMotion, stages.length]);

  useEffect(() => {
    const lightbox = lightboxRef.current;
    if (!lightbox) return;
    if (imageOpen && !lightbox.open) lightbox.showModal();
    if (!imageOpen && lightbox.open) lightbox.close();
  }, [imageOpen]);

  const selectStage = (index: number) => {
    setStageIndex(index);
    setPlaying(false);
  };

  const selectView = (nextView: View) => {
    setPlaying(false);
    setView(nextView);
  };

  const handleTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex = index;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % 3;
    else if (event.key === "ArrowLeft") nextIndex = (index + 2) % 3;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = 2;
    else return;
    event.preventDefault();
    const nextView = (["product", "engineering", "decisions"] as const)[nextIndex];
    selectView(nextView);
    tabRefs.current[nextIndex]?.focus();
  };

  return <div className="project-viewer">
    <div className="project-viewer__heading">
      <div>
        <p className="project-viewer__category">{project.category ?? "Selected work"}</p>
        <span className="project-viewer__status">{project.status ?? project.dates}</span>
      </div>
      {project.summary && <p className="project-viewer__summary">{project.summary}</p>}
      <SaveProjectButton id={project.slug ?? project.id ?? project.title} title={project.title} />
    </div>

    <div className="project-viewer__tabs" role="tablist" aria-label={`${project.title} project views`}>
      {(["product", "engineering", "decisions"] as const).map((name, index) => <button key={name} ref={(element) => { tabRefs.current[index] = element; }} type="button" role="tab" tabIndex={view === name ? 0 : -1} id={`project-tab-${name}`} aria-selected={view === name} aria-controls={`project-panel-${name}`} onKeyDown={(event) => handleTabKeyDown(event, index)} onClick={() => selectView(name)}>{name === "product" ? "Product" : name === "engineering" ? "Engineering" : "Decisions"}</button>)}
    </div>

    {view === "product" && <section id="project-panel-product" role="tabpanel" aria-labelledby="project-tab-product" className="project-viewer__layout">
      <div className="project-viewer__media-column">
        {activeImage && !imageError && <div className="project-viewer__media-frame">
          <button type="button" className="project-viewer__image-button" onClick={() => setImageOpen(true)} aria-label={`Enlarge image: ${activeImage.alt}`}>
            <img src={activeImage.src} alt={activeImage.alt} onError={() => setImageError(true)} style={transitionProject === project.slug ? { viewTransitionName: `project-preview-${project.slug}` } : undefined} />
            <span><ZoomIn size={15} aria-hidden="true" /> Enlarge</span>
          </button>
          <p className="project-viewer__caption">{activeImage.caption}</p>
        </div>}
        {screenshots.length > 1 && <div className="project-viewer__filmstrip" aria-label="Project screenshots">{screenshots.map((shot, index) => <button key={shot.src} type="button" aria-label={`Show screenshot ${index + 1}: ${shot.caption}`} aria-pressed={index === imageIndex} onClick={() => { setImageError(false); setImageIndex(index); }}><img src={shot.src} alt="" /></button>)}</div>}
        {project.workflow?.length ? <div className="project-viewer__workflow"><p>At a glance</p><ol>{project.workflow.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, "0")}</span>{step}</li>)}</ol></div> : null}
      </div>
      <div className="project-viewer__copy">
        <h3>What it does</h3>
        <div className="project-viewer__prose"><Markdown>{project.description}</Markdown></div>
        {project.href && <a className="project-viewer__primary-link" href={project.href} target={project.href.startsWith("http") ? "_blank" : undefined} rel={project.href.startsWith("http") ? "noopener noreferrer" : undefined}>Open {project.links?.find((link) => link.href === project.href)?.type === "Case study" ? "case study" : "project"}<ArrowRight size={15} aria-hidden="true" /></a>}
        {project.technologies?.length ? <div className="project-viewer__technologies"><h4>Built with</h4><ul>{project.technologies.map((technology) => <li key={technology}>{technology}</li>)}</ul></div> : null}
      </div>
    </section>}

    {view === "engineering" && <section id="project-panel-engineering" role="tabpanel" aria-labelledby="project-tab-engineering" className="project-viewer__panel">
      {stages.length > 0 && activeStage ? <>
        <div className="project-viewer__workflow-heading"><div><h3>Trace the workflow</h3><p>{project.architecture?.summary}</p></div><div className="project-viewer__playback"><button type="button" aria-pressed={playing} onClick={() => reducedMotion ? selectStage((stageIndex + 1) % stages.length) : setPlaying((value) => !value)} aria-label={reducedMotion ? "Advance one workflow stage" : playing ? "Pause workflow" : "Play workflow"}>{playing ? <Pause size={15} /> : <Play size={15} />}<span>{reducedMotion ? "Next stage" : playing ? "Pause" : "Play"}</span></button><button type="button" onClick={() => selectStage((stageIndex - 1 + stages.length) % stages.length)} aria-label="Previous stage"><ArrowLeft size={16} /></button><button type="button" onClick={() => selectStage((stageIndex + 1) % stages.length)} aria-label="Next stage"><ArrowRight size={16} /></button><button type="button" onClick={() => { setPlaying(false); setStageIndex(0); }} aria-label="Restart workflow"><RotateCcw size={15} /></button></div></div>
        <div className="project-flow" data-reduced-motion={reducedMotion}>
          <svg className="project-flow__line" viewBox="0 0 1000 90" preserveAspectRatio="none" role="img" aria-label="Project workflow connections">
            <path d={`M ${50} 45 ${stages.map((_, index) => `L ${50 + (900 * (index + 1)) / stages.length} 45`).join(" ")}`} />
            <path className="project-flow__progress" d={`M 50 45 L ${50 + (900 * (stageIndex + 1)) / stages.length} 45`} />
          </svg>
          <div className="project-flow__nodes">{stages.map((stage, index) => <button key={stage.id} type="button" className="project-flow__node" style={{ left: `${5 + (90 * (index + 1)) / stages.length}%` }} data-active={stageIndex === index} data-complete={index < stageIndex} aria-current={stageIndex === index ? "step" : undefined} onClick={() => selectStage(index)}><span className="project-flow__dot" /><span className="project-flow__label">{stage.title}</span></button>)}</div>
        </div>
        <ol className="project-flow__list" aria-label="Workflow stages">{stages.map((stage, index) => <li key={stage.id}><button type="button" aria-current={stageIndex === index ? "step" : undefined} onClick={() => selectStage(index)}><span>{String(index + 1).padStart(2, "0")}</span>{stage.title}</button></li>)}</ol>
        <article className="project-viewer__stage-detail" aria-live="polite" aria-atomic="true">
          <div className="project-viewer__stage-title"><span>Stage {String(stageIndex + 1).padStart(2, "0")} / {String(stages.length).padStart(2, "0")}</span><h4>{activeStage.title}</h4></div>
          <p>{activeStage.action}</p>
          <dl><div><dt>Input</dt><dd>{activeStage.input}</dd></div><div><dt>Output</dt><dd>{activeStage.output}</dd></div><div><dt>Contribution / decision</dt><dd>{activeStage.contribution}</dd></div></dl>
          {activeStage.source && <a className="project-viewer__source-link" href={activeStage.source.href} target="_blank" rel="noopener noreferrer">Verified source: {activeStage.source.label}<ArrowRight size={14} aria-hidden="true" /></a>}
        </article>
      </> : <>
        <h3>Engineering notes</h3>
        {project.caseStudy?.decisions.length ? <ul className="project-viewer__decision-list">{project.caseStudy.decisions.map((decision) => <li key={decision}>{decision}</li>)}</ul> : null}
        {project.workflow?.length ? <ol className="project-flow__list">{project.workflow.map((step, index) => <li key={step}><span className="project-flow__static-step"><span>{String(index + 1).padStart(2, "0")}</span>{step}</span></li>)}</ol> : null}
        <p className="project-viewer__note">This project has no verified source-linked stage sequence yet.</p>
      </>}
      <ProjectDesignExplorer project={project} />
    </section>}

    {view === "decisions" && <section id="project-panel-decisions" role="tabpanel" aria-labelledby="project-tab-decisions" className="project-viewer__panel project-viewer__decisions">
      {project.caseStudy ? <>
        <section><h3>Audience and problem</h3><p>{project.caseStudy.problem}</p></section>
        <section><h3>My contribution</h3><p>{project.caseStudy.contribution}</p></section>
        <section><h3>Trade-offs and decisions</h3><ul>{project.caseStudy.decisions.map((decision) => <li key={decision}>{decision}</li>)}</ul></section>
        <section><h3>Status and limitations</h3><p className="project-viewer__status-copy">{project.status ?? project.dates}</p><ul>{project.caseStudy.limitations.map((limitation) => <li key={limitation}>{limitation}</li>)}</ul></section>
        <section><h3>What I learned</h3><p>{project.caseStudy.lessons}</p></section>
      </> : <div className="project-viewer__prose"><Markdown>{project.details ?? project.description}</Markdown></div>}
    </section>}

    <dialog ref={lightboxRef} className="project-image-viewer" aria-label={`Enlarged image: ${activeImage?.alt ?? project.title}`} onCancel={(event) => { event.preventDefault(); setImageOpen(false); }} onClick={(event) => { if (event.target === event.currentTarget) setImageOpen(false); }}>{activeImage && <figure><button type="button" autoFocus aria-label="Close enlarged image" onClick={() => setImageOpen(false)}>Close image</button><img src={activeImage.src} alt={activeImage.alt} /><figcaption>{activeImage.caption}</figcaption></figure>}</dialog>
  </div>;
}
