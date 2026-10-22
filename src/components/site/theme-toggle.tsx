"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useMotionSettings } from "@/components/motion-settings";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

const buttonClass =
  "inline-flex size-11 items-center justify-center rounded-control border border-rule text-ink t-fast transition-colors hover:bg-muted [&_svg]:size-5";

const noopSubscribe = () => () => {};

/**
 * Magic UI Animated Theme Toggler when motion is welcome; a plain button otherwise (the animated one
 * runs a view transition and does not check reduced motion itself).
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const { reducedMotion } = useMotionSettings();
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);

  if (!mounted) return <span aria-hidden="true" className="inline-block size-11" />;

  const isDark = resolvedTheme === "dark";
  const label = `Switch to ${isDark ? "light" : "dark"} theme`;

  if (reducedMotion) {
    return (
      <button type="button" className={buttonClass} aria-label={label} onClick={() => setTheme(isDark ? "light" : "dark")}>
        {isDark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
      </button>
    );
  }

  return (
    <AnimatedThemeToggler
      className={buttonClass}
      aria-label={label}
      theme={isDark ? "dark" : "light"}
      onThemeChange={setTheme}
      duration={360}
    />
  );
}
