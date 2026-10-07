"use client";

import { ArrowRight, ArrowUpRight, BookOpen, FileText, LoaderCircle, MessageSquareText, Plus, Sparkles, Upload } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { DemoNotice, ProjectDemoTopbar, buttonStyle, primaryButtonStyle } from "./project-demo-shared";
import { DemoSceneTour } from "./demo-scene-tour";

const suggestions = [
  { question: "What is retrieval-augmented generation?", answer: "Retrieval-augmented generation (RAG) combines a retrieval system with a language model. It fetches relevant text from an external source, such as a PDF, and includes that text in the prompt so the response is grounded in the document.", page: 1, source: "Introduction to Retrieval-Augmented Generation", excerpt: "RAG combines a retrieval system with a language model so responses can be grounded in external text." },
  { question: "How does semantic search work?", answer: "Semantic search looks for passages with similar meaning, even when they do not use the same words. The guide describes converting text chunks and the query into vectors, then finding nearby vectors.", page: 3, source: "Semantic Search and FAISS", excerpt: "Text chunks and questions are represented as vectors so nearby meanings can be retrieved." },
  { question: "What does FAISS do?", answer: "FAISS indexes vector embeddings. Given a new query vector, it finds the nearest neighbors: the chunks most likely to contain a relevant answer.", page: 3, source: "Semantic Search and FAISS", excerpt: "FAISS searches vector indexes to find the nearest passages for a query." },
  { question: "Walk me through the document pipeline.", answer: "The sample guide describes a pipeline that chunks document text, creates embeddings, stores the vectors in FAISS, and retrieves relevant passages when a question is asked.", page: 2, source: "How This Sample Document Works", excerpt: "The sample flow moves from text chunks to embeddings, an index, and retrieved passages." },
];

type Citation = { page: number; source: string; excerpt: string };
type Message = { role: "user" | "assistant"; text: string; citation?: Citation };

export function ResearchPaperDemo({ embedded = false }: { embedded?: boolean }) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "user", text: suggestions[0].question },
    { role: "assistant", text: suggestions[0].answer, citation: suggestions[0] },
  ]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialPreview, setInitialPreview] = useState(true);
  const [visibleCharacters, setVisibleCharacters] = useState(suggestions[0].answer.length);
  const [isTyping, setIsTyping] = useState(false);
  const [previewRun, setPreviewRun] = useState(0);
  const typingTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (embedded || !initialPreview) return;
    const answerLength = suggestions[0].answer.length;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const startTimer = window.setTimeout(() => {
      setVisibleCharacters(0);
      setIsTyping(true);
      let count = 0;
      typingTimer.current = window.setInterval(() => {
        count = Math.min(count + 2, answerLength);
        setVisibleCharacters(count);
        if (count >= answerLength) {
          window.clearInterval(typingTimer.current);
          typingTimer.current = undefined;
          setIsTyping(false);
        }
      }, 24);
    }, previewRun === 0 ? 700 : 100);

    return () => {
      window.clearTimeout(startTimer);
      if (typingTimer.current !== undefined) window.clearInterval(typingTimer.current);
      typingTimer.current = undefined;
    };
  }, [embedded, initialPreview, previewRun]);

  function ask(question: string) {
    const clean = question.trim();
    if (!clean || loading) return;
    setInitialPreview(false);
    setIsTyping(false);
    setVisibleCharacters(suggestions[0].answer.length);
    if (typingTimer.current !== undefined) window.clearInterval(typingTimer.current);
    const normalized = clean.toLowerCase();
    const answer = suggestions.find((item) =>
      item.question.toLowerCase().split(" ").some((word) => word.length > 4 && normalized.includes(word))
    );
    setMessages((current) => [...current, { role: "user", text: clean }]);
    setDraft("");
    setLoading(true);
    window.setTimeout(() => {
      const response = answer
        ? { text: answer.answer, citation: answer }
        : { text: "This preview uses prepared answers about RAG, semantic search, FAISS, and the document pipeline. Choose one of the suggested questions to explore a cited response.", citation: undefined };
      setMessages((current) => [...current, { role: "assistant", ...response }]);
      setLoading(false);
    }, 600);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    ask(draft);
  }

  return (
    <main className={"research-theme bg-background p-4 text-foreground sm:p-6 " + (embedded ? "w-full rounded-2xl border border-[#403654] shadow-[0_24px_70px_-44px_rgba(96,63,163,0.7)]" : "project-demo-fullscreen min-h-dvh w-full pb-28 sm:pb-28")}>
      <ProjectDemoTopbar embedded={embedded} title="ResearchPaper AI" source="https://github.com/patelpreet404-alt/researchpaper-ai" />
      <div data-demo-scene="Research workspace" className="research-hero mb-5 flex flex-wrap items-end justify-between gap-4 rounded-2xl border border-[#473d66] p-5 sm:p-7">
        <div className="max-w-2xl">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-4xl">A clearer way to read <span className="text-[#cbb9ff]">research.</span></h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">Explore a sample document, ask a prepared question, and follow each answer back to its source.</p>
        </div>
        <DemoNotice><Sparkles className="size-3.5" /> Prepared answers · no live AI</DemoNotice>
      </div>

      <div className="grid gap-4 lg:grid-cols-[258px_minmax(0,1fr)]">
        <aside className="order-2 flex flex-col gap-4 lg:order-1">
          <section data-demo-scene="Document library" data-demo-order-desktop="1" data-demo-order-mobile="4" className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Your library</h2>
              <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">1 document</span>
            </div>
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 transition-colors hover:border-primary/60">
              <span className="mb-2 grid size-9 place-items-center rounded-lg bg-red-500/10 text-red-600 dark:text-red-300"><FileText className="size-4" /></span>
              <p className="text-xs font-semibold leading-snug">Introduction to Retrieval-Augmented Generation</p>
              <p className="mt-2 text-[11px] text-muted-foreground">Sample research note · 3 pages</p>
            </div>
            <button type="button" disabled aria-label="Uploads unavailable in this demo" className="mt-3 flex min-h-24 w-full cursor-not-allowed flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/30 px-3 text-center text-xs text-muted-foreground disabled:opacity-100">
              <Upload className="size-4" />
              <span className="font-medium text-foreground/80">Add another document</span>
              <span>Uploads are unavailable in this demo</span>
            </button>
          </section>
          <section data-demo-scene="Sample paper" data-demo-order-desktop="2" data-demo-order-mobile="5" className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <h2 className="text-sm font-semibold">Sample document</h2>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">This workspace keeps its example paper and prepared answers in the browser. It does not accept files or contact an AI service.</p>
            <a href="/samples/rag-study-guide.pdf" target="_blank" rel="noopener noreferrer" className={buttonStyle + " mt-3 w-full text-xs"}>
              <BookOpen className="size-3.5" /> Open sample PDF <ArrowUpRight className="ml-auto size-3.5" />
            </a>
          </section>
        </aside>

        <section className="order-1 flex min-h-[690px] flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm sm:min-h-[740px] lg:order-2">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary"><MessageSquareText className="size-4" /></div>
              <div className="min-w-0">
                <h2 className="text-sm font-semibold">Ask the document</h2>
                <p className="truncate text-xs text-muted-foreground">Introduction to Retrieval-Augmented Generation</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!embedded && <button type="button" onClick={() => { setMessages([{ role: "user", text: suggestions[0].question }, { role: "assistant", text: suggestions[0].answer, citation: suggestions[0] }]); setDraft(""); setLoading(false); setInitialPreview(true); setVisibleCharacters(0); setIsTyping(false); setPreviewRun((run) => run + 1); }} className={buttonStyle + " research-action min-h-9 px-3 text-xs"}><Sparkles className="size-3.5" /> Replay demo</button>}
              <button type="button" onClick={() => { setMessages([]); setDraft(""); setLoading(false); setInitialPreview(false); setIsTyping(false); if (typingTimer.current !== undefined) window.clearInterval(typingTimer.current); }} className={buttonStyle + " research-action min-h-9 px-3 text-xs"}>
                <Plus className="size-3.5" /> New chat
              </button>
            </div>
          </div>

          <div data-demo-scene="Suggested questions" data-demo-order-desktop="4" data-demo-order-mobile="2" className="border-b border-border bg-muted/20 px-4 py-4 sm:px-6">
            <div className="mb-2 flex items-center justify-between gap-3">
              <h3 className="text-[11px] font-semibold tracking-wide text-muted-foreground">SUGGESTED QUESTIONS</h3>
              <span className="text-[11px] text-muted-foreground">Select one to explore</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((item) => (
                <button key={item.question} type="button" disabled={loading} onClick={() => ask(item.question)} className="rounded-full border border-border bg-background px-3 py-2 text-left text-xs transition-all hover:-translate-y-0.5 hover:border-primary/60 hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50">{item.question}</button>
              ))}
            </div>
          </div>

          <div data-demo-scene="Answer and citation" data-demo-order-desktop="5" data-demo-order-mobile="3" className="flex-1 space-y-5 overflow-y-auto px-4 py-5 sm:px-6" aria-live="polite">
            {messages.length === 0 && !loading ? (
              <div className="flex min-h-[330px] flex-col items-center justify-center text-center">
                <div className="grid size-12 place-items-center rounded-2xl bg-muted text-muted-foreground"><MessageSquareText className="size-5" /></div>
                <h3 className="mt-4 text-base font-semibold">Start with a question</h3>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">Choose one above to see a prepared sample answer with its source.</p>
              </div>
            ) : messages.map((message, index) => (
              <div key={index} className={"flex " + (message.role === "user" ? "justify-end" : "justify-start")}>
                {message.role === "user" ? (
                  <p className="max-w-[600px] rounded-2xl rounded-br-sm bg-primary px-4 py-3 text-sm leading-relaxed text-primary-foreground">{message.text}</p>
                ) : (
                  <div className="w-full max-w-[780px] space-y-3">
                    <div className="flex items-center gap-2 text-xs font-semibold"><span className="grid size-6 place-items-center rounded-full bg-primary/10 text-primary"><Sparkles className="size-3" /></span> Sample response</div>
                    <p className="text-sm leading-7 text-foreground/90">{initialPreview && index === 1 ? suggestions[0].answer.slice(0, visibleCharacters) : message.text}{initialPreview && index === 1 && isTyping && <span className="research-type-caret" aria-hidden />}</p>
                    {message.citation && !(initialPreview && isTyping) && (
                      <a href={"/samples/rag-study-guide.pdf#page=" + message.citation.page} target="_blank" rel="noopener noreferrer" className="research-citation group block max-w-xl rounded-lg border border-border bg-background p-3 transition-colors hover:border-primary/40 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <span className="flex min-w-0 items-center gap-2 text-xs font-medium"><FileText className="size-3.5 shrink-0 text-primary" /><span className="truncate">{message.citation.source}</span></span>
                          <span className="shrink-0 rounded-md bg-muted px-2 py-1 text-[11px] text-muted-foreground">p. {message.citation.page}</span>
                        </div>
                        <p className="text-xs leading-relaxed text-muted-foreground">“{message.citation.excerpt}”</p>
                        <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-primary">Open source in sample PDF <ArrowUpRight className="size-3" /></span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}
            {loading && <div className="space-y-3" role="status" aria-label="Loading prepared sample answer"><div className="flex items-center gap-2 text-xs font-medium text-muted-foreground"><LoaderCircle className="size-4 animate-spin" /> Finding a prepared response…</div><div className="h-3 w-4/5 animate-pulse rounded bg-muted" /><div className="h-3 w-2/3 animate-pulse rounded bg-muted" /><div className="h-20 max-w-lg animate-pulse rounded-lg border border-border bg-muted/50" /></div>}
          </div>

          <div className="border-t border-border bg-background px-4 py-4 sm:px-6">
            <form onSubmit={submit} className="flex items-end gap-2 rounded-xl border border-border bg-card p-2 shadow-sm focus-within:ring-2 focus-within:ring-ring/50">
              <label className="sr-only" htmlFor="research-question">Ask a question about the sample document</label>
              <textarea id="research-question" rows={1} value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); ask(draft); } }} placeholder="Ask about this sample document…" className="max-h-28 min-h-10 flex-1 resize-y bg-transparent px-2 py-2 text-sm outline-none placeholder:text-muted-foreground" />
              <button type="submit" disabled={!draft.trim() || loading} className={primaryButtonStyle + " research-send min-h-9 px-3"} aria-label="Send question"><ArrowRight className="size-4" /></button>
            </form>
            <p className="mt-2 text-center text-[11px] text-muted-foreground">Prepared sample content · uploads and AI responses are disabled</p>
          </div>
        </section>
      </div>
      {!embedded && <DemoSceneTour />}
    </main>
  );
}
