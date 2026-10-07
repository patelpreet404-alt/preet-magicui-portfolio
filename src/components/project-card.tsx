/* eslint-disable @next/next/no-img-element */
"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useState } from "react";
import Markdown from "react-markdown";

function ProjectImage({ src, alt }: { src: string; alt: string }) {
  const [imageError, setImageError] = useState(false);

  if (!src || imageError) {
    return <div className="w-full h-48 bg-muted" />;
  }

  return (
    <img
      src={src}
      alt={alt}
      className="w-full h-48 object-cover transition-transform duration-700 ease-out group-hover/card:scale-[1.035]"
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

const coverStyles = [
  "from-violet-500/20 via-background to-blue-500/15",
  "from-sky-500/20 via-background to-teal-500/15",
  "from-amber-500/20 via-background to-orange-500/15",
  "from-rose-500/20 via-background to-violet-500/15",
];

const projectAccents = ["#ec4899", "#8b5cf6", "#84cc16", "#f97316"];

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
  const hrefIsExternal = Boolean(href?.startsWith("http"));
  const accent = projectAccents[variant % projectAccents.length];
  const reduceMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothPointerX = useSpring(pointerX, { stiffness: 180, damping: 28, mass: 0.25 });
  const smoothPointerY = useSpring(pointerY, { stiffness: 180, damping: 28, mass: 0.25 });
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const smoothRotateX = useSpring(rotateX, { stiffness: 200, damping: 24, mass: 0.25 });
  const smoothRotateY = useSpring(rotateY, { stiffness: 200, damping: 24, mass: 0.25 });
  const spotlight = useMotionTemplate`radial-gradient(440px circle at ${smoothPointerX}px ${smoothPointerY}px, ${accent}22, transparent 58%)`;

  function updatePointer(event: React.PointerEvent<HTMLElement>) {
    if (event.pointerType !== "mouse" || reduceMotion) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    pointerX.set(x);
    pointerY.set(y);
    rotateX.set(-((y / bounds.height) - 0.5) * 3.5);
    rotateY.set(((x / bounds.width) - 0.5) * 3.5);
  }

  function resetPointer() {
    pointerX.set(0);
    pointerY.set(0);
    rotateX.set(0);
    rotateY.set(0);
  }

  const cover = video ? (
    <video
      src={video}
      autoPlay
      loop
      muted
      playsInline
      className="w-full h-48 object-cover transition-transform duration-700 ease-out group-hover/card:scale-[1.035]"
    />
  ) : image ? (
    <ProjectImage src={image} alt={title} />
  ) : (
    <div
      className={cn(
        "relative isolate flex h-48 flex-col justify-between overflow-hidden bg-linear-to-br p-5",
        coverStyles[variant % coverStyles.length]
      )}
    >
      <div className="absolute -right-8 -top-16 size-48 rounded-full border border-foreground/10" />
      <div className="absolute -right-16 -top-2 size-48 rounded-full border border-foreground/10" />
      <span className="relative text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
        Selected work · {String(variant + 1).padStart(2, "0")}
      </span>
      <span className="relative max-w-[85%] text-xl font-semibold tracking-tight text-foreground">
        {title}
      </span>
    </div>
  );

  return (
    <motion.article
      className={cn(
        "group/card relative isolate flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm transition-shadow duration-300 hover:shadow-xl focus-within:ring-2 focus-within:ring-ring/50",
        className
      )}
      style={{
        rotateX: reduceMotion ? 0 : smoothRotateX,
        rotateY: reduceMotion ? 0 : smoothRotateY,
        transformPerspective: 1200,
        transformStyle: "preserve-3d",
      }}
      whileHover={
        reduceMotion
          ? undefined
          : {
              y: -4,
              scale: 1.004,
              boxShadow: `0 24px 70px -32px ${accent}70`,
            }
      }
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      onPointerMove={updatePointer}
      onPointerLeave={resetPointer}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100 group-focus-within/card:opacity-100"
        style={{ background: spotlight }}
      />
      <div className="relative z-20 flex h-full flex-col">
        <div className="relative shrink-0 overflow-hidden">
          {href ? (
            <Link
              href={href}
              target={hrefIsExternal ? "_blank" : undefined}
              rel={hrefIsExternal ? "noopener noreferrer" : undefined}
              aria-label={`Open ${title}`}
              className="block"
            >
              {cover}
            </Link>
          ) : (
            cover
          )}
          {links && links.length > 0 && (
            <div className="absolute top-2 right-2 flex flex-wrap gap-2">
              {links.map((link, idx) => {
                const linkIsExternal = link.href.startsWith("http");
                return (
                  <Link
                    href={link.href}
                    key={idx}
                    target={linkIsExternal ? "_blank" : undefined}
                    rel={linkIsExternal ? "noopener noreferrer" : undefined}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Badge
                      className="flex items-center gap-1.5 bg-black text-xs text-white shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:bg-black/90"
                      variant="default"
                    >
                      {link.icon}
                      {link.type}
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
              <h3 className="font-semibold tracking-tight transition-colors duration-200 group-hover/card:text-foreground">
                {title}
              </h3>
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
          <div className="prose flex-1 text-xs max-w-full text-pretty font-sans leading-relaxed text-muted-foreground dark:prose-invert">
            <Markdown>{description}</Markdown>
          </div>
          {tags && tags.length > 0 && (
            <div className="mt-auto flex flex-wrap gap-1">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  className="h-6 w-fit border px-2 text-[11px] font-medium transition-colors duration-200 group-hover/card:border-border"
                  variant="outline"
                  style={{ borderColor: `${accent}35`, backgroundColor: `${accent}0c` }}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}
