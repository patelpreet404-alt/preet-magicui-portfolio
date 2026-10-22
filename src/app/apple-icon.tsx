import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const font = await readFile(join(process.cwd(), "src/lib/fonts/schibsted-grotesk-latin-600-normal.woff"));
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#14171f",
          color: "#f6f7f4",
          fontFamily: "Schibsted Grotesk",
          fontWeight: 600,
          fontSize: 92,
          letterSpacing: "-0.04em",
        }}
      >
        <div style={{ display: "flex" }}>PP</div>
        <div style={{ display: "flex", width: 100, height: 10, background: "#f2e35c", marginTop: 6 }} />
      </div>
    ),
    { ...size, fonts: [{ name: "Schibsted Grotesk", data: font, weight: 600, style: "normal" }] },
  );
}
