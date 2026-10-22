"use client";

import { ProjectDetailsProvider } from "@/components/project-details";
import { SavedProjectsProvider } from "@/components/saved-projects";
import { PROJECTS } from "@/data/resume";

export default function ProjectDetailsShell({ children }: { children: React.ReactNode }) {
  return <SavedProjectsProvider projects={PROJECTS}><ProjectDetailsProvider projects={PROJECTS}>{children}</ProjectDetailsProvider></SavedProjectsProvider>;
}
