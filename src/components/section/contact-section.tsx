"use client";

import { useRef, useState } from "react";
import { ArrowUpRight, Check, Copy, Mail } from "lucide-react";
import { DATA } from "@/data/resume";

export default function ContactSection() {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const resetTimer = useRef<number | null>(null);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(DATA.contact.email);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
    if (resetTimer.current) window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => setCopyState("idle"), 3000);
  };

  return (
    <div className="contact-panel">
      <div>
        <h2 className="font-serif text-4xl leading-tight tracking-tight sm:text-5xl">Get in touch.</h2>
        <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground sm:text-base">
          Have a project, internship opportunity, or question? Send me an email or connect on LinkedIn.
        </p>
      </div>
      <div className="contact-panel__actions">
        <a className="portfolio-button portfolio-button--primary" href={`mailto:${DATA.contact.email}`}>
          <Mail size={17} aria-hidden="true" /> Email me <ArrowUpRight size={16} aria-hidden="true" />
        </a>
        <button type="button" className="portfolio-button portfolio-button--secondary" onClick={copyEmail}>
          {copyState === "copied" ? <Check size={17} aria-hidden="true" /> : <Copy size={17} aria-hidden="true" />}
          {copyState === "copied" ? "Copied" : "Copy email"}
        </button>
        <a className="portfolio-button portfolio-button--text" href={DATA.contact.social.LinkedIn.url} target="_blank" rel="noopener noreferrer">
          LinkedIn <ArrowUpRight size={16} aria-hidden="true" />
        </a>
        <span className="sr-only" role="status" aria-live="polite">
          {copyState === "copied" ? "Email address copied" : copyState === "failed" ? "Could not copy email address. Use the email link instead." : ""}
        </span>
      </div>
      {copyState === "failed" && <p className="text-sm text-muted-foreground">Copy unavailable here. Use the email button instead.</p>}
    </div>
  );
}
