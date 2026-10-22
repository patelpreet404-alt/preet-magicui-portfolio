"use client";

import { useEffect } from "react";
import { useMotionSettings } from "@/components/motion-settings";

const FINE_POINTER = "(hover: hover) and (pointer: fine)";

/**
 * Lenis smooth scrolling. Off for reduced motion (OS or manual toggle) and on touch devices, where
 * native scrolling is better. Loaded after the page is idle so it never competes with first paint.
 * In-page anchor links (#work, /#about, ...) scroll through Lenis too, below the sticky header.
 */
export function SmoothScroll() {
  const { reducedMotion } = useMotionSettings();

  useEffect(() => {
    if (reducedMotion || !window.matchMedia(FINE_POINTER).matches) return;

    let destroyed = false;
    let cleanup: (() => void) | undefined;

    const start = async () => {
      const { default: Lenis } = await import("lenis");
      if (destroyed) return;
      const lenis = new Lenis({
        autoRaf: true,
        lerp: 0.12,
        // Menus, dialogs and scrollable regions keep their native scrolling.
        prevent: (node) => Boolean(node.closest("dialog, [data-lenis-prevent]")),
      });
      document.documentElement.classList.add("lenis", "lenis-smooth");

      const onClick = (event: MouseEvent) => {
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        const anchor = (event.target as Element | null)?.closest?.("a[href]");
        if (!anchor) return;
        const url = new URL((anchor as HTMLAnchorElement).href, window.location.href);
        if (url.origin !== window.location.origin || url.pathname !== window.location.pathname || !url.hash) return;
        const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
        if (!target) return;
        event.preventDefault();
        const headerHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) * 16 || 64;
        lenis.scrollTo(target, { offset: -(headerHeight + 16) });
        window.history.pushState(null, "", url.hash);
      };
      document.addEventListener("click", onClick);

      cleanup = () => {
        document.removeEventListener("click", onClick);
        document.documentElement.classList.remove("lenis", "lenis-smooth", "lenis-scrolling");
        lenis.destroy();
      };
    };

    const idle = window.requestIdleCallback ?? ((callback: () => void) => window.setTimeout(callback, 200));
    const handle = idle(() => void start());

    return () => {
      destroyed = true;
      if (typeof handle === "number") (window.cancelIdleCallback ?? window.clearTimeout)(handle);
      cleanup?.();
    };
  }, [reducedMotion]);

  return null;
}
