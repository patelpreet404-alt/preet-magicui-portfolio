"use client";

import { useEffect, useState } from "react";

const TERMINAL_URL = "https://preet-patel-portfolio.vercel.app/";

export default function TerminalPortfolioEmbed() {
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [attempt, setAttempt] = useState(0);
  const [terminalFocused, setTerminalFocused] = useState(false);

  useEffect(() => {
    const floatingNav = document.querySelector<HTMLElement>("[data-floating-nav]");
    if (!floatingNav) return;
    const originalOpacity = floatingNav.style.opacity;
    const originalPointerEvents = floatingNav.style.pointerEvents;

    if (terminalFocused) {
      floatingNav.style.opacity = "0";
      floatingNav.style.pointerEvents = "none";
    }

    return () => {
      floatingNav.style.opacity = originalOpacity;
      floatingNav.style.pointerEvents = originalPointerEvents;
    };
  }, [terminalFocused]);

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-background">
      <div className="flex flex-col gap-4 border-b border-border p-5 sm:flex-row sm:items-end sm:justify-between sm:p-6">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Another side of my work</p>
          <h2 id="other-portfolio-heading" className="mt-2 text-xl font-semibold tracking-tight">Try this to know more about me</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Type <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">help</kbd> to explore my projects, skills, and experience right here.
          </p>
        </div>
        <p className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground" role="status" aria-live="polite">
          <span className={`size-2 rounded-full ${status === "ready" ? "bg-emerald-500" : status === "error" ? "bg-red-500" : "animate-pulse bg-amber-500"}`} aria-hidden="true" />
          {status === "ready" ? "Terminal ready" : status === "error" ? "Terminal unavailable" : "Loading terminal"}
        </p>
      </div>

      <div
        className="bg-[#202020] p-2 sm:p-3"
        onPointerEnter={() => setTerminalFocused(true)}
        onPointerLeave={() => setTerminalFocused(false)}
      >
        {status === "error" && (
          <div className="mb-2 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
            <span>The interactive portfolio could not load.</span>
            <button
              type="button"
              onClick={() => {
                setStatus("loading");
                setAttempt((current) => current + 1);
              }}
              className="rounded-full border border-white/20 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              Try again
            </button>
          </div>
        )}
        <iframe
          key={attempt}
          src={TERMINAL_URL}
          title="Preet Patel interactive terminal portfolio"
          aria-label="Interactive terminal portfolio. Click the command prompt and type help to get started."
          loading="lazy"
          referrerPolicy="no-referrer"
          sandbox="allow-scripts allow-same-origin"
          onFocus={() => setTerminalFocused(true)}
          onBlur={() => setTerminalFocused(false)}
          onLoad={() => setStatus("ready")}
          onError={() => setStatus("error")}
          className="h-[620px] w-full rounded-xl border border-white/10 bg-[#242424] sm:h-[560px]"
        />
      </div>
      <p className="border-t border-border px-5 py-3 text-xs text-muted-foreground sm:px-6">
        Click inside the terminal to type. It stays on this page; use <kbd className="rounded border border-border bg-muted px-1 py-0.5 font-mono text-[10px] text-foreground">help</kbd> to see available commands.
      </p>
    </div>
  );
}
