import type { MetadataRoute } from "next";
import { profile } from "@/content";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${profile.name}: ${profile.jobTitle}`,
    short_name: profile.name,
    description: profile.description,
    start_url: "/",
    display: "standalone",
    background_color: "#f6f7f4",
    theme_color: "#f6f7f4",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
