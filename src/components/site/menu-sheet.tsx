"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { profile } from "@/content";
import { NAV_ITEMS, type NavId } from "./nav";

/**
 * Full-screen menu for phones. A modal <dialog>: focus is trapped (the rest of the page is inert),
 * Esc closes it, and focus returns to the Menu button.
 */
export function MenuSheet({ activeId, pathname }: { activeId: NavId | null; pathname: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  const close = useCallback(() => dialogRef.current?.close(), []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const sync = () => {
      setOpen(dialog.open);
      document.documentElement.style.overflow = dialog.open ? "hidden" : "";
    };
    dialog.addEventListener("close", sync);
    const wide = window.matchMedia("(min-width: 640px)");
    const closeWhenWide = () => {
      if (wide.matches && dialog.open) dialog.close();
    };
    wide.addEventListener("change", closeWhenWide);
    return () => {
      dialog.removeEventListener("close", sync);
      wide.removeEventListener("change", closeWhenWide);
      document.documentElement.style.overflow = "";
    };
  }, []);

  // Wrap Tab / Shift+Tab inside the sheet instead of letting focus leave for the browser UI.
  const trapTab = (event: React.KeyboardEvent<HTMLDialogElement>) => {
    if (event.key !== "Tab") return;
    const focusable = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"),
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const show = () => {
    dialogRef.current?.showModal();
    setOpen(true);
    document.documentElement.style.overflow = "hidden";
  };

  const linkClass =
    "type-h3 flex min-h-14 items-center justify-between border-b border-rule py-3 text-ink aria-[current]:underline aria-[current]:decoration-link aria-[current]:decoration-2 aria-[current]:underline-offset-8";

  return (
    <>
      <button
        type="button"
        onClick={show}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="type-meta -mr-2 inline-flex min-h-11 items-center rounded-control px-3 text-ink hover:bg-muted sm:hidden"
      >
        Menu
      </button>

      <dialog
        ref={dialogRef}
        aria-label="Menu"
        onKeyDown={trapTab}
        className="fixed inset-0 m-0 hidden h-dvh max-h-none w-dvw max-w-none flex-col overflow-y-auto bg-paper p-0 text-ink open:flex"
      >
        <div className="container-site flex min-h-[var(--header-h)] items-center justify-between border-b border-rule">
          <span className="font-semibold tracking-tight">{profile.name}</span>
          <button
            type="button"
            onClick={close}
            autoFocus
            className="type-meta -mr-2 inline-flex min-h-11 items-center gap-2 rounded-control px-3 text-ink hover:bg-muted"
          >
            <X className="size-4" aria-hidden="true" />
            Close
          </button>
        </div>

        <nav aria-label="Menu" className="container-site flex-1 pt-4">
          <ul>
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  onClick={close}
                  className={linkClass}
                  aria-current={activeId === item.id || (item.id === "about" && pathname === "/about") ? "location" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <a href={profile.resume} target="_blank" rel="noopener noreferrer" className={linkClass}>
                <span>
                  Résumé <span className="sr-only">(PDF, opens in a new tab)</span>
                </span>
                <ArrowUpRight className="size-6 text-graphite" aria-hidden="true" />
              </a>
            </li>
          </ul>
        </nav>

        <p className="container-site type-meta flex items-center gap-2 pb-8 pt-6 text-graphite">
          <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-link" />
          <span>
            <span className="sr-only">Availability: </span>
            {profile.availability.short}
          </span>
        </p>
      </dialog>
    </>
  );
}
