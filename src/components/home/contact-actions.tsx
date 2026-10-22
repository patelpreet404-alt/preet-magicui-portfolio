"use client";

import { useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

/** Large email link plus a "Copy email" button with a live-region announcement. */
export function ContactActions({ email }: { email: string }) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const resetTimer = useRef<number | null>(null);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
    if (resetTimer.current) window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => setCopyState("idle"), 3000);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <a
          href={`mailto:${email}`}
          className="type-h3 break-all text-ink underline decoration-rule decoration-2 underline-offset-8 t-fast transition-colors hover:decoration-link"
        >
          {email}
        </a>
        <button
          type="button"
          onClick={copyEmail}
          className="type-meta press t-fast inline-flex min-h-11 items-center gap-2 rounded-control border border-rule px-4 text-ink transition-colors hover:border-ink"
        >
          {copyState === "copied" ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
          {copyState === "copied" ? "Copied" : "Copy email"}
        </button>
      </div>
      <p role="status" aria-live="polite" className="type-meta mt-3 min-h-[1.45em] text-graphite">
        {copyState === "copied" && "Email address copied."}
        {copyState === "failed" && "Couldn't copy here. Use the email link instead."}
      </p>
    </div>
  );
}
