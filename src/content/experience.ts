import { todo } from "./profile";

export interface ExperienceEntry {
  company: string;
  /** The résumé's title wins over the journey's "Software Development / Data Analytics Intern". */
  title: string;
  location: string;
  /** Display label, e.g. "Jun–Aug 2026". */
  period: string;
  start: string;
  end: string;
  logo: string;
  bullets: readonly string[];
  outcome: { text: string; citationId: string };
  stack: readonly string[];
}

export const experience: readonly ExperienceEntry[] = [
  {
    company: "Rang Technologies",
    title: "Software Development Intern",
    location: "Remote (New Jersey, USA)",
    period: "Jun–Aug 2026",
    start: "2026-06",
    end: "2026-08",
    logo: "/organizations/rang-logo.jpg",
    bullets: [
      "Built a Flask and Supabase attendance platform for 50+ employees across four workflows.",
      "Added IP-based attendance verification and an admin dashboard for work hours, login history, breaks and attendance insights.",
      "Optimized 10+ REST API endpoints and Supabase queries.",
    ],
    outcome: { text: "Manual attendance processing down 80%", citationId: "exp-rang-80" },
    stack: ["Flask", "Supabase", "REST APIs", "IP verification", "Analytics"],
  },
];

export const experienceTodos = {
  measurement: todo("how the 80% reduction was measured"),
};
