import { withContentCollections } from "@content-collections/next";
import path from "node:path";
import { fileURLToPath } from "node:url";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Inline the (small, Tailwind) stylesheet so first paint is not blocked by a CSS request. Most visitors are first-time.
  // A stray lockfile in the home directory made Next pick the wrong workspace root.
  turbopack: { root: path.dirname(fileURLToPath(import.meta.url)) },
  // Old modal links (/?project=<slug>) now open the case-study page.
  async redirects() {
    return [
      {
        source: "/",
        has: [{ type: "query", key: "project", value: "(?<slug>[a-z0-9-]+)" }],
        destination: "/work/:slug",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

// withContentCollections must be the outermost plugin
export default withContentCollections(nextConfig);
