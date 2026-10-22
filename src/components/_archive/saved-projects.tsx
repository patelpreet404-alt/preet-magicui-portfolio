"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Bookmark, BookmarkCheck, Copy, Heart, Trash2, X } from "lucide-react";
import type { PortfolioProject } from "@/data/resume";

const STORAGE_KEY = "preet-portfolio-saved-projects";
type SavedContextValue = { ids: readonly string[]; toggleSaved: (id: string) => void; isSaved: (id: string) => boolean };
const SavedContext = createContext<SavedContextValue | null>(null);

export function useSavedProjects() {
  const value = useContext(SavedContext);
  if (!value) throw new Error("Saved projects must be used inside SavedProjectsProvider");
  return value;
}

export function SavedProjectsProvider({ projects, children }: { projects: readonly PortfolioProject[]; children: React.ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [storageReady, setStorageReady] = useState(false);
  const [storageUnavailable, setStorageUnavailable] = useState(false);
  const [dialogMode, setDialogMode] = useState<"saved" | "compare">("saved");
  const [selected, setSelected] = useState<string[]>([]);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openedByHistoryRef = useRef(false);
  const directComparisonRef = useRef(false);
  const closeAfterPopRef = useRef(false);
  const triggerRef = useRef<HTMLElement | null>(null);
  const scrollYRef = useRef(0);
  const modeRef = useRef(dialogMode);
  modeRef.current = dialogMode;
  const known = useMemo(() => new Map(projects.map((project) => [project.slug, project])), [projects]);
  const savedProjects = ids.map((id) => known.get(id)).filter((project): project is PortfolioProject => Boolean(project));

  useEffect(() => {
    try {
      const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]") as unknown;
      if (Array.isArray(stored)) setIds(Array.from(new Set(stored.filter((id): id is string => typeof id === "string" && known.has(id)))));
    } catch { setStorageUnavailable(true); }
    finally { setStorageReady(true); }
  }, [known]);

  useEffect(() => {
    if (!storageReady) return;
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids)); }
    catch { setStorageUnavailable(true); }
  }, [ids, storageReady]);

  const isSaved = useCallback((id: string) => ids.includes(id), [ids]);
  const toggleSaved = useCallback((id: string) => setIds((current) => current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id]), []);

  const syncFromUrl = useCallback(() => {
    const raw = new URL(window.location.href).searchParams.get("compare");
    if (!raw) {
      if (modeRef.current === "compare") {
        setDialogMode("saved");
        setCompareIds([]);
      }
      if (openedByHistoryRef.current) {
        openedByHistoryRef.current = false;
        if (closeAfterPopRef.current) {
          closeAfterPopRef.current = false;
          dialogRef.current?.close();
          setDialogVisible(false);
        }
      } else if (directComparisonRef.current) {
        directComparisonRef.current = false;
        dialogRef.current?.close();
        setDialogVisible(false);
      }
      return;
    }
    const pair = Array.from(new Set(raw.split(","))).filter((id) => known.has(id));
    if (!dialogRef.current?.open) {
      directComparisonRef.current = true;
      dialogRef.current?.showModal();
      setDialogVisible(true);
      triggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      scrollYRef.current = window.scrollY;
    }
    setDialogMode("compare");
    if (pair.length === 2 && pair.length === raw.split(",").length) {
      setCompareIds(pair);
      setMessage("");
    } else {
      setCompareIds([]);
      setSelected(pair);
      setDialogMode("saved");
      setMessage("That comparison link has an unknown or repeated project. Choose two saved projects to make a new comparison.");
    }
  }, [known]);

  useEffect(() => {
    const openSaved = () => {
      setMessage(""); setDialogMode("saved"); setSelected([]);
      triggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      scrollYRef.current = window.scrollY;
      if (!dialogRef.current?.open) dialogRef.current?.showModal();
      setDialogVisible(true);
    };
    window.addEventListener("portfolio:saved-open", openSaved);
    window.addEventListener("popstate", syncFromUrl);
    window.addEventListener("portfolio:compare-location", syncFromUrl);
    syncFromUrl();
    return () => {
      window.removeEventListener("portfolio:saved-open", openSaved);
      window.removeEventListener("popstate", syncFromUrl);
      window.removeEventListener("portfolio:compare-location", syncFromUrl);
    };
  }, [syncFromUrl]);

  useEffect(() => {
    if (!dialogVisible) return;
    const root = document.documentElement;
    const body = document.body;
    const oldRoot = root.style.overflow;
    const oldBody = body.style.overflow;
    root.style.overflow = "hidden";
    body.style.overflow = "hidden";
    return () => {
      root.style.overflow = oldRoot;
      body.style.overflow = oldBody;
      window.scrollTo({ top: scrollYRef.current, behavior: "instant" });
      if (triggerRef.current?.isConnected) triggerRef.current.focus({ preventScroll: true });
    };
  }, [dialogVisible]);

  const openComparison = (pair: string[]) => {
    if (pair.length !== 2 || pair.some((id) => !known.has(id))) return;
    const url = new URL(window.location.href);
    url.searchParams.set("compare", pair.join(","));
    window.history.pushState({ ...window.history.state, portfolioCompare: true }, "", url);
    openedByHistoryRef.current = true;
    directComparisonRef.current = false;
    closeAfterPopRef.current = false;
    setCompareIds(pair);
    setDialogMode("compare");
    setMessage("");
    if (!dialogRef.current?.open) {
      triggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      scrollYRef.current = window.scrollY;
      dialogRef.current?.showModal();
      setDialogVisible(true);
    }
  };

  const close = () => {
    if (openedByHistoryRef.current) {
      closeAfterPopRef.current = true;
      window.history.back();
    } else {
      const url = new URL(window.location.href);
      url.searchParams.delete("compare");
      window.history.replaceState(window.history.state, "", url);
      openedByHistoryRef.current = false;
      directComparisonRef.current = false;
      dialogRef.current?.close();
      setDialogVisible(false);
    }
  };

  const removeFromComparison = (id: string) => {
    const project = known.get(id);
    const url = new URL(window.location.href);
    url.searchParams.delete("compare");
    window.history.replaceState(window.history.state, "", url);
    openedByHistoryRef.current = false;
    directComparisonRef.current = false;
    closeAfterPopRef.current = false;
    setCompareIds([]);
    setSelected((current) => current.filter((entry) => entry !== id));
    setDialogMode("saved");
    setMessage(`${project?.title ?? "Project"} removed from this comparison.`);
    window.dispatchEvent(new Event("portfolio:compare-location"));
  };

  const copyPair = async () => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("compare", compareIds.join(","));
      await navigator.clipboard.writeText(url.toString());
      setMessage("Comparison link copied.");
    } catch { setMessage("Copy is unavailable here. You can copy the address bar link instead."); }
  };

  const value = useMemo(() => ({ ids, toggleSaved, isSaved }), [ids, toggleSaved, isSaved]);

  return <SavedContext.Provider value={value}>{children}
    <dialog ref={dialogRef} className="saved-projects-dialog" aria-label={dialogMode === "compare" ? "Project comparison" : "Saved projects"} onCancel={(event) => { event.preventDefault(); close(); }} onClick={(event) => { if (event.target === event.currentTarget) close(); }}>
      <header className="saved-projects-dialog__header"><div><p>{dialogMode === "compare" ? "Side by side" : "Your observatory"}</p><h2>{dialogMode === "compare" ? "Compare projects" : "Saved projects"}</h2></div><button type="button" aria-label="Close saved projects" onClick={close}><X size={18} /></button></header>
      <div className="saved-projects-dialog__body">
        {storageUnavailable && <p className="saved-projects-dialog__notice" role="status">Browser storage is unavailable; saves will last for this visit only.</p>}
        {message && <p className="saved-projects-dialog__notice" role="status">{message}</p>}
        {dialogMode === "saved" && <>
          {savedProjects.length ? <>
            <p className="saved-projects-dialog__intro">Choose two saved projects to compare their purpose, workflow, and engineering decisions.</p>
            <div className="saved-projects-list">{savedProjects.map((project) => <article key={project.slug}>
              <label><input type="checkbox" checked={selected.includes(project.slug)} disabled={!selected.includes(project.slug) && selected.length >= 2} onChange={() => setSelected((current) => current.includes(project.slug) ? current.filter((id) => id !== project.slug) : [...current, project.slug])} /><span><strong>{project.title}</strong><small>{project.status}</small></span></label>
              <button type="button" aria-label={`Remove ${project.title} from saved projects`} onClick={() => { toggleSaved(project.slug); setSelected((current) => current.filter((id) => id !== project.slug)); }}><Trash2 size={15} /></button>
            </article>)}</div>
            <div className="saved-projects-dialog__actions"><button type="button" className="saved-projects-dialog__primary" disabled={selected.length !== 2} onClick={() => openComparison(selected)}>Compare selected <span>({selected.length}/2)</span></button><button type="button" className="saved-projects-dialog__quiet" onClick={() => { setIds([]); setSelected([]); }}>Clear all</button></div>
          </> : <div className="saved-projects-empty"><Heart size={20} /><h3>Save a project to start a collection</h3><p>Use “Save project” on any featured or additional project. Your choices stay in this browser.</p></div>}
        </>}
        {dialogMode === "compare" && compareIds.length === 2 && compareIds.every((id) => known.has(id)) && <>
          <div className="comparison-projects">{compareIds.map((id) => { const project = known.get(id)!; return <article key={id}><div><p>{project.status}</p><h3>{project.title}</h3></div><button type="button" onClick={() => removeFromComparison(id)} aria-label={`Remove ${project.title} from comparison`}><Trash2 size={15} /></button></article>; })}</div>
          <div className="comparison-table">
            {([
              ["Audience and problem", (project: PortfolioProject) => project.caseStudy.problem],
              ["My contribution", (project: PortfolioProject) => project.caseStudy.contribution],
              ["Main workflow", (project: PortfolioProject) => project.workflow.join(" → ") || "No workflow provided."],
              ["Architecture and decisions", (project: PortfolioProject) => [project.architecture?.summary, ...project.caseStudy.decisions].filter(Boolean).join(" ")],
              ["Status and limitations", (project: PortfolioProject) => `${project.status} ${project.caseStudy.limitations.join(" ")}`],
              ["Available links", (project: PortfolioProject) => project.links.length ? project.links.map((link) => link.type).join(", ") : "No public demo, repository, or case study link."],
            ] as const).map(([label, getText]) => <section key={label}><h4>{label}</h4><div>{compareIds.map((id) => { const project = known.get(id)!; return <article key={id}><h5>{project.title}</h5><p>{getText(project)}</p>{label === "Available links" && <div className="comparison-links">{project.links.map((link) => <a key={link.href} href={link.href} target={link.href.startsWith("http") ? "_blank" : undefined} rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}>{link.type}</a>)}</div>}</article>; })}</div></section>)}
          </div>
          <div className="saved-projects-dialog__actions"><button type="button" className="saved-projects-dialog__primary" onClick={copyPair}><Copy size={15} /> Copy comparison link</button><button type="button" className="saved-projects-dialog__quiet" onClick={() => { const url = new URL(window.location.href); url.searchParams.delete("compare"); window.history.replaceState(window.history.state, "", url); openedByHistoryRef.current = false; setDialogMode("saved"); setCompareIds([]); setMessage(""); }}>Back to saved</button></div>
        </>}
      </div>
    </dialog>
  </SavedContext.Provider>;
}

export function SaveProjectButton({ id, title, className = "" }: { id: string; title: string; className?: string }) {
  const { isSaved, toggleSaved } = useSavedProjects();
  const saved = isSaved(id);
  return <button type="button" className={`save-project-button ${className}`} aria-pressed={saved} aria-label={`${saved ? "Remove saved project" : "Save project"}: ${title}`} onClick={(event) => { event.stopPropagation(); toggleSaved(id); }}><span className="save-project-button__icon" aria-hidden="true">{saved ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}</span><span>{saved ? "Saved" : "Save project"}</span></button>;
}
