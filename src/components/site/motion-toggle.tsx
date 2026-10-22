"use client";

import { useMotionSettings } from "@/components/motion-settings";

export function MotionToggle() {
  const { reducedMotion, setReducedMotion } = useMotionSettings();

  return (
    <button
      type="button"
      aria-pressed={reducedMotion}
      onClick={() => setReducedMotion(!reducedMotion)}
      className="type-meta inline-flex min-h-11 items-center gap-2 rounded-control px-2 text-graphite t-fast transition-colors hover:text-ink"
    >
      Reduce motion
      <span className="text-ink underline decoration-rule underline-offset-4">{reducedMotion ? "On" : "Off"}</span>
    </button>
  );
}
