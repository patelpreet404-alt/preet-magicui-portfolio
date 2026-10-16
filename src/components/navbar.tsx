"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BookmarkCheck, BriefcaseBusiness, Compass, FileText, Mail, Moon, Orbit, UserRound } from "lucide-react";
import { DATA } from "@/data/resume";
import { useMotionSettings } from "@/components/motion-settings";
import { useSavedProjects } from "@/components/saved-projects";

const sections = [
  { id: "hero", label: "Intro", icon: UserRound },
  { id: "work", label: "Work", icon: BriefcaseBusiness },
  { id: "projects", label: "Projects", icon: Compass },
  { id: "engineering-map", label: "Map", icon: Orbit },
  { id: "contact", label: "Contact", icon: Mail }
] as const;

export default function Navbar() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [hiddenWhileScrolling, setHiddenWhileScrolling] = useState(false);
  const { reducedMotion, setReducedMotion } = useMotionSettings();
  const { ids: savedIds } = useSavedProjects();

  useEffect(() => {
    let previousY = window.scrollY;
    const handleScroll = () => {
      const nextY = window.scrollY;
      if (nextY > previousY + 4) setHiddenWhileScrolling(true);
      else if (nextY < previousY - 4) setHiddenWhileScrolling(false);
      previousY = nextY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (pathname !== "/") return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveSection(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0, 0.1, 0.25, 0.5, 1] }
    );
    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, [pathname]);

  if (pathname.startsWith("/projects/")) return null;

  return (
    <nav data-floating-nav data-hidden={hiddenWhileScrolling} aria-label="Main sections" className="portfolio-nav" onFocusCapture={() => setHiddenWhileScrolling(false)}>
      <div className="portfolio-nav__inner">
        {sections.map(({ id, label, icon: Icon }) => (
          <a
            key={id}
            href={`#${id}`}
            aria-label={label}
            aria-current={activeSection === id ? "location" : undefined}
            className="portfolio-nav__item"
            onClick={() => setActiveSection(id)}
          >
            <Icon size={18} aria-hidden="true" />
            <span>{label}</span>
          </a>
        ))}
        <span className="portfolio-nav__divider" aria-hidden="true" />
        {savedIds.length > 0 && <button type="button" className="portfolio-nav__item portfolio-nav__saved" aria-haspopup="dialog" onClick={() => window.dispatchEvent(new Event("portfolio:saved-open"))}>
          <BookmarkCheck size={17} aria-hidden="true" /><span>Saved <b>{savedIds.length}</b></span>
        </button>}
        <a href={DATA.contact.social.Resume.url} target="_blank" rel="noopener noreferrer" className="portfolio-nav__item" aria-label="Resume, opens PDF in a new tab">
          <FileText size={18} aria-hidden="true" />
          <span>Resume</span>
        </a>
        <button type="button" className="portfolio-nav__item" aria-label={reducedMotion ? "Turn off reduce motion" : "Reduce motion"} aria-pressed={reducedMotion} onClick={() => setReducedMotion(!reducedMotion)}>
          <Moon size={18} aria-hidden="true" />
          <span>{reducedMotion ? "Motion off" : "Reduce motion"}</span>
        </button>
      </div>
    </nav>
  );
}
