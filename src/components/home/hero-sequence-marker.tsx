"use client";

import { useEffect } from "react";

/** Remembers, for this session, that the hero sequence has played (the CSS reads data-hero-played). */
export function HeroSequenceMarker() {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        window.sessionStorage.setItem("hero-sequence-played", "true");
      } catch {
        // Storage can be blocked; the sequence then simply plays again next time.
      }
    }, 1600);
    return () => window.clearTimeout(timer);
  }, []);
  return null;
}
