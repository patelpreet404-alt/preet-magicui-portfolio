import type { MetadataRoute } from "next";
import { profile } from "@/content";

export default function robots(): MetadataRoute.Robots {
  const base = profile.url.replace(/\/$/, "");
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${base}/sitemap.xml`,
  };
}
