/** Link kinds are mapped to icons by components; content stays JSX-free. */
export type LinkKind = "demo" | "source" | "case-study" | "preview";

export interface ContentLink {
  kind: LinkKind;
  href: string;
  /** Overrides the default label for the kind ("Live demo", "Source", "Read case study", "Interactive preview"). */
  label?: string;
}

/** Visible placeholder for anything Preet still has to supply. Also listed in docs/redesign/PROGRESS.md. */
export const todo = (what: string) => `[TODO: ${what}]`;

export const profile = {
  name: "Preet Patel",
  initials: "PP",
  jobTitle: "Software Engineer (AI & Backend)",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://preet-magicui-portfolio.vercel.app",
  location: "Delhi, India",
  email: "patelpreet404@gmail.com",
  description:
    "Computer Science and Engineering student at DTU building practical AI tools, backend systems, and developer-focused software.",
  headline: "Preet Patel builds software that shows its work.",
  avatar: "/preet-patel-avatar.jpg",
  resume: "/preet-patel-resume.pdf",
  terminalUrl: "https://preet-patel-portfolio.vercel.app/",

  availability: {
    short: todo('short availability, e.g. "Open to roles"'),
    long: todo('e.g. "Open to software engineering and applied-AI roles for 2027 — Delhi, remote or relocation"'),
  },

  social: {
    github: { label: "GitHub", href: "https://github.com/patelpreet404-alt" },
    linkedin: { label: "LinkedIn", href: "https://www.linkedin.com/in/preet-patel-162631317/" },
    leetcode: { label: "LeetCode", href: "https://leetcode.com/u/pr33t2005/" },
    neetcode: { label: "NeetCode", href: "https://neetcode.io/user/SuperGengar989" },
  },

  /** Assembled from existing site copy; Preet should replace it with his own words. */
  bio: [
    "I grew up in Al Jubail, Saudi Arabia, and moved to Delhi in 2023 to study Computer Science and Engineering at Delhi Technological University.",
    "I like projects that connect solid engineering with a clear use for the person on the other side: AI tools that show their sources, backend systems that people rely on, and a compiler to see what happens behind the code.",
    todo("replace this bio with Preet's own 3–4 sentences"),
  ],

  now: "I'm researching early identification of crypto-ransomware, combining behavioral features from Cuckoo Sandbox with Random Forest classification and SHA-256 signature matching.",

  education: [
    {
      school: "Delhi Technological University",
      degree: "B.Tech, Computer Science and Engineering",
      period: "2023–2027",
      href: "https://dtu.ac.in/",
    },
    {
      school: "International Indian School Al Jubail",
      degree: "Senior Secondary, PCM with Computer Science",
      period: "2021–2023",
      href: "https://www.iisjubail.org/",
    },
  ],

  /** From the résumé's skills section, grouped for the About page. */
  toolbox: [
    { group: "Languages", items: ["Python", "Java", "C", "C++", "SQL", "JavaScript", "TypeScript"] },
    { group: "Backend", items: ["FastAPI", "Flask", "Node.js", "REST APIs", "Supabase", "Drizzle ORM", "Inngest"] },
    { group: "AI and data", items: ["RAG", "LangChain", "FAISS", "Gemini", "Scikit-learn", "PostgreSQL", "MySQL", "MongoDB", "SQLite"] },
    { group: "Frontend", items: ["React", "Next.js", "HTML", "CSS"] },
    { group: "Tools", items: ["Docker", "Git", "Pytest", "Flex", "Bison"] },
  ],

  beyondCode: [
    "Represented the Al Jubail U-19 regional cricket team in Saudi Arabia.",
    "Smart India Hackathon 2024 participant and several national 48-hour hackathons.",
    "IBM SkillsBuild training in RAG and generative AI.",
    "Kaggle certificates in machine learning and Python.",
  ],
} as const;
