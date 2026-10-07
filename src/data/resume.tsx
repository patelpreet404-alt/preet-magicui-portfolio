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
    "I'm studying Computer Science and Engineering at Delhi Technological University in Delhi. I like working across the stack: designing APIs and data flows, then shaping them into tools people can use. My recent work spans an AI learning platform, a research paper Q&A tool with citations, and a C++17 compiler. During my software development internship at Rang Technologies, I built an attendance and analytics platform for 50+ employees.",
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
      detail: "C++17 language tooling from lexical analysis and parsing through optimization and LLVM IR.",
      proof: "OptiLang",
    },
  ],
  skillGroups: [
    {
      title: "Languages",
      skills: ["Python", "C", "C++17", "Java", "JavaScript", "TypeScript", "SQL"],
    },
    {
      title: "Backend and data",
      skills: ["FastAPI", "Flask", "Node.js", "Express.js", "REST APIs", "PostgreSQL", "Supabase", "MySQL", "MongoDB", "SQLite"],
    },
    {
      title: "AI and machine learning",
      skills: ["RAG", "LangChain", "Gemini", "OpenAI API", "FAISS", "Scikit-learn", "TensorFlow", "Pandas", "NumPy"],
    },
    {
      title: "Web and engineering tools",
      skills: ["React", "Next.js", "HTML", "CSS", "Docker", "Git", "Pytest", "Drizzle ORM", "Inngest", "Flex", "Bison", "LLVM IR"],
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
      logoUrl: "",
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
      logoUrl: "",
      start: "2023",
      end: "2027",
    },
    {
      school: "International Indian School Al Jubail",
      href: "https://www.iisjubail.org/",
      degree: "Senior Secondary, PCM with Computer Science",
      logoUrl: "",
      start: "2021",
      end: "2023",
    },
  ],
  projects: [
    {
      title: "AI Learning Management System",
      href: "https://preet-magicui-portfolio.vercel.app/projects/ai-learning-management",
      dates: "Interactive preview",
      description:
        "A guided course space for notes, flashcards, quizzes, and Q&A, with a browser-only sample course to explore.",
      technologies: ["Next.js", "Gemini", "Clerk", "Drizzle ORM", "PostgreSQL", "Inngest"],
      links: [
        {
          type: "Demo",
          href: "https://preet-magicui-portfolio.vercel.app/projects/ai-learning-management",
          icon: <Icons.globe className="size-3" />,
        },
        {
          type: "Source",
          href: "https://github.com/patelpreet404-alt/ai-learning-management-system",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "/projects/ai-learning-management.png",
      video: "",
    },
    {
      title: "ResearchPaper AI",
      href: "https://researchpaper-ai-demo.vercel.app",
      dates: "Interactive preview",
      description:
        "A PDF research workspace with a sample document, prepared answers, and page-level citations. Uploads and live AI are unavailable in this preview.",
      technologies: ["Python", "FastAPI", "LangChain", "FAISS", "OpenAI API", "SQLite"],
      links: [
        {
          type: "Demo",
          href: "https://researchpaper-ai-demo.vercel.app",
          icon: <Icons.globe className="size-3" />,
        },
        {
          type: "Source",
          href: "https://github.com/patelpreet404-alt/researchpaper-ai",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "/projects/researchpaper-ai.png",
      video: "",
    },
    {
      title: "OptiLang",
      href: "https://preet-magicui-portfolio.vercel.app/projects/optilang",
      dates: "Interactive preview",
      description:
        "A C++17 compiler preview that walks through lexical analysis, semantic checks, and optimization with a before-and-after code sample.",
      technologies: ["C++17", "Flex", "Bison", "LLVM IR", "Compiler design"],
      links: [
        {
          type: "Demo",
          href: "https://preet-magicui-portfolio.vercel.app/projects/optilang",
          icon: <Icons.globe className="size-3" />,
        },
        {
          type: "Source",
          href: "https://github.com/patelpreet404-alt/OptiLang",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "/projects/optilang.png",
      video: "",
    },
    {
      title: "Crypto Ransomware Research",
      href: "",
      dates: "Ongoing research",
      description:
        "Researching early ransomware identification with behavioral features from Cuckoo Sandbox, Random Forest classification, and SHA-256 signature matching.",
      technologies: ["Python", "Cuckoo Sandbox", "Random Forest", "SHA-256", "MySQL"],
      links: [],
      image: "",
      video: "",
    },
  ],
  hackathons: [
    {
      title: "Smart India Hackathon 2024",
      dates: "2024",
      location: "India",
      description:
        "Worked with a multidisciplinary team on a software solution for a real-world problem.",
      image: "",
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
