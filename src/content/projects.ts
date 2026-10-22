import type { ContentLink } from "./profile";

export type ProjectDomain = "ai-ml" | "full-stack" | "systems" | "data" | "security";
export type ProjectStatus = "live-demo" | "prototype" | "ongoing-research" | "sample-data";

export const DOMAIN_LABELS: Record<ProjectDomain, string> = {
  "ai-ml": "AI & ML",
  "full-stack": "Full-stack",
  systems: "Systems",
  data: "Data",
  security: "Security",
};

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  "live-demo": "Live demo",
  prototype: "Prototype",
  "ongoing-research": "Ongoing research",
  "sample-data": "Sample data",
};

export interface ProjectMedia {
  /** Poster for the video, or the screenshot when there is no video. */
  poster: string;
  video?: string;
  alt: string;
}

export interface ArchitectureStage {
  id: string;
  title: string;
  action: string;
  input: string;
  output: string;
  contribution: string;
  source?: { label: string; href: string };
}

export interface Project {
  /** Stable URL slug. These match the old `/?project=<slug>` links, so do not rename them. */
  slug: string;
  name: string;
  subtitle?: string;
  oneLiner: string;
  /** Longer plain-text description (the old card copy). */
  summary: string;
  /** Visible placeholder until Preet supplies it. */
  role: string;
  /** Visible placeholder until Preet supplies it. */
  period: string;
  status: ProjectStatus;
  /** The previous, more specific status wording, shown on the case-study page. */
  statusNote: string;
  /** 1–4 = Selected work, in order. Everything else is listed under More work. */
  featuredRank?: number;
  domains: readonly ProjectDomain[];
  stack: readonly string[];
  links: readonly ContentLink[];
  media: ProjectMedia;
  /** Citation shown on the project's Selected work row (see citations.ts). */
  proof?: string;
  caseStudy: {
    problem: string;
    contribution: string;
    decisions: readonly string[];
    limitations: readonly string[];
    lessons: string;
  };
  workflow: readonly string[];
  architecture?: { summary: string; stages: readonly ArchitectureStage[] };
  screenshots?: readonly { src: string; alt: string; caption: string }[];
  /** Measured outcomes, each optionally backed by a citation. Projects without measured data omit this. */
  results?: readonly { text: string; citationId?: string }[];
  /** Key into PROJECT_DESIGNS in src/data/project-design-explorer.ts (overview, services, data model). */
  designExplorerId?: string;
  /** Caveats about the public demo; shown as "About this demo" on the case-study page only. */
  aboutDemo: string | null;
}

export const projects: readonly Project[] = [
  {
    slug: "researchpaper-ai",
    name: "ResearchPaper AI",
    oneLiner: "Ask a research paper anything; every answer cites the page it came from.",
    summary: "A research workspace for asking questions about PDF papers and checking answers against page-level citations. The demo opens with a sample document and prepared answers; document uploads and live AI responses are unavailable in this preview.",
    role: "[TODO: role]",
    period: "[TODO: month year]",
    status: "live-demo",
    statusNote: "Interactive preview",
    featuredRank: 1,
    domains: [
      "ai-ml",
      "full-stack"
    ],
    stack: [
      "Python",
      "FastAPI",
      "LangChain",
      "FAISS",
      "OpenAI API",
      "SQLite"
    ],
    links: [
      {
        kind: "demo",
        href: "https://researchpaper-ai-demo-7yoie94wv-patelpreet404-alts-projects.vercel.app/"
      },
      {
        kind: "source",
        href: "https://github.com/patelpreet404-alt/researchpaper-ai"
      },
      {
        kind: "preview",
        href: "/projects/researchpaper-ai"
      },
      {
        kind: "case-study",
        href: "/work/researchpaper-ai"
      }
    ],
    media: {
      poster: "/projects/researchpaper-ai-poster.jpg",
      video: "/projects/researchpaper-ai-demo.mp4",
      alt: "ResearchPaper AI answering a question about a sample PDF, with the answer's source passage cited to page 1."
    },
    proof: "proof-researchpaper",
    caseStudy: {
      problem: "Readers need answers to questions about PDF papers with evidence they can check against the source page.",
      contribution: "Built a retrieval workflow that extracts PDF text, indexes passages, and generates answers with page citations.",
      decisions: [
        "Overlapping chunks preserve nearby context; a persistent FAISS index supports semantic retrieval.",
        "FastAPI routes, RAG services, domain models, and adapters separate the API from retrieval infrastructure.",
        "SQLite stores conversation history for follow-up questions."
      ],
      limitations: [
        "The public preview uses a prepared document and answers. PDF uploads and live AI responses are unavailable there.",
        "Live responses require the configured backend and API access."
      ],
      lessons: "Page citations make retrieved evidence inspectable; a prepared preview must be clearly distinguished from a live model response."
    },
    workflow: [
      "Extract PDF text",
      "Chunk and embed",
      "Retrieve passages",
      "Answer with citations"
    ],
    architecture: {
      summary: "The source app ingests page-aware text, indexes overlapping chunks, retrieves evidence for a question, and streams a cited answer. The public portfolio preview is a separate prepared-sample experience.",
      stages: [
        {
          id: "extract",
          title: "Extract pages",
          action: "Read the uploaded PDF into page-level text and preserve document metadata.",
          input: "PDF file",
          output: "Page text and document metadata",
          contribution: "The PDF service extracts page-aware text for downstream chunking.",
          source: {
            label: "PDF service",
            href: "https://github.com/patelpreet404-alt/researchpaper-ai/blob/main/app/services/pdf_service.py"
          }
        },
        {
          id: "chunk",
          title: "Create chunks",
          action: "Split page text into overlapping passages while retaining page and document references.",
          input: "Page text",
          output: "Overlapping, page-tagged chunks",
          contribution: "A bounded chunk size and overlap preserve nearby context for retrieval.",
          source: {
            label: "Chunking service",
            href: "https://github.com/patelpreet404-alt/researchpaper-ai/blob/main/app/services/chunking_service.py"
          }
        },
        {
          id: "index",
          title: "Embed and index",
          action: "Generate embeddings and persist the vector index for semantic search.",
          input: "Document chunks",
          output: "Disk-backed FAISS index",
          contribution: "The vector-store adapter keeps retrieval infrastructure separate from the routes.",
          source: {
            label: "Vector store",
            href: "https://github.com/patelpreet404-alt/researchpaper-ai/blob/main/app/services/vector_store_service.py"
          }
        },
        {
          id: "retrieve",
          title: "Retrieve evidence",
          action: "Search for passages relevant to the reader’s question and keep their source metadata.",
          input: "Question and index",
          output: "Ranked source passages",
          contribution: "Retrieval filters work from the stored page-aware passages before generation.",
          source: {
            label: "Retrieval service",
            href: "https://github.com/patelpreet404-alt/researchpaper-ai/blob/main/app/services/retrieval_service.py"
          }
        },
        {
          id: "answer",
          title: "Generate a response",
          action: "Use retrieved passages and bounded conversation context to stream a grounded answer.",
          input: "Question, passages, recent history",
          output: "Streamed answer",
          contribution: "FastAPI routes and the chat service separate request handling from answer generation.",
          source: {
            label: "Chat service",
            href: "https://github.com/patelpreet404-alt/researchpaper-ai/blob/main/app/services/chat_service.py"
          }
        },
        {
          id: "cite",
          title: "Inspect citations",
          action: "Return page references from the retrieved context and store conversation history.",
          input: "Retrieved passages and answer",
          output: "Answer with page references; SQLite conversation records",
          contribution: "Citations help readers inspect evidence but do not prove an answer is correct.",
          source: {
            label: "Chat route",
            href: "https://github.com/patelpreet404-alt/researchpaper-ai/blob/main/app/api/routes_chat.py"
          }
        }
      ]
    },
    screenshots: [
      {
        src: "/projects/researchpaper-deployed.png",
        alt: "ResearchPaper AI product introduction",
        caption: "The product page explains PDF question answering and page citations."
      },
      {
        src: "/projects/researchpaper-ai.png",
        alt: "ResearchPaper AI prepared sample workspace",
        caption: "The public workspace uses a prepared sample and answers; it does not upload files or call a model."
      }
    ],
    designExplorerId: "researchpaper-ai",
    aboutDemo: "The public preview uses a prepared sample document and prepared answers. PDF uploads and live AI responses are unavailable there; live responses require the configured backend and API access."
  },
  {
    slug: "optilang",
    name: "OptiLang",
    oneLiner: "A compiler for a small C-like language, from tokens to optimized three-address code.",
    summary: "An interactive C++17 compiler preview that shows how code moves through lexical analysis, semantic checks, and optimization. Visitors can compare a before-and-after code sample and see the compiler concepts behind each stage.",
    role: "[TODO: role]",
    period: "[TODO: month year]",
    status: "live-demo",
    statusNote: "Interactive preview",
    featuredRank: 2,
    domains: [
      "systems"
    ],
    stack: [
      "C++17",
      "Flex",
      "Bison",
      "Clang / LLVM exercises",
      "Compiler design"
    ],
    links: [
      {
        kind: "demo",
        href: "https://patelpreet404-alt.github.io/OptiLang/"
      },
      {
        kind: "source",
        href: "https://github.com/patelpreet404-alt/OptiLang"
      },
      {
        kind: "preview",
        href: "/projects/optilang"
      },
      {
        kind: "case-study",
        href: "/work/optilang"
      }
    ],
    media: {
      poster: "/projects/optilang-poster.jpg",
      video: "/projects/optilang-demo.mp4",
      alt: "OptiLang's interactive compiler preview: a stage selector, a source program, and the optimized three-address code beside it."
    },
    proof: "proof-optilang",
    caseStudy: {
      problem: "Compiler learners need to see how a small statically typed language moves from source code to an optimized intermediate form.",
      contribution: "Built a C++17 compiler pipeline that tokenizes and parses source, checks semantics, and generates optimized three-address code.",
      decisions: [
        "Flex and Bison provide tokenization and LALR(1) parsing.",
        "Semantic checks cover types, scope, function resolution, and implicit widening.",
        "Five optimization passes operate on three-address code. LLVM examples in the repository are a separate Clang exercise."
      ],
      limitations: [
        "The browser deployment is an interactive compiler preview. Its examples illustrate the pipeline.",
        "The existing repository measurement is specific to its demo program: 57 to 37 instructions (35%) in about 0.34 ms on average."
      ],
      lessons: "An explicit intermediate representation makes the effect of each optimization easier to inspect and compare."
    },
    workflow: [
      "Tokenize",
      "Parse",
      "Check semantics",
      "Generate three-address code",
      "Optimize three-address code"
    ],
    architecture: {
      summary: "The custom compiler translates C-like source into optimized three-address code. The repository’s LLVM examples are a separate Clang exercise, not a later stage in this pipeline.",
      stages: [
        {
          id: "tokenize",
          title: "Tokenize",
          action: "Flex reads source text, tracks line positions, and classifies tokens.",
          input: ".mc source",
          output: "Token stream",
          contribution: "The lexer makes the language’s lexical rules explicit.",
          source: {
            label: "Lexer",
            href: "https://github.com/patelpreet404-alt/OptiLang/blob/main/src/lexer.l"
          }
        },
        {
          id: "parse",
          title: "Parse",
          action: "Bison applies the LALR(1) grammar and precedence rules to form the syntax tree.",
          input: "Token stream",
          output: "Abstract syntax tree",
          contribution: "Grammar and precedence rules keep syntax structure inspectable.",
          source: {
            label: "Parser grammar",
            href: "https://github.com/patelpreet404-alt/OptiLang/blob/main/src/parser.y"
          }
        },
        {
          id: "semantics",
          title: "Check semantics",
          action: "Validate types, scopes, function use, and supported implicit widening.",
          input: "Abstract syntax tree",
          output: "Semantically checked program or diagnostics",
          contribution: "Compilation stops after semantic errors rather than generating misleading output.",
          source: {
            label: "Semantic analysis",
            href: "https://github.com/patelpreet404-alt/OptiLang/blob/main/src/semantic.cpp"
          }
        },
        {
          id: "tac",
          title: "Generate TAC",
          action: "Translate the checked syntax tree into three-address instructions.",
          input: "Checked program",
          output: "Three-address code",
          contribution: "An explicit intermediate representation makes optimization effects easier to inspect.",
          source: {
            label: "TAC generator",
            href: "https://github.com/patelpreet404-alt/OptiLang/blob/main/src/tac_gen.cpp"
          }
        },
        {
          id: "optimize",
          title: "Optimize",
          action: "Run constant folding and propagation, common subexpression elimination, dead-code elimination, unreachable-block elimination, and loop-invariant code motion.",
          input: "Three-address code",
          output: "Optimized three-address code",
          contribution: "The passes operate on the compiler’s TAC; branching resets propagation where assumptions no longer hold.",
          source: {
            label: "Optimizer",
            href: "https://github.com/patelpreet404-alt/OptiLang/blob/main/src/optimizer.cpp"
          }
        }
      ]
    },
    results: [
      {
        text: "On the repository's demo program, the optimizer cuts the output from 57 instructions to 37 (35%) in about 0.34 ms on average.",
        citationId: "hero-optilang",
      },
    ],
    aboutDemo: "The browser deployment is an interactive compiler preview, and its examples illustrate the pipeline. The repository measurement is specific to its demo program: 57 to 37 instructions (35%) in about 0.34 ms on average."
  },
  {
    slug: "ai-learning-management",
    name: "Studyloom",
    subtitle: "AI course builder",
    oneLiner: "Turns a topic into a course: outline, notes, flashcards and quizzes, generated in the background.",
    summary: "A guided learning workspace that brings course notes, flashcards, quizzes, and question answering together in one place. The interactive browser preview includes a sample course so visitors can explore the learning flow without creating an account.",
    role: "[TODO: role]",
    period: "[TODO: month year]",
    status: "live-demo",
    statusNote: "Interactive preview",
    featuredRank: 3,
    domains: [
      "ai-ml",
      "full-stack"
    ],
    stack: [
      "Next.js",
      "Gemini",
      "Clerk",
      "Drizzle ORM",
      "PostgreSQL",
      "Inngest"
    ],
    links: [
      {
        kind: "demo",
        href: "https://studyloom-ai-learning.vercel.app"
      },
      {
        kind: "source",
        href: "https://github.com/patelpreet404-alt/ai-learning-management-system"
      },
      {
        kind: "preview",
        href: "/projects/ai-learning-management"
      },
      {
        kind: "case-study",
        href: "/work/ai-learning-management"
      }
    ],
    media: {
      poster: "/projects/ai-learning-management-poster.jpg",
      video: "/projects/ai-learning-management-demo.mp4",
      alt: "Studyloom's sample course workspace with lesson notes open and the course list at the left."
    },
    proof: "proof-studyloom",
    caseStudy: {
      problem: "Learners need course notes, flashcards, quizzes, and answers connected to a clear study plan.",
      contribution: "Built a guided workspace that turns a topic, course type, and difficulty into an outline and study materials.",
      decisions: [
        "Gemini generates the outline and material; Inngest coordinates longer generation tasks.",
        "Clerk handles identity, with Neon PostgreSQL and Drizzle ORM storing course and study data."
      ],
      limitations: [
        "The browser preview uses a sample course. Creating courses depends on the configured full application flow."
      ],
      lessons: "The interface makes generation progress visible so learners can distinguish material that is being generated from material that is ready."
    },
    workflow: [
      "Choose a topic",
      "Generate an outline",
      "Create study materials",
      "Study and quiz"
    ],
    screenshots: [
      {
        src: "/projects/studyloom-deployed.png",
        alt: "Studyloom learning workspace dashboard",
        caption: "Studyloom’s learner workspace, showing course navigation and a guided course plan."
      },
      {
        src: "/projects/ai-learning-management.png",
        alt: "Studyloom sample course workspace",
        caption: "The portfolio preview’s sample course and lesson materials; course creation uses the full application flow."
      }
    ],
    designExplorerId: "ai-lms",
    aboutDemo: "The browser preview uses a sample course. Creating courses depends on the configured full application flow."
  },
  {
    slug: "foodfolk",
    name: "Foodfolk",
    subtitle: "Good food, remembered",
    oneLiner: "A restaurant map shaped by your friends' recommendations.",
    summary: "A social restaurant map shaped by recommendations from friends. Explore Mumbai places, filter friends’ picks, save a shortlist, and revisit where you have eaten through a food passport. The public demo uses sample activity and keeps changes in the browser.",
    role: "[TODO: role]",
    period: "[TODO: month year]",
    status: "live-demo",
    statusNote: "Interactive preview",
    featuredRank: 4,
    domains: [
      "full-stack"
    ],
    stack: [
      "React",
      "TypeScript",
      "Leaflet",
      "OpenStreetMap",
      "Node.js",
      "SQLite"
    ],
    links: [
      {
        kind: "demo",
        href: "https://foodfolk-discovery-demo-patelpreet404-alts-projects.vercel.app/"
      },
      {
        kind: "source",
        href: "https://github.com/patelpreet404-alt/foodfolk-discovery-map"
      },
      {
        kind: "case-study",
        href: "/work/foodfolk"
      }
    ],
    media: {
      poster: "/projects/foodfolk-preview.jpg",
      alt: "The Cook Along landing page that the Foodfolk demo opens on."
    },
    proof: "proof-foodfolk",
    caseStudy: {
      problem: "Restaurant discovery needs a way to connect places with friends’ recommendations and a person’s own food history.",
      contribution: "Built a map interface for exploring Mumbai restaurants, filtering friends’ picks, saving places, and revisiting a food passport; the repository also includes the social API.",
      decisions: [
        "React, TypeScript, and Leaflet render the map using OpenStreetMap data.",
        "Photon and Overpass support restaurant and neighbourhood search.",
        "A Node.js API with SQLite supports persistent accounts, friendships, reviews, saved places, and photo access."
      ],
      limitations: [
        "The public deployment opens on Cook Along, with Food Map available in navigation.",
        "Food Map uses seeded accounts and activity; changes remain in the visitor’s browser.",
        "The persistent social backend requires a Node server and durable storage. This preview is not a launched social network."
      ],
      lessons: "Browser-local exploration and persistent social data have different storage needs and must be described clearly."
    },
    workflow: [
      "Explore the map",
      "Find a place",
      "See friends’ picks",
      "Save or review",
      "Revisit the food passport"
    ],
    designExplorerId: "foodfolk",
    aboutDemo: "The public deployment opens on the Cook Along landing page, with Food Map available in its navigation. Food Map uses seeded accounts and activity, and changes stay in the visitor's browser. The persistent social backend needs a Node server and durable storage; this preview is not a launched social network."
  },
  {
    slug: "subbieguard",
    name: "SubbieGuard",
    subtitle: "Variation administration, kept together",
    oneLiner: "A workspace that keeps a variation's source, evidence and next action in one reviewable record.",
    summary: "A development-stage commercial workspace for NSW electrical subcontractors, designed to keep an instructed variation’s source, evidence, and next action together in one reviewable record—from the initial instruction through notice preparation and commercial history.",
    role: "[TODO: role]",
    period: "[TODO: month year]",
    status: "prototype",
    statusNote: "Development-stage prototype",
    domains: [
      "full-stack"
    ],
    stack: [
      "Next.js",
      "TypeScript",
      "Supabase Auth",
      "Postgres",
      "Private Storage"
    ],
    links: [
      {
        kind: "demo",
        href: "https://subbieguard-portfolio-public.vercel.app",
        label: "Public case study"
      },
      {
        kind: "case-study",
        href: "/work/subbieguard"
      }
    ],
    media: {
      poster: "/projects/subbieguard-deployed.png",
      alt: "The SubbieGuard public case-study page."
    },
    caseStudy: {
      problem: "NSW commercial electrical subcontractors need to review variation instructions, contract sources, site evidence, labour notes, and next actions together.",
      contribution: "Built the development foundation for a commercial workspace that carries a variation record through evidence review, notice preparation, and commercial history.",
      decisions: [
        "Contract sources and versions stay visible; ambiguous rules and unsupported dates require human review.",
        "Estimates, claims, assessments, invoices, and payments remain distinct records to avoid repeated counting.",
        "Next.js, TypeScript, Supabase Auth, Postgres, private Storage, migrations, and role-aware access support the foundation."
      ],
      limitations: [
        "M0–M3 verified using synthetic development data.",
        "M4 prepared but not through hosted acceptance.",
        "M5–M6 future work.",
        "Real customer document handling remains gated. The workspace does not decide legal entitlement or establish valid legal service."
      ],
      lessons: "Human review and clear record boundaries are necessary when software organizes a commercial story with legal implications."
    },
    workflow: [
      "Capture the change",
      "Ground it in the contract",
      "Keep evidence with the work",
      "Make the next step clear",
      "Prepare and review a notice",
      "Track claim and payment history"
    ],
    aboutDemo: "A development-stage prototype using synthetic examples. It does not claim customer launch, legal approval, validated market demand, guaranteed payment, or revenue protection."
  },
  {
    slug: "crypto-ransomware-research",
    name: "Crypto-ransomware research",
    subtitle: "Pre-encryption identification",
    oneLiner: "Research into identifying crypto-ransomware before encryption, from sandbox behavior and file signatures.",
    summary: "Ongoing research into early crypto-ransomware identification. The approach combines behavioral features collected with Cuckoo Sandbox, Random Forest classification, and SHA-256 signature matching; a public demo and source repository are not available yet.",
    role: "[TODO: role]",
    period: "[TODO: month year]",
    status: "ongoing-research",
    statusNote: "Ongoing research",
    domains: [
      "security",
      "ai-ml"
    ],
    stack: [
      "Python",
      "Cuckoo Sandbox",
      "Random Forest",
      "SHA-256",
      "MySQL"
    ],
    links: [
      {
        kind: "case-study",
        href: "/work/crypto-ransomware-research"
      }
    ],
    media: {
      poster: "/projects/crypto-ransomware-preview.png",
      alt: "Preview image for the crypto-ransomware research project."
    },
    caseStudy: {
      problem: "This research investigates whether ransomware can be identified before encryption causes wider damage.",
      contribution: "Exploring behavioral feature extraction from Cuckoo Sandbox, Random Forest classification, and SHA-256 signature matching.",
      decisions: [
        "Behavioral classification and known-file signatures provide two different detection signals.",
        "Python supports the analysis workflow, with MySQL among the existing project tools."
      ],
      limitations: [
        "Research is ongoing; no public demo or source repository is available.",
        "No validated detection accuracy or operational deployment is claimed."
      ],
      lessons: "The research keeps behavioral classification separate from known-signature matching when describing its approach."
    },
    workflow: [
      "Collect sandbox behavior",
      "Extract features",
      "Evaluate classification",
      "Check signatures"
    ],
    aboutDemo: null
  },
  {
    slug: "fieldnote-commerce-intelligence",
    name: "Fieldnote",
    subtitle: "Commerce intelligence",
    oneLiner: "A commerce analytics study of order progression, repeat purchases, category mix and delivery timing.",
    summary: "A commerce analytics study of order progression, repeat purchases, category mix, and delivery timing. The linked page shows a static dashboard preview using synthetic sample data.",
    role: "[TODO: role]",
    period: "[TODO: month year]",
    status: "sample-data",
    statusNote: "Read-only visual preview",
    domains: [
      "data"
    ],
    stack: [
      "Next.js",
      "TypeScript",
      "Python",
      "SQLite",
      "SQL"
    ],
    links: [
      {
        kind: "demo",
        href: "https://fieldnote-commerce-dashboard.wirykiwi11.chatgpt.site/"
      },
      {
        kind: "source",
        href: "https://github.com/patelpreet404-alt/olist-ecommerce-analytics"
      },
      {
        kind: "case-study",
        href: "/work/fieldnote-commerce-intelligence"
      }
    ],
    media: {
      poster: "/projects/fieldnote-dashboard.png",
      alt: "Fieldnote dashboard screenshot using synthetic sample data."
    },
    caseStudy: {
      problem: "Marketplace analysts need clear definitions and views for order progression, customer retention, category revenue mix, and delivery timing.",
      contribution: "Built the dashboard interface, metric definitions, SQL reference queries, and a Python builder that aggregates a compatible SQLite source into a local analytics snapshot.",
      decisions: [
        "Use a bundled JSON snapshot so the repository dashboard can run without credentials or a live service.",
        "Count delivery outcomes at the order level before joining product lines, so multi-item baskets do not duplicate orders.",
        "Show recent customer cohorts only for observable follow-up months and calculate the headline retention from mature cohorts."
      ],
      limitations: [
        "The public page is a static visual preview of the dashboard, not the interactive repository application.",
        "The bundled analytics snapshot is synthetic; the source SQLite database and its full DDL are not included."
      ],
      lessons: "Analytics views need explicit denominators, source provenance, and careful join grain to remain interpretable."
    },
    workflow: [
      "Read synthetic source tables",
      "Aggregate order and customer measures",
      "Build a local JSON snapshot",
      "Explore the repository dashboard"
    ],
    architecture: {
      summary: "A compatible synthetic SQLite source is aggregated into a bundled JSON snapshot for the locally runnable dashboard; the public page is a static visual preview.",
      stages: [
        {
          id: "source",
          title: "Read source records",
          action: "Read generated marketplace records from a compatible SQLite database.",
          input: "Synthetic source tables",
          output: "Order, customer, and product records",
          contribution: "The source database is not bundled; the portfolio snapshot and builder are supplied.",
          source: {
            label: "Snapshot builder",
            href: "https://github.com/patelpreet404-alt/olist-ecommerce-analytics/blob/main/scripts/build_data.py"
          }
        },
        {
          id: "aggregate",
          title: "Calculate measures",
          action: "Aggregate funnel, cohort, category, and delivery measures using explicit metric definitions.",
          input: "Order, customer, and product records",
          output: "Calculated analytics measures",
          contribution: "Delivery is counted at order grain before product-line joins, and incomplete cohort periods are left unreported.",
          source: {
            label: "Analytics builder",
            href: "https://github.com/patelpreet404-alt/olist-ecommerce-analytics/blob/main/scripts/build_data.py"
          }
        },
        {
          id: "snapshot",
          title: "Write snapshot",
          action: "Save the measures and source notes as local analytics JSON.",
          input: "Calculated analytics measures",
          output: "Bundled read-only snapshot",
          contribution: "The dashboard can run without credentials or a live analytics service.",
          source: {
            label: "Bundled analytics JSON",
            href: "https://github.com/patelpreet404-alt/olist-ecommerce-analytics/blob/main/public/analytics.json"
          }
        },
        {
          id: "dashboard",
          title: "Explore the dashboard",
          action: "Render overview, funnel, cohort, fulfillment, and data-definition views from the snapshot.",
          input: "Bundled read-only snapshot",
          output: "Inspectable portfolio analytics",
          contribution: "The source app supports local exploration; the public URL shows a static visual preview.",
          source: {
            label: "Dashboard source",
            href: "https://github.com/patelpreet404-alt/olist-ecommerce-analytics/tree/main/src/app"
          }
        }
      ]
    },
    screenshots: [
      {
        src: "/projects/fieldnote-dashboard.png",
        alt: "Fieldnote commerce analytics dashboard",
        caption: "Dashboard screenshot using synthetic sample data."
      }
    ],
    designExplorerId: "fieldnote-commerce-intelligence",
    aboutDemo: "The public page is a static visual preview of the dashboard, not the interactive repository application. The bundled analytics snapshot is synthetic; the source SQLite database and its full DDL are not included."
  },
  {
    slug: "ledgerline-credit-risk-scorecard",
    name: "Ledgerline",
    subtitle: "Credit risk scorecard",
    oneLiner: "An analyst workspace for illustrative credit exposure, scorecard bins and stress scenarios.",
    summary: "An analyst workspace for exploring illustrative credit exposure, application reviews, scorecard bins, stress scenarios, and a hypothetical decision lab. The demo uses synthetic examples, not live lending data.",
    role: "[TODO: role]",
    period: "[TODO: month year]",
    status: "sample-data",
    statusNote: "Interactive preview",
    domains: [
      "data",
      "ai-ml"
    ],
    stack: [
      "Next.js",
      "TypeScript",
      "Python",
      "Scikit-Learn",
      "PostgreSQL",
      "DAX"
    ],
    links: [
      {
        kind: "demo",
        href: "https://ledgerline-credit-risk-demo.vercel.app/"
      },
      {
        kind: "source",
        href: "https://github.com/patelpreet404-alt/credit-risk-scorecard"
      },
      {
        kind: "case-study",
        href: "/work/ledgerline-credit-risk-scorecard"
      }
    ],
    media: {
      poster: "/projects/ledgerline-credit-risk.png",
      alt: "Ledgerline portfolio and scorecard dashboard using illustrative values."
    },
    caseStudy: {
      problem: "Risk analysts need an interpretable way to review application signals, portfolio exposure, and how assumptions affect potential loss.",
      contribution: "Built an interactive portfolio demo and a separate analytical foundation with synthetic data generation, scorecard training, SQL schema and queries, and DAX measures.",
      decisions: [
        "Use WOE bins and information value to make feature treatment inspectable.",
        "Keep stress scenarios and hypothetical scoring explicitly illustrative rather than implying production lending decisions.",
        "Store application records and matured performance outcomes separately in the SQL design."
      ],
      limitations: [
        "The public dashboard displays synthetic examples and illustrative portfolio values; it is not connected to lender data.",
        "Displayed model-health figures from the supplied brief are not reproduced from a verified source portfolio in the demo.",
        "The decision lab runs locally in the browser and must not be used for lending decisions."
      ],
      lessons: "Credit analytics need visible assumptions, data provenance, and a clear boundary between a demonstration and validated model performance."
    },
    workflow: [
      "Review illustrative portfolio",
      "Inspect scorecard bins",
      "Explore stress assumptions",
      "Try hypothetical scoring"
    ],
    architecture: {
      summary: "A visitor-controlled walkthrough of the deployed demo. Synthetic modeling scripts and SQL definitions are separate repository foundations, not a live lending backend.",
      stages: [
        {
          id: "portfolio",
          title: "Review the portfolio",
          action: "Inspect illustrative exposure, expected loss, application activity, and model-health views.",
          input: "Synthetic demo values",
          output: "Portfolio overview",
          contribution: "The interface brings major portfolio questions into one analyst workspace.",
          source: {
            label: "Dashboard source",
            href: "https://github.com/patelpreet404-alt/credit-risk-scorecard/blob/main/app/page.tsx"
          }
        },
        {
          id: "scorecard",
          title: "Inspect the scorecard",
          action: "Review information value, WOE bins, and the plain-language methodology panel.",
          input: "Illustrative scorecard features",
          output: "Interpretable bin view",
          contribution: "Feature treatment is shown as inspectable bins rather than an unexplained score.",
          source: {
            label: "Dashboard source",
            href: "https://github.com/patelpreet404-alt/credit-risk-scorecard/blob/main/app/page.tsx"
          }
        },
        {
          id: "stress",
          title: "Test assumptions",
          action: "Choose baseline, preset, or custom macroeconomic shocks to see illustrative loss sensitivity.",
          input: "Scenario assumptions",
          output: "Illustrative loss comparison",
          contribution: "The stress test documents its sensitivity assumptions and is not a forecast.",
          source: {
            label: "Product scope",
            href: "https://github.com/patelpreet404-alt/credit-risk-scorecard/blob/main/PRODUCT.md"
          }
        },
        {
          id: "decision",
          title: "Try a hypothetical profile",
          action: "Enter an example profile and calculate a local illustrative score and risk band.",
          input: "Hypothetical application fields",
          output: "Example score and risk band",
          contribution: "The sandbox stays in the browser and is not a lending decision.",
          source: {
            label: "Dashboard source",
            href: "https://github.com/patelpreet404-alt/credit-risk-scorecard/blob/main/app/page.tsx"
          }
        }
      ]
    },
    screenshots: [
      {
        src: "/projects/ledgerline-credit-risk.png",
        alt: "Ledgerline portfolio and scorecard dashboard",
        caption: "Repository screenshot of the interactive credit-risk demo using illustrative values."
      }
    ],
    designExplorerId: "ledgerline-credit-risk-scorecard",
    aboutDemo: "The public dashboard displays synthetic examples and illustrative portfolio values; it is not connected to lender data. The decision lab runs locally in the browser and must not be used for lending decisions."
  },
  {
    slug: "signal-telecom-churn-analytics",
    name: "Signal",
    subtitle: "Telecom churn analytics",
    oneLiner: "A dashboard for exploring churn, revenue at risk, customer cohorts and early-tenure retention.",
    summary: "A sample-data dashboard for exploring churn, recurring revenue at risk, customer cohorts, service mix, and early-tenure retention. Visitors can filter example customers and export visible sample records.",
    role: "[TODO: role]",
    period: "[TODO: month year]",
    status: "sample-data",
    statusNote: "Interactive preview",
    domains: [
      "data"
    ],
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "CSS"
    ],
    links: [
      {
        kind: "demo",
        href: "https://patelpreet404-alt.github.io/telecom-churn-analytics/"
      },
      {
        kind: "source",
        href: "https://github.com/patelpreet404-alt/telecom-churn-analytics"
      },
      {
        kind: "case-study",
        href: "/work/signal-telecom-churn-analytics"
      }
    ],
    media: {
      poster: "/projects/signal-telecom-churn.png",
      alt: "Signal telecom retention dashboard using representative sample values."
    },
    caseStudy: {
      problem: "Retention teams need to see where churn pressure appears across contracts, customer tenure, revenue, and services.",
      contribution: "Built an interactive, responsive dashboard with time-range controls, cohort and survival views, customer filters, detail panels, and CSV export for sample records.",
      decisions: [
        "Keep portfolio figures and example profiles together in source so they can be replaced when verified analysis is available.",
        "Use client-side filters and exports for a static GitHub Pages deployment without credentials or a backend.",
        "Label dashboard figures as sample data to separate the demo from measured subscriber outcomes."
      ],
      limitations: [
        "The public dashboard uses representative sample values and profiles rather than a verified subscriber dataset.",
        "Churn and early-tenure figures from the supplied project brief have not been independently reproduced in the repository."
      ],
      lessons: "A useful retention interface still needs traceable source data before its illustrative patterns can support real decisions."
    },
    workflow: [
      "Scan sample retention metrics",
      "Change the time range",
      "Compare cohorts and services",
      "Filter customers",
      "Export sample records"
    ],
    architecture: {
      summary: "The static Next.js demo keeps representative metrics and profiles in the client application; visitor controls update the local views and CSV export.",
      stages: [
        {
          id: "overview",
          title: "Scan the overview",
          action: "Read sample churn, subscriber, recurring revenue, and revenue-at-risk summaries.",
          input: "Representative in-app values",
          output: "Retention overview",
          contribution: "The dashboard groups the key retention questions on one readable screen.",
          source: {
            label: "Dashboard source",
            href: "https://github.com/patelpreet404-alt/telecom-churn-analytics/blob/main/app/page.tsx"
          }
        },
        {
          id: "trends",
          title: "Change the period",
          action: "Select a time range to compare illustrative revenue and churn trends.",
          input: "Chosen time window",
          output: "Updated local trend view",
          contribution: "Time controls keep the visual comparison under visitor control.",
          source: {
            label: "Dashboard source",
            href: "https://github.com/patelpreet404-alt/telecom-churn-analytics/blob/main/app/page.tsx"
          }
        },
        {
          id: "segments",
          title: "Explore retention",
          action: "Inspect contract comparisons, early-tenure survival, signup cohorts, and service mix.",
          input: "Representative cohort and service values",
          output: "Segment views",
          contribution: "Cohort and survival views make the early-customer story inspectable within the sample.",
          source: {
            label: "Dashboard source",
            href: "https://github.com/patelpreet404-alt/telecom-churn-analytics/blob/main/app/page.tsx"
          }
        },
        {
          id: "customers",
          title: "Filter and export",
          action: "Search example customers by identifier or service, filter contract type, inspect a detail drawer, and export visible sample rows.",
          input: "Local sample customer profiles",
          output: "Filtered list or CSV",
          contribution: "The static site can be explored without transmitting customer input to a server.",
          source: {
            label: "Dashboard source",
            href: "https://github.com/patelpreet404-alt/telecom-churn-analytics/blob/main/app/page.tsx"
          }
        }
      ]
    },
    screenshots: [
      {
        src: "/projects/signal-telecom-churn.png",
        alt: "Signal telecom retention dashboard",
        caption: "Screenshot of the deployed interactive dashboard using representative sample values."
      }
    ],
    designExplorerId: "signal-telecom-churn-analytics",
    aboutDemo: "The public dashboard uses representative sample values and profiles rather than a verified subscriber dataset; there is no connected subscriber database or live data feed."
  }
];

export const featuredProjects = projects
  .filter((project) => project.featuredRank !== undefined)
  .sort((a, b) => (a.featuredRank ?? 0) - (b.featuredRank ?? 0));

export const moreProjects = projects.filter((project) => project.featuredRank === undefined);

export const getProject = (slug: string) => projects.find((project) => project.slug === slug);
