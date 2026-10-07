"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, BookOpen, FileSearch, TerminalSquare } from "lucide-react";
import { LearningManagementDemo } from "@/components/learning-management-demo";
import { OptiLangDemo } from "@/components/optilang-demo";
import { ResearchPaperDemo } from "@/components/research-paper-demo";

const previews = [
  {
    title: "AI Learning Management",
    description: "A colorful study desk with course notes, flashcards, and a sample quiz.",
    href: "/projects/ai-learning-management",
    icon: BookOpen,
  },
  {
    title: "ResearchPaper AI",
    description: "Explore a sample paper, suggested questions, and linked citations.",
    href: "/projects/researchpaper-ai",
    icon: FileSearch,
  },
  {
    title: "OptiLang",
    description: "Step through a compiler pipeline and compare prepared code output.",
    href: "/projects/optilang",
    icon: TerminalSquare,
  },
];

export default function ProjectPreviewsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = previews[activeIndex];

  return (
    <section id="project-previews" className="flex min-h-0 flex-col gap-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">Try a project</h2>
          <p className="mt-1 text-sm text-muted-foreground">Explore the interactive demos right here.</p>
        </div>
        <span className="rounded-full border border-border bg-muted/50 px-3 py-1 text-xs text-muted-foreground">Interactive previews</span>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Interactive project previews">
        {previews.map((preview, index) => {
          const Icon = preview.icon;
          return (
            <button
              key={preview.href}
              type="button"
              role="tab"
              aria-selected={activeIndex === index}
              onClick={() => setActiveIndex(index)}
              className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${activeIndex === index ? "border-foreground bg-foreground text-background" : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"}`}
            >
              <Icon className="size-3.5" aria-hidden="true" />
              {preview.title}
            </button>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-5">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold">{active.title}</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">{active.description}</p>
          </div>
          <Link href={active.href} className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            Open full demo <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
        <div className="p-3 sm:p-4" role="tabpanel" aria-label={`${active.title} preview`}>
          {activeIndex === 0 && <LearningManagementDemo key={active.href} embedded />}
          {activeIndex === 1 && <ResearchPaperDemo key={active.href} embedded />}
          {activeIndex === 2 && <OptiLangDemo key={active.href} embedded />}
        </div>
      </div>
      <p className="text-center text-[11px] text-muted-foreground">These are sample front-end experiences. Actions use prepared demo content.</p>
    </section>
  );
}
