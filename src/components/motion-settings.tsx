"use client";

import { createContext, useContext, useEffect, useState } from "react";

type MotionContextValue = {
  reducedMotion: boolean;
  setReducedMotion: (value: boolean) => void;
};

const MotionContext = createContext<MotionContextValue | null>(null);
const STORAGE_KEY = "portfolio-reduce-motion";

export function MotionSettingsProvider({ children }: { children: React.ReactNode }) {
  const [systemPrefersReducedMotion, setSystemPrefersReducedMotion] = useState(false);
  const [override, setOverride] = useState<boolean | null>(null);
  const reducedMotion = override ?? systemPrefersReducedMotion;

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateSystemPreference = () => setSystemPrefersReducedMotion(media.matches);
    updateSystemPreference();
    media.addEventListener("change", updateSystemPreference);
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === "true" || saved === "false") {
        window.setTimeout(() => setOverride(saved === "true"), 0);
      }
    } catch {
      // The system setting remains available when storage is blocked.
    }
    return () => media.removeEventListener("change", updateSystemPreference);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.reducedMotion = String(reducedMotion);
  }, [reducedMotion]);

  const setReducedMotion = (value: boolean) => {
    setOverride(value);
    try {
      window.localStorage.setItem(STORAGE_KEY, String(value));
    } catch {
      // The control still works for this visit.
    }
  };

  return (
    <MotionContext.Provider value={{ reducedMotion, setReducedMotion }}>
      {children}
    </MotionContext.Provider>
  );
}

export function useMotionSettings() {
  const context = useContext(MotionContext);
  if (!context) throw new Error("Motion settings must be used inside MotionSettingsProvider");
  return context;
}
