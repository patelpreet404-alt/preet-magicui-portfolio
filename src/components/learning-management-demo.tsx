"use client";

import { ArrowRight, BookOpen, Check, Clock3, FileText, Plus, RotateCcw } from "lucide-react";
import { useState } from "react";
import { DemoNotice, ProjectDemoTopbar, buttonStyle } from "./project-demo-shared";

const courses = [
  {
    title: "Applied Machine Learning",
    subject: "AI & data",
    progress: 68,
    color: "bg-violet-500",
    tone: "border-violet-300 bg-violet-50 text-violet-900 dark:border-violet-400/30 dark:bg-violet-400/10 dark:text-violet-100",
    description: "Train your eye for patterns, useful features, and fair model evaluation.",
    chapters: ["A practical map of machine learning", "Preparing a reliable dataset", "Training your first model", "Evaluating beyond accuracy"],
    noteTitle: "A model learns from examples",
    noteIntro: "Machine learning turns examples into a rule that can help with new decisions. The goal is not to memorize the training set; it is to find patterns that hold up in the world outside it.",
    takeaway: "A useful evaluation checks examples the model has not seen during training.",
    noteDetails: "Keep training data for fitting, validation data for comparing choices, and a held-out test set for one final estimate. Using the test set repeatedly can quietly turn it into part of the training process.",
    cardQuestion: "Why should evaluation include examples a model has never seen?",
    cardAnswer: "To estimate whether the learned pattern generalizes beyond the training examples.",
    quizQuestion: "Which set gives a final estimate after model choices are complete?",
    options: ["The training set", "The held-out test set", "The feature list", "The prediction log"],
    correct: "The held-out test set",
    questions: [["What is overfitting?", "When a model follows quirks in its training examples too closely and performs poorly on new data."], ["Why keep validation data?", "It helps compare model choices during development without repeatedly using the final test set."]],
  },
  {
    title: "Modern Web Systems",
    subject: "Engineering",
    progress: 32,
    color: "bg-cyan-500",
    tone: "border-cyan-300 bg-cyan-50 text-cyan-950 dark:border-cyan-400/30 dark:bg-cyan-400/10 dark:text-cyan-100",
    description: "Trace a browser request through the layers that make a web app feel instant.",
    chapters: ["From URL to first render", "Designing resilient APIs", "Caching at the edge", "Keeping interfaces accessible"],
    noteTitle: "A request takes a useful route",
    noteIntro: "When someone opens a page, the browser resolves a domain, negotiates a connection, requests a document, and assembles the response. Good systems make each step predictable and keep repeated work close to the visitor.",
    takeaway: "A cache is most useful when its freshness rules match how often the underlying data changes.",
    noteDetails: "Static assets can often be cached for a long time when their filenames include a content hash. Frequently changing account data needs shorter lifetimes or explicit revalidation so people see current information.",
    cardQuestion: "What does a content hash in an asset filename make safer?",
    cardAnswer: "Long-lived caching, because a changed file receives a new URL.",
    quizQuestion: "Why can a content-hashed script be cached for a long time?",
    options: ["The URL changes whenever the file changes", "The browser never checks script files", "It prevents network connections", "It stores user sessions"],
    correct: "The URL changes whenever the file changes",
    questions: [["What is cache invalidation?", "The process of ensuring a cached response is refreshed when its source changes."], ["When is edge caching useful?", "When a response can be reused by many visitors and serving it nearer to them reduces delay."]],
  },
  {
    title: "Research Methods",
    subject: "Study skills",
    progress: 84,
    color: "bg-rose-500",
    tone: "border-rose-300 bg-rose-50 text-rose-950 dark:border-rose-400/30 dark:bg-rose-400/10 dark:text-rose-100",
    description: "Turn a broad curiosity into a clear question and a careful study plan.",
    chapters: ["Shaping a research question", "Choosing a study design", "Sampling and measurement", "Writing a grounded conclusion"],
    noteTitle: "A good question guides the method",
    noteIntro: "A research question names the group, idea, and relationship you want to understand. A focused question makes it easier to choose what evidence to collect and what conclusions that evidence can support.",
    takeaway: "A study design should fit the question, rather than force the question to fit convenient data.",
    noteDetails: "Define key terms before collecting evidence. A clear operational definition describes how an idea will be observed or measured, giving readers a fair chance to interpret the results and their limits.",
    cardQuestion: "What should a research question help you decide?",
    cardAnswer: "Which evidence and method can answer it responsibly.",
    quizQuestion: "What is the purpose of an operational definition?",
    options: ["To describe how a concept will be observed or measured", "To guarantee a result is significant", "To replace the research question", "To hide limitations from readers"],
    correct: "To describe how a concept will be observed or measured",
    questions: [["What makes a question researchable?", "It can be investigated with evidence that is available and appropriate to the claim."], ["Why describe limitations?", "Readers can judge where the findings apply and where further study is needed."]],
  },
];
const tabs = ["overview", "notes", "flashcards", "quiz", "q&a"] as const;
type StudyTab = (typeof tabs)[number];

export function LearningManagementDemo({ embedded = false }: { embedded?: boolean }) {
  const [courseIndex, setCourseIndex] = useState(0);
  const [tab, setTab] = useState<StudyTab>("overview");
  const [flipped, setFlipped] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const course = courses[courseIndex];

  function chooseCourse(index: number) {
    setCourseIndex(index);
    setTab("overview");
    setFlipped(false);
    setSelectedAnswer("");
    setShowFeedback(false);
  }

  return (
    <main className={embedded ? "w-full text-foreground" : "relative left-1/2 w-[calc(100vw-2rem)] max-w-[1380px] -translate-x-1/2 text-foreground sm:w-[calc(100vw-3rem)]"}>
      <ProjectDemoTopbar embedded={embedded} title="AI Learning Management System" source="https://github.com/patelpreet404-alt/ai-learning-management-system" />
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4 px-1">
        <div className="max-w-2xl">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Your study desk</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">A guided course space for notes, flashcards, quizzes, and quick review.</p>
        </div>
        <DemoNotice><BookOpen className="size-3.5" /> Sample course data · no sign-in</DemoNotice>
      </div>

      <div className="grid gap-4 lg:grid-cols-[258px_minmax(0,1fr)]">
        <aside className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between"><h2 className="text-sm font-semibold">My courses</h2><span className="text-xs text-muted-foreground">3</span></div>
          <div className="space-y-2">
            {courses.map((item, index) => (
              <button key={item.title} type="button" onClick={() => chooseCourse(index)} aria-pressed={courseIndex === index} className={"w-full rounded-lg border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " + (courseIndex === index ? item.tone : "border-border hover:bg-muted/60")}>
                <span className="mb-2 flex items-center justify-between"><span className={"size-2 rounded-full " + item.color} /><span className="text-[11px] opacity-75">{item.progress}% complete</span></span>
                <span className="block text-xs font-semibold">{item.title}</span><span className="mt-1 block text-[11px] opacity-75">{item.subject}</span>
              </button>
            ))}
          </div>
          <button type="button" disabled className={buttonStyle + " mt-3 w-full justify-start text-xs"}><Plus className="size-3.5" /> Create course <span className="ml-auto text-[10px] text-muted-foreground">Preview only</span></button>
          <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-950 dark:border-amber-300/20 dark:bg-amber-300/10 dark:text-amber-100"><div className="flex items-center gap-2 text-xs font-semibold"><Clock3 className="size-3.5" /> Your weekly rhythm</div><p className="mt-1.5 text-xs leading-relaxed opacity-75">A little review each day helps new ideas stick.</p></div>
        </aside>

        <section className="min-h-[680px] overflow-hidden rounded-xl border border-border bg-card shadow-sm sm:min-h-[740px]">
          <div className="border-b border-border p-4 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div><div className="mb-2 flex items-center gap-2 text-xs"><span className={"rounded-full border px-2 py-0.5 font-medium " + course.tone}>{course.subject}</span><span className="text-muted-foreground">Self-paced</span></div><h2 className="text-xl font-semibold tracking-tight sm:text-2xl">{course.title}</h2><p className="mt-1.5 max-w-xl text-sm text-muted-foreground">{course.description}</p></div>
              <button type="button" className={buttonStyle} onClick={() => setTab("notes")}><BookOpen className="size-4" /> Continue learning</button>
            </div>
            <div className="mt-5 flex items-center gap-3"><div className="h-2 flex-1 overflow-hidden rounded-full bg-muted"><div className={"h-full rounded-full transition-all " + course.color} style={{ width: course.progress + "%" }} /></div><span className="text-xs font-medium tabular-nums text-muted-foreground">{course.progress}%</span></div>
          </div>

          <div className="flex gap-1 overflow-x-auto border-b border-border px-3 sm:px-5" role="tablist" aria-label="Study materials">
            {tabs.map((item) => <button key={item} type="button" role="tab" aria-selected={tab === item} onClick={() => { setTab(item); setFlipped(false); setSelectedAnswer(""); setShowFeedback(false); }} className={"shrink-0 border-b-2 px-3 py-3 text-xs font-medium capitalize transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " + (tab === item ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground")}>{item === "q&a" ? "Q&A" : item}</button>)}
          </div>

          <div className="p-4 sm:p-6">
            {tab === "overview" && <div>
              <div className="mb-4 flex items-center justify-between"><div><h3 className="text-base font-semibold">Course outline</h3><p className="mt-1 text-xs text-muted-foreground">Pick up where you left off or revisit a chapter.</p></div><span className={"rounded-full px-2.5 py-1 text-xs font-medium " + course.tone}>{course.chapters.length} chapters</span></div>
              <div className="divide-y divide-border rounded-xl border border-border">{course.chapters.map((chapter, index) => <button key={chapter} type="button" onClick={() => setTab("notes")} className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"><span className={"grid size-8 shrink-0 place-items-center rounded-full text-xs font-semibold " + (index < Math.max(1, Math.round(course.progress / 25)) ? course.tone : "bg-muted text-muted-foreground")}>{index < Math.max(1, Math.round(course.progress / 25)) ? <Check className="size-4" /> : String(index + 1).padStart(2, "0")}</span><span className="min-w-0 flex-1"><span className="block text-sm font-medium">{chapter}</span><span className="mt-1 block text-xs text-muted-foreground">{index < Math.max(1, Math.round(course.progress / 25)) ? "Reviewed · Notes, cards, quiz" : "Notes, flashcards, quiz"}</span></span><ArrowRight className="size-4 shrink-0 text-muted-foreground" /></button>)}</div>
            </div>}

            {tab === "notes" && <article className="prose prose-sm max-w-3xl dark:prose-invert"><div className="not-prose mb-5 flex items-center gap-3"><span className={"grid size-10 place-items-center rounded-xl " + course.tone}><BookOpen className="size-5" /></span><div><p className="text-xs font-medium text-muted-foreground">STUDY NOTES · CHAPTER 01</p><h3 className="mt-1 text-lg font-semibold text-foreground">{course.noteTitle}</h3></div></div><p>{course.noteIntro}</p><div className={"not-prose my-5 rounded-xl border p-4 " + course.tone}><p className="text-xs font-semibold">Remember this</p><p className="mt-1 text-sm leading-relaxed opacity-80">{course.takeaway}</p></div><h4>Put it into practice</h4><p>{course.noteDetails}</p></article>}

            {tab === "flashcards" && <div className="mx-auto max-w-xl">
              <div className="mb-4 flex items-center justify-between"><div><h3 className="text-base font-semibold">Quick review</h3><p className="mt-1 text-xs text-muted-foreground">Card 1 of 12 · select to flip</p></div><button type="button" className={buttonStyle} onClick={() => setFlipped(!flipped)}><RotateCcw className="size-3.5" /> Flip card</button></div>
              <button type="button" aria-pressed={flipped} onClick={() => setFlipped(!flipped)} className={"flex min-h-64 w-full flex-col items-center justify-center rounded-2xl border p-8 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " + course.tone}><span className="text-[11px] font-semibold uppercase tracking-wider opacity-70">{flipped ? "Answer" : "Question"}</span><span className="mt-4 max-w-md text-lg font-medium leading-relaxed">{flipped ? course.cardAnswer : course.cardQuestion}</span><span className="mt-6 text-xs opacity-70">Select the card to reveal</span></button>
            </div>}

            {tab === "quiz" && <div className="mx-auto max-w-2xl">
              <div className="mb-5 flex items-center justify-between"><div><h3 className="text-base font-semibold">Check your understanding</h3><p className="mt-1 text-xs text-muted-foreground">Question 1 of 8</p></div><span className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">Untimed practice</span></div>
              <p className="text-sm font-medium leading-relaxed">{course.quizQuestion}</p>
              <div className="mt-4 space-y-2">{course.options.map((option, index) => <button key={option} type="button" onClick={() => { setSelectedAnswer(option); setShowFeedback(true); }} className={"flex w-full items-center gap-3 rounded-lg border p-3 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " + (selectedAnswer === option ? course.tone : "border-border hover:bg-muted/50")}><span className="grid size-6 shrink-0 place-items-center rounded-full border border-current/20 text-xs">{String.fromCharCode(65 + index)}</span>{option}</button>)}</div>
              {showFeedback && <p role="status" className={"mt-4 rounded-lg p-3 text-sm " + (selectedAnswer === course.correct ? "bg-emerald-500/10 text-emerald-800 dark:text-emerald-200" : "bg-amber-500/10 text-amber-800 dark:text-amber-200")}>{selectedAnswer === course.correct ? "That's right. Nice work connecting the idea to the method." : "Take another look at the key idea, then try once more."}</p>}
            </div>}

            {tab === "q&a" && <div className="mx-auto max-w-2xl"><h3 className="text-base font-semibold">Questions and answers</h3><p className="mt-1 text-xs text-muted-foreground">A few helpful prompts from this course.</p><div className="mt-4 space-y-3">{course.questions.map(([question, answer], index) => <details key={question} open={index === 0} className="rounded-lg border border-border p-4"><summary className="cursor-pointer text-sm font-medium">{question}</summary><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{answer}</p></details>)}</div></div>}

            <p className="mt-8 border-t border-border pt-4 text-center text-[11px] text-muted-foreground"><FileText className="mr-1 inline size-3" /> Front-end preview with sample content. Course generation, sign-in, and saved progress are not connected.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
