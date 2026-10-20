"use client";

import { createContext, lazy, Suspense, useCallback, useContext, useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { ExternalLink, X } from "lucide-react";

const ProjectViewer = lazy(() => import("./project-viewer"));

export function projectSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export interface ProjectDetailData {
  id?: string;
  slug?: string;
  caseStudy?: { problem: string; contribution: string; decisions: readonly string[]; limitations: readonly string[]; lessons: string };
  title: string;
  subtitle?: string;
  description: string;
  details?: string;
  dates: string;
  status?: string;
  category?: string;
  summary?: string;
  href?: string;
  image?: string;
  screenshots?: readonly { src: string; alt: string; caption: string }[];
  technologies?: readonly string[];
  workflow?: readonly string[];
  architecture?: { summary: string; stages: readonly { id: string; title: string; action: string; input: string; output: string; contribution: string; source?: { label: string; href: string } }[] };
  domainIds?: readonly string[];
  links?: readonly { type: string; href: string; icon?: React.ReactNode }[];
}

const DetailsContext = createContext<{ openProject: (id: string, trigger?: HTMLElement) => void; isOpen: boolean }>({ openProject: () => undefined, isOpen: false });
export const useProjectDetails = () => useContext(DetailsContext);

export function ProjectDetailsProvider({ projects, children }: { projects: readonly ProjectDetailData[]; children: React.ReactNode }) {
  const activeId = useSyncExternalStore(
    useCallback((notify) => {
      window.addEventListener("popstate", notify);
      window.addEventListener("portfolio:project-location", notify);
      return () => {
        window.removeEventListener("popstate", notify);
        window.removeEventListener("portfolio:project-location", notify);
      };
    }, []),
    () => new URL(window.location.href).searchParams.get("project"),
    () => null
  );
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const pushedRef = useRef(false);
  const scrollYRef = useRef(0);
  const [transitionProject, setTransitionProject] = useState<string | null>(null);
  const titleId = useId();
  const project = projects.find((item) => (item.slug ?? item.id ?? projectSlug(item.title)) === activeId);
  const openProject = useCallback((id: string, trigger?: HTMLElement) => {
    scrollYRef.current = window.scrollY;
    triggerRef.current = trigger ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);
    const url = new URL(window.location.href);
    if (url.searchParams.get("project") !== id) {
      url.searchParams.set("project", id);
      window.history.pushState({ ...window.history.state, portfolioProject: true }, "", url);
      pushedRef.current = true;
    }
    const origin = trigger?.closest("article")?.querySelector<HTMLElement>(".project-preview img, .project-preview video");
    const documentWithTransition = document as unknown as { startViewTransition?: (callback: () => void) => { finished: Promise<void> } };
    const startViewTransition = documentWithTransition.startViewTransition;
    const canMorph = Boolean(origin && typeof startViewTransition === "function" && document.documentElement.dataset.reducedMotion !== "true");
    if (canMorph && origin) {
      origin.style.viewTransitionName = `project-preview-${id}`;
      setTransitionProject(id);
      const transition = startViewTransition!.call(document, () => window.dispatchEvent(new Event("portfolio:project-location")));
      void transition.finished.finally(() => {
        origin.style.viewTransitionName = "";
        setTransitionProject(null);
      });
    } else {
      setTransitionProject(null);
      window.dispatchEvent(new Event("portfolio:project-location"));
    }
  }, []);

  const closeProject = useCallback(() => {

    if (pushedRef.current) {
      pushedRef.current = false;
      window.history.back();
    } else {
      const url = new URL(window.location.href);
      url.searchParams.delete("project");
      window.history.replaceState(window.history.state, "", url);
      window.dispatchEvent(new Event("portfolio:project-location"));
    }
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!project || !dialog) {
      dialog?.close();
      return;
    }
    const root = document.documentElement;
    const body = document.body;
    const oldRoot = root.style.overflow;
    const oldBody = body.style.overflow;
    body.dataset.projectDetailsOpen = "true";
    root.style.overflow = "hidden";
    body.style.overflow = "hidden";
    document.dispatchEvent(new CustomEvent("portfolio:project-details", { detail: { open: true } }));
    if (!dialog.open) dialog.showModal();
    return () => {
      dialog.close();
      delete body.dataset.projectDetailsOpen;
      root.style.overflow = oldRoot;
      body.style.overflow = oldBody;
      document.dispatchEvent(new CustomEvent("portfolio:project-details", { detail: { open: false } }));
      const trigger = triggerRef.current;
      requestAnimationFrame(() => {
        if (trigger?.isConnected) trigger.focus({ preventScroll: true });
        window.scrollTo({ top: scrollYRef.current, behavior: "instant" });
      });
    };
  }, [project]);

  return <DetailsContext.Provider value={{ openProject, isOpen: Boolean(project) }}>
    {children}
    <dialog ref={dialogRef} aria-labelledby={titleId} className="project-detail-dialog" onCancel={(event) => { event.preventDefault(); closeProject(); }} onClick={(event) => { if (event.target === event.currentTarget) closeProject(); }}>
    {project && <div className="flex max-h-[90dvh] flex-col">
        <div className="project-detail-dialog__header">
          <div className="flex min-w-0 items-center gap-3"><span className="project-detail-dialog__mark" aria-hidden="true">✳</span><div className="min-w-0"><p className="text-xs text-slate-400">Project observatory</p><h2 id={titleId} className="truncate font-serif text-xl sm:text-2xl">{project.title}</h2></div></div>
          <button type="button" autoFocus aria-label="Close project details" onClick={closeProject} className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-white/15 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"><X className="size-4" /></button>
        </div>
        <div className="project-detail-dialog__content" data-project-id={project.slug}><Suspense fallback={<div className="project-viewer__loading" role="status">Opening project…</div>}><ProjectViewer key={project.slug} project={project} transitionProject={transitionProject} /></Suspense></div>
        <div className="flex shrink-0 flex-wrap gap-3 border-t border-white/10 px-6 py-4 sm:px-8">
          {project.links?.length ? project.links.map((link) => <a key={link.href} href={link.href} target={link.href.startsWith("http") ? "_blank" : undefined} rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-4 text-sm font-medium hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">{link.icon}{link.type === "Source" ? "Repository" : link.type}<ExternalLink className="size-3.5" /></a>) : <p className="text-sm text-slate-400">No public demo, repository, or case study is available yet.</p>}
        </div>
      </div>}
    </dialog>
  </DetailsContext.Provider>;
}
