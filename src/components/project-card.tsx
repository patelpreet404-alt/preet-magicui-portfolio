/* eslint-disable @next/next/no-img-element */
"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ArrowUpRight, MousePointer2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";

function ProjectImage({ src, alt }: { src: string; alt: string }) {
  const [imageError, setImageError] = useState(false);

  if (!src || imageError) {
    return <div className="h-full w-full bg-muted" />;
  }

  return (
    <img
      src={src}
      alt={alt}
      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover/card:scale-[1.025]"
      onError={() => setImageError(true)}
    />
  );
}

interface Props {
  title: string;
  href?: string;
  description: string;
  dates: string;
  tags: readonly string[];
  link?: string;
  image?: string;
  video?: string;
  links?: readonly {
    icon: React.ReactNode;
    type: string;
    href: string;
  }[];
  className?: string;
  variant?: number;
}

const previewFrames = [
  { background: "#f64d59", tag: "#f64d59" },
  {
    background: "linear-gradient(120deg, #f0d65c 0%, #f28db3 52%, #6478e8 100%)",
    tag: "#df8ab1",
  },
  { background: "#f5f5f4", tag: "#a6a6a6" },
  { background: "#ed9b58", tag: "#ed9b58" },
];

const fallbackStyles = [
  "from-rose-100 via-white to-rose-200 dark:from-rose-950 dark:via-zinc-950 dark:to-rose-900",
  "from-amber-100 via-white to-indigo-200 dark:from-amber-950 dark:via-zinc-950 dark:to-indigo-950",
  "from-zinc-100 via-white to-zinc-200 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-800",
  "from-orange-100 via-white to-rose-200 dark:from-orange-950 dark:via-zinc-950 dark:to-rose-950",
];

export function ProjectCard({
  title,
  href,
  description,
  dates,
  tags,
  link,
  image,
  video,
  links,
  className,
  variant = 0,
}: Props) {
  const previewRef = useRef<HTMLDivElement>(null);
  const [previewIsVisible, setPreviewIsVisible] = useState(false);
  const hrefIsExternal = Boolean(href?.startsWith("http"));
  const frame = previewFrames[variant % previewFrames.length];

  useEffect(() => {
    const preview = previewRef.current;
    if (!preview) return;

    if (!("IntersectionObserver" in window)) {
      return;
    }

    let intersects = false;
    const updateVisibility = () => setPreviewIsVisible(intersects && !document.hidden);
    const observer = new IntersectionObserver(
      ([entry]) => {
        intersects = entry.isIntersecting;
        updateVisibility();
      },
      { rootMargin: "80px" }
    );
    const handleVisibilityChange = () => updateVisibility();

    observer.observe(preview);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const cover = video ? (
    <video
      src={video}
      autoPlay
      loop
      muted
      playsInline
      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover/card:scale-[1.025]"
    />
  ) : image ? (
    <ProjectImage src={image} alt={title} />
  ) : (
    <div
      className={cn(
        "flex h-full w-full flex-col justify-between bg-linear-to-br p-5 text-foreground",
        fallbackStyles[variant % fallbackStyles.length]
      )}
    >
      <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
        Selected work · {String(variant + 1).padStart(2, "0")}
      </span>
      <span className="max-w-[85%] text-xl font-semibold tracking-tight">{title}</span>
    </div>
  );

  return (
    <article
      className={cn(
        "group/card flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:shadow-lg hover:ring-2 hover:ring-muted focus-within:ring-2 focus-within:ring-ring/60",
        className
      )}
    >
      <div className="relative shrink-0 p-[6px] pt-2" style={{ background: frame.background }}>
        <div
          ref={previewRef}
          className="project-preview relative aspect-video overflow-hidden rounded-t-[8px] bg-background"
        >
          {href ? (
            <Link
              href={href}
              target={hrefIsExternal ? "_blank" : undefined}
              rel={hrefIsExternal ? "noopener noreferrer" : undefined}
              className="absolute inset-0 block"
              aria-label={`Open ${title}`}
            >
              {cover}
            </Link>
          ) : (
            cover
          )}
          {variant < 3 && (
            <span
              className="project-preview-cursor-track"
              data-active={previewIsVisible}
              aria-hidden="true"
              style={{ animationDelay: `${-variant * 1.1}s` }}
            >
              <span className="project-preview-cursor">
                <span className="project-preview-cursor-pulse" />
                <MousePointer2 className="relative z-10 size-6 fill-white text-zinc-950 drop-shadow-[0_2px_3px_rgba(0,0,0,0.6)]" />
              </span>
            </span>
          )}
        </div>
        {links && links.length > 0 && (
          <div className="absolute right-2 top-2 z-20 flex flex-wrap gap-2">
            {links.map((projectLink, idx) => {
              const linkIsExternal = projectLink.href.startsWith("http");
              return (
                <Link
                  href={projectLink.href}
                  key={idx}
                  target={linkIsExternal ? "_blank" : undefined}
                  rel={linkIsExternal ? "noopener noreferrer" : undefined}
                  onClick={(event) => event.stopPropagation()}
                >
                  <Badge
                    className="flex items-center gap-1.5 bg-black text-xs text-white shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:bg-black/90"
                    variant="default"
                  >
                    {projectLink.icon}
                    {projectLink.type}
                  </Badge>
                </Link>
              );
            })}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1">
            <h3 className="font-semibold tracking-tight">{title}</h3>
            <time className="text-xs text-muted-foreground">{dates}</time>
          </div>
          {href && (
            <Link
              href={href}
              target={hrefIsExternal ? "_blank" : undefined}
              rel={hrefIsExternal ? "noopener noreferrer" : undefined}
              className="rounded-sm text-muted-foreground transition-all duration-200 group-hover/card:-translate-y-0.5 group-hover/card:translate-x-0.5 group-hover/card:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label={`Open ${title}`}
            >
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </Link>
          )}
        </div>
        <div className="prose max-w-full flex-1 text-xs text-pretty font-sans leading-relaxed text-muted-foreground dark:prose-invert">
          <Markdown>{description}</Markdown>
        </div>
        {tags.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-1">
            {tags.map((tag) => (
              <Badge
                key={tag}
                className="h-6 w-fit border px-2 text-[11px] font-medium"
                variant="outline"
                style={{ borderColor: `${frame.tag}65`, backgroundColor: `${frame.tag}0d` }}
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
