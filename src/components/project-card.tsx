/* eslint-disable @next/next/no-img-element */
"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import { useProjectDetails, projectSlug } from "./project-details";
import { SaveProjectButton } from "./saved-projects";

function ProjectImage({ src, alt }: { src: string; alt: string }) {
  const [imageError, setImageError] = useState(false);

  if (!src || imageError) {
    return <div className="h-full w-full bg-muted" />;
  }

  return (
    <img
      src={src}
      alt={alt}
      className="h-full w-full object-cover transition-transform duration-350 ease-out group-hover/card:scale-[1.035]"
      onError={() => setImageError(true)}
    />
  );
}

interface Props {
  id?: string;
  slug?: string;
  status?: string;
  title: string;
  subtitle?: string;
  href?: string;
  description: string;
  details?: string;
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
  workflow?: readonly string[];
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
  id,
  slug,
  status,
  title,
  subtitle,
  href,
  description,
  details,
  dates,
  tags,
  link,
  image,
  video,
  links,
  workflow,
  className,
  variant = 0,
}: Props) {
  const previewRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { openProject } = useProjectDetails();
  const hrefIsExternal = Boolean(href?.startsWith("http"));
  const frame = previewFrames[variant % previewFrames.length];

  useEffect(() => {
    const preview = previewRef.current;
    if (!preview) return;

    if (!("IntersectionObserver" in window)) {
      return;
    }

    let intersects = false;
    const updateVisibility = () => {
      const shouldPlay = intersects && !document.hidden;
      const videoElement = videoRef.current;
      if (!videoElement) return;
      if (shouldPlay) {
        void videoElement.play().catch(() => undefined);
      } else {
        videoElement.pause();
      }
    };
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
      ref={videoRef}
      src={video}
      poster={image}
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
      aria-hidden="true"
      className="h-full w-full object-cover transition-transform duration-350 ease-out group-hover/card:scale-[1.035]"
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
        "group/card flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-[border-color,box-shadow] duration-200 ease-out hover:border-foreground/30 hover:shadow-[0_16px_40px_-28px_rgba(180,210,255,0.35)] focus-within:border-foreground/30 focus-within:ring-2 focus-within:ring-ring/60",
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
                    className="flex items-center gap-1.5 bg-black text-xs text-white shadow-sm transition-colors duration-200 hover:bg-black/90"
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
            <h3 className="text-base font-semibold leading-snug tracking-tight md:text-lg">{title}</h3>
            {subtitle && <p className="text-xs leading-snug text-muted-foreground">{subtitle}</p>}
            <span className="mt-1 inline-flex w-fit rounded-full border border-border bg-muted/50 px-2.5 py-1 text-[11px] font-medium text-foreground/85">{status ?? dates}</span>
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
        <div className="prose max-w-full flex-1 text-xs text-pretty font-sans leading-relaxed text-muted-foreground dark:prose-invert md:text-sm">
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
        <div className="project-card__actions">
          <button
            type="button"
            className="mt-1 inline-flex min-h-11 w-fit items-center gap-1.5 text-xs font-medium text-foreground underline-offset-4 transition-colors hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:text-sm"
            onClick={(event) => openProject(slug ?? id ?? projectSlug(title), event.currentTarget)}
            aria-haspopup="dialog"
          >
            View project details <ArrowUpRight className="size-3.5" aria-hidden />
          </button>
          <SaveProjectButton id={slug ?? id ?? projectSlug(title)} title={title} />
        </div>
      </div>
    </article>
  );
}
