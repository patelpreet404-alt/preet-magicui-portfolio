import { todo } from "./profile";

export interface CitationEvidence {
  kind: "source" | "demo" | "resume" | "case-study";
  label: string;
  href: string;
}

export interface CitationVisual {
  type: "bars";
  caption: string;
  bars: readonly { label: string; value: number }[];
}

export interface Citation {
  id: string;
  /** What is being backed up, in a few words (the note's title). */
  claim: string;
  /** One or two sentences. */
  explanation: string;
  evidence: readonly CitationEvidence[];
  visual?: CitationVisual;
}

const RP = "https://github.com/patelpreet404-alt/researchpaper-ai";
const OL = "https://github.com/patelpreet404-alt/OptiLang";

const list: readonly Citation[] = [
  // Hero
  {
    id: "hero-researchpaper",
    claim: "ResearchPaper AI cites the page behind every answer",
    explanation:
      "Page-aware extraction, FAISS retrieval, then a streamed answer that returns page citations. The public demo uses a prepared sample document rather than a live model.",
    evidence: [
      { kind: "demo", label: "Interactive sample", href: "/projects/researchpaper-ai" },
      { kind: "source", label: "app/services/chat_service.py", href: `${RP}/blob/main/app/services/chat_service.py` },
    ],
  },
  {
    id: "hero-rang",
    claim: "Attendance platform for 50+ employees at Rang Technologies",
    explanation:
      "Software Development Intern, Jun–Aug 2026. Flask and Supabase, IP-based verification, an admin analytics dashboard, 10+ endpoints optimized, and manual processing down 80%.",
    evidence: [{ kind: "resume", label: "Résumé (PDF)", href: "/preet-patel-resume.pdf" }],
  },
  {
    id: "hero-optilang",
    claim: "OptiLang, a compiler for a small C-like language in C++17",
    explanation:
      "A Flex/Bison front end, semantic checks, three-address code and five optimization passes. On the repository's demo program it cuts 57 instructions to 37 (35%) in about 0.34 ms.",
    evidence: [
      { kind: "demo", label: "Interactive preview", href: "/projects/optilang" },
      { kind: "source", label: "Repository", href: OL },
    ],
    visual: {
      type: "bars",
      caption: "Instructions on the repository's demo program",
      bars: [
        { label: "Before optimization", value: 57 },
        { label: "After five passes", value: 37 },
      ],
    },
  },

  // Experience
  {
    id: "exp-rang-80",
    claim: "Manual attendance processing down 80%",
    explanation: `Reported in the résumé: automated verification and reporting reduced manual attendance processing by 80%. ${todo("how the 80% was measured")}`,
    evidence: [{ kind: "resume", label: "Résumé (PDF)", href: "/preet-patel-resume.pdf" }],
  },

  // Selected work (one per row)
  {
    id: "proof-researchpaper",
    claim: "Retrieval over a persistent FAISS index",
    explanation:
      "Overlapping, page-tagged chunks are embedded and stored in a disk-backed FAISS index, so each answer is grounded in passages that can be traced to a page.",
    evidence: [
      { kind: "source", label: "vector_store_service.py", href: `${RP}/blob/main/app/services/vector_store_service.py` },
      { kind: "source", label: "chunking_service.py", href: `${RP}/blob/main/app/services/chunking_service.py` },
    ],
  },
  {
    id: "proof-optilang",
    claim: "Five optimization passes on three-address code",
    explanation:
      "Constant folding and propagation, common subexpression elimination, dead-code elimination, unreachable-block elimination, and loop-invariant code motion.",
    evidence: [{ kind: "source", label: "src/optimizer.cpp", href: `${OL}/blob/main/src/optimizer.cpp` }],
  },
  {
    id: "proof-studyloom",
    claim: "Generation runs in the background",
    explanation:
      "Gemini shapes the outline, and Inngest coordinates the longer generation jobs, so progress stays visible while notes, flashcards and quizzes are still being made.",
    evidence: [
      { kind: "source", label: "Repository", href: "https://github.com/patelpreet404-alt/ai-learning-management-system" },
    ],
  },
  {
    id: "proof-foodfolk",
    claim: "A map backed by a social API",
    explanation:
      "The interface uses React, TypeScript and Leaflet on OpenStreetMap data; the repository also includes a Node.js API with a SQLite schema for accounts, friendships, reviews and saved places.",
    evidence: [
      {
        kind: "source",
        label: "server/schema.sql",
        href: "https://github.com/patelpreet404-alt/foodfolk-discovery-map/blob/main/server/schema.sql",
      },
    ],
  },
];

export const citations: Readonly<Record<string, Citation>> = Object.fromEntries(list.map((citation) => [citation.id, citation]));

export function getCitation(id: string): Citation {
  const citation = citations[id];
  if (!citation) throw new Error(`Unknown citation id: ${id}`);
  return citation;
}
