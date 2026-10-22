"use client";

import { useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { ArchitectureStage } from "@/content";

/**
 * Stage list on the left; the selected stage's input, output, contribution and source link on the right.
 * Nothing advances on its own. Arrow keys move between stages.
 */
export function ArchitectureStepper({ stages }: { stages: readonly ArchitectureStage[] }) {
  const [index, setIndex] = useState(0);
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);
  const stage = stages[index];

  const move = (next: number) => {
    const clamped = (next + stages.length) % stages.length;
    setIndex(clamped);
    buttons.current[clamped]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      move(index + 1);
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      move(index - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      move(0);
    } else if (event.key === "End") {
      event.preventDefault();
      move(stages.length - 1);
    }
  };

  return (
    <div className="grid gap-8 md:grid-cols-[minmax(0,16rem)_1fr]">
      <ol aria-label="Stages" className="border-t border-rule md:border-t-0" onKeyDown={onKeyDown}>
        {stages.map((item, i) => (
          <li key={item.id} className="border-b border-rule">
            <button
              ref={(element) => {
                buttons.current[i] = element;
              }}
              type="button"
              aria-current={i === index ? "step" : undefined}
              onClick={() => setIndex(i)}
              className="type-meta t-fast flex min-h-11 w-full items-center gap-3 py-2 text-left text-graphite transition-colors hover:text-ink aria-[current]:text-ink"
            >
              <span className="w-5 shrink-0 tabular-nums">{i + 1}</span>
              <span className="aria-[current]:font-semibold">{item.title}</span>
            </button>
          </li>
        ))}
      </ol>

      <div aria-live="polite" className="min-w-0">
        <h3 className="type-body font-semibold text-ink">
          <span className="tabular-nums text-graphite">
            {index + 1} of {stages.length}
          </span>{" "}
          {stage.title}
        </h3>
        <p className="type-prose measure-prose mt-3 text-ink">{stage.action}</p>
        <dl className="type-meta mt-6 grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <div>
            <dt className="text-graphite">Input</dt>
            <dd className="mt-1 font-normal text-ink">{stage.input}</dd>
          </div>
          <div>
            <dt className="text-graphite">Output</dt>
            <dd className="mt-1 font-normal text-ink">{stage.output}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-graphite">My contribution</dt>
            <dd className="mt-1 font-normal text-ink">{stage.contribution}</dd>
          </div>
        </dl>
        {stage.source && (
          <a
            href={stage.source.href}
            target="_blank"
            rel="noopener noreferrer"
            className="type-meta mt-4 inline-flex min-h-11 items-center gap-1 text-link underline decoration-rule underline-offset-4 hover:decoration-link"
          >
            Source: {stage.source.label}
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        )}
      </div>
    </div>
  );
}
