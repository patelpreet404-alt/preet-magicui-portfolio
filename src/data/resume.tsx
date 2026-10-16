import type { ReactNode } from "react";

export const PROJECT_DOMAINS = [
  { id: "full-stack", title: "Full-Stack Development", pathDescription: "Product flows that connect interface, services, and persistent data." },
  { id: "ai-ml", title: "AI / ML Engineering", pathDescription: "Applied AI work that turns learning or research material into useful answers." },
  { id: "frontend", title: "Frontend Development", pathDescription: "Interfaces that make complex workflows concrete and inspectable." },
  { id: "backend-cloud", title: "Backend & Cloud", pathDescription: "Service and data foundations behind the visible product workflows." },
  { id: "cybersecurity", title: "Cybersecurity", pathDescription: "Research into identifying suspicious behavior and known threats." },
  { id: "systems-research", title: "Systems & Research", pathDescription: "Low-level language tooling and research-led engineering workflows." },
] as const;

export type DomainId = (typeof PROJECT_DOMAINS)[number]["id"];
export type ProjectPlacement = "featured" | "additional";

export interface ProjectCaseStudy {
  problem: string;
  contribution: string;
  decisions: readonly string[];
  limitations: readonly string[];
  lessons: string;
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

export interface PortfolioProject {
  slug: string;
  placement: ProjectPlacement;
  title: string;
  subtitle?: string;
  summary: string;
  category: string;
  domainIds: readonly DomainId[];
  domainNotes?: Partial<Record<DomainId, string>>;
  status: string;
  href?: string;
  dates: string;
  description: string;
  details?: string;
  caseStudy: ProjectCaseStudy;
  workflow: readonly string[];
  architecture?: { summary: string; stages: readonly ArchitectureStage[] };
  screenshots?: readonly { src: string; alt: string; caption: string }[];
  technologies: readonly string[];
  links: readonly { type: string; href: string; icon: ReactNode }[];
  image?: string;
  video?: string;
}

import { Icons } from "@/components/icons";
import { FileTextIcon, HomeIcon } from "lucide-react";

export const DATA = {
  name: "Preet Patel",
  initials: "PP",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://preet-magicui-portfolio.vercel.app",
  location: "Delhi, India",
  locationLink: "https://www.google.com/maps/place/Delhi",
  description:
    "Computer Science and Engineering student at DTU building practical AI tools, backend systems, and developer-focused software.",
  summary:
    "I'm studying Computer Science and Engineering at Delhi Technological University. I work across the stack, from APIs and data flows to clear tools people can use. My projects include an AI learning platform, research-paper Q&A with citations, and a C++17 compiler. At Rang Technologies, I built an attendance and analytics platform for 50+ employees.",
  avatarUrl: "/preet-patel-avatar.jpg",
  focusAreas: [
    {
      title: "Backend systems",
      detail: "Flask, FastAPI, and Supabase services for attendance, analytics, and data workflows.",
      proof: "Rang Technologies internship",
    },
    {
      title: "Applied AI",
      detail: "Retrieval-grounded research tools and structured learning experiences with RAG, LangChain, Gemini, and FAISS.",
      proof: "ResearchPaper AI and AI Learning Management System",
    },
    {
      title: "Compilers and systems",
      detail: "C++17 language tooling from lexical analysis and parsing through semantic checks and optimized three-address code.",
      proof: "OptiLang",
    },
  ],
  skillGroups: [
    {
      title: "Frontend",
      skills: ["TypeScript", "React", "Next.js"],
    },
    {
      title: "Backend",
      skills: ["Python", "FastAPI", "Flask"],
    },
    {
      title: "Databases & data",
      skills: ["SQL", "PostgreSQL", "Supabase"],
    },
    {
      title: "AI & machine learning",
      skills: ["RAG", "LangChain", "FAISS", "Gemini", "Scikit-learn"],
    },
    {
      title: "Systems engineering",
      skills: ["C++17", "Flex", "Bison", "LLVM IR"],
    },
    {
      title: "Tools & delivery",
      skills: ["Docker", "Git"],
    },
  ],
  educationFocus: ["Low-level systems", "Compiler design", "AI/ML infrastructure", "Database architecture"],
  certifications: [
    { provider: "IBM SkillsBuild", focus: "RAG and Generative AI" },
    { provider: "Kaggle", focus: "Machine Learning and Python" },
  ],
  research: {
    title: "Early identification of crypto-ransomware",
    detail: "Ongoing research combining behavioral features from Cuckoo Sandbox with Random Forest classification and SHA-256 signature matching.",
    tools: ["Cuckoo Sandbox", "Python", "Random Forest", "SHA-256", "MySQL"],
  },
  navbar: [{ href: "/", icon: HomeIcon, label: "Home" }],
  contact: {
    email: "patelpreet404@gmail.com",
    social: {
      GitHub: {
        name: "GitHub",
        url: "https://github.com/patelpreet404-alt",
        icon: Icons.github,
        navbar: true,
      },
      LinkedIn: {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/preet-patel-162631317/",
        icon: Icons.linkedin,
        navbar: true,
      },
      Email: {
        name: "Email",
        url: "mailto:patelpreet404@gmail.com",
        icon: Icons.email,
        navbar: true,
      },
      Resume: {
        name: "Resume",
        url: "/preet-patel-resume.pdf",
        icon: FileTextIcon,
        navbar: true,
      },
    },
  },
  work: [
    {
      company: "Rang Technologies",
      location: "New Jersey (Remote)",
      title: "Software Development Intern",
      logoUrl: "/organizations/rang-logo.jpg",
      start: "Jun 2026",
      end: "Aug 2026",
      description:
        "Built a Flask and Supabase attendance platform for 50+ employees, including IP-based verification, an admin analytics dashboard, and more than 10 optimized API endpoints. The workflows reduced manual attendance processing by 80%.",
    },
  ],
  education: [
    {
      school: "Delhi Technological University",
      href: "https://dtu.ac.in/",
      degree: "B.Tech, Computer Science and Engineering",
      logoUrl: "/organizations/dtu-logo.jpg",
      start: "2023",
      end: "2027",
    },
    {
      school: "International Indian School Al Jubail",
      href: "https://www.iisjubail.org/",
      degree: "Senior Secondary, PCM with Computer Science",
      logoUrl: "/organizations/iis-logo.jpg",
      start: "2021",
      end: "2023",
    },
  ],
  projects: [
    {
      title: "AI Learning Management System",
      slug: "ai-learning-management",
      placement: "featured",
      summary: "AI product & learning",
      category: "Applied AI",
      domainIds: ["full-stack", "ai-ml", "frontend", "backend-cloud"],
      domainNotes: {
        "full-stack": "Course creation joins the learner interface, generation flow, and saved course data.",
        "ai-ml": "Gemini is used to generate course outlines and study materials from a chosen topic.",
        frontend: "The learner workspace makes course plans, lessons, and quizzes easy to navigate.",
        "backend-cloud": "The application coordinates generation work and persists the resulting course content.",
      },
      status: "Interactive preview",
      caseStudy: {"problem": "Learners need course notes, flashcards, quizzes, and answers connected to a clear study plan.", "contribution": "Built a guided workspace that turns a topic, course type, and difficulty into an outline and study materials.", "decisions": ["Gemini generates the outline and material; Inngest coordinates longer generation tasks.", "Clerk handles identity, with Neon PostgreSQL and Drizzle ORM storing course and study data."], "limitations": ["The browser preview uses a sample course. Creating courses depends on the configured full application flow."], "lessons": "The interface makes generation progress visible so learners can distinguish material that is being generated from material that is ready."},
      workflow: ["Choose a topic", "Generate an outline", "Create study materials", "Study and quiz"],
      href: "https://studyloom-ai-learning.vercel.app",
      dates: "Interactive preview",
      description:
        "A guided learning workspace that brings course notes, flashcards, quizzes, and question answering together in one place. The interactive browser preview includes a sample course so visitors can explore the learning flow without creating an account.",
      details: `Turn a learning goal into a complete, interactive study plan. Choose a topic, course type, and difficulty; the system uses Google Gemini to shape a chapter-by-chapter outline, then generates the study material that fits the learner’s plan.

**From topic to study session**
- Build a course outline with summaries, chapters, and topics.
- Create chapter notes, swipeable flashcards, timed quizzes, and question-and-answer sets.
- Choose individual material types or generate the full study set.
- Follow background generation progress as content moves from “generating” to “ready.”

Clerk handles sign-in, while course and study data are stored in Neon PostgreSQL through Drizzle ORM. Inngest coordinates the longer AI and database workflows. The portfolio demo opens a sample course so visitors can explore the interface; creating courses uses the full application flow.`,
      technologies: ["Next.js", "Gemini", "Clerk", "Drizzle ORM", "PostgreSQL", "Inngest"],
      links: [
        {
          type: "Demo",
          href: "https://studyloom-ai-learning.vercel.app",
          icon: <Icons.globe className="size-3" />,
        },
        {
          type: "Source",
          href: "https://github.com/patelpreet404-alt/ai-learning-management-system",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "/projects/studyloom-deployed.png",
      screenshots: [
        { src: "/projects/studyloom-deployed.png", alt: "Studyloom learning workspace dashboard", caption: "Studyloom’s learner workspace, showing course navigation and a guided course plan." },
        { src: "/projects/ai-learning-management.png", alt: "Studyloom sample course workspace", caption: "The portfolio preview’s sample course and lesson materials; course creation uses the full application flow." },
      ],
      video: "",
    },
    {
      title: "ResearchPaper AI",
      slug: "researchpaper-ai",
      placement: "featured",
      summary: "Research & document intelligence",
      category: "Applied AI",
      domainIds: ["full-stack", "ai-ml", "frontend", "backend-cloud", "systems-research"],
      domainNotes: {
        "full-stack": "The paper workflow connects document ingestion, retrieval services, and a cited reading interface.",
        "ai-ml": "Semantic retrieval grounds generated answers in passages from the paper.",
        frontend: "The reader can inspect a prepared sample and see where answer citations point.",
        "backend-cloud": "FastAPI services coordinate page extraction, FAISS retrieval, streamed answers, and SQLite history.",
        "systems-research": "The project turns document processing and retrieval into an inspectable research workflow.",
      },
      status: "Interactive preview",
      caseStudy: {"problem": "Readers need answers to questions about PDF papers with evidence they can check against the source page.", "contribution": "Built a retrieval workflow that extracts PDF text, indexes passages, and generates answers with page citations.", "decisions": ["Overlapping chunks preserve nearby context; a persistent FAISS index supports semantic retrieval.", "FastAPI routes, RAG services, domain models, and adapters separate the API from retrieval infrastructure.", "SQLite stores conversation history for follow-up questions."], "limitations": ["The public preview uses a prepared document and answers. PDF uploads and live AI responses are unavailable there.", "Live responses require the configured backend and API access."], "lessons": "Page citations make retrieved evidence inspectable; a prepared preview must be clearly distinguished from a live model response."},
      workflow: ["Extract PDF text", "Chunk and embed", "Retrieve passages", "Answer with citations"],
      architecture: {
        summary: "The source app ingests page-aware text, indexes overlapping chunks, retrieves evidence for a question, and streams a cited answer. The public portfolio preview is a separate prepared-sample experience.",
        stages: [
          { id: "extract", title: "Extract pages", action: "Read the uploaded PDF into page-level text and preserve document metadata.", input: "PDF file", output: "Page text and document metadata", contribution: "The PDF service extracts page-aware text for downstream chunking.", source: { label: "PDF service", href: "https://github.com/patelpreet404-alt/researchpaper-ai/blob/main/app/services/pdf_service.py" } },
          { id: "chunk", title: "Create chunks", action: "Split page text into overlapping passages while retaining page and document references.", input: "Page text", output: "Overlapping, page-tagged chunks", contribution: "A bounded chunk size and overlap preserve nearby context for retrieval.", source: { label: "Chunking service", href: "https://github.com/patelpreet404-alt/researchpaper-ai/blob/main/app/services/chunking_service.py" } },
          { id: "index", title: "Embed and index", action: "Generate embeddings and persist the vector index for semantic search.", input: "Document chunks", output: "Disk-backed FAISS index", contribution: "The vector-store adapter keeps retrieval infrastructure separate from the routes.", source: { label: "Vector store", href: "https://github.com/patelpreet404-alt/researchpaper-ai/blob/main/app/services/vector_store_service.py" } },
          { id: "retrieve", title: "Retrieve evidence", action: "Search for passages relevant to the reader’s question and keep their source metadata.", input: "Question and index", output: "Ranked source passages", contribution: "Retrieval filters work from the stored page-aware passages before generation.", source: { label: "Retrieval service", href: "https://github.com/patelpreet404-alt/researchpaper-ai/blob/main/app/services/retrieval_service.py" } },
          { id: "answer", title: "Generate a response", action: "Use retrieved passages and bounded conversation context to stream a grounded answer.", input: "Question, passages, recent history", output: "Streamed answer", contribution: "FastAPI routes and the chat service separate request handling from answer generation.", source: { label: "Chat service", href: "https://github.com/patelpreet404-alt/researchpaper-ai/blob/main/app/services/chat_service.py" } },
          { id: "cite", title: "Inspect citations", action: "Return page references from the retrieved context and store conversation history.", input: "Retrieved passages and answer", output: "Answer with page references; SQLite conversation records", contribution: "Citations help readers inspect evidence but do not prove an answer is correct.", source: { label: "Chat route", href: "https://github.com/patelpreet404-alt/researchpaper-ai/blob/main/app/api/routes_chat.py" } }
        ]
      },
      href: "https://researchpaper-ai-demo-7yoie94wv-patelpreet404-alts-projects.vercel.app/",
      dates: "Interactive preview",
      description:
        "A research workspace for asking questions about PDF papers and checking answers against page-level citations. The demo opens with a sample document and prepared answers; document uploads and live AI responses are unavailable in this preview.",
      details: `ResearchPaper AI lets a reader ask natural-language questions about their own PDF papers and trace each answer back to its source page. Rather than asking the model to respond from memory, the application retrieves relevant document passages and uses them as the evidence for its answer.

**Document-to-answer workflow**
- Extract text page by page, then split it into overlapping chunks that preserve nearby context.
- Create embeddings and store them in a persistent FAISS index for semantic search.
- Retrieve relevant passages for each question and generate a grounded response with page citations.
- Stream answers as they are generated, with conversation history saved in SQLite for follow-up questions.

The backend is organized into FastAPI routes, focused RAG services, domain models, and infrastructure adapters. The public portfolio preview uses a prepared sample document and answers; uploading PDFs and getting live model responses require the configured backend and API access.`,
      technologies: ["Python", "FastAPI", "LangChain", "FAISS", "OpenAI API", "SQLite"],
      links: [
        {
          type: "Demo",
          href: "https://researchpaper-ai-demo-7yoie94wv-patelpreet404-alts-projects.vercel.app/",
          icon: <Icons.globe className="size-3" />,
        },
        {
          type: "Source",
          href: "https://github.com/patelpreet404-alt/researchpaper-ai",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "/projects/researchpaper-deployed.png",
      screenshots: [
        { src: "/projects/researchpaper-deployed.png", alt: "ResearchPaper AI product introduction", caption: "The product page explains PDF question answering and page citations." },
        { src: "/projects/researchpaper-ai.png", alt: "ResearchPaper AI prepared sample workspace", caption: "The public workspace uses a prepared sample and answers; it does not upload files or call a model." },
      ],
      video: "",
    },
    {
      title: "OptiLang",
      slug: "optilang",
      placement: "featured",
      summary: "Compiler & systems engineering",
      category: "Systems & Research",
      domainIds: ["systems-research"],
      status: "Interactive preview",
      domainNotes: { "systems-research": "The compiler moves from Flex and Bison front-end stages to semantic checks and optimized three-address code." },
      caseStudy: {"problem": "Compiler learners need to see how a small statically typed language moves from source code to an optimized intermediate form.", "contribution": "Built a C++17 compiler pipeline that tokenizes and parses source, checks semantics, and generates optimized three-address code.", "decisions": ["Flex and Bison provide tokenization and LALR(1) parsing.", "Semantic checks cover types, scope, function resolution, and implicit widening.", "Five optimization passes operate on three-address code. LLVM examples in the repository are a separate Clang exercise."], "limitations": ["The browser deployment is an interactive compiler preview. Its examples illustrate the pipeline.", "The existing repository measurement is specific to its demo program: 57 to 37 instructions (35%) in about 0.34 ms on average."], "lessons": "An explicit intermediate representation makes the effect of each optimization easier to inspect and compare."},
      workflow: ["Tokenize", "Parse", "Check semantics", "Generate three-address code", "Optimize three-address code"],
      architecture: {
        summary: "The custom compiler translates C-like source into optimized three-address code. The repository’s LLVM examples are a separate Clang exercise, not a later stage in this pipeline.",
        stages: [
          { id: "tokenize", title: "Tokenize", action: "Flex reads source text, tracks line positions, and classifies tokens.", input: ".mc source", output: "Token stream", contribution: "The lexer makes the language’s lexical rules explicit.", source: { label: "Lexer", href: "https://github.com/patelpreet404-alt/OptiLang/blob/main/src/lexer.l" } },
          { id: "parse", title: "Parse", action: "Bison applies the LALR(1) grammar and precedence rules to form the syntax tree.", input: "Token stream", output: "Abstract syntax tree", contribution: "Grammar and precedence rules keep syntax structure inspectable.", source: { label: "Parser grammar", href: "https://github.com/patelpreet404-alt/OptiLang/blob/main/src/parser.y" } },
          { id: "semantics", title: "Check semantics", action: "Validate types, scopes, function use, and supported implicit widening.", input: "Abstract syntax tree", output: "Semantically checked program or diagnostics", contribution: "Compilation stops after semantic errors rather than generating misleading output.", source: { label: "Semantic analysis", href: "https://github.com/patelpreet404-alt/OptiLang/blob/main/src/semantic.cpp" } },
          { id: "tac", title: "Generate TAC", action: "Translate the checked syntax tree into three-address instructions.", input: "Checked program", output: "Three-address code", contribution: "An explicit intermediate representation makes optimization effects easier to inspect.", source: { label: "TAC generator", href: "https://github.com/patelpreet404-alt/OptiLang/blob/main/src/tac_gen.cpp" } },
          { id: "optimize", title: "Optimize", action: "Run constant folding and propagation, common subexpression elimination, dead-code elimination, unreachable-block elimination, and loop-invariant code motion.", input: "Three-address code", output: "Optimized three-address code", contribution: "The passes operate on the compiler’s TAC; branching resets propagation where assumptions no longer hold.", source: { label: "Optimizer", href: "https://github.com/patelpreet404-alt/OptiLang/blob/main/src/optimizer.cpp" } }
        ]
      },
      href: "https://patelpreet404-alt.github.io/OptiLang/",
      dates: "Interactive preview",
      description:
        "An interactive C++17 compiler preview that shows how code moves through lexical analysis, semantic checks, and optimization. Visitors can compare a before-and-after code sample and see the compiler concepts behind each stage.",
      details: `OptiLang is a compiler for a small, statically typed C-like language. It takes source code from tokenization through parsing and semantic checks, translates the program into three-address code, then optimizes that intermediate form.

**A complete compiler pipeline**
- Flex tokenizes source code; Bison parses it with an LALR(1) grammar.
- Semantic analysis checks types, scope, function resolution, and implicit widening.
- The compiler generates three-address code, then runs five passes: constant folding and propagation, common subexpression elimination, dead-code elimination, unreachable-block elimination, and loop-invariant code motion.
- Separate LLVM examples use Clang and are not a later stage in the custom compiler pipeline.

On the repository’s demo program, the optimizer reduces the output from 57 instructions to 37 (35%) in about 0.34 ms on average. The repository also includes standalone expression calculators, a FIRST/FOLLOW table generator, sample programs, and a 12-case check suite.`,
      technologies: ["C++17", "Flex", "Bison", "Clang / LLVM exercises", "Compiler design"],
      links: [
        {
          type: "Demo",
          href: "https://patelpreet404-alt.github.io/OptiLang/",
          icon: <Icons.globe className="size-3" />,
        },
        {
          type: "Source",
          href: "https://github.com/patelpreet404-alt/OptiLang",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "/projects/optilang-live-site.png",
      video: "",
    },
    {
      title: "Crypto Ransomware Research",
      slug: "crypto-ransomware-research",
      placement: "featured",
      summary: "Pre-encryption identification research",
      category: "Cybersecurity",
      domainIds: ["ai-ml", "cybersecurity", "systems-research"],
      domainNotes: {
        "ai-ml": "Random Forest classification evaluates features extracted from sandbox behavior.",
        cybersecurity: "The research combines behavioral analysis with SHA-256 matching for known files.",
        "systems-research": "The proposed workflow studies sandbox behavior, extracted signals, and classification as a research sequence.",
      },
      status: "Ongoing research",
      caseStudy: {"problem": "This research investigates whether ransomware can be identified before encryption causes wider damage.", "contribution": "Exploring behavioral feature extraction from Cuckoo Sandbox, Random Forest classification, and SHA-256 signature matching.", "decisions": ["Behavioral classification and known-file signatures provide two different detection signals.", "Python supports the analysis workflow, with MySQL among the existing project tools."], "limitations": ["Research is ongoing; no public demo or source repository is available.", "No validated detection accuracy or operational deployment is claimed."], "lessons": "The research keeps behavioral classification separate from known-signature matching when describing its approach."},
      workflow: ["Collect sandbox behavior", "Extract features", "Evaluate classification", "Check signatures"],
      href: "",
      dates: "Ongoing research",
      description:
        "Ongoing research into early crypto-ransomware identification. The approach combines behavioral features collected with Cuckoo Sandbox, Random Forest classification, and SHA-256 signature matching; a public demo and source repository are not available yet.",
      details: `This ongoing project explores how ransomware could be identified before encryption causes wider damage. The research combines two signals: behavior observed while samples run in Cuckoo Sandbox, and SHA-256 signatures that can match known files.

**Research direction**
- Analyze sandbox behavior and extract features that can help distinguish ransomware activity.
- Use a Random Forest classifier to evaluate behavioral features.
- Pair classification with SHA-256 signature matching as a second detection signal.
- Use Python for the analysis workflow, with MySQL listed among the project tools.

The work is still in progress, so there is no public demo or source repository to link yet.`,
      technologies: ["Python", "Cuckoo Sandbox", "Random Forest", "SHA-256", "MySQL"],
      links: [],
      image: "/projects/crypto-ransomware-preview.png",
      video: "",
    },
    {
      title: "SubbieGuard",
      slug: "subbieguard",
      placement: "featured",
      summary: "Variation administration workspace",
      category: "Full-Stack Development",
      domainIds: ["full-stack", "frontend", "backend-cloud"],
      domainNotes: {
        "full-stack": "A variation record carries source, evidence, review, notice preparation, and commercial history.",
        frontend: "The workspace is designed to make supporting records and review status visible together.",
        "backend-cloud": "The development foundation uses role-aware access, Postgres, private storage, and versioned migrations.",
      },
      status: "Development-stage prototype",
      caseStudy: {"problem": "NSW commercial electrical subcontractors need to review variation instructions, contract sources, site evidence, labour notes, and next actions together.", "contribution": "Built the development foundation for a commercial workspace that carries a variation record through evidence review, notice preparation, and commercial history.", "decisions": ["Contract sources and versions stay visible; ambiguous rules and unsupported dates require human review.", "Estimates, claims, assessments, invoices, and payments remain distinct records to avoid repeated counting.", "Next.js, TypeScript, Supabase Auth, Postgres, private Storage, migrations, and role-aware access support the foundation."], "limitations": ["M0–M3 verified using synthetic development data.", "M4 prepared but not through hosted acceptance.", "M5–M6 future work.", "Real customer document handling remains gated. The workspace does not decide legal entitlement or establish valid legal service."], "lessons": "Human review and clear record boundaries are necessary when software organizes a commercial story with legal implications."},
      subtitle: "Variation administration, kept together",
      href: "https://subbieguard-portfolio-public.vercel.app",
      dates: "Development-stage prototype",
      description:
        "A development-stage commercial workspace for NSW electrical subcontractors, designed to keep an instructed variation’s source, evidence, and next action together in one reviewable record—from the initial instruction through notice preparation and commercial history.",
      details: `SubbieGuard is a development-stage commercial workspace concept for NSW commercial electrical subcontractors.

**The problem**
When scope changes, the instruction, contract source, site evidence, labour notes, and next action can end up spread across conversations and files. By claim time, the commercial story can be difficult to review as one connected record.

**Product approach**
SubbieGuard is designed to keep each instructed variation’s source, evidence, and next action together in a reviewable record, then carry that same record through notice preparation and commercial history. It organizes context for people to review; it does not decide legal entitlement.

**Human-review guardrails**
- Keep contract sources, versions, and locations visible; record a person’s operational acknowledgment without presenting it as legal approval.
- Send ambiguous rules and unsupported dates to human review instead of inventing certainty.
- Keep estimates, claims, assessments, invoices, and payments as distinct records so a variation is not counted repeatedly.
- Require human review for notices. A draft or reported-send record is not proof that legal service was valid.

**Technical foundation**
Next.js and TypeScript, with Supabase Auth, Postgres, private Storage, versioned migrations, and role-aware access. The architecture describes the development foundation; real customer document handling remains gated.

**Build status**
- M0–M3: verified against synthetic development data.
- M4: prepared; hosted acceptance has not passed.
- M5–M6: future work.

This is a development-stage project using synthetic examples. It does not claim customer launch, legal approval, validated market demand, guaranteed payment, or revenue protection.`,
      workflow: [
        "Capture the change",
        "Ground it in the contract",
        "Keep evidence with the work",
        "Make the next step clear",
        "Prepare and review a notice",
        "Track claim and payment history",
      ],
      technologies: ["Next.js", "TypeScript", "Supabase Auth", "Postgres", "Private Storage"],
      links: [
        {
          type: "Case study",
          href: "https://subbieguard-portfolio-public.vercel.app",
          icon: <Icons.globe className="size-3" />,
        },
      ],
      image: "/projects/subbieguard-deployed.png",
      video: "",
    },
    {
      title: "Foodfolk",
      slug: "foodfolk",
      placement: "featured",
      summary: "Social restaurant discovery",
      category: "Full-Stack Development",
      domainIds: ["full-stack", "frontend", "backend-cloud"],
      domainNotes: {
        "full-stack": "Restaurant profiles connect search, friends’ picks, saved places, and food logs.",
        frontend: "The map lets visitors explore Mumbai restaurants and filter sample activity.",
        "backend-cloud": "The repository includes a SQLite-backed API for accounts, friendships, reviews, saves, and photos.",
      },
      status: "Interactive preview",
      caseStudy: {"problem": "Restaurant discovery needs a way to connect places with friends’ recommendations and a person’s own food history.", "contribution": "Built a map interface for exploring Mumbai restaurants, filtering friends’ picks, saving places, and revisiting a food passport; the repository also includes the social API.", "decisions": ["React, TypeScript, and Leaflet render the map using OpenStreetMap data.", "Photon and Overpass support restaurant and neighbourhood search.", "A Node.js API with SQLite supports persistent accounts, friendships, reviews, saved places, and photo access."], "limitations": ["The public deployment opens on Cook Along, with Food Map available in navigation.", "Food Map uses seeded accounts and activity; changes remain in the visitor’s browser.", "The persistent social backend requires a Node server and durable storage. This preview is not a launched social network."], "lessons": "Browser-local exploration and persistent social data have different storage needs and must be described clearly."},
      subtitle: "Good food, remembered",
      href: "https://foodfolk-discovery-demo-patelpreet404-alts-projects.vercel.app/",
      dates: "Interactive preview",
      description:
        "A social restaurant map shaped by recommendations from friends. Explore Mumbai places, filter friends’ picks, save a shortlist, and revisit where you have eaten through a food passport. The public demo uses sample activity and keeps changes in the browser.",
      details: `Foodfolk brings restaurant discovery, trusted recommendations, and personal food history into one map. Instead of treating a venue as just a pin, it connects places to the people who recommended them and the meals worth remembering.

**Explore and remember**
- Search restaurants and neighbourhoods on an interactive map, then inspect places and their reviews.
- Filter for friends’ recommendations, saved places, photos, or higher ratings.
- Save places for later and revisit reviewed restaurants in a personal food passport.
- In the full application, connect with friends and write reviews with ratings, dishes, photos, price notes, and public, friends-only, or private visibility.

**Technical foundation**
The interface uses React, TypeScript, and Leaflet with OpenStreetMap data. The source repository includes a Node.js API backed by SQLite for accounts, friendships, reviews, saved places, and photo access. Restaurant search uses Photon and OpenStreetMap’s Overpass API.

**Preview status**
The linked deployment opens with the Cook Along landing page shown on this card, with Food Map available in its navigation. Food Map is a seeded interactive demo: its sample accounts and activity are for exploration, and changes stay in the visitor’s browser. The persistent social backend requires a Node server and durable storage; this public preview is not a launched social network.`,
      workflow: [
        "Explore the map",
        "Find a place",
        "See friends’ picks",
        "Save or review",
        "Revisit the food passport",
      ],
      technologies: ["React", "TypeScript", "Leaflet", "OpenStreetMap", "Node.js", "SQLite"],
      links: [
        {
          type: "Demo",
          href: "https://foodfolk-discovery-demo-patelpreet404-alts-projects.vercel.app/",
          icon: <Icons.globe className="size-3" />,
        },
        {
          type: "Source",
          href: "https://github.com/patelpreet404-alt/foodfolk-discovery-map",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "/projects/foodfolk-preview.jpg",
      video: "",
    },
    {
      title: "Fieldnote — Commerce Intelligence",
      slug: "fieldnote-commerce-intelligence",
      placement: "additional",
      summary: "Read-only commerce analytics dashboard",
      category: "Data Analytics",
      domainIds: [],
      status: "Read-only visual preview",
      href: "https://fieldnote-commerce-dashboard.wirykiwi11.chatgpt.site/",
      dates: "Read-only visual preview",
      description: "A commerce analytics study of order progression, repeat purchases, category mix, and delivery timing. The linked page shows a static dashboard preview using synthetic sample data.",
      details: "The repository contains a locally runnable dashboard, a repeatable SQLite-to-JSON snapshot builder, and PostgreSQL reference queries. The public link is a read-only visual preview. Its sample data is synthetic and does not represent actual marketplace performance.",
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
      workflow: ["Read synthetic source tables", "Aggregate order and customer measures", "Build a local JSON snapshot", "Explore the repository dashboard"],
      architecture: {
        summary: "A compatible synthetic SQLite source is aggregated into a bundled JSON snapshot for the locally runnable dashboard; the public page is a static visual preview.",
        stages: [
          { id: "source", title: "Read source records", action: "Read generated marketplace records from a compatible SQLite database.", input: "Synthetic source tables", output: "Order, customer, and product records", contribution: "The source database is not bundled; the portfolio snapshot and builder are supplied.", source: { label: "Snapshot builder", href: "https://github.com/patelpreet404-alt/olist-ecommerce-analytics/blob/main/scripts/build_data.py" } },
          { id: "aggregate", title: "Calculate measures", action: "Aggregate funnel, cohort, category, and delivery measures using explicit metric definitions.", input: "Order, customer, and product records", output: "Calculated analytics measures", contribution: "Delivery is counted at order grain before product-line joins, and incomplete cohort periods are left unreported.", source: { label: "Analytics builder", href: "https://github.com/patelpreet404-alt/olist-ecommerce-analytics/blob/main/scripts/build_data.py" } },
          { id: "snapshot", title: "Write snapshot", action: "Save the measures and source notes as local analytics JSON.", input: "Calculated analytics measures", output: "Bundled read-only snapshot", contribution: "The dashboard can run without credentials or a live analytics service.", source: { label: "Bundled analytics JSON", href: "https://github.com/patelpreet404-alt/olist-ecommerce-analytics/blob/main/public/analytics.json" } },
          { id: "dashboard", title: "Explore the dashboard", action: "Render overview, funnel, cohort, fulfillment, and data-definition views from the snapshot.", input: "Bundled read-only snapshot", output: "Inspectable portfolio analytics", contribution: "The source app supports local exploration; the public URL shows a static visual preview.", source: { label: "Dashboard source", href: "https://github.com/patelpreet404-alt/olist-ecommerce-analytics/tree/main/src/app" } }
        ]
      },
      screenshots: [{ src: "/projects/fieldnote-dashboard.png", alt: "Fieldnote commerce analytics dashboard", caption: "Dashboard screenshot using synthetic sample data." }],
      technologies: ["Next.js", "TypeScript", "Python", "SQLite", "SQL"],
      links: [
        { type: "Demo", href: "https://fieldnote-commerce-dashboard.wirykiwi11.chatgpt.site/", icon: <Icons.globe className="size-3" /> },
        { type: "Source", href: "https://github.com/patelpreet404-alt/olist-ecommerce-analytics", icon: <Icons.github className="size-3" /> }
      ],
      image: "/projects/fieldnote-dashboard.png",
      video: ""
    },
    {
      title: "Ledgerline — Credit Risk Scorecard",
      slug: "ledgerline-credit-risk-scorecard",
      placement: "additional",
      summary: "Credit risk scorecard and portfolio analysis",
      category: "Risk Analytics",
      domainIds: [],
      status: "Interactive preview",
      href: "https://ledgerline-credit-risk-demo.vercel.app/",
      dates: "Interactive preview",
      description: "An analyst workspace for exploring illustrative credit exposure, application reviews, scorecard bins, stress scenarios, and a hypothetical decision lab. The demo uses synthetic examples, not live lending data.",
      details: "The repository pairs the interactive dashboard with synthetic data generation, local logistic-regression training, a PostgreSQL analytical schema, reference queries, and Power BI DAX measures. Displayed demo figures are illustrative; the repository does not connect the public dashboard to a lender dataset or a live decisioning service.",
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
      workflow: ["Review illustrative portfolio", "Inspect scorecard bins", "Explore stress assumptions", "Try hypothetical scoring"],
      architecture: {
        summary: "A visitor-controlled walkthrough of the deployed demo. Synthetic modeling scripts and SQL definitions are separate repository foundations, not a live lending backend.",
        stages: [
          { id: "portfolio", title: "Review the portfolio", action: "Inspect illustrative exposure, expected loss, application activity, and model-health views.", input: "Synthetic demo values", output: "Portfolio overview", contribution: "The interface brings major portfolio questions into one analyst workspace.", source: { label: "Dashboard source", href: "https://github.com/patelpreet404-alt/credit-risk-scorecard/blob/main/app/page.tsx" } },
          { id: "scorecard", title: "Inspect the scorecard", action: "Review information value, WOE bins, and the plain-language methodology panel.", input: "Illustrative scorecard features", output: "Interpretable bin view", contribution: "Feature treatment is shown as inspectable bins rather than an unexplained score.", source: { label: "Dashboard source", href: "https://github.com/patelpreet404-alt/credit-risk-scorecard/blob/main/app/page.tsx" } },
          { id: "stress", title: "Test assumptions", action: "Choose baseline, preset, or custom macroeconomic shocks to see illustrative loss sensitivity.", input: "Scenario assumptions", output: "Illustrative loss comparison", contribution: "The stress test documents its sensitivity assumptions and is not a forecast.", source: { label: "Product scope", href: "https://github.com/patelpreet404-alt/credit-risk-scorecard/blob/main/PRODUCT.md" } },
          { id: "decision", title: "Try a hypothetical profile", action: "Enter an example profile and calculate a local illustrative score and risk band.", input: "Hypothetical application fields", output: "Example score and risk band", contribution: "The sandbox stays in the browser and is not a lending decision.", source: { label: "Dashboard source", href: "https://github.com/patelpreet404-alt/credit-risk-scorecard/blob/main/app/page.tsx" } }
        ]
      },
      screenshots: [{ src: "/projects/ledgerline-credit-risk.png", alt: "Ledgerline portfolio and scorecard dashboard", caption: "Repository screenshot of the interactive credit-risk demo using illustrative values." }],
      technologies: ["Next.js", "TypeScript", "Python", "Scikit-Learn", "PostgreSQL", "DAX"],
      links: [
        { type: "Demo", href: "https://ledgerline-credit-risk-demo.vercel.app/", icon: <Icons.globe className="size-3" /> },
        { type: "Source", href: "https://github.com/patelpreet404-alt/credit-risk-scorecard", icon: <Icons.github className="size-3" /> }
      ],
      image: "/projects/ledgerline-credit-risk.png",
      video: ""
    },
    {
      title: "Signal — Telecom Churn Analytics",
      slug: "signal-telecom-churn-analytics",
      placement: "additional",
      summary: "Telecom retention and churn exploration",
      category: "Customer Analytics",
      domainIds: [],
      status: "Interactive preview",
      href: "https://patelpreet404-alt.github.io/telecom-churn-analytics/",
      dates: "Interactive preview",
      description: "A sample-data dashboard for exploring churn, recurring revenue at risk, customer cohorts, service mix, and early-tenure retention. Visitors can filter example customers and export visible sample records.",
      details: "Signal is a responsive static dashboard built with Next.js and TypeScript. Its metrics and customer profiles are representative values defined in the application source; the public site has no connected subscriber database or live data feed.",
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
      workflow: ["Scan sample retention metrics", "Change the time range", "Compare cohorts and services", "Filter customers", "Export sample records"],
      architecture: {
        summary: "The static Next.js demo keeps representative metrics and profiles in the client application; visitor controls update the local views and CSV export.",
        stages: [
          { id: "overview", title: "Scan the overview", action: "Read sample churn, subscriber, recurring revenue, and revenue-at-risk summaries.", input: "Representative in-app values", output: "Retention overview", contribution: "The dashboard groups the key retention questions on one readable screen.", source: { label: "Dashboard source", href: "https://github.com/patelpreet404-alt/telecom-churn-analytics/blob/main/app/page.tsx" } },
          { id: "trends", title: "Change the period", action: "Select a time range to compare illustrative revenue and churn trends.", input: "Chosen time window", output: "Updated local trend view", contribution: "Time controls keep the visual comparison under visitor control.", source: { label: "Dashboard source", href: "https://github.com/patelpreet404-alt/telecom-churn-analytics/blob/main/app/page.tsx" } },
          { id: "segments", title: "Explore retention", action: "Inspect contract comparisons, early-tenure survival, signup cohorts, and service mix.", input: "Representative cohort and service values", output: "Segment views", contribution: "Cohort and survival views make the early-customer story inspectable within the sample.", source: { label: "Dashboard source", href: "https://github.com/patelpreet404-alt/telecom-churn-analytics/blob/main/app/page.tsx" } },
          { id: "customers", title: "Filter and export", action: "Search example customers by identifier or service, filter contract type, inspect a detail drawer, and export visible sample rows.", input: "Local sample customer profiles", output: "Filtered list or CSV", contribution: "The static site can be explored without transmitting customer input to a server.", source: { label: "Dashboard source", href: "https://github.com/patelpreet404-alt/telecom-churn-analytics/blob/main/app/page.tsx" } }
        ]
      },
      screenshots: [{ src: "/projects/signal-telecom-churn.png", alt: "Signal telecom retention dashboard", caption: "Screenshot of the deployed interactive dashboard using representative sample values." }],
      technologies: ["Next.js", "React", "TypeScript", "CSS"],
      links: [
        { type: "Demo", href: "https://patelpreet404-alt.github.io/telecom-churn-analytics/", icon: <Icons.globe className="size-3" /> },
        { type: "Source", href: "https://github.com/patelpreet404-alt/telecom-churn-analytics", icon: <Icons.github className="size-3" /> }
      ],
      image: "/projects/signal-telecom-churn.png",
      video: ""
    },
  ],
  hackathons: [
    {
      title: "Smart India Hackathon 2024",
      dates: "2024",
      location: "India",
      description:
        "Worked with a multidisciplinary team on a software solution for a real-world problem.",
      image: "/organizations/sih-logo.jpg",
      links: [],
    },
    {
      title: "National Hackathons",
      dates: "During university",
      location: "India",
      description:
        "Participated in multiple 48-hour hackathons focused on rapid prototyping and collaborative development.",
      image: "",
      links: [],
    },
  ],
} as const;

export const PROJECTS: readonly PortfolioProject[] = DATA.projects;
export const FEATURED_PROJECTS = PROJECTS.filter((project) => project.placement === "featured");
export const ADDITIONAL_PROJECTS = PROJECTS.filter((project) => project.placement === "additional");
