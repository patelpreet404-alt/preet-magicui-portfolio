import { todo } from "./profile";

export interface TimelineRow {
  /** Display date, or a visible placeholder. */
  when: string;
  text: string;
}

/** The six rows shown in About on the home page. */
export const timelineShort: readonly TimelineRow[] = [
  { when: "2019–2023", text: "School in Al Jubail, Saudi Arabia (PCM and Computer Science)." },
  { when: "2023", text: "Moved to Delhi for B.Tech in Computer Science and Engineering at DTU." },
  { when: "2024", text: "Smart India Hackathon." },
  { when: todo("year"), text: "Built ResearchPaper AI, Studyloom and OptiLang." },
  { when: "Jun–Aug 2026", text: "Software Development Intern at Rang Technologies." },
  { when: "Now", text: "Researching crypto-ransomware detection and looking for my next team." },
];

export type TimelineKind = "education" | "hackathon" | "projects" | "experience" | "research" | "now" | "next";

export interface TimelineEntry {
  id: string;
  /** Display label. Undated project chapters carry a visible placeholder instead of "During B.Tech". */
  when: string;
  kind: TimelineKind;
  title: string;
  organization?: string;
  location?: string;
  description: string;
  highlights?: readonly string[];
  projects?: readonly string[];
  technologies?: readonly string[];
  status?: string;
}

/**
 * The longer story for /about. Migrated from src/data/journey.ts. Dropped as unverifiable or
 * contradicting the project pages: "5 learning types · 4 study material formats", "50K+ credit
 * records · 100K+ e-commerce orders", "DGS — Career Development Platform", "FoodSocial" (now Foodfolk),
 * "LLVM IR" and "Tableau" (not on the résumé or any project page).
 */
export const timelineLong: readonly TimelineEntry[] = [
  {
    id: "foundation",
    when: "Apr 2019 – Mar 2021",
    kind: "education",
    title: "Where it all began",
    organization: "International Indian School Al Jubail",
    location: "Al Jubail, Saudi Arabia",
    description: "Built a foundation in mathematics, science and analytical thinking while discovering an interest in technology.",
    highlights: ["92.6% — Secondary education"],
  },
  {
    id: "computer-science",
    when: "Apr 2021 – Mar 2023",
    kind: "education",
    title: "Discovering computer science",
    organization: "International Indian School Al Jubail",
    location: "Al Jubail, Saudi Arabia",
    description: "Studied Physics, Chemistry, Mathematics and Computer Science, which strengthened an interest in programming and logical problem-solving.",
    highlights: ["85.6% — Senior Secondary (PCM with Computer Science)"],
  },
  {
    id: "dtu",
    when: "Sep 2023 – May 2027 (expected)",
    kind: "education",
    title: "A new chapter at DTU",
    organization: "Delhi Technological University",
    location: "Delhi, India",
    description: "Moved from Saudi Arabia to India to study Computer Science and Engineering and explore algorithms, databases, software and intelligent systems.",
    highlights: ["B.Tech, Computer Science and Engineering"],
    status: "Currently pursuing",
  },
  {
    id: "hackathon",
    when: "2024",
    kind: "hackathon",
    title: "Turning ideas into reality",
    organization: "Smart India Hackathon 2024",
    description: "Worked with a multidisciplinary team on practical challenges and learned rapid prototyping and teamwork under pressure.",
    highlights: ["Smart India Hackathon 2024 — participant"],
  },
  {
    id: "learning-apps",
    when: todo("month year"),
    kind: "projects",
    title: "Building my first intelligent applications",
    description: "Explored full-stack development through AI-powered learning tools and automated content generation.",
    projects: ["Studyloom"],
    technologies: ["Next.js", "TypeScript", "Gemini", "PostgreSQL", "Clerk", "Inngest"],
  },
  {
    id: "rag",
    when: todo("month year"),
    kind: "projects",
    title: "Exploring generative AI and RAG",
    description: "Built a research-paper workspace using document retrieval, semantic search, conversation history and citation-aware answers.",
    projects: ["ResearchPaper AI"],
    technologies: ["Python", "FastAPI", "LangChain", "FAISS", "OpenAI API"],
  },
  {
    id: "compiler",
    when: todo("month year"),
    kind: "projects",
    title: "Understanding what happens behind the code",
    description: "Developed OptiLang, a C++17 compiler with parsing, semantic checks, an intermediate representation and optimization passes.",
    projects: ["OptiLang"],
    technologies: ["C++17", "Flex", "Bison"],
    highlights: ["35% fewer instructions on the repository demo program"],
  },
  {
    id: "data",
    when: todo("month year"),
    kind: "projects",
    title: "Discovering the power of data",
    description: "Explored customer behavior, credit risk, predictive modeling and business analytics through datasets and dashboards.",
    projects: ["Ledgerline", "Signal", "Fieldnote"],
    technologies: ["Python", "SQL", "Scikit-learn", "Power BI"],
  },
  {
    id: "rang",
    when: "Jun – Aug 2026",
    kind: "experience",
    title: "From classroom to industry",
    organization: "Rang Technologies",
    location: "Remote (New Jersey, USA)",
    description: "Built a workforce attendance and analytics platform with Flask and Supabase for operational use.",
    highlights: ["50+ employees supported", "Four workflows", "80% reduction in manual processing"],
    technologies: ["Python", "Flask", "Supabase", "REST APIs"],
    status: "Software Development Intern",
  },
  {
    id: "research",
    when: "Ongoing as of Oct 2026",
    kind: "research",
    title: "Exploring AI in cybersecurity",
    organization: "Pre-encryption identification of crypto-ransomware",
    description: "Exploring early ransomware detection through machine learning, behavioral analysis and cryptographic signature matching.",
    technologies: ["Python", "Random Forest", "Cuckoo Sandbox", "SHA-256"],
    status: "Ongoing research",
  },
  {
    id: "product-thinking",
    when: "Sep – Oct 2026",
    kind: "projects",
    title: "From projects to product thinking",
    description: "Explored product ideas that connect full-stack engineering, thoughtful user experience, database design and practical problems.",
    projects: ["SubbieGuard", "Foodfolk"],
    technologies: ["Next.js", "React", "TypeScript", "Supabase", "PostgreSQL"],
  },
  {
    id: "current",
    when: "Oct 2026 – present",
    kind: "now",
    title: "The journey is just getting started",
    description: "Continuing to explore software engineering, applied AI, data-driven systems and research through projects that challenge me to improve.",
    technologies: ["Full-stack engineering", "Applied AI", "Backend systems", "Research"],
    status: "Currently building",
  },
  {
    id: "next",
    when: "May 2027 (expected)",
    kind: "next",
    title: "The next chapter",
    description: "Completing the B.Tech at DTU and beginning a career building reliable, intelligent and impactful software.",
    status: "Upcoming",
  },
];
