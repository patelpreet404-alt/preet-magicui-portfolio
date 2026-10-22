"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Play } from "lucide-react";
import type { ProjectMedia } from "@/content";

/**
 * Case-study hero media. The poster is a next/image (it is the page's LCP element); a video only loads
 * and plays when the visitor asks for it, with native controls. Nothing autoplays.
 */
export function CaseMedia({ name, media }: { name: string; media: ProjectMedia }) {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div className="relative size-full">
      <Image
        src={media.poster}
        alt={media.alt}
        fill
        sizes="(min-width: 1320px) 1320px, 100vw"
        className="object-cover object-top"
      />
      {media.video && !playing && (
        <button
          type="button"
          onClick={() => {
            setPlaying(true);
            // The video mounts on the next render; play it as soon as it exists.
            window.requestAnimationFrame(() => void videoRef.current?.play().catch(() => undefined));
          }}
          className="type-meta press t-fast absolute bottom-4 left-4 inline-flex min-h-11 items-center gap-2 rounded-control border border-rule bg-paper px-4 text-ink transition-colors hover:border-ink"
        >
          <Play className="size-4" aria-hidden="true" />
          Play demo video
          <span className="sr-only"> of {name}</span>
        </button>
      )}
      {media.video && playing && (
        <video
          ref={videoRef}
          controls
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
          aria-label={`${name} demo video`}
          className="absolute inset-0 size-full bg-muted object-cover object-top"
        >
          <source src={media.video} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
