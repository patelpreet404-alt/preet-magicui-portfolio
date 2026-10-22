import { profile } from "@/content";
import { OG_CONTENT_TYPE, OG_SIZE, renderOg } from "@/lib/og";

export const alt = `${profile.name}: ${profile.jobTitle}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOg({
    kicker: "Portfolio",
    title: profile.headline,
    claim: "A research assistant that cites the page behind every answer.",
  });
}
