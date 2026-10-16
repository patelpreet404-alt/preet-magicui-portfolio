"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

export function ProjectMarquee({ children }: { children: ReactNode }) {
  const regionRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const [userPaused, setUserPaused] = useState(false);
  const [pointerInside, setPointerInside] = useState(false);
  const [focusInside, setFocusInside] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [touchBrowsing, setTouchBrowsing] = useState(false);
  const [touchPlaying, setTouchPlaying] = useState(false);
  const [touchPlaybackUsed, setTouchPlaybackUsed] = useState(false);
  const inputModeRef = useRef<"keyboard" | "pointer">("pointer");
  const paused = detailOpen || reducedMotion || (touchBrowsing
    ? !touchPlaying || focusInside
    : userPaused || pointerInside || focusInside);
  const pausedRef = useRef(paused);
  useEffect(() => { pausedRef.current = paused; }, [paused]);

  useEffect(() => {
    const markKeyboardInput = () => { inputModeRef.current = "keyboard"; };
    const markPointerInput = () => { inputModeRef.current = "pointer"; };
    window.addEventListener("keydown", markKeyboardInput, true);
    window.addEventListener("pointerdown", markPointerInput, true);
    return () => {
      window.removeEventListener("keydown", markKeyboardInput, true);
      window.removeEventListener("pointerdown", markPointerInput, true);
    };
  }, []);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const touchQuery = window.matchMedia("(hover: none), (pointer: coarse), (max-width: 900px)");
    const updateEnvironment = () => {
      const preference = document.documentElement.dataset.reducedMotion;
      setReducedMotion(preference === undefined ? motionQuery.matches : preference === "true");
      setTouchBrowsing(touchQuery.matches);
      setDetailOpen(Boolean(document.querySelector("dialog[open], [data-project-details-open=\"true\"]")));
    };
    updateEnvironment();
    motionQuery.addEventListener("change", updateEnvironment);
    touchQuery.addEventListener("change", updateEnvironment);
    const observer = new MutationObserver(updateEnvironment);
    observer.observe(document.documentElement, {
      subtree: true,
      attributes: true,
      attributeFilter: ["open", "data-reduced-motion", "data-project-details-open"]
    });
    return () => {
      observer.disconnect();
      motionQuery.removeEventListener("change", updateEnvironment);
      touchQuery.removeEventListener("change", updateEnvironment);
    };
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = viewport?.querySelector<HTMLElement>(".project-marquee__track");
    const group = track?.querySelector<HTMLElement>(".project-marquee__group");
    if (!viewport || !track || !group) return;
    let frame = 0;
    let previousTime = 0;
    const nativeBrowsing = touchBrowsing || reducedMotion;
    if (nativeBrowsing) {
      track.style.transform = "";
      viewport.scrollLeft = offsetRef.current;
      if (reducedMotion) return;
    } else {
      viewport.scrollLeft = 0;
    }
    const tick = (time: number) => {
      if (previousTime && !pausedRef.current && group.offsetWidth) {
        offsetRef.current = (offsetRef.current + Math.min(time - previousTime, 50) * 0.026) % group.offsetWidth;
      }
      previousTime = time;
      if (touchBrowsing) {
        if (!pausedRef.current) viewport.scrollLeft = offsetRef.current;
      } else {
        track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [touchBrowsing, reducedMotion, touchPlaying]);

  const browse = (direction: number) => {
    const viewport = viewportRef.current;
    const track = viewport?.querySelector<HTMLElement>(".project-marquee__track");
    const group = track?.querySelector<HTMLElement>(".project-marquee__group");
    const item = group?.querySelector<HTMLElement>(".project-marquee__item");
    if (!viewport || !track || !group || !item) return;
    const distance = item.offsetWidth + 16;
    if (touchBrowsing || reducedMotion) {
      const width = group.offsetWidth;
      const next = (viewport.scrollLeft % width + direction * distance + width) % width;
      offsetRef.current = next;
      viewport.scrollTo({ left: next, behavior: reducedMotion ? "instant" : "smooth" });
      return;
    }
    offsetRef.current = (offsetRef.current + direction * distance + group.offsetWidth) % group.offsetWidth;
    track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
  };

  return (
    <div
      ref={regionRef}
      className="project-marquee"
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured projects"
      data-native-browsing={touchBrowsing || reducedMotion}
      data-paused={paused}
      data-touch-playback-used={touchBrowsing && touchPlaybackUsed}
      onPointerEnter={(event) => {
        if (event.pointerType !== "touch") {
          pausedRef.current = true;
          setPointerInside(true);
        }
      }}
      onPointerLeave={() => setPointerInside(false)}
      onFocusCapture={() => {
        if (inputModeRef.current === "keyboard") {
          pausedRef.current = true;
          setFocusInside(true);
        }
      }}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocusInside(false);
      }}
    >
      <div className="project-marquee__controls" aria-label="Carousel controls">
        <span className="project-marquee__state" aria-live="polite">
          {reducedMotion ? "Motion reduced" : touchBrowsing ? "Swipe to explore" : paused ? "Paused" : "Auto-playing"}
        </span>
        <button type="button" onClick={() => browse(-1)} aria-label="Previous project"><ChevronLeft size={17} /></button>
        <button
          type="button"
          onClick={() => {
            if (touchBrowsing) {
              const willPlay = !touchPlaying;
              if (willPlay) setTouchPlaybackUsed(true);
              setTouchPlaying(willPlay);
              if (willPlay && inputModeRef.current === "keyboard") setFocusInside(false);
            } else {
              const willPlay = userPaused;
              setUserPaused((value) => !value);
              if (willPlay && inputModeRef.current === "keyboard") setFocusInside(false);
            }
          }}
          aria-label={reducedMotion ? "Automatic movement disabled by reduced motion" : (touchBrowsing ? touchPlaying : !userPaused) ? "Pause carousel" : "Play carousel"}
          aria-pressed={reducedMotion ? undefined : (touchBrowsing ? touchPlaying : !userPaused)}
          disabled={reducedMotion}
          title={reducedMotion ? "Turn off Reduce motion to play the carousel" : undefined}
        >
          {reducedMotion || (touchBrowsing ? !touchPlaying : userPaused) ? <Play size={15} /> : <Pause size={15} />}
          <span>{reducedMotion ? "Motion reduced" : (touchBrowsing ? !touchPlaying : userPaused) ? "Play" : "Pause"}</span>
        </button>
        <button type="button" onClick={() => browse(1)} aria-label="Next project"><ChevronRight size={17} /></button>
      </div>
      <div
        ref={viewportRef}
        className="project-marquee__viewport"
        onScroll={(event) => {
          if (touchBrowsing || reducedMotion) {
            const track = event.currentTarget.querySelector<HTMLElement>(".project-marquee__track");
            const width = track?.querySelector<HTMLElement>(".project-marquee__group")?.offsetWidth ?? 0;
            if (touchBrowsing && width && event.currentTarget.scrollLeft >= width) {
              event.currentTarget.scrollLeft %= width;
            }
            offsetRef.current = event.currentTarget.scrollLeft;
          }
        }}
      >{children}</div>
    </div>
  );
}
