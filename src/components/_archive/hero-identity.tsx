"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMotionSettings } from "@/components/motion-settings";
import { useEffect, useState } from "react";

const IDENTITIES = ["Fullstack", "Founder", "Creative"];

export default function HeroIdentity() {
  const [index, setIndex] = useState(0);
  const { reducedMotion } = useMotionSettings();

  useEffect(() => {
    if (reducedMotion) return;
    const interval = window.setInterval(() => {
      setIndex((current) => (current + 1) % IDENTITIES.length);
    }, 2400);

    return () => window.clearInterval(interval);
  }, [reducedMotion]);

  return (
    <p className="hero-identity text-muted-foreground" aria-label="Full-stack developer, founder, and creative living in India">
      A{" "}
      <span className="hero-identity__word" aria-hidden="true">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={IDENTITIES[reducedMotion ? 0 : index]}
            initial={reducedMotion ? false : { opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0, y: -5 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="inline-block"
          >
            {IDENTITIES[reducedMotion ? 0 : index]}
          </motion.span>
        </AnimatePresence>
      </span>{" "}
      lives in India.
    </p>
  );
}
