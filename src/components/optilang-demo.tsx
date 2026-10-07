"use client";

import { ArrowRight, ArrowUpRight, Check, Code2, Layers3, LoaderCircle, Play, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { DemoNotice, ProjectDemoTopbar, primaryButtonStyle } from "./project-demo-shared";
import { DemoSceneTour } from "./demo-scene-tour";

const sourceCode = [
  "int main() {",
  "    int samples = 12;",
  "    int batches = 3;",
  "    int total = samples * batches;",
  "    int duplicate = samples * batches;",
  "    print total;",
  "    print duplicate;",
  "    return 0;",
  "}",
].join("\n");
const beforeCode = [
  "t1 = samples * batches",
  "total = t1",
  "t2 = samples * batches",
  "duplicate = t2",
  "print total",
  "print duplicate",
  "return 0",
].join("\n");
const afterCode = [
  "total = 36",
  "duplicate = 36",
  "print total",
  "print duplicate",
  "return 0",
].join("\n");
const stages = [
  { name: "Lexing", detail: "Turns characters into tokens such as identifiers, literals, and operators." },
  { name: "Parsing", detail: "Checks the token stream against the grammar and builds a structured syntax tree." },
  { name: "Semantic analysis", detail: "Validates types, declarations, scope, and function use before code generation." },
  { name: "TAC generation", detail: "Translates the program into three-address code, a compact intermediate representation." },
  { name: "Constant folding", detail: "Evaluates constant expressions and propagates known values through the program." },
  { name: "Common expressions", detail: "Finds repeated expressions and reuses earlier results within a basic block." },
  { name: "Dead code + CFG", detail: "Removes unused values and unreachable blocks from the intermediate code." },
  { name: "LICM + LLVM IR", detail: "Moves safe loop-invariant work, then emits LLVM IR for a native toolchain." },
];

export function OptiLangDemo({ embedded = false }: { embedded?: boolean }) {
  const [stage, setStage] = useState(0);
  const [optimized, setOptimized] = useState(true);
  const [running, setRunning] = useState(false);
  const [ran, setRan] = useState(false);
  const [tourPlaying, setTourPlaying] = useState(false);

  useEffect(() => {
    if (embedded || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setTimeout(() => setTourPlaying(true), 0);
    return () => window.clearTimeout(timer);
  }, [embedded]);

  useEffect(() => {
    if (!tourPlaying || embedded) return;
    const nextStage = (stage + 1) % stages.length;
    const timer = window.setTimeout(() => {
      setStage(nextStage);
      setOptimized(nextStage >= 4);
    }, 1450);
    return () => window.clearTimeout(timer);
  }, [embedded, stage, tourPlaying]);

  function runSample() {
    setRunning(true);
    window.setTimeout(() => {
      setRunning(false);
      setRan(true);
      setOptimized(true);
    }, 550);
  }

  return (
    <main className={"optilang-theme optilang-workspace bg-background px-3 py-4 text-foreground sm:px-5 sm:py-6 " + (embedded ? "w-full rounded-2xl border border-emerald-500/25 shadow-[0_20px_70px_-35px_rgba(16,185,129,0.45)]" : "project-demo-fullscreen min-h-dvh w-full pb-28 sm:pb-28")}>
      <ProjectDemoTopbar embedded={embedded} title="OptiLang" source="https://github.com/patelpreet404-alt/OptiLang" />
      <div data-demo-scene="Compiler overview" className="optilang-hero relative mb-5 overflow-hidden rounded-2xl border border-primary/20 bg-[linear-gradient(115deg,#10291b,#07130d_67%)] px-5 py-7 sm:px-8 sm:py-10">
        <div className="relative z-10 grid items-center gap-8 md:grid-cols-[minmax(0,1fr)_minmax(260px,370px)]">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary"><span className="size-1.5 rounded-full bg-primary" /> Compiler preview · built in C++17</div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">See the compiler <span className="text-primary">work.</span></h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">Trace one program from source to optimized instructions. Every stage has a purpose, and every change has a reason.</p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button type="button" onClick={() => { setTourPlaying(false); runSample(); }} disabled={running} className={primaryButtonStyle + " optilang-run min-h-11 rounded-full px-5"}>{running ? <LoaderCircle className="size-4 animate-spin" /> : <Play className="size-4" />}{running ? "Preparing comparison…" : ran ? "Replay the sample" : "Run the sample"}<ArrowRight className="size-4" /></button>
              {!embedded && <button type="button" onClick={() => { if (tourPlaying) setTourPlaying(false); else { setStage(0); setOptimized(false); setTourPlaying(true); } }} className="optilang-tour inline-flex min-h-10 items-center gap-2 rounded-full border border-primary/30 bg-white/5 px-4 text-xs font-semibold text-primary transition-all hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-pressed={tourPlaying}><span className={tourPlaying ? "optilang-tour-dot is-playing" : "optilang-tour-dot"} aria-hidden />{tourPlaying ? "Pause walkthrough" : "Replay walkthrough"}</button>}
            </div>
          </div>
          <div className="optilang-hero-sample rounded-xl border border-primary/25 bg-[#07130b] p-4 font-mono text-xs shadow-[0_24px_48px_-24px_rgba(0,0,0,.7)]" aria-label="Optimization example">
            <div className="mb-4 flex items-center justify-between border-b border-primary/15 pb-3 font-sans text-[11px] font-medium text-muted-foreground"><span>main.mc → optimized.tac</span><span className="flex items-center gap-1.5 text-primary"><span className="size-1.5 rounded-full bg-primary" /> READY</span></div>
            <p className="text-muted-foreground">- t2 = samples * batches</p>
            <p className="mt-2 text-primary">+ duplicate = 36</p>
            <div className="mt-5 flex items-center justify-between rounded-lg bg-primary/10 px-3 py-2 font-sans text-[11px]"><span className="text-muted-foreground">Common expression removed</span><span className="font-semibold text-primary">−2 instructions</span></div>
          </div>
        </div>
        <div className="relative z-10 mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/10 pt-4 text-xs text-muted-foreground"><span><strong className="font-semibold text-foreground">8</strong> pipeline stages</span><span><strong className="font-semibold text-foreground">5</strong> optimization passes</span><span><strong className="font-semibold text-primary">2 fewer</strong> instructions</span></div>
      </div>
      <div className="mb-4"><DemoNotice><Code2 className="size-3.5" /> Prepared example · custom code is not compiled</DemoNotice></div>

      <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3"><div className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary"><Layers3 className="size-4" /></div><div><h2 className="text-sm font-semibold">Compiler playground</h2><p className="text-xs text-muted-foreground">C-like language · sample program</p></div></div>
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary"><span className="size-1.5 animate-pulse rounded-full bg-primary" /> {running ? "Preparing output" : ran ? "Comparison ready" : "Ready to explore"}</span>
        </div>

        <div data-demo-scene="Pipeline stages" className="border-b border-border bg-muted/20 p-4 sm:p-6">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3"><div><h3 className="text-sm font-semibold">Compilation pipeline</h3><p className="mt-1 text-xs text-muted-foreground">Select a stage to see what it does.</p></div><span className="rounded-full border border-border bg-background px-2.5 py-1 text-[11px] text-muted-foreground">8 stages · 5 optimization passes</span></div>
          <div className="flex gap-2 overflow-x-auto pb-2" aria-label="Compiler pipeline stages">{stages.map((item, index) => <button key={item.name} type="button" onClick={() => { setTourPlaying(false); setStage(index); setOptimized(index >= 4); }} aria-pressed={stage === index} className={"flex min-w-28 items-center gap-2 rounded-lg border px-3 py-2 text-left text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " + (stage === index ? "optilang-stage-active border-primary/40 bg-primary/10 text-foreground" : "border-border bg-background text-muted-foreground hover:bg-muted")}><span className="grid size-5 shrink-0 place-items-center rounded-full bg-muted text-[10px] tabular-nums">{index + 1}</span>{item.name}</button>)}</div>
          <div className="mt-2 rounded-lg border border-border bg-background px-4 py-3"><div className="flex items-center gap-2 text-xs font-semibold"><Zap className="size-3.5 text-primary" />{stages[stage].name}</div><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{stages[stage].detail}</p></div>
        </div>

        <div className="grid lg:grid-cols-2">
          <div data-demo-scene="Source program" className="border-b border-border p-4 lg:border-b-0 lg:border-r sm:p-6">
            <div className="mb-3 flex items-center justify-between"><div><h3 className="text-sm font-semibold">Source program</h3><p className="mt-1 text-xs text-muted-foreground">Read-only sample · main.mc</p></div><span className="rounded-md bg-muted px-2 py-1 font-mono text-[10px] text-muted-foreground">C-like</span></div>
            <pre className="optilang-code min-h-64 overflow-x-auto rounded-xl border border-border bg-[#07110b] p-4 text-xs leading-6 text-foreground sm:text-sm"><code>{sourceCode}</code></pre>
          </div>
          <div data-demo-scene="Optimized output" className="p-4 sm:p-6">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3"><div><h3 className="text-sm font-semibold">Three-address code</h3><p className="mt-1 text-xs text-muted-foreground">See how optimization reduces repeated work.</p></div><div className="flex rounded-lg border border-border bg-muted/50 p-1" role="group" aria-label="Choose output view"><button type="button" aria-pressed={!optimized} onClick={() => { setTourPlaying(false); setOptimized(false); }} className={"rounded-md px-2.5 py-1.5 text-[11px] font-medium " + (!optimized ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>Before</button><button type="button" aria-pressed={optimized} onClick={() => { setTourPlaying(false); setOptimized(true); }} className={"rounded-md px-2.5 py-1.5 text-[11px] font-medium " + (optimized ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>After</button></div></div>
            <pre key={String(optimized)} className="optilang-code optilang-code-enter min-h-64 overflow-x-auto rounded-xl border border-border bg-[#07110b] p-4 text-xs leading-6 text-foreground sm:text-sm"><code>{optimized ? afterCode : beforeCode}</code></pre>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-background px-3 py-2.5"><span className="text-xs text-muted-foreground">{optimized ? "Prepared optimized output" : "Prepared unoptimized output"}</span><span className="inline-flex items-center gap-1.5 text-xs font-semibold tabular-nums">{optimized ? "5" : "7"} instructions{optimized && <span className="text-emerald-700 dark:text-emerald-300"><Check className="ml-1 inline size-3.5" /> fewer</span>}</span></div>
            {ran && <p role="status" className="mt-3 text-xs text-emerald-700 dark:text-emerald-300">Sample comparison complete. This preview displays prepared output; it does not run custom code.</p>}
          </div>
        </div>
      </section>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3 text-xs text-muted-foreground"><span>Explore the source, compiler, and full test suite.</span><a href="https://github.com/patelpreet404-alt/OptiLang" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground">View OptiLang on GitHub <ArrowUpRight className="size-3.5" /></a></div>
      {!embedded && <DemoSceneTour />}
    </main>
  );
}
