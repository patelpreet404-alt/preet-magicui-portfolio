"use client";

import { useEffect, useState } from "react";

export const NAV_ITEMS = [
  { id: "work", label: "Work", href: "/#work" },
  { id: "about", label: "About", href: "/#about" },
  { id: "contact", label: "Contact", href: "/#contact" },
] as const;

export type NavId = (typeof NAV_ITEMS)[number]["id"];

/** Home-page sections that count toward each nav item. */
const SECTION_TO_NAV: Record<string, NavId> = {
  work: "work",
  experience: "work",
  "more-work": "work",
  about: "about",
  contact: "contact",
};

/** Which nav item the visitor is reading on the home page (null elsewhere or above the first section). */
export function useActiveSection(enabled: boolean): NavId | null {
  const [active, setActive] = useState<NavId | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const elements = Object.keys(SECTION_TO_NAV)
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length > 0) {
          const top = visible.reduce((a, b) => (a.boundingClientRect.top < b.boundingClientRect.top ? a : b));
          setActive(SECTION_TO_NAV[top.target.id] ?? null);
        } else if (window.scrollY < 200) {
          setActive(null);
        }
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [enabled]);

  return enabled ? active : null;
}
