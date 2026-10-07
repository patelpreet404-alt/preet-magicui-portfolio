"use client";

import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  BookOpenText,
  Check,
  ChevronRight,
  Clock3,
  FileText,
  Github,
  LockKeyhole,
  Plus,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const courses = [
  {
    title: "Applied Machine Learning",
    subject: "AI & data",
    progress: 68,
    description: "Build intuition for patterns, useful features, and fair model evaluation.",
    chapters: ["A practical map of machine learning", "Preparing a reliable dataset", "Training your first model", "Evaluating beyond accuracy"],
    noteTitle: "A model learns from examples",
    noteIntro: "Machine learning turns examples into a rule that can help with new decisions. The goal is not to memorize the training set; it is to find patterns that hold up in the world outside it.",
    takeaway: "A useful evaluation checks examples the model has not seen during training.",
    noteDetails: "Keep training data for fitting, validation data for comparing choices, and a held-out test set for one final estimate. Reusing the test set during development can quietly make it part of the training process.",
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

const tabLabels: Record<StudyTab, string> = {
  overview: "Course plan",
  notes: "Lesson notes",
  flashcards: "Flashcard",
  quiz: "Quick quiz",
  "q&a": "Course Q&A",
};

function PreviewHeader({ embedded }: { embedded: boolean }) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e7e0e4] pb-4">
      <div className="flex min-w-0 items-center gap-3">
        {!embedded && (
          <Link
            href="/"
            aria-label="Back to portfolio"
            className="grid size-9 shrink-0 place-items-center rounded-full border border-[#e7e0e4] bg-white text-[#171217] transition-colors hover:bg-[#fff8fb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d63384]"
          >
            <ArrowLeft className="size-4" />
          </Link>
        )}
        <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-[#eadfe5] bg-white text-[#d63384]">
          <BookOpenText className="size-5" aria-hidden />
        </span>
        <div className="min-w-0">
          <p className="font-bold tracking-tight">Studyroom</p>
          <p className="truncate text-xs text-[#5f565c]">AI Learning Management System · sample workspace</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#eadfe5] bg-white px-2.5 py-1 text-xs font-medium text-[#51464d]">
          <span className="size-1.5 rounded-full bg-[#d63384]" aria-hidden />
          Preview mode
        </span>
        <a
          href="https://github.com/patelpreet404-alt/ai-learning-management-system"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View AI Learning Management System source on GitHub"
          className="inline-flex min-h-9 items-center gap-2 rounded-full border border-[#171217] bg-white px-3 text-xs font-semibold transition-colors hover:bg-[#171217] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d63384]"
        >
          <Github className="size-4" aria-hidden />
          <span className="hidden sm:inline">Source</span>
        </a>
      </div>
    </header>
  );
}

export function LearningManagementDemo({ embedded = false }: { embedded?: boolean }) {
  const [courseIndex, setCourseIndex] = useState(0);
  const [tab, setTab] = useState<StudyTab>("overview");
  const [activeChapter, setActiveChapter] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const course = courses[courseIndex];

  function chooseCourse(index: number) {
    setCourseIndex(index);
    setTab("overview");
    setActiveChapter(0);
    setFlipped(false);
    setSelectedAnswer("");
    setShowFeedback(false);
  }

  function chooseTab(item: StudyTab) {
    setTab(item);
    setFlipped(false);
    setSelectedAnswer("");
    setShowFeedback(false);
  }

  const content = (
    <div className="flex flex-col gap-5">
      <PreviewHeader embedded={embedded} />

      <section className="grid gap-2 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <h1 className="max-w-2xl text-2xl font-bold tracking-tight sm:text-3xl">Make a little progress today.</h1>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-[#5f565c] sm:text-base">
            Pick a course, settle into one idea, and give it your attention.
          </p>
        </div>
        <p className="inline-flex w-fit items-center gap-2 text-xs font-medium text-[#5f565c]">
          <LockKeyhole className="size-3.5" aria-hidden />
          Sample content · no account needed
        </p>
      </section>

      <div className="grid gap-5 lg:grid-cols-[245px_minmax(0,1fr)]">
        <aside className="flex flex-col gap-5 border-b border-[#e7e0e4] pb-5 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-5" aria-label="Course navigation">
          <div>
            <div className="mb-2 flex items-baseline justify-between">
              <h2 className="text-xs font-bold uppercase tracking-[0.12em]">Your courses</h2>
              <span className="text-xs text-[#5f565c]">{courses.length} samples</span>
            </div>
            <div className="space-y-1">
              {courses.map((item, index) => (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => chooseCourse(index)}
                  aria-pressed={courseIndex === index}
                  className={"group w-full rounded-xl border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d63384] " + (courseIndex === index ? "border-[#d63384] bg-white" : "border-transparent hover:bg-[#fff8fb]")}
                >
                  <span className="flex items-start justify-between gap-2">
                    <span className="text-sm font-semibold leading-snug">{item.title}</span>
                    <ChevronRight className={"mt-0.5 size-4 shrink-0 transition-transform " + (courseIndex === index ? "translate-x-0.5" : "text-[#8b7985] group-hover:translate-x-0.5")} aria-hidden />
                  </span>
                  <span className="mt-1 block text-xs text-[#5f565c]">{item.subject}</span>
                  <span className="mt-2 flex items-center gap-2">
                    <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white">
                      <span className="block h-full rounded-full bg-[#d63384]" style={{ width: item.progress + "%" }} />
                    </span>
                    <span className="text-[11px] tabular-nums text-[#5f565c]">{item.progress}%</span>
                  </span>
                </button>
              ))}
            </div>
            <button
              type="button"
              disabled
              title="Course creation is not connected in this sample."
              className="mt-3 inline-flex min-h-10 w-full items-center justify-start gap-2 rounded-xl border border-dashed border-[#cbb9c4] px-3 text-xs font-medium text-[#766a72] disabled:cursor-not-allowed disabled:opacity-75"
            >
              <Plus className="size-3.5" aria-hidden />
              Create a course
              <span className="ml-auto text-[10px]">Preview only</span>
            </button>
          </div>

          <div className="rounded-xl bg-[#171217] p-4 text-white">
            <p className="flex items-center gap-2 text-xs font-semibold">
              <Clock3 className="size-3.5 text-[#ffb6d7]" aria-hidden />
              A steady rhythm
            </p>
            <p className="mt-2 text-xs leading-relaxed text-white/75">Short, regular reviews make it easier to return to a new idea.</p>
            <div className="mt-3 flex items-center gap-1.5" aria-label="Example weekly study plan">
              {["M", "T", "W", "T", "F"].map((day, index) => (
                <span key={day + index} className={"grid size-7 place-items-center rounded-full text-[10px] font-semibold " + (index < 3 ? "bg-[#ffb6d7] text-[#171217]" : "border border-white/25 text-white/65")}>{day}</span>
              ))}
            </div>
          </div>
        </aside>

        <div className="min-w-0 space-y-5">
          <section className="relative overflow-hidden rounded-2xl border border-[#e7e0e4] bg-white p-5 shadow-sm shadow-[#171217]/5 sm:p-7">
            <div className="relative max-w-3xl">
              <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#d63384]">
                <Sparkles className="size-3.5" aria-hidden />
                Pick up where you left off
              </p>
              <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
                <div className="max-w-xl">
                  <p className="text-xs font-semibold text-[#5f565c]">{course.subject} · self-paced</p>
                  <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">{course.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-[#5f565c]">{course.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => chooseTab("notes")}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#171217] px-4 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d63384] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                >
                  Continue lesson
                  <ArrowRight className="size-4" aria-hidden />
                </button>
              </div>
              <div className="mt-5 flex items-center gap-3">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#f2edf0]" role="progressbar" aria-label={course.title + " progress"} aria-valuemin={0} aria-valuemax={100} aria-valuenow={course.progress}>
                  <div className="h-full rounded-full bg-[#d63384]" style={{ width: course.progress + "%" }} />
                </div>
                <span className="text-xs font-bold tabular-nums">{course.progress}% complete</span>
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-[#e7e0e4] bg-white shadow-sm shadow-[#171217]/5">
            <div className="flex gap-1 overflow-x-auto border-b border-[#e7e0e4] p-2 sm:px-4" role="tablist" aria-label="Study materials">
              {tabs.map((item) => (
                <button
                  key={item}
                  type="button"
                  role="tab"
                  aria-selected={tab === item}
                  onClick={() => chooseTab(item)}
                  className={"min-h-10 shrink-0 rounded-lg px-3 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d63384] " + (tab === item ? "bg-[#171217] text-white" : "text-[#5f565c] hover:bg-[#fff8fb] hover:text-[#171217]")}
                >
                  {tabLabels[item]}
                </button>
              ))}
            </div>

            <div className="p-4 sm:p-6">
              {tab === "overview" && (
                <div>
                  <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold">Course plan</h3>
                      <p className="mt-1 text-sm text-[#5f565c]">Choose a lesson to open the sample notes.</p>
                    </div>
                    <span className="rounded-full border border-[#eadfe5] bg-white px-3 py-1 text-xs font-semibold text-[#51464d]">{course.chapters.length} lessons</span>
                  </div>
                  <div className="divide-y divide-[#eadfe5] border-y border-[#eadfe5]">
                    {course.chapters.map((chapter, index) => {
                      const reviewed = index < Math.max(1, Math.round(course.progress / 25));
                      return (
                        <button
                          key={chapter}
                          type="button"
                          onClick={() => {
                            setActiveChapter(index);
                            chooseTab("notes");
                          }}
                          className="flex w-full items-center gap-3 py-4 text-left transition-colors hover:bg-[#fff8fb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#d63384]"
                        >
                          <span className={"grid size-9 shrink-0 place-items-center rounded-full border border-[#e7e0e4] bg-white text-xs font-bold " + (reviewed ? "text-[#d63384]" : "text-[#5f565c")}>
                            {reviewed ? <Check className="size-4 text-[#d63384]" aria-label="Reviewed" /> : String(index + 1).padStart(2, "0")}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-sm font-semibold">{chapter}</span>
                            <span className="mt-1 block text-xs text-[#5f565c]">Sample lesson notes available</span>
                          </span>
                          <ArrowRight className="size-4 shrink-0 text-[#5f565c]" aria-hidden />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {tab === "notes" && (
                <article className="max-w-3xl">
                  <div className="mb-5 flex items-start gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-[#eadfe5] bg-white text-[#d63384]">
                      <FileText className="size-5" aria-hidden />
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#7a596b]">Sample lesson · {String(activeChapter + 1).padStart(2, "0")}</p>
                      <h3 className="mt-1 text-lg font-bold">{activeChapter === 0 ? course.noteTitle : course.chapters[activeChapter]}</h3>
                    </div>
                  </div>
                  <p className="text-sm leading-7 text-[#493d45]">{course.noteIntro}</p>
                  <div className="my-5 rounded-xl border border-[#e7e0e4] bg-[#fff8fb] p-4">
                    <p className="text-xs font-bold uppercase tracking-wide">Keep in mind</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-[#493d45]">{course.takeaway}</p>
                  </div>
                  <h4 className="font-bold">Put it into practice</h4>
                  <p className="mt-2 text-sm leading-7 text-[#493d45]">{course.noteDetails}</p>
                </article>
              )}

              {tab === "flashcards" && (
                <div className="mx-auto max-w-xl">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold">One idea to remember</h3>
                      <p className="mt-1 text-sm text-[#5f565c]">Flip the card to reveal the answer.</p>
                    </div>
                    <button type="button" onClick={() => setFlipped(!flipped)} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#e7e0e4] px-3.5 text-xs font-semibold transition-colors hover:bg-[#fff8fb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d63384]">
                      <RotateCcw className="size-3.5" aria-hidden />
                      Flip card
                    </button>
                  </div>
                  <button
                    type="button"
                    aria-pressed={flipped}
                    onClick={() => setFlipped(!flipped)}
                    className="flex min-h-64 w-full flex-col items-center justify-center rounded-2xl border border-[#e7e0e4] bg-white p-8 text-center transition-colors hover:border-[#d63384] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d63384]"
                  >
                    <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#6c3f56]">{flipped ? "Answer" : "Question"}</span>
                    <span className="mt-4 max-w-md text-xl font-semibold leading-relaxed">{flipped ? course.cardAnswer : course.cardQuestion}</span>
                    <span className="mt-6 text-xs text-[#5f565c]">Select the card to {flipped ? "see the question" : "reveal the answer"}</span>
                  </button>
                </div>
              )}

              {tab === "quiz" && (
                <div className="mx-auto max-w-2xl">
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold">Quick check</h3>
                      <p className="mt-1 text-sm text-[#5f565c]">One sample question · untimed</p>
                    </div>
                    <span className="rounded-full border border-[#eadfe5] bg-white px-3 py-1 text-xs font-semibold text-[#51464d]">Practice</span>
                  </div>
                  <p className="text-sm font-semibold leading-relaxed">{course.quizQuestion}</p>
                  <div className="mt-4 space-y-2">
                    {course.options.map((option, index) => {
                      const isSelected = selectedAnswer === option;
                      return (
                        <button
                          key={option}
                          type="button"
                          aria-pressed={isSelected}
                          onClick={() => {
                            setSelectedAnswer(option);
                            setShowFeedback(true);
                          }}
                          className={"flex w-full items-center gap-3 rounded-xl border p-3 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d63384] " + (isSelected ? "border-[#d63384] bg-[#fff8fb]" : "border-[#eadfe5] hover:bg-[#fff8fb]")}
                        >
                          <span className="grid size-7 shrink-0 place-items-center rounded-full border border-[#d9ccd4] text-xs font-semibold">{String.fromCharCode(65 + index)}</span>
                          <span className="flex-1">{option}</span>
                          {isSelected && selectedAnswer === course.correct && <Check className="size-4" aria-hidden />}
                        </button>
                      );
                    })}
                  </div>
                  {showFeedback && (
                    <p role="status" className={"mt-4 rounded-xl border p-3 text-sm font-medium " + (selectedAnswer === course.correct ? "border-[#eadfe5] bg-[#fff8fb] text-[#40383d]" : "border-[#eadfe5] bg-white text-[#51464d]")}>
                      {selectedAnswer === course.correct ? "That’s right. Nice work connecting the idea to the method." : "Not quite. Revisit the key idea, then try another answer."}
                    </p>
                  )}
                </div>
              )}

              {tab === "q&a" && (
                <div className="mx-auto max-w-2xl">
                  <div className="flex items-center gap-3">
                    <span className="grid size-9 place-items-center rounded-full border border-[#eadfe5] bg-white text-[#d63384]"><BookOpen className="size-4" aria-hidden /></span>
                    <div>
                      <h3 className="font-bold">Questions from this course</h3>
                      <p className="mt-0.5 text-xs text-[#5f565c]">Prepared sample answers</p>
                    </div>
                  </div>
                  <div className="mt-4 divide-y divide-[#eadfe5] border-y border-[#eadfe5]">
                    {course.questions.map(([question, answer], index) => (
                      <details key={question} open={index === 0} className="py-4">
                        <summary className="cursor-pointer list-none text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d63384]">
                          <span className="flex items-center justify-between gap-3">{question}<ChevronRight className="size-4 shrink-0 transition-transform open:rotate-90" aria-hidden /></span>
                        </summary>
                        <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#5f565c]">{answer}</p>
                      </details>
                    ))}
                  </div>
                </div>
              )}

              <p className="mt-7 flex items-start gap-2 border-t border-[#eadfe5] pt-4 text-xs leading-relaxed text-[#5f565c]">
                <BookOpen className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                Sample content only. Course generation, sign-in, and saved progress are not connected in this preview.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );

  if (embedded) {
    return (
      <section aria-label="AI Learning Management sample preview" className="rounded-xl bg-white p-3 text-[#171217] sm:p-5">
        {content}
      </section>
    );
  }

  return (
    <main className="relative left-1/2 min-h-dvh w-[calc(100vw-2rem)] max-w-[1320px] -translate-x-1/2 bg-white px-4 py-5 text-[#171217] sm:w-[calc(100vw-3rem)] sm:px-6 sm:py-8">
      <div className="mx-auto w-full max-w-[1320px]">{content}</div>
    </main>
  );
}
