import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export const buttonStyle =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-border bg-background px-3.5 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";
export const primaryButtonStyle =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

export function ProjectDemoTopbar({
  title,
  source,
  embedded = false,
}: {
  title: string;
  source: string;
  embedded?: boolean;
}) {
  return (
    <header className="mb-7 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
      <div className="flex min-w-0 items-center gap-3">
        {!embedded && <Link
          href="/"
          className="grid size-9 shrink-0 place-items-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Back to Preet Patel's portfolio"
        >
          <ArrowLeft className="size-4" />
        </Link>}
        <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
          <span className="text-xs font-semibold">PP</span>
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{title}</p>
          <p className="text-xs text-muted-foreground">Built by Preet Patel</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <a
          href={source}
          target="_blank"
          rel="noopener noreferrer"
          className="grid size-9 place-items-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={"View " + title + " source on GitHub"}
        >
          <ArrowUpRight className="size-4" />
        </a>
      </div>
    </header>
  );
}

export function DemoNotice({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-800 dark:text-amber-200">
      {children}
    </span>
  );
}
