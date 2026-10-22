"use client";

import { ProjectDetailsProvider } from "@/components/_archive/project-details";
import { SavedProjectsProvider } from "@/components/_archive/saved-projects";
import { PROJECTS } from "@/data/resume";

export default function ProjectDetailsShell({ children }: { children: React.ReactNode }) {
  return <SavedProjectsProvider projects={PROJECTS}><ProjectDetailsProvider projects={PROJECTS}>{children}</ProjectDetailsProvider></SavedProjectsProvider>;
}
