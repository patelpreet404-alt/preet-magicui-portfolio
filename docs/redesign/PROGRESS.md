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
- [x] Phase 1 — Foundations
- [x] Phase 2 — Home page
- [x] Phase 3 — Case studies and /about
- [x] Phase 4 — Motion and polish
- [x] Phase 5 — Performance, accessibility, SEO (video re-encode blocked)
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

## Phase 1 — Foundations (done)

### Plan (files I will touch)

**Structure.** Route groups so the demo pages stay chrome-free and keep their own CSS:
`src/app/layout.tsx` (html, fonts, providers only) · `src/app/(site)/layout.tsx` (skip link, header, `<main id="main">`, footer, legacy modal shell) · `src/app/(site)/page.tsx` + `blog/` (moved with `git mv`) · `src/app/projects/layout.tsx` (imports `demos.css`, wraps demos in `.site-content`) · `src/app/projects/demos.css` (lines moved verbatim out of `globals.css`) · `src/app/styleguide/page.tsx` (temporary `noindex` design-system proof page, deleted in Phase 5).

**Tokens, type, grid, motion.** `src/app/globals.css` (rewritten: tokens, shadcn aliases, `@theme`, type utilities, container/grid helpers, motion tokens, reduced-motion rules, focus ring, `scroll-padding-top`) · `src/app/legacy.css` (what remains of `portfolio-polish.css`, `design-explorer.css` and the old marquee / engineering-map rules; no `:root` rules; deleted in Phase 5 with `_archive/`) · delete `portfolio-polish.css`, `design-explorer.css` (merged into `legacy.css`).

**Fonts.** `src/app/layout.tsx`: Schibsted Grotesk (variable), Newsreader (variable, `opsz`, normal style only), DM Mono 400/500, latin subset. Bodoni Moda and Manrope removed.

**Chrome.** `src/components/site/{site-header,menu-sheet,site-footer,skip-link,delhi-clock,motion-toggle,theme-toggle}.tsx`; Magic UI Animated Theme Toggler via the shadcn CLI into `src/components/magicui/`; `src/components/motion-settings.tsx` kept (hook reused). Delete `navbar.tsx`, `site-background.tsx`, `hls.js` dependency.

**Content.** `src/content/{profile,projects,experience,timeline,citations}.ts` (typed, JSX-free). `src/data/*` stays for the legacy sections until Phase 2–3 so the build never breaks.

**Config.** `next.config.mjs` (`turbopack.root`), `eslint.config.mjs` (ignore `.content-collections/**`), `scripts/screenshot.mjs` (add `/styleguide`).

**Verification.** lint + build; screenshots `phase-1` (home, styleguide, demos); demo pages compared against `before`; contrast ratios for every token pair computed and logged below.

### Tasks

- [x] Route groups + `projects/layout.tsx`
- [x] Tokens (light + dark) in `globals.css`, mapped into Tailwind v4 `@theme`; shadcn token names kept as aliases
- [x] Fonts: Schibsted Grotesk, Newsreader (opsz), DM Mono for code only; Bodoni Moda, Manrope, hard-coded Georgia removed from the new system (legacy.css still has a few Georgia fallbacks until it is deleted)
- [x] Type scale, 12-column grid / container, section spacing, `scroll-padding-top`
- [x] Motion tokens + reduced-motion rules tied to `html[data-reduced-motion]` and the OS setting
- [x] Remove `site-background.tsx`, HLS/Mux stream, `hls.js`
- [x] Delete the forced-dark `:root` overrides (`portfolio-polish.css`); remaining legacy rules in `legacy.css`
- [x] Demo CSS moved to `demos.css`, imported only by `/projects/*`; demos compared with `before` (same heights; one 28 px difference from the new font)
- [x] Header (hide on scroll down / show on scroll up / always on focus; <640px name + Menu sheet, focus-trapped, Esc closes), footer, skip link. Verified with a Playwright run (skip link, hide/show, focus reveal, sheet open / Tab wrap / Esc / focus return, scroll lock)
- [x] Theme toggle (Magic UI Animated Theme Toggler; plain button under reduced motion) and motion toggle in the footer
- [x] Data refactor into typed, JSX-free `src/content/*`
- [x] `turbopack.root` + ESLint ignore (both baseline warnings gone; the edge-runtime warning remains until the OG image is rebuilt in Phase 5)
- [x] Contrast ratios verified for both themes (`node scripts/contrast.mjs`)
- [x] Screenshots `phase-1`

**Contrast (WCAG):** light: ink 16.7:1, graphite 6.1:1, link 6.9:1, ink on highlight 13.6:1. Dark: ink 15.5:1, graphite 7.2:1, link 8.6:1, ink on highlight underlay 6.0:1. Rule: the `[n]` citation marker sits after the highlighted phrase, never on the underlay (link on the dark underlay would be only 3.3:1).

## Phase 2 — Home page (done)

### Plan (files I will touch)

- **Citations:** `src/components/cite/{cite.tsx (server: numbers by reading order via React.cache), cite-region.tsx (client: open state, margin/inline placement, Esc), note-content.tsx}`; CSS for `.cite-mark`, `.cite-marker`, note slide-in in `globals.css`.
- **Sections:** `src/components/home/{hero,selected-work,work-media,experience,more-work,about,contact,contact-actions}.tsx`, `src/components/link-icons.tsx`; `src/app/(site)/page.tsx` renders exactly Hero, Selected work, Experience, More work, About, Contact.
- **Archive:** `git mv` the old sections, project card, marquee, journey, online presence, tech stack, engineering map, design-explorer section, terminal embed, hero identity, saved/compare, modal flow into `src/components/_archive/`; `ProjectDetailsShell` and `legacy.css` leave the layout.
- **Content tweaks:** shorter `[TODO: role]` placeholder in `projects.ts`.
- **Verification:** screenshots `phase-2` + report (section count, first-project position), citation behaviour test (numbering order, margin vs inline, Esc + focus return, no overlap), axe quick pass.

### Tasks

- [x] Citation system (`<Cite>`, margin notes ≥1100px stacked without overlap, inline disclosure below, Esc closes the latest note and returns focus, `aria-expanded`/`aria-controls`). Numbering uses an explicit per-page reading order (`src/content/citation-order.ts`) because server components under client boundaries don't render in document order
- [x] Hero with three citations, portrait right ≥1024px (moves to About below), availability line, actions
- [x] Selected work (4 rows; video plays muted+loop only on hover/focus/≥60% in view, visible Play/Pause button, poster under reduced motion; `next/image` posters)
- [x] Experience (Rang Technologies, fully visible, one citation, margin note)
- [x] More work (filters with `aria-pressed`, semantic list, status, stack ≤3, links; Data filter 5 → 3 verified)
- [x] About (condensed) incl. mobile portrait, timeline (6 rows), education, toolbox, beyond code, elsewhere
- [x] Contact (copy-email with live region; no more 2–3 word column) + Phase 1 footer
- [x] Old sections moved to `src/components/_archive/`; `page.tsx` renders six sections; `legacy.css` deleted; modal shell removed from the layout
- [x] First project at **1.19 screens** (1440×900), **0.87** (768×1024), **1.25** (390×844) — targets were ~1.2 and ~2
- [x] axe on `/` in light and dark: 0 violations
- [x] Screenshots `phase-2`

Home page height: 7,768 px at 1440 (was 10,927), 9,874 px at 390 (was 13,221). Browser console shows only 404s for `/work/*` and `/about` link prefetches, which Phase 3 creates.

## Phase 3 — Case studies and /about (done)

### Plan (files I will touch)

- **Routes:** `src/app/(site)/work/[slug]/{page.tsx, opengraph-image.tsx}` (static params, metadata from data, `dynamicParams = false`), `src/app/(site)/about/page.tsx`, shared `src/lib/og.tsx` for OG images.
- **Components:** `src/components/work/{case-study-section, architecture-stepper (client), system-design, schema-tables, hero-media}.tsx`; Magic UI `Safari` via the shadcn CLI.
- **Content:** `results` on `Project` (OptiLang only has measured data), per-page citation order for case studies in `citation-order.ts`.
- **Redirects / robots:** `next.config.mjs` `redirects()` with a `has` query matcher for `/?project=<slug>`; `/blog` gets `robots: { index: false }`.
- **Deletions:** modal flow (`project-details*`, `project-viewer`), saved/compare (`saved-projects`), `project-card`, old projects sections that depend on them.
- **Verification:** screenshots `phase-3` (home, about, case study, demos), axe on `/about` and a case study, keyboard test of the stepper, redirect test.

### Tasks

- [x] `/work/[slug]` for all 9 projects (statically generated, `dynamicParams = false`), `generateMetadata` (title, description, canonical, OG/Twitter) and a per-project `opengraph-image` in the new identity (also redone for the root; no more edge runtime)
- [x] Top bar (All work / Next project, wraps from last to first), title, facts, links incl. interactive preview, hero media in a Safari frame (plain frame for the research project, which has no public page)
- [x] Problem → What I built → How it works (accessible stepper: arrow keys, Home/End, wraps, `aria-current="step"`, live detail) → System design (overview, services, data model from the old explorer data; component graph for the research and prototype projects) → Decisions → Results (only OptiLang has measured data; cited) → Limitations → What I learned → About this demo → contact + next project
- [x] `/about` (long timeline, education, toolbox, beyond code, elsewhere)
- [x] `/?project=<slug>` → `/work/<slug>` (308 via `redirects()` with a `has` query matcher). Next keeps the original query string on the destination (`/work/optilang?project=optilang`); harmless, the page ignores it
- [x] `/blog` has `robots: { index: false }` and is not linked anywhere
- [x] Modal flow, saved/compare, project card, marquee-era sections and the engineering map deleted
- [x] Demo pages still render (screenshots `phase-3`; heights unchanged)
- [x] axe on `/`, `/about`, `/work/researchpaper-ai` in light and dark: 0 violations. No horizontal overflow on any case study at 390 px
- [x] Screenshots `phase-3`

**Not done yet (needs the Next 16.x / React 19.3 upgrade, Phase 4):** `<Link transitionTypes>` on All work / Next project and the `<ViewTransition>` morph.

## Phase 4 — Motion and polish (done)

- [x] Upgraded to Next 16.4.2 and React 19.3.1 (allowed minor upgrades); read the bundled docs in `node_modules/next/dist/docs` for `<ViewTransition>` and `Link transitionTypes` before using them
- [x] Hero load sequence: highlight sweep (700ms, 120ms stagger) + marker fade, total 1.11 s, CSS-driven so the text is never hidden; once per session (early inline script reads `sessionStorage`); skipped under OS reduced motion and the manual toggle (the saved choice is applied before first paint)
- [x] `<ViewTransition>` morph: work-row media → case-study hero (`work-media-<slug>`, `share="morph"`); directional `nav-forward` / `nav-back` slides on page roots; header anchored; `pointer-events: none` on the overlay; zero-duration under reduced motion. Verified: navigation in both directions starts a view transition
- [x] Lenis smooth scroll: site pages only, fine pointers only, off for reduced motion and touch, loaded on idle; in-page anchors scroll through it below the header; fixed two integration bugs found by tests (`autoRaf`, native `scroll-behavior: smooth` fighting it)
- [x] More-work hover preview: fine pointer only, transform-only, rAF-throttled, off under reduced motion; keyboard focus shows a fixed bottom-right slot
- [x] Micro-interactions: press feedback on buttons, media-frame hover/focus border, link-arrow nudge, marker hover
- [x] Self-critique (below), fixes applied, screenshots re-shot as `phase-4`

**Ten weakest details found, and what happened**

| # | Detail | Result |
|---|---|---|
| 1 | About timeline on phones: 7.5rem date column squeezed entries to ~140 px | Fixed: date stacks above text below 640 px |
| 2 | Case-study title orphaned a word on phones ("ResearchPaper / AI") | Fixed: smaller fluid clamp for case-study h1 |
| 3 | Header availability placeholder was long and dominated the header | Fixed: `[TODO: availability]` |
| 4 | Work-row media gave no hover signal | Fixed: border darkens on hover / focus-within |
| 5 | More-work Demo / Source links shifted between rows | Fixed: fixed two-slot grid |
| 6 | Pause/Play preview button covers part of the poster | Left: 44 px target is required and it is the only pause control |
| 7 | Inline citation note had no visual tie to its marker | Fixed: 2 px `--link` rule (margin notes too) |
| 8 | Keyboard focus might land under the sticky header | Verified on 5 page/width combos: never obscured, always scrolled into view, ring always present |
| 9 | Small graphite text in More work is quiet | Left: passes contrast (6.1:1 light, 7.2:1 dark) |
| 10 | No focus feedback on a focused media frame | Fixed with #4 |

Also audited programmatically on 5 pages at 390 / 768 / 1440: no target under 24 px (inline markers are exempt and are 24 px anyway), no text under 12 px, no horizontal overflow, no console errors. axe: 0 violations on `/`, `/about`, `/work/researchpaper-ai`, light and dark.

Metrics now: home 7,768 px at 1440 (was 10,927) · first project at **1.18** screens (1440×900), 0.87 (768×1024), 1.25 (390×844).

## Phase 5 — Performance, accessibility, SEO (done, one item blocked)

### Plan (files I will touch)

- **Deletions:** `src/components/_archive/`, `src/app/api/online-presence/`, `src/data/online-presence.ts`, `src/app/(site)/styleguide/`, the blog's old OG images and `public/fonts/`, unused template images and `public/tech-icons/`, shadcn primitives and dependencies nothing imports (checked with grep first).
- **Images:** re-export `crypto-ransomware-preview.png` and `preet-patel-avatar.jpg` (macOS `sips`); render each project's extra screenshots on its case study through `next/image`; skip autoplay on save-data / slow connections.
- **Videos:** `ffmpeg` is not installed, so the re-encode is logged as a TODO (spec).
- **SEO:** `src/app/{sitemap,robots,manifest}.ts`, `icon.svg`, `apple-icon.tsx`, delete `favicon.ico`, JSON-LD `Person`, canonical + OG/Twitter on every page.
- **Verification:** lint, build, all behaviour suites, axe, Lighthouse mobile against the production build.

### Tasks

- [x] Archive, `/api/online-presence`, styleguide, old data files, unused shadcn primitives and dependencies deleted (`react-markdown`, `rehype-pretty-code`, `tailwindcss-animate`, three Radix packages, `@fontsource/schibsted-grotesk`; `hls.js` went in Phase 1). `motion` stays: the blog still uses `BlurFade`
- [x] 11 unused template images, `public/tech-icons/`, `public/fonts/`, three org logos and three unused project screenshots deleted after grepping references
- [x] `crypto-ransomware-preview.png` 1.2 MB → 92 KB JPEG; avatar 396 KB → 172 KB (880 px). Every image is `next/image` with `sizes` (the only non-`next/image` pixels are the demo `<video>` elements)
- [ ] **Demo videos re-encoded: blocked, no `ffmpeg` on this machine.** The three MP4s are still ~6 MB each. Mitigations shipped: they never load until a row is ≥60% in view / hovered / played, and not at all on data-saver or 2G/3G connections; the case-study hero loads the video only when asked
- [x] Fonts: `next/font` only, latin subset; Schibsted Grotesk is one 47 KB variable file (preloaded), DM Mono 400/500 (not preloaded), Newsreader static 400 (22 KB, not preloaded)
- [x] Skip link, landmarks (`header`, `nav` ×2 labelled, `main`, `footer`), one `h1` per page, focus ring 2px `--link` / 3px offset, Esc closes notes and the menu, reduced-motion audit (no transforms, autoplay, View Transitions, Lenis or hero sweep under reduced motion; verified in tests)
- [x] axe: 0 violations (not just 0 serious/critical) on `/`, `/about`, `/work/researchpaper-ai`, light and dark
- [x] SEO: title "Preet Patel — Software Engineer (AI & Backend)", description from data, canonical on home/about/case studies/demos, OG + Twitter per page, redesigned `opengraph-image` (root + per project) and `twitter-image`, `sitemap.xml` (14 URLs, no blog), `robots.txt`, `manifest.webmanifest`, `icon.svg` + `apple-icon` ("PP" monogram; default favicon deleted), JSON-LD `Person` on the home page, empty `verification` removed
- [x] Lighthouse mobile (production build, simulated throttling):

| Page | Perf | A11y | Best practices | SEO | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|
| `/` | 98 | 100 | 100 | 100 | 2.5 s | 0 ms | 0 |
| `/about` | 96 | 100 | 100 | 100 | 2.8 s | 0 ms | 0 |
| `/work/researchpaper-ai` | 94 | 100 | 100 | 100 | 3.1 s | 0 ms | 0 |
| `/work/optilang` | 94 | 100 | 100 | 100 | 3.1 s | 0 ms | 0 |
| `/work/foodfolk` | 98 | 100 | 100 | 100 | 2.5 s | 0 ms | 0 |

Lab LCP on case studies (3.1 s) is above the 2.5 s p75 field target even though the score passes; it is simulated slow-4G on a 4× CPU slowdown and the LCP element is the lead paragraph. Field data (CrUX / Vercel Speed Insights) is the real check after deploy.

**Performance investigation (kept for the record).** Measured, not guessed, with 3 Lighthouse runs per variant: inlining CSS (`experimental.inlineCss`) and `font-display: optional` made no difference or were worse and were reverted; the image preload and the Safari frame's blend modes were minor (blend modes removed anyway). The real cost was the 131 KB variable Newsreader file fetched on first render of prose pages. Fixes: Newsreader is now static 400 (22 KB); below-the-fold case-study sections use `content-visibility: auto`; the About intro is set in the sans face (the brief reserves Newsreader for case-study prose and citation notes); interactive-preview links don't prefetch.

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
| D8 | The old home sections stay in `(site)/page.tsx` inside a narrow wrapper until Phase 2, styled by `legacy.css` (hex values and all). Their ids were renamed (`#experience`, `#work`) so the new header links land somewhere | Keeps the build and demo flows working between phases; nothing new may import `legacy.css` |
| D9 | Header availability dot uses `--link` (not green) | No green in the palette; the dot's meaning is carried by its text |
| D10 | Header availability text is the visible `[TODO: …]` placeholder (hidden below 1024 px, read by screen readers) | The brief forbids inventing an availability claim |
| D11 | The theme toggle is a plain button when reduced motion is on | The Magic UI toggle runs a view transition and doesn't check reduced motion |
| D12 | The `[n]` citation marker never sits on the highlight underlay | Dark-theme link-on-underlay contrast is 3.3:1 |
| D13 | `details` markdown on the old project data was dropped from `src/content/projects.ts`; its facts are already in `caseStudy` | `react-markdown` can then be removed in Phase 5 |
| D14 | `/styleguide` is a temporary `noindex` proof page | Verifies tokens and type in both themes; deleted in Phase 5 |
| D15 | The portrait in the hero is capped at 22rem wide | So an open citation note sits fully inside a 1440×900 fold under it |
| D16 | Work videos autoplay when ≥60% in view (as specified) and a visible Pause/Play button is always shown | WCAG 2.2.2: anything that moves for more than 5 s needs a pause control. The three MP4s are ~6 MB each until re-encoded (no `ffmpeg` here) |
| D17 | Selected work shows at most 4 stack items per row; More work shows 3 | Keeps the rows scannable; full stacks are on the case-study pages |
| D18 | Case-study "What I built" uses the contribution plus only the first sentence of the old card copy | The rest of that copy is demo caveats, which now live in "About this demo" |
| D19 | The Safari frame (Magic UI) was edited: its autoplaying `<video>` and raw `<img>` props were replaced by a `children` slot, and its SVG is `pointer-events-none` | WCAG 2.2.2 (autoplay needs a pause control), `next/image`, and clickable video controls |
| D20 | OG images use Schibsted Grotesk woff files copied to `src/lib/fonts/` (SIL OFL, licence kept alongside) and read with `readFile(join(process.cwd(), …))` | `fetch(file URL)` isn't supported in the Node runtime; this is the pattern Next's file tracing follows |
| D21 | Case-study numbering uses `work:<slug>` reading orders built from each project's `results` | Same reason as the home page |
| D22 | The hero sequence is CSS-only with an inline pre-paint script, not a React effect | The text is the LCP and must never be hidden; an effect would flash the finished highlight before resetting it |
| D23 | Lenis is mounted only in the `(site)` layout | The demo pages have their own scroll regions and must not be hijacked |
| D24 | The hover preview and Lenis are disabled under reduced motion; the keyboard-focus preview slot is not | The slot is static (no movement) and is the only way keyboard users see the preview |
| D25 | Newsreader is static 400, not the variable file with the `opsz` axis the brief named | Measured 131 KB → 22 KB and ~0.6 s earlier case-study first paint; at 19 px body size the optical-size axis is barely visible |
| D26 | About page intro uses the sans face | Keeps the heavy prose font off that page; the brief only assigns Newsreader to case-study prose and citation notes |
| D27 | `Safari` frame lost its SVG `mix-blend-mode` groups | They forced extra compositing; the icon fills are flat grey so the look is unchanged |

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
10. **`ffmpeg`** (Phase 5 blocker): not installed here, so the three ~6 MB demo MP4s can't be re-encoded in Phase 5. Either `brew install ffmpeg` or hand over smaller files.
11. **LinkedIn "100+ connections"** and LeetCode/NeetCode counts are being removed rather than shown. Confirm that's fine.
12. **OptiLang demo page wording:** `/projects/optilang` itself says "8 pipeline stages" and "LICM + LLVM IR" (matching the résumé), while the project data and case study say five optimization passes and that the LLVM examples are a separate exercise. Demo pages were not edited; pick one wording.
13. **Three names for one product:** "Studyloom" (site, live URL), "Studyroom" and "AI Learning Management System" (demo page header and résumé).
14. **Foodfolk's preview image** is a "cook along." landing page. Confirm Foodfolk is the right name and that this is the image you want as its Selected work media.
15. Dropped from the timeline as unverifiable: "Tableau" (not on the résumé or any project page).
