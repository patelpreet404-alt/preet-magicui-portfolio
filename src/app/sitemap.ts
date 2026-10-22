import type { MetadataRoute } from "next";
import { profile, projects } from "@/content";

// The blog is left out on purpose until it has posts. No lastModified: it would have to be invented.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = profile.url.replace(/\/$/, "");
  return [
    { url: base, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.7 },
    ...projects.map((project) => ({
      url: `${base}/work/${project.slug}`,
      changeFrequency: "monthly" as const,
      priority: project.featuredRank ? 0.9 : 0.6,
    })),
    ...["optilang", "researchpaper-ai", "ai-learning-management"].map((slug) => ({
      url: `${base}/projects/${slug}`,
      changeFrequency: "yearly" as const,
      priority: 0.4,
    })),
  ];
}
