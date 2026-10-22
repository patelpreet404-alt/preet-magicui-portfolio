# Preet Patel — Portfolio

A personal portfolio built with Next.js 16, React 19, TypeScript, Tailwind CSS v4 and Magic UI, based on the [Magic UI portfolio template](https://github.com/magicuidesign/portfolio). Design direction: **"Cited"** — a few key claims carry numbered citations that open their evidence. See [docs/redesign](docs/redesign) for the plan, decisions and changelog.

## Run locally

Requires Node.js 18+ and pnpm.

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Edit content

All content lives in typed modules in `src/content/` (no JSX):

| File | What it holds |
|---|---|
| `profile.ts` | name, links, bio, education, toolbox, availability |
| `projects.ts` | every project: one-liner, stack, media, case study, links |
| `experience.ts` | Rang Technologies |
| `timeline.ts` | the six-row timeline on the home page and the long one on `/about` |
| `citations.ts` | the evidence behind each citation `[n]`; reading order per page is in `citation-order.ts` |

Anything not yet supplied renders as a visible `[TODO: …]`; the full list is in [docs/redesign/PROGRESS.md](docs/redesign/PROGRESS.md).

Routes: `/` (six sections), `/about`, `/work/[slug]` (one static case study per project), and the three interactive demos under `/projects/*`. The blog at `/blog` is `noindex` and unlinked until it has posts (`content/*.mdx`).

## Check quality

```bash
pnpm lint && pnpm build && pnpm start
node scripts/screenshot.mjs --label local --axe   # full-page screenshots, metrics and axe
node scripts/contrast.mjs                          # WCAG contrast for both themes
```

## Deploy

Deploys as a Next.js site on Vercel. The default site URL is `https://preet-magicui-portfolio.vercel.app`; set `NEXT_PUBLIC_SITE_URL` if you use a different domain so canonical URLs, the sitemap and social metadata point to the right site.

## License

The template is MIT licensed. See [LICENSE](LICENSE) for the original copyright notice.
