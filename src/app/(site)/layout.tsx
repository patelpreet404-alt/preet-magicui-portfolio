import ProjectDetailsShell from "@/components/project-details-shell";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { SkipLink } from "@/components/site/skip-link";
import "../legacy.css";

export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // ProjectDetailsShell is the old modal flow; it goes away in Phase 3 when /work/[slug] exists.
    <ProjectDetailsShell>
      <SkipLink />
      <SiteHeader />
      <main id="main" tabIndex={-1} className="type-body outline-none">
        {children}
      </main>
      <SiteFooter />
    </ProjectDetailsShell>
  );
}
