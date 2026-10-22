import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// Colors are the light-theme tokens from globals.css; ImageResponse cannot read CSS variables.
const PAPER = "#f6f7f4";
const INK = "#14171f";
const GRAPHITE = "#565e6c";
const RULE = "#d9dcd6";
const HIGHLIGHT = "#f2e35c";
const LINK = "#2b44d1";

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png";

// join(process.cwd(), "<literal>") is the pattern Next's file tracing follows, so the fonts ship with the route.
const font = (weight: 500 | 600) =>
  weight === 500
    ? readFile(join(process.cwd(), "src/lib/fonts/schibsted-grotesk-latin-500-normal.woff"))
    : readFile(join(process.cwd(), "src/lib/fonts/schibsted-grotesk-latin-600-normal.woff"));

/** Open Graph card in the "Cited" identity: the claim, then a highlighter stroke and a [1] marker. */
export async function renderOg({ kicker, title, claim }: { kicker: string; title: string; claim: string }) {
  const [medium, semibold] = await Promise.all([font(500), font(600)]);
  const titleSize = title.length > 36 ? 72 : title.length > 22 ? 88 : 104;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: PAPER,
          color: INK,
          padding: "64px 72px",
          fontFamily: "Schibsted Grotesk",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28, fontWeight: 500, color: GRAPHITE }}>
          <span>{kicker}</span>
          <span>Preet Patel</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: titleSize, fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1.02, maxWidth: 1000 }}>{title}</div>
          <div style={{ display: "flex", fontSize: 34, fontWeight: 500, lineHeight: 1.3, maxWidth: 900, marginTop: 36 }}>{claim}</div>
          <div style={{ display: "flex", alignItems: "center", marginTop: 20 }}>
            <div style={{ display: "flex", width: 168, height: 12, background: HIGHLIGHT }} />
            <div style={{ display: "flex", fontSize: 24, fontWeight: 500, color: LINK, marginLeft: 14 }}>[1]</div>
          </div>
        </div>

        <div style={{ display: "flex", borderTop: `2px solid ${RULE}`, paddingTop: 24, fontSize: 26, fontWeight: 500, color: GRAPHITE }}>
          Software Engineer (AI &amp; Backend) · Delhi
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Schibsted Grotesk", data: medium, weight: 500, style: "normal" },
        { name: "Schibsted Grotesk", data: semibold, weight: 600, style: "normal" },
      ],
    },
  );
}
