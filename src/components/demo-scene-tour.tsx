"use client";

import { ChevronDown, ChevronUp, Pause, Play, Video } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

function getSceneTargets() {
  const desktop = window.matchMedia("(min-width: 1024px)").matches;
  return Array.from(document.querySelectorAll<HTMLElement>("[data-demo-scene]"))
    .map((target, index) => {
      const order = Number(target.dataset[desktop ? "demoOrderDesktop" : "demoOrderMobile"]);
      return { target, index, order: Number.isFinite(order) ? order : index };
    })
    .sort((left, right) => left.order - right.order || left.index - right.index)
    .map(({ target }) => target);
}

export function DemoSceneTour() {
  const [scenes, setScenes] = useState<string[]>([]);
  const [activeScene, setActiveScene] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [direction, setDirection] = useState(1);
  const playingRef = useRef(false);
  const programmaticScrollRef = useRef(false);
  const scrollLockTimerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const targets = getSceneTargets();
    const labels = targets.map((target, index) => {
      target.dataset.demoSceneIndex = String(index);
      return target.dataset.demoScene || `Scene ${index + 1}`;
    });
    let frame = 0;
    const sceneFrame = requestAnimationFrame(() => setScenes(labels));

    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => setReducedMotion(motionPreference.matches);
    updateMotionPreference();
    motionPreference.addEventListener("change", updateMotionPreference);

    const updateSceneFromScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (playingRef.current || programmaticScrollRef.current) return;
        const currentTargets = getSceneTargets();
        const marker = 120;
        let nearestIndex = 0;
        let nearestDistance = Number.POSITIVE_INFINITY;
        currentTargets.forEach((target, index) => {
          const bounds = target.getBoundingClientRect();
          if (bounds.bottom < marker) return;
          const distance = Math.abs(bounds.top - marker);
          if (distance < nearestDistance) {
            nearestDistance = distance;
            nearestIndex = index;
          }
        });
        setActiveScene(nearestIndex);
      });
    };

    const updateSceneOrderForViewport = () => {
      const currentTargets = getSceneTargets();
      programmaticScrollRef.current = false;
      const nextLabels = currentTargets.map((target, index) => {
        target.dataset.demoSceneIndex = String(index);
        return target.dataset.demoScene || `Scene ${index + 1}`;
      });
      setScenes(nextLabels);
      updateSceneFromScroll();
    };

    const stopTourForManualScroll = (event: Event) => {
      const target = event.target;
      if (target instanceof Element && target.closest("[data-demo-scene-controller]")) return;
      programmaticScrollRef.current = false;
      if (scrollLockTimerRef.current !== undefined) window.clearTimeout(scrollLockTimerRef.current);
      setPlaying(false);
    };
    window.addEventListener("scroll", updateSceneFromScroll, { passive: true });
    window.addEventListener("resize", updateSceneOrderForViewport, { passive: true });
    window.addEventListener("wheel", stopTourForManualScroll, { passive: true });
    window.addEventListener("touchstart", stopTourForManualScroll, { passive: true });
    window.addEventListener("pointerdown", stopTourForManualScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(sceneFrame);
      if (scrollLockTimerRef.current !== undefined) window.clearTimeout(scrollLockTimerRef.current);
      motionPreference.removeEventListener("change", updateMotionPreference);
      window.removeEventListener("scroll", updateSceneFromScroll);
      window.removeEventListener("resize", updateSceneOrderForViewport);
      window.removeEventListener("wheel", stopTourForManualScroll);
      window.removeEventListener("touchstart", stopTourForManualScroll);
      window.removeEventListener("pointerdown", stopTourForManualScroll);
    };
  }, []);

  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  const goToScene = useCallback((nextIndex: number) => {
    const targets = getSceneTargets();
    if (!targets.length) return;
    const boundedIndex = Math.max(0, Math.min(nextIndex, targets.length - 1));
    programmaticScrollRef.current = true;
    if (scrollLockTimerRef.current !== undefined) window.clearTimeout(scrollLockTimerRef.current);
    scrollLockTimerRef.current = window.setTimeout(() => {
      programmaticScrollRef.current = false;
    }, 900);
    setActiveScene(boundedIndex);
    targets[boundedIndex]?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
  }, [reducedMotion]);

  useEffect(() => {
    if (!playing || scenes.length < 2) return;
    const timer = window.setTimeout(() => {
      let nextDirection = direction;
      let nextIndex = activeScene + direction;
      if (nextIndex >= scenes.length) {
        nextDirection = -1;
        nextIndex = scenes.length - 2;
      } else if (nextIndex < 0) {
        nextDirection = 1;
        nextIndex = 1;
      }
      setDirection(nextDirection);
      goToScene(nextIndex);
    }, 4400);
    return () => window.clearTimeout(timer);
  }, [activeScene, direction, goToScene, playing, scenes.length]);

  if (scenes.length < 2) return null;

  function toggleTour() {
    if (playing) {
      setPlaying(false);
      return;
    }
    if (reducedMotion) return;
    setDirection(1);
    setPlaying(true);
    goToScene(0);
  }

  function stepScene(offset: number) {
    setPlaying(false);
    setDirection(1);
    goToScene(activeScene + offset);
  }

  return (
    <aside className="demo-scene-controller fixed inset-x-0 z-[70] mx-auto w-[min(94vw,430px)] px-1" style={{ bottom: "max(1rem, env(safe-area-inset-bottom))" }} aria-label="Video recording scene controls" data-demo-scene-controller>
      <div className="flex items-center gap-2 rounded-2xl border border-border/80 bg-background/95 p-2 text-foreground shadow-[0_18px_55px_-20px_rgba(15,15,20,0.38)] backdrop-blur-md">
        <button type="button" onClick={() => stepScene(-1)} disabled={activeScene === 0} className="demo-scene-control-button grid size-10 shrink-0 place-items-center rounded-xl border border-border bg-card text-muted-foreground disabled:opacity-35" aria-label="Scroll to previous scene" title="Previous scene">
          <ChevronUp className="size-4" aria-hidden="true" />
        </button>
        <div className="min-w-0 flex-1 px-1" aria-live="polite" aria-atomic="true">
          <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground"><Video className="size-3" aria-hidden="true" />{playing ? "Camera tour running" : "Video scene"}</p>
          <p className="truncate text-xs font-semibold">{scenes[activeScene] || "Project overview"} <span className="font-normal text-muted-foreground">· {activeScene + 1}/{scenes.length}</span></p>
        </div>
        <button type="button" onClick={toggleTour} disabled={reducedMotion && !playing} className="demo-scene-control-button inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-xl bg-foreground px-3 text-xs font-semibold text-background disabled:cursor-not-allowed disabled:opacity-55" aria-label={playing ? "Pause camera tour" : reducedMotion ? "Camera tour disabled by reduced motion preference" : "Play camera tour"} title={reducedMotion ? "Automatic movement is off because reduced motion is enabled" : "Play the scrolling camera tour"}>
          {playing ? <Pause className="size-3.5" aria-hidden="true" /> : <Play className="size-3.5" aria-hidden="true" />}
          {playing ? "Pause" : reducedMotion ? "Motion off" : "Play tour"}
        </button>
        <button type="button" onClick={() => stepScene(1)} disabled={activeScene === scenes.length - 1} className="demo-scene-control-button grid size-10 shrink-0 place-items-center rounded-xl border border-border bg-card text-muted-foreground disabled:opacity-35" aria-label="Scroll to next scene" title="Next scene">
          <ChevronDown className="size-4" aria-hidden="true" />
        </button>
      </div>
    </aside>
  );
}
