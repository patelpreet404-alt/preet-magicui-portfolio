import { Icons } from "@/components/icons";
import { FileTextIcon, HomeIcon } from "lucide-react";
import { ReactLight } from "@/components/ui/svgs/reactLight";
import { NextjsIconDark } from "@/components/ui/svgs/nextjsIconDark";
import { Typescript } from "@/components/ui/svgs/typescript";
import { Nodejs } from "@/components/ui/svgs/nodejs";
import { Python } from "@/components/ui/svgs/python";
import { Postgresql } from "@/components/ui/svgs/postgresql";
import { Docker } from "@/components/ui/svgs/docker";
import { Java } from "@/components/ui/svgs/java";

export const DATA = {
  name: "Preet Patel",
  initials: "PP",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://preet-magicui-portfolio.vercel.app",
  location: "Delhi, India",
  locationLink: "https://www.google.com/maps/place/Delhi",
  description:
    "Computer Science student building backend systems, AI tools, and developer-focused software.",
  summary:
    "I'm a Computer Science and Engineering student at Delhi Technological University. I enjoy turning complex ideas into useful software, from an [AI learning platform](https://github.com/patelpreet404-alt/ai-learning-management-system) and a [research paper Q&A tool](https://github.com/patelpreet404-alt/researchpaper-ai) to an [optimizing compiler](https://github.com/patelpreet404-alt/OptiLang). Most recently, I built an attendance and analytics platform during my software development internship at Rang Technologies.",
  avatarUrl: "/preet-patel-avatar.jpg",
  skills: [
    { name: "Python", icon: Python },
    { name: "TypeScript", icon: Typescript },
    { name: "Java", icon: Java },
    { name: "C++", icon: null },
    { name: "React", icon: ReactLight },
    { name: "Next.js", icon: NextjsIconDark },
    { name: "Node.js", icon: Nodejs },
    { name: "FastAPI", icon: null },
    { name: "Flask", icon: null },
    { name: "PostgreSQL", icon: Postgresql },
    { name: "Supabase", icon: null },
    { name: "RAG / LangChain", icon: null },
    { name: "Docker", icon: Docker },
  ],
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
