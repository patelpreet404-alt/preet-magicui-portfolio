"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import type { Citation } from "@/content";
import { NoteContent } from "./note-content";

interface OpenNote {
  id: string;
  n: number;
  citation: Citation;
  marker: HTMLButtonElement;
}

interface RegionContext {
  placement: "inline" | "margin";
  open: readonly OpenNote[];
  toggle: (note: OpenNote) => void;
  close: (id: string, refocus?: boolean) => void;
}

const Region = createContext<RegionContext | null>(null);

function useRegion() {
  const region = useContext(Region);
  if (!region) throw new Error("Citations must be rendered inside a <CiteRegion>");
  return region;
}

const MARGIN_QUERY = "(min-width: 1100px)";

function useWide() {
  return useSyncExternalStore(
    (onChange) => {
      const media = window.matchMedia(MARGIN_QUERY);
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    },
    () => window.matchMedia(MARGIN_QUERY).matches,
    () => false,
  );
}

/**
 * Owns which notes are open for the citations inside it. `margin` regions show notes in the right-hand
 * margin column at 1100px and wider (see <CiteNotes variant="margin">) and as an inline disclosure
 * below the paragraph otherwise; `inline` regions always use the inline disclosure.
 * Renders no DOM of its own.
 */
export function CiteRegion({ mode, children }: { mode: "inline" | "margin"; children: React.ReactNode }) {
  const wide = useWide();
  const placement: RegionContext["placement"] = mode === "margin" && wide ? "margin" : "inline";
  const [open, setOpen] = useState<readonly OpenNote[]>([]);

  const close = useCallback((id: string, refocus = false) => {
    setOpen((current) => {
      const note = current.find((item) => item.id === id);
      if (note && refocus) note.marker.focus();
      return current.filter((item) => item.id !== id);
    });
  }, []);

  const toggle = useCallback((note: OpenNote) => {
    setOpen((current) => (current.some((item) => item.id === note.id) ? current.filter((item) => item.id !== note.id) : [...current, note]));
  }, []);

  // Esc closes the most recently opened note and returns focus to its marker.
  useEffect(() => {
    if (open.length === 0) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close(open[open.length - 1].id, true);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, close]);

  const value = useMemo(() => ({ placement, open, toggle, close }), [placement, open, toggle, close]);
  return <Region.Provider value={value}>{children}</Region.Provider>;
}

/** The numbered [n] button after a cited phrase. */
export function CiteMarker({ n, citation }: { n: number; citation: Citation }) {
  const { placement, open, toggle } = useRegion();
  const ref = useRef<HTMLButtonElement>(null);
  const expanded = open.some((item) => item.id === citation.id);

  return (
    <button
      ref={ref}
      type="button"
      className="cite-marker"
      aria-expanded={expanded}
      aria-controls={`cite-note-${citation.id}-${placement}`}
      onClick={() => {
        if (ref.current) toggle({ id: citation.id, n, citation, marker: ref.current });
      }}
    >
      [{n}]<span className="sr-only"> evidence: {citation.claim}</span>
    </button>
  );
}

/**
 * Where open notes appear. Place `variant="inline"` right after the paragraph and `variant="margin"`
 * in the margin column; only the one that matches the current placement renders.
 */
export function CiteNotes({ variant, className = "" }: { variant: "inline" | "margin"; className?: string }) {
  const { placement, open, close } = useRegion();
  const containerRef = useRef<HTMLDivElement>(null);
  const items = useRef(new Map<string, HTMLElement>());
  const [layout, setLayout] = useState<{ tops: Record<string, number>; height: number }>({ tops: {}, height: 0 });
  const active = variant === placement;

  // Margin layout: align each note with its marker, then push down so notes never overlap.
  useLayoutEffect(() => {
    if (!active || variant !== "margin") return;
    const container = containerRef.current;
    if (!container) return;
    const compute = () => {
      const containerTop = container.getBoundingClientRect().top;
      const sorted = [...open].sort((a, b) => a.marker.getBoundingClientRect().top - b.marker.getBoundingClientRect().top);
      const tops: Record<string, number> = {};
      let cursor = 0;
      for (const note of sorted) {
        const height = items.current.get(note.id)?.offsetHeight ?? 0;
        const top = Math.max(note.marker.getBoundingClientRect().top - containerTop, cursor, 0);
        tops[note.id] = top;
        cursor = top + height + 16;
      }
      setLayout({ tops, height: Math.max(cursor - 16, 0) });
    };
    compute();
    const observer = new ResizeObserver(compute);
    observer.observe(container);
    items.current.forEach((element) => observer.observe(element));
    window.addEventListener("resize", compute);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", compute);
    };
  }, [open, active, variant]);

  if (!active) return null;

  const live = { "aria-live": "polite" as const };

  if (variant === "inline") {
    return (
      <div ref={containerRef} className={className} {...live}>
        {open.map((note) => (
          <aside
            key={note.id}
            id={`cite-note-${note.id}-inline`}
            aria-label={`Citation ${note.n}`}
            className="note-in mt-4 border-l border-rule pl-4"
          >
            <NoteContent n={note.n} citation={note.citation} onClose={() => close(note.id, true)} />
          </aside>
        ))}
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`relative ${className}`} style={{ height: layout.height || undefined }} {...live}>
      {open.map((note) => (
        <aside
          key={note.id}
          ref={(element) => {
            if (element) items.current.set(note.id, element);
            else items.current.delete(note.id);
          }}
          id={`cite-note-${note.id}-margin`}
          aria-label={`Citation ${note.n}`}
          className="note-in absolute inset-x-0 border-l border-rule pl-4"
          style={{ top: layout.tops[note.id] ?? 0, visibility: note.id in layout.tops ? "visible" : "hidden" }}
        >
          <NoteContent n={note.n} citation={note.citation} onClose={() => close(note.id, true)} />
        </aside>
      ))}
    </div>
  );
}
