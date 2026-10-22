"use client";

import Image from "next/image";
import Link from "next/link";
import { ViewTransition, useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { useMotionSettings } from "@/components/motion-settings";
import type { ProjectMedia } from "@/content";

/**
 * The 16:10 media frame of a Selected work row. A video plays muted and looped only while the frame
 * is hovered, focused, or at least 60% in view; otherwise (and always under reduced motion) the
 * poster shows. A visible Play/Pause button lets anyone control it.
 */
/** Autoplaying a ~6 MB video is wrong on a data-saver or slow connection; the Play button still works. */
function constrainedConnection() {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  return Boolean(connection?.saveData) || ["slow-2g", "2g", "3g"].includes(connection?.effectiveType ?? "");
}

export function WorkMedia({ slug, name, media }: { slug: string; name: string; media: ProjectMedia }) {
  const { reducedMotion } = useMotionSettings();
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [inView, setInView] = useState(false);
  const [manual, setManual] = useState<"play" | "pause" | null>(null);
  const [playing, setPlaying] = useState(false);
  const [constrained] = useState(() => typeof navigator !== "undefined" && constrainedConnection());

  const hasVideo = Boolean(media.video);
  const auto = !reducedMotion && !constrained && (hovered || focused || inView);
  const shouldPlay = manual === "pause" ? false : manual === "play" ? true : auto;

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || !hasVideo) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.intersectionRatio >= 0.6), { threshold: [0, 0.6, 1] });
    observer.observe(frame);
    return () => observer.disconnect();
  }, [hasVideo]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (shouldPlay) video.play().catch(() => undefined);
    else video.pause();
  }, [shouldPlay]);

  return (
    <ViewTransition name={`work-media-${slug}`} share="morph" default="none">
    <div
      ref={frameRef}
      data-work-media={slug}
      className="t-base relative aspect-[16/10] overflow-hidden rounded-media border border-rule bg-muted transition-colors hover:border-graphite focus-within:border-ink"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      <Link href={`/work/${slug}`} transitionTypes={["nav-forward"]} tabIndex={-1} aria-hidden="true" className="absolute inset-0 block">
        <Image
          src={media.poster}
          alt={media.alt}
          fill
          sizes="(min-width: 1320px) 860px, (min-width: 1024px) 64vw, 100vw"
          className="object-cover object-top"
        />
        {hasVideo && (
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
            className="absolute inset-0 size-full object-cover object-top t-base transition-opacity"
            style={{ opacity: playing ? 1 : 0 }}
            onPlaying={() => setPlaying(true)}
          >
            <source src={media.video} type="video/mp4" />
          </video>
        )}
      </Link>

      {hasVideo && (
        <button
          type="button"
          aria-pressed={shouldPlay}
          onClick={() => setManual(shouldPlay ? "pause" : "play")}
          className="type-meta absolute bottom-3 left-3 inline-flex min-h-11 items-center gap-2 rounded-control border border-rule bg-paper px-3 text-ink t-fast transition-colors hover:border-ink"
        >
          {shouldPlay ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
          {shouldPlay ? "Pause preview" : "Play preview"}
          <span className="sr-only"> of {name}</span>
        </button>
      )}
    </div>
    </ViewTransition>
  );
}
