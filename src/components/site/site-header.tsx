"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { profile } from "@/content";
import { MenuSheet } from "./menu-sheet";
import { NAV_ITEMS, useActiveSection } from "./nav";

const linkClass =
  "type-meta inline-flex min-h-11 items-center rounded-control px-3 text-graphite t-fast transition-colors hover:text-ink aria-[current]:text-ink aria-[current]:underline aria-[current]:decoration-link aria-[current]:decoration-2 aria-[current]:underline-offset-8";

export function SiteHeader() {
  const pathname = usePathname();
  const activeId = useActiveSection(pathname === "/");
  const [hidden, setHidden] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);

  // New page: always start with the header visible.
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setHidden(false);
  }

  // Hide on scroll down, show on scroll up. Focus inside the header always reveals it (CSS).
  useEffect(() => {
    let last = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const delta = y - last;
      if (y < 80) {
        setHidden(false);
        last = y;
      } else if (delta > 6) {
        setHidden(true);
        last = y;
      } else if (delta < -6) {
        setHidden(false);
        last = y;
      }
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header
      data-hidden={hidden}
      style={{ viewTransitionName: "site-header" }}
      className="t-base sticky top-0 z-40 border-b border-rule bg-paper transition-transform data-[hidden=true]:not-focus-within:-translate-y-full"
    >
      <div className="container-site flex h-[var(--header-h)] items-center justify-between gap-6">
        <Link href="/" className="-ml-1 inline-flex min-h-11 items-center rounded-control px-1 font-semibold tracking-tight text-ink">
          {profile.name}
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 sm:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={linkClass}
              aria-current={activeId === item.id || (item.id === "about" && pathname === "/about") ? "location" : undefined}
            >
              {item.label}
            </Link>
          ))}
          <a href={profile.resume} target="_blank" rel="noopener noreferrer" className={`${linkClass} gap-1`}>
            Résumé
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
            <span className="sr-only">(PDF, opens in a new tab)</span>
          </a>
          <Link href="/#contact" className={`${linkClass} ml-2 gap-2`}>
            <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-link" />
            <span className="sr-only">Availability: </span>
            <span className="max-lg:sr-only">{profile.availability.short}</span>
          </Link>
        </nav>

        <MenuSheet activeId={activeId} pathname={pathname} />
      </div>
    </header>
  );
}
