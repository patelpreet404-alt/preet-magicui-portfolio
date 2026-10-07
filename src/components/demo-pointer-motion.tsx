"use client";

import { useEffect, useRef } from "react";

export function DemoPointerMotion() {
  const anchor = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = anchor.current?.closest<HTMLElement>(".demo-motion-root");
    if (!root) return;

    const motion = window.matchMedia("(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    const panels = [
      ...(root.matches("[data-demo-depth]") ? [root] : []),
      ...Array.from(root.querySelectorAll<HTMLElement>("[data-demo-depth]")),
    ];
    const frames = new Map<HTMLElement, number>();
    const scrollRegion = root.querySelector<HTMLElement>("[data-demo-scroll-region]");
    const visibility = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const panel = entry.target as HTMLElement;
        panel.dataset.demoVisible = String(entry.isIntersecting);
      });
    }, { root: scrollRegion, threshold: 0.18 });
    panels.forEach((panel, index) => {
      panel.style.setProperty("--demo-reveal-delay", `${(index % 4) * 110}ms`);
      visibility.observe(panel);
    });

    function reset(panel: HTMLElement) {
      const frame = frames.get(panel);
      if (frame !== undefined) cancelAnimationFrame(frame);
      frames.delete(panel);
      panel.dataset.demoPointerActive = "false";
      panel.style.setProperty("--demo-tilt-x", "0deg");
      panel.style.setProperty("--demo-tilt-y", "0deg");
      panel.style.setProperty("--demo-shift-x", "0px");
      panel.style.setProperty("--demo-shift-y", "0px");
      panel.style.setProperty("--demo-glow-x", "50%");
      panel.style.setProperty("--demo-glow-y", "50%");
    }

    const cleanups = panels.map((panel) => {
      const move = (event: PointerEvent) => {
        if (!motion.matches || event.pointerType !== "mouse") return;
        const rect = panel.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
        const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
        const previous = frames.get(panel);
        if (previous !== undefined) cancelAnimationFrame(previous);
        frames.set(panel, requestAnimationFrame(() => {
          panel.dataset.demoPointerActive = "true";
          panel.style.setProperty("--demo-tilt-x", `${((0.5 - y) * 12).toFixed(2)}deg`);
          panel.style.setProperty("--demo-tilt-y", `${((x - 0.5) * 14).toFixed(2)}deg`);
          panel.style.setProperty("--demo-shift-x", `${((x - 0.5) * 20).toFixed(1)}px`);
          panel.style.setProperty("--demo-shift-y", `${((y - 0.5) * 18).toFixed(1)}px`);
          panel.style.setProperty("--demo-glow-x", `${(x * 100).toFixed(1)}%`);
          panel.style.setProperty("--demo-glow-y", `${(y * 100).toFixed(1)}%`);
        }));
      };
      const leave = () => reset(panel);
      panel.addEventListener("pointermove", move, { passive: true });
      panel.addEventListener("pointerleave", leave);
      return () => {
        panel.removeEventListener("pointermove", move);
        panel.removeEventListener("pointerleave", leave);
        reset(panel);
      };
    });

    const resetAll = () => panels.forEach(reset);
    motion.addEventListener("change", resetAll);
    return () => {
      motion.removeEventListener("change", resetAll);
      visibility.disconnect();
      cleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  return <span ref={anchor} hidden aria-hidden="true" />;
}
