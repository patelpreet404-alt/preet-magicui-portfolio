import { ViewTransition } from "react";

/**
 * Directional page transition. Wrap each page's root in this (not the layout: layouts persist, so
 * enter/exit never fire there). Untyped navigations (browser back/forward, refresh) don't animate.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const types = { "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" } as const;
  return (
    <ViewTransition enter={types} exit={types} default="none">
      {children}
    </ViewTransition>
  );
}
