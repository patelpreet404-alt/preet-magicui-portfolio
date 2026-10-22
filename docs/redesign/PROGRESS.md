# Redesign progress

Branch `redesign/v2` · base `origin/main` @ `cb394b3` · spec: [PLAN.md](./PLAN.md)

This file is how we resume across sessions. Work stops at the end of every phase; Preet says "continue" to start the next one.

## How to run things

```bash
npx -y pnpm@10 install          # pnpm is not installed globally on this machine; `npx -y pnpm@10 <cmd>` works the same
npx -y pnpm@10 lint && npx -y pnpm@10 build
npx -y pnpm@10 start            # serve the production build on :3000
node scripts/screenshot.mjs --label <name> [--axe] [--reduced-motion] [--only /path]
```

Screenshots land in `docs/redesign/screenshots/<label>/` (git-ignored; each run also writes `report.json` with page heights, section counts, first-project position and console errors).

## Status

- [x] **Phase 0 — Baseline**
- [ ] Phase 1 — Foundations
- [ ] Phase 2 — Home page
- [ ] Phase 3 — Case studies and /about
- [ ] Phase 4 — Motion and polish
- [ ] Phase 5 — Performance, accessibility, SEO
- [ ] Phase 6 — Final QA

## Phase 0 — Baseline

- [x] Read every file the brief lists (page, layout, resume/journey/design data, all `components/section/*`, project viewer/details, navbar, three CSS files, résumé PDF)
- [x] Branch `redesign/v2`
- [x] `pnpm install && pnpm lint && pnpm build` — see "Baseline results"
- [x] Save the prompt to `docs/redesign/PLAN.md`
- [x] Create this file
- [x] `scripts/screenshot.mjs` + `@playwright/test` devDependency + Chromium installed
- [x] Capture `before` screenshots (24 captures: `/` and the three demo pages × 3 viewports × 2 themes; `/about` and `/work/*` skipped because they don't exist yet)

### Baseline results

| Check | Result |
|---|---|
| `lint` | passes with 0 errors. After a build it reports 1 warning from the generated `.content-collections/generated/allPosts.js` (`import/no-anonymous-default-export`); add `.content-collections/**` to the ESLint ignores in Phase 1 |
| `build` | passes. Two warnings: (1) Next infers the workspace root as `/Users/preet/package-lock.json` because of a stray lockfile in the home directory; (2) "Using edge runtime on a page disables static generation" (an `opengraph-image` route). Both are addressed in Phase 1 / 3 |
| Routes | `/`, `/projects/{ai-learning-management,optilang,researchpaper-ai}` static; `/blog`, `/blog/[slug]`, `/api/online-presence` and the OG images dynamic |
| Console errors | none on any captured page |
| Home page (1440×900) | 13 `<section>`s, 10,927 px (12.1 screens), first project at 5,328 px (5.9 screens) |
| Home page (768×1024) | 11,402 px (11.1 screens), first project at 5,227 px (5.1 screens) |
| Home page (390×844) | 13,221 px (15.7 screens), first project at 6,558 px (7.8 screens) |
| Light theme "before" | visibly broken: `portfolio-polish.css` forces dark tokens on `:root`, so the light capture is a washed-out white-on-grey version of the dark page |
| Environment | Node 26.8.2; `pnpm` and `ffmpeg` are not installed (Playwright's bundled ffmpeg is not usable for re-encoding) |

Repo note: `/Users/preet/Desktop/portfolio` was not a git checkout (it held only `PORTFOLIO_REDESIGN_PLAN.md` and `SONNET_MASTER_PROMPT.md`). It was turned into the repo root with `git init` + `git fetch origin` + `git checkout -b redesign/v2 origin/main`. The two markdown files are listed in `.git/info/exclude` so they stay untracked.

## Phase 1 — Foundations (not started)

Plan to be written here when the phase begins.

- [ ] Tokens (light + dark) in `globals.css`, mapped into Tailwind v4 `@theme`; shadcn token names kept as aliases so the demo pages keep working
- [ ] Fonts: Schibsted Grotesk, Newsreader (opsz), DM Mono for code only; remove Bodoni Moda, Manrope, hard-coded Georgia
- [ ] Type scale, 12-column grid / container, section spacing, `scroll-padding-top`
- [ ] Motion tokens + reduced-motion utilities tied to `MotionSettingsProvider` (`html[data-reduced-motion]`)
- [ ] Remove `site-background.tsx` (HLS/Mux space video) and delete the forced-dark `:root` overrides in `portfolio-polish.css`; fold anything still needed into `globals.css`
- [ ] Move demo CSS (`.optilang-theme`, `.research-theme`, `.studyroom-*`, `.project-demo-fullscreen`, …) into `demos.css`, imported only by `/projects/*`
- [ ] Header (hide on scroll down / show on scroll up / always on focus; <640px name + Menu sheet, focus-trapped, Esc closes) and footer shells, skip link
- [ ] Theme toggle (Magic UI Animated Theme Toggler), motion toggle moved to footer
- [ ] Data refactor into typed, JSX-free `src/content/{profile,projects,experience,timeline,citations}.ts`
- [ ] `turbopack.root` set to silence the lockfile warning
- [ ] Screenshots `phase-1`

## Phase 2 — Home page (not started)

- [ ] Hero with three citations (`<Cite>` component + `src/content/citations.ts`)
- [ ] Selected work (4 rows, hover/in-view video, `next/image` fallbacks)
- [ ] Experience (Rang Technologies, fully visible, one citation)
- [ ] More work (filters, semantic list, status, links)
- [ ] About (condensed)
- [ ] Contact + footer (copy-email, IST clock, theme/motion toggles, terminal link)
- [ ] Old sections removed from `page.tsx` and moved to `src/components/_archive/`
- [ ] First project within ~1.2 screens (1440×900) / ~2 screens (390 px)
- [ ] Screenshots `phase-2`

## Phase 3 — Case studies and /about (not started)

- [ ] `/work/[slug]` (`generateStaticParams`, `generateMetadata`, `opengraph-image`)
- [ ] Architecture stepper, system design (overview / services / data model), decisions, results, limitations, "About this demo"
- [ ] Top bar with All work / Next project (`transitionTypes`)
- [ ] `/about`
- [ ] `/?project=<slug>` → `/work/<slug>` redirect (`redirects()` with `has`)
- [ ] `/blog` out of navigation + sitemap, `robots: { index: false }`
- [ ] Delete modal flow (`project-details.tsx`, `project-viewer.tsx`, `ProjectDetailsShell`) and saved/compare feature
- [ ] Demo pages checked in screenshots
- [ ] Screenshots `phase-3`

## Phase 4 — Motion and polish (not started)

- [ ] Hero load sequence (once per session, skipped under reduced motion, < 1.4 s)
- [ ] `<ViewTransition>` morph work row → case-study hero; directional nav (upgrade Next 16.x / React 19.3.x if required)
- [ ] Optional Lenis (off for reduced motion and touch)
- [ ] More-work hover preview (fine pointer only)
- [ ] Micro-interactions
- [ ] Self-critique: screenshot every page at 390/768/1440 in both themes, list the 10 weakest details, fix, re-shoot
- [ ] Screenshots `phase-4`

## Phase 5 — Performance, accessibility, SEO (not started)

- [ ] Remove `hls.js`, the Mux stream, the iframe; delete `_archive/`, `/api/online-presence`, unused deps (`react-markdown` only if unused) and unused template images
- [ ] Every image through `next/image` with `sizes`; re-export `crypto-ransomware-preview.png` and the avatar
- [ ] Re-encode demo MP4s (blocked: no `ffmpeg` — see "Content needed")
- [ ] Fonts via `next/font`, latin only, only used weights
- [ ] Skip link, landmarks, one `h1` per page, focus ring 2px `--link` / 3px offset, Esc behaviour, reduced-motion audit
- [ ] axe (`@axe-core/playwright`) on `/`, `/about`, one case study: zero serious/critical
- [ ] SEO: title/description/canonical/OG/Twitter, `opengraph-image`, `sitemap.ts`, `robots.ts`, `manifest.ts`, `icon.svg` + `apple-icon`, JSON-LD `Person`, remove empty `verification`
- [ ] Lighthouse mobile: Perf ≥ 90; A11y, Best Practices, SEO ≥ 95
- [ ] Screenshots `phase-5`

## Phase 6 — Final QA (not started)

- [ ] Before/after screenshots
- [ ] Final "Content needed from Preet" list
- [ ] `docs/redesign/CHANGELOG.md`
- [ ] Open a PR (do not merge)

## Decisions

| # | Decision | Why |
|---|---|---|
| D1 | Turned the non-git working directory into the repo root instead of cloning into a subfolder | The brief says to run at the repo root; both prompt files stay untracked via `.git/info/exclude` |
| D2 | Use `npx -y pnpm@10` rather than installing pnpm globally | Avoids changing the machine's global tooling; `pnpm-lock.yaml` is lockfile v9, which pnpm 10 reads |
| D3 | `docs/redesign/screenshots/` is git-ignored | ~18 MB per label × many labels would bloat the repo. Final PR can attach a curated subset |
| D4 | Screenshot script also writes a fold-only image and `report.json` (heights, section count, first-project position, console errors, optional axe) | The "done when" criteria are numeric; this makes them checkable on every phase |
| D5 | Theme storage key stays `portfolio-space-theme` | The screenshot script and any returning visitor's saved choice keep working; rename is cosmetic |
| D6 | When sources disagree, the conservative wording wins: intern title = résumé's "Software Development Intern"; OptiLang = the site's five-pass / "LLVM examples are separate" wording, not the résumé's "eight-stage … LLVM IR" | Per non-negotiables; each is also listed below as a TODO |
| D7 | Product name "Studyloom" (subtitle "AI course builder") on the site, although the résumé and repo data call it "AI Learning Management System" | Brief says so; the demo route stays `/projects/ai-learning-management`. Résumé wording logged below |

## Content needed from Preet

1. **Availability line** (hero + contact): role types, start date, locations. Rendered as `[TODO: …]` until provided.
2. **Month and year for each project** (replaces "During B.Tech"): ResearchPaper AI, Studyloom, OptiLang, SubbieGuard/Foodfolk, Fieldnote, Ledgerline, Signal, crypto-ransomware research.
3. **Your role on each project** (solo / team of N / hackathon). Rendered as `[TODO: role]`.
4. **Fourth featured project:** Foodfolk (demo + source) or SubbieGuard (more product depth, no source link). Foodfolk is the placeholder.
5. **Confirm the numbers:** 50+ employees, 80% manual-processing reduction (how measured?), 35% instruction reduction (57 → 37 on the repo's demo program, ~0.34 ms).
6. **Resolve inconsistencies**
   - Intern title: résumé "Software Development Intern" vs journey "Software Development / Data Analytics Intern".
   - OptiLang: résumé says "eight-stage compiler" and lists "LLVM IR"; the site says five optimization passes and that the LLVM examples are a separate Clang exercise. Update the résumé or confirm.
   - Product name: résumé "AI Learning Management System" vs site "Studyloom".
   - "Foodfolk" (projects) vs "FoodSocial" (journey).
   - "DGS — Career Development Platform" appears only in the journey; dropped unless it gets a page.
   - Journey says "50K+ credit records · 100K+ e-commerce orders" while the project cards say the data is synthetic/sample; dropped from the site.
   - "5 learning types · 4 study material formats" (journey) is not in the résumé or project data; dropped.
   - Résumé lists "RSA" among the ransomware research tools; the site lists "MySQL". Neither is on the other.
7. **A new portrait** (clear, well lit, no sunglasses, ≥ 1200 px on the long side, 4:5). The current avatar is a 396 KB square photo with sunglasses.
8. **A short bio in your own words** (3–4 sentences). Placeholder is assembled from existing copy.
9. **Custom domain** (e.g. `preetpatel.dev`) before an Awwwards submission; currently `vercel.app`.
10. **`ffmpeg`:** not installed here, so the three ~6 MB demo MP4s can't be re-encoded in Phase 5. Either `brew install ffmpeg` or hand over smaller files.
11. **LinkedIn "100+ connections"** and LeetCode/NeetCode counts are being removed rather than shown. Confirm that's fine.
