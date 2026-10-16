export type JourneyState = 'completed' | 'ongoing' | 'future';

export type JourneyIcon =
  | 'graduation' | 'code' | 'university' | 'trophy' | 'brain'
  | 'search' | 'cpu' | 'chart' | 'briefcase' | 'shield'
  | 'rocket' | 'infinity' | 'flag';

export interface JourneyMilestone {
  id: string;
  dateLabel: string;
  startDate: string | null;
  endDate: string | null;
  state: JourneyState;
  icon: JourneyIcon;
  category: string;
  title: string;
  organization?: string;
  location?: string;
  description: string;
  highlights?: readonly string[];
  projects?: readonly string[];
  technologies?: readonly string[];
  status?: string;
}

export const JOURNEY_MILESTONES: readonly JourneyMilestone[] = [
  {
    id: 'foundation', dateLabel: 'APR 2019 — MAR 2021', startDate: '2019-04', endDate: '2021-03',
    state: 'completed', icon: 'graduation', category: 'Education', title: 'Where It All Began',
    organization: 'International Indian School Al Jubail', location: 'Saudi Arabia',
    description: 'Built a foundation in mathematics, science, and analytical thinking while discovering my interest in technology.',
    highlights: ['92.6% — Secondary Education']
  },
  {
    id: 'computer-science', dateLabel: 'APR 2021 — MAR 2023', startDate: '2021-04', endDate: '2023-03',
    state: 'completed', icon: 'code', category: 'Education', title: 'Discovering Computer Science',
    organization: 'International Indian School Al Jubail', location: 'Saudi Arabia',
    description: 'Studied Physics, Chemistry, Mathematics, and Computer Science, strengthening my interest in programming and logical problem-solving.',
    highlights: ['85.6% — Senior Secondary (PCM + CS)']
  },
  {
    id: 'dtu', dateLabel: 'SEP 2023 — MAY 2027 (EXPECTED)', startDate: '2023-09', endDate: '2027-05',
    state: 'ongoing', icon: 'university', category: 'University', title: 'A New Chapter at DTU',
    organization: 'Delhi Technological University', location: 'New Delhi, India',
    description: 'Moved from Saudi Arabia to India to study Computer Science Engineering and explore algorithms, databases, software, and intelligent systems.',
    highlights: ['B.Tech — Computer Science & Engineering'], status: 'Currently pursuing'
  },
  {
    id: 'hackathon', dateLabel: '2024', startDate: '2024', endDate: '2024',
    state: 'completed', icon: 'trophy', category: 'Hackathon', title: 'Turning Ideas Into Reality',
    organization: 'Smart India Hackathon 2024',
    description: 'Collaborated with a multidisciplinary team on practical challenges, learning rapid prototyping and teamwork under pressure.',
    highlights: ['Smart India Hackathon 2024 — Participant']
  },
  {
    id: 'learning-apps', dateLabel: 'DURING B.TECH', startDate: null, endDate: null,
    state: 'completed', icon: 'brain', category: 'Software Engineering & AI', title: 'Building My First Intelligent Applications',
    description: 'Explored full-stack development through AI-powered learning tools and automated content generation.',
    projects: ['AI Learning Management System'],
    technologies: ['Next.js', 'TypeScript', 'Gemini AI', 'PostgreSQL', 'Clerk', 'Inngest'],
    highlights: ['5 learning types · 4 study material formats']
  },
  {
    id: 'rag', dateLabel: 'DURING B.TECH', startDate: null, endDate: null,
    state: 'completed', icon: 'search', category: 'AI Engineering', title: 'Exploring Generative AI & RAG',
    description: 'Built a research-paper workspace using document retrieval, semantic search, conversation history, and citation-aware answers.',
    projects: ['ResearchPaper AI'],
    technologies: ['Python', 'FastAPI', 'LangChain', 'FAISS', 'OpenAI API'],
    highlights: ['RAG · Semantic search · Citation tracking']
  },
  {
    id: 'compiler', dateLabel: 'DURING B.TECH', startDate: null, endDate: null,
    state: 'completed', icon: 'cpu', category: 'Systems Engineering', title: 'Understanding What Happens Behind the Code',
    description: 'Developed OptiLang, a C++17 compiler with parsing, semantic checks, an intermediate representation, and optimization passes.',
    projects: ['OptiLang — Mini Compiler'],
    technologies: ['C++17', 'Flex', 'Bison', 'LLVM IR'],
    highlights: ['35% fewer instructions on the repository demo program']
  },
  {
    id: 'data', dateLabel: 'DURING B.TECH', startDate: null, endDate: null,
    state: 'completed', icon: 'chart', category: 'Data Analytics & Machine Learning', title: 'Discovering the Power of Data',
    description: 'Explored customer behavior, credit risk, predictive modeling, and business analytics through datasets and dashboards.',
    projects: ['Enterprise Credit Risk Assessment', 'Telecom Customer Churn Analytics', 'E-Commerce Funnel & Retention Analytics'],
    technologies: ['Python', 'SQL', 'Scikit-learn', 'Power BI', 'Tableau'],
    highlights: ['50K+ credit records · 100K+ e-commerce orders']
  },
  {
    id: 'rang', dateLabel: 'JUN 2026 — AUG 2026', startDate: '2026-06', endDate: '2026-08',
    state: 'completed', icon: 'briefcase', category: 'Professional Experience', title: 'From Classroom to Industry',
    organization: 'Rang Technologies', location: 'New Jersey, USA — Remote',
    description: 'Built a workforce attendance and analytics platform with Flask, PostgreSQL, and Supabase for operational use.',
    highlights: ['50+ employees supported', '4 operational workflows', '80% reduction in manual processing'],
    technologies: ['Python', 'Flask', 'PostgreSQL', 'Supabase', 'REST APIs'],
    status: 'Software Development / Data Analytics Intern'
  },
  {
    id: 'research', dateLabel: 'ONGOING AS OF OCT 2026', startDate: null, endDate: null,
    state: 'ongoing', icon: 'shield', category: 'Ongoing Research', title: 'Exploring AI in Cybersecurity',
    organization: 'Pre-Encryption and Identification of Crypto Ransomwares',
    description: 'Exploring early ransomware detection through machine learning, behavioral analysis, and cryptographic signature matching.',
    technologies: ['Python', 'Random Forest', 'Cuckoo Sandbox', 'SHA-256'], status: 'Ongoing research'
  },
  {
    id: 'product-thinking', dateLabel: 'SEP 2026 — OCT 2026', startDate: '2026-09', endDate: '2026-10',
    state: 'completed', icon: 'rocket', category: 'Independent Development', title: 'From Projects to Product Thinking',
    description: 'Explored product ideas that connect full-stack engineering, thoughtful user experience, database design, and practical problems.',
    projects: ['DGS — Career Development Platform', 'SubbieGuard — Construction Workflow SaaS', 'FoodSocial — Social Food Discovery'],
    technologies: ['Next.js', 'React', 'TypeScript', 'Supabase', 'PostgreSQL'],
    highlights: ['Full-stack · SaaS · Product development']
  },
  {
    id: 'current', dateLabel: 'OCT 2026 — PRESENT', startDate: '2026-10', endDate: null,
    state: 'ongoing', icon: 'infinity', category: 'Current Chapter', title: 'The Journey Is Just Getting Started',
    description: 'Continuing to explore software engineering, applied AI, data-driven systems, and research through projects that challenge me to improve.',
    technologies: ['Full-stack engineering', 'Applied AI', 'Backend systems', 'Research'],
    status: 'Currently building'
  },
  {
    id: 'next', dateLabel: 'MAY 2027 — EXPECTED', startDate: '2027-05', endDate: null,
    state: 'future', icon: 'flag', category: 'Future Milestone', title: 'The Next Chapter',
    description: 'Working toward completing my B.Tech at DTU and beginning a career building reliable, intelligent, and impactful software.',
    status: 'Upcoming'
  }
];

export const JOURNEY_BEYOND = [
  { title: 'Cricket', description: 'Represented the Al Jubail U-19 regional cricket team in Saudi Arabia.' },
  { title: 'Hackathons', description: 'Participated in multiple national 48-hour hackathons.' },
  { title: 'Certifications', description: 'IBM SkillsBuild and Kaggle learning certifications documented in my résumés.' }
] as const;
