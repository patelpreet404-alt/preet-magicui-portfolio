"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DATA } from "@/data/resume";
import { ChevronDown, MapPin } from "lucide-react";

function LogoMark({ label }: { label: string }) {
  return (
    <div className="grid size-10 shrink-0 place-items-center rounded-full border border-border bg-muted text-xs font-semibold text-foreground" aria-hidden="true">
      {label.split(" ").map((word) => word[0]).slice(0, 2).join("")}
    </div>
  );
}

export default function WorkSection() {
  return (
    <Accordion type="single" collapsible className="w-full">
      {DATA.work.map((work) => (
        <AccordionItem
          key={work.company}
          value={work.company}
          className="w-full border-y border-border"
        >
          <AccordionTrigger className="group p-4 text-left no-underline hover:no-underline sm:p-5 [&>svg]:hidden">
            <div className="flex w-full items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-4">
                <LogoMark label={work.company} />
                <div className="min-w-0">
                  <span className="font-semibold">{work.company}</span>
                  <p className="mt-1 text-sm text-muted-foreground">{work.title}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="size-3.5" aria-hidden />
                    {work.location}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2 text-right">
                <span className="text-xs tabular-nums text-muted-foreground">{work.start} – {work.end ?? "Present"}</span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors group-hover:bg-muted group-focus-visible:ring-2 group-focus-visible:ring-ring">
                  View internship details
                  <ChevronDown className="size-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180" aria-hidden />
                </span>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-5 pt-1 sm:px-5">
            <div className="ml-14 border-t border-border pt-5">
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">{work.description}</p>
              <div className="mt-5 grid gap-5 md:grid-cols-3 md:divide-x md:divide-border">
                <div className="md:pr-5">
                  <h4 className="text-sm font-semibold">Platform</h4>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">Built four attendance workflows with Flask and Supabase for a team of 50+ employees.</p>
                </div>
                <div className="md:px-5">
                  <h4 className="text-sm font-semibold">Verification and visibility</h4>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">Added IP-based attendance verification and an admin dashboard for work hours, login history, breaks, and attendance insights.</p>
                </div>
                <div className="md:pl-5">
                  <h4 className="text-sm font-semibold">Impact</h4>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">Optimized more than 10 REST API endpoints and Supabase queries, reducing manual attendance processing by 80%.</p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2" aria-label="Technologies used">
                {["Flask", "Supabase", "REST APIs", "IP verification", "Analytics"].map((technology) => (
                  <span key={technology} className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">{technology}</span>
                ))}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
