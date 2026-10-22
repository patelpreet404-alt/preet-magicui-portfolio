import { profile } from "@/content";
import { DelhiClock } from "./delhi-clock";
import { MotionToggle } from "./motion-toggle";
import { ThemeToggle } from "./theme-toggle";

export function SiteFooter() {
  return (
    <footer className="border-t border-rule">
      <div className="container-site flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between">
        <p className="type-meta text-graphite">
          © {new Date().getFullYear()} {profile.name}
        </p>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <DelhiClock />
          <ThemeToggle />
          <MotionToggle />
          <a
            href={profile.terminalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="type-meta inline-flex min-h-11 items-center text-graphite underline decoration-rule underline-offset-4 t-fast transition-colors hover:text-ink"
          >
            Prefer a terminal?
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
